const prisma = require("../lib/prisma");

const ALLOWED_STATUSES = new Set(["Finalized", "FollowUp"]);
const MEDICAL_AI_MODEL = "gemini-2.0-flash";
const MEDICAL_GROQ_AI_MODEL = "llama-3.1-8b-instant";

const include = {
  pet: { select: { id: true, name: true, species: true } },
  vet: {
    select: { id: true, username: true, firstName: true, lastName: true },
  },
  appointment: { select: { id: true, scheduledAt: true } },
};

const isValidDateValue = (value) => {
  if (!value) return true;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
};

const canAccessRecord = async (user, record) => {
  if (user.role === "veterinarian") return record.vetId === user.id;
  if (user.role === "pet_owner") {
    const pet = await prisma.pet.findUnique({
      where: { id: record.petId },
      select: { ownerId: true },
    });
    return Boolean(pet && pet.ownerId === user.id);
  }
  return true;
};

const parseCommonFilters = (req, where) => {
  const includeArchived = req.query.includeArchived === "true";
  if (!includeArchived) where.isArchived = false;

  if (req.query.petId) where.petId = req.query.petId;
  if (req.query.appointmentId) where.appointmentId = req.query.appointmentId;

  if (req.query.status) {
    if (!ALLOWED_STATUSES.has(req.query.status)) {
      return { error: "Invalid status filter" };
    }
    where.status = req.query.status;
  }

  if (req.query.fromDate || req.query.toDate) {
    const createdAt = {};
    if (req.query.fromDate) {
      if (!isValidDateValue(req.query.fromDate)) {
        return { error: "Invalid fromDate" };
      }
      createdAt.gte = new Date(req.query.fromDate);
    }
    if (req.query.toDate) {
      if (!isValidDateValue(req.query.toDate)) {
        return { error: "Invalid toDate" };
      }
      createdAt.lte = new Date(req.query.toDate);
    }
    where.createdAt = createdAt;
  }

  return { includeArchived };
};

// GET /api/medical-records
exports.getMedicalRecords = async (req, res) => {
  try {
    const where = {};
    const { role, id } = req.user;
    if (role === "veterinarian") where.vetId = id;
    else if (role === "pet_owner") where.pet = { ownerId: id };

    const parsed = parseCommonFilters(req, where);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const records = await prisma.medicalRecord.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
    res.json(records);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/medical-records/:id
exports.getMedicalRecord = async (req, res) => {
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      include,
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    const allowed = await canAccessRecord(req.user, record);
    if (!allowed) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(record);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/medical-records
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      petId,
      appointmentId,
      vetId,
      diagnosis,
      treatment,
      prescription,
      notes,
      status,
      followUpDate,
    } = req.body;
    if (!petId || !diagnosis)
      return res
        .status(400)
        .json({ message: "petId and diagnosis are required" });

    if (status && !ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (!isValidDateValue(followUpDate)) {
      return res.status(400).json({ message: "Invalid followUpDate" });
    }

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true, ownerId: true },
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    let resolvedVetId = req.user.role === "veterinarian" ? req.user.id : null;
    let resolvedAppointmentId = appointmentId || null;
    let autoLinkedAppointment = false;

    if (resolvedAppointmentId) {
      const appt = await prisma.appointment.findUnique({
        where: { id: resolvedAppointmentId },
        select: { id: true, petId: true, vetId: true },
      });
      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appt.petId !== petId) {
        return res
          .status(400)
          .json({ message: "appointmentId does not match selected pet" });
      }
      resolvedVetId = appt.vetId || resolvedVetId;
    } else {
      // Auto-link to latest non-cancelled appointment for this pet if it exists.
      const latestBookedAppointment = await prisma.appointment.findFirst({
        where: {
          petId,
          status: { not: "Cancelled" },
        },
        select: { id: true, vetId: true },
        orderBy: { scheduledAt: "desc" },
      });

      if (latestBookedAppointment) {
        resolvedAppointmentId = latestBookedAppointment.id;
        resolvedVetId = latestBookedAppointment.vetId || resolvedVetId;
        autoLinkedAppointment = true;
      }
    }

    if (!resolvedVetId && vetId) {
      resolvedVetId = vetId;
    }

    if (!resolvedVetId) {
      return res
        .status(400)
        .json({ message: "Unable to resolve veterinarian for this record" });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        petId,
        appointmentId: resolvedAppointmentId,
        vetId: resolvedVetId,
        diagnosis,
        treatment,
        prescription,
        notes,
        status,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
      include,
    });
    res.status(201).json({
      ...record,
      autoLinkedAppointment,
      linkedAppointmentId: resolvedAppointmentId,
    });
  } catch (e) {
    if (e && e.code === "P2002") {
      return res.status(409).json({
        message:
          "A medical record for this appointment already exists. Use update instead.",
      });
    }
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/medical-records/:id
exports.updateMedicalRecord = async (req, res) => {
  try {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        vetId: true,
        petId: true,
        pet: { select: { ownerId: true } },
      },
    });
    if (!existing) return res.status(404).json({ message: "Record not found" });

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "pet_owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { diagnosis, treatment, prescription, notes, status, followUpDate } =
      req.body;

    if (status && !ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (followUpDate !== undefined && !isValidDateValue(followUpDate)) {
      return res.status(400).json({ message: "Invalid followUpDate" });
    }

    const data = {};
    if (diagnosis !== undefined) data.diagnosis = diagnosis;
    if (treatment !== undefined) data.treatment = treatment;
    if (prescription !== undefined) data.prescription = prescription;
    if (notes !== undefined) data.notes = notes;
    if (status !== undefined) data.status = status;
    if (followUpDate !== undefined) {
      data.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    const record = await prisma.medicalRecord.update({
      where: { id: req.params.id },
      data,
      include,
    });
    res.json(record);
  } catch (e) {
    if (e && e.code === "P2002") {
      return res.status(409).json({
        message:
          "A medical record for this appointment already exists. Use update instead.",
      });
    }
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/medical-records/:id
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        vetId: true,
        isArchived: true,
        pet: { select: { ownerId: true } },
      },
    });
    if (!existing) return res.status(404).json({ message: "Record not found" });

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "pet_owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (existing.isArchived) {
      return res.json({ message: "Record already archived" });
    }

    await prisma.medicalRecord.update({
      where: { id: req.params.id },
      data: { isArchived: true, archivedAt: new Date() },
    });
    res.json({ message: "Record archived" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/medical-records/:id/ai-insight
exports.getAiInsight = async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "true";

    const record = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            age: true,
            gender: true,
          },
        },
      },
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    const allowed = await canAccessRecord(req.user, record);
    if (!allowed) return res.status(403).json({ message: "Forbidden" });

    const DISCLAIMER =
      "This insight is AI-generated for informational purposes only. It is not a substitute for professional veterinary advice. Always consult your veterinarian.";

    // ── Return cached insight unless a refresh is explicitly requested ──
    if (!forceRefresh && record.aiInsight) {
      return res.json({
        insight: record.aiInsight,
        isAiGenerated: true,
        fromCache: true,
        aiModel: record.aiInsightModel || "gemini-2.0-flash",
        generatedAt: record.aiInsightGeneratedAt?.toISOString(),
        disclaimer: DISCLAIMER,
      });
    }

    // ── Only veterinarians/staff/admin may trigger (or refresh) a generation ──
    if (req.user.role === "pet_owner" && !record.aiInsight) {
      return res.status(503).json({
        message:
          "AI insight has not been generated for this record yet. Please ask your veterinarian.",
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!geminiApiKey && !groqApiKey) {
      return res
        .status(503)
        .json({ message: "AI service is not configured on this server" });
    }

    const pet = record.pet || {};
    const historyRecords = await prisma.medicalRecord.findMany({
      where: { petId: record.petId },
      select: {
        id: true,
        createdAt: true,
        diagnosis: true,
        treatment: true,
        prescription: true,
        notes: true,
        status: true,
        followUpDate: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const historyLines = historyRecords.map((hist, idx) => {
      const createdAtText = hist.createdAt
        ? new Date(hist.createdAt).toLocaleDateString()
        : "Unknown date";
      const followUpText = hist.followUpDate
        ? new Date(hist.followUpDate).toLocaleDateString()
        : "None scheduled";
      return [
        `${idx + 1}. Record ID: ${hist.id} | Date: ${createdAtText}`,
        `   Diagnosis: ${hist.diagnosis || "Not specified"}`,
        `   Treatment: ${hist.treatment || "Not specified"}`,
        `   Prescription: ${hist.prescription || "None"}`,
        `   Notes: ${hist.notes || "None"}`,
        `   Status: ${hist.status || "Unknown"} | Follow-up: ${followUpText}`,
      ].join("\n");
    });

    const prompt = [
      "You are a veterinary health assistant. Based on the current medical record and the pet's full medical history, provide a brief, helpful health insight for the pet owner.",
      "Be clear, compassionate, and informative. Do NOT provide a new diagnosis — only educational context and general wellness guidance relevant to the existing findings.",
      "",
      "Pet Information:",
      `- Name: ${pet.name || "Unknown"}`,
      `- Species: ${pet.species || "Unknown"}`,
      `- Breed: ${pet.breed || "Not specified"}`,
      `- Age: ${pet.age != null ? pet.age + " year(s)" : "Unknown"}`,
      `- Gender: ${pet.gender || "Unknown"}`,
      "",
      "Medical Record:",
      `- Diagnosis: ${record.diagnosis}`,
      `- Treatment: ${record.treatment || "Not specified"}`,
      `- Prescription: ${record.prescription || "None"}`,
      `- Notes: ${record.notes || "None"}`,
      `- Status: ${record.status}`,
      `- Follow-up Date: ${record.followUpDate ? new Date(record.followUpDate).toLocaleDateString() : "None scheduled"}`,
      "",
      "Full Medical History Across All Records (oldest to newest):",
      historyLines.length > 0
        ? historyLines.join("\n\n")
        : "No medical history records found.",
      "",
      "Please provide:",
      "1. A brief plain-language explanation of the diagnosis",
      "2. Any notable pattern or trend across the full medical history",
      "3. What the pet owner should watch for at home",
      "4. General care tips relevant to this condition",
      "5. When to seek immediate veterinary attention",
      "",
      "Keep your response under 300 words. Use clear, non-technical language suitable for a general pet owner.",
    ].join("\n");

    let insight = "";
    let selectedModel = "";
    let geminiRateLimitMessage = "";

    if (geminiApiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MEDICAL_AI_MODEL}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 600, temperature: 0.6 },
          }),
        },
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        insight = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (insight) {
          selectedModel = MEDICAL_AI_MODEL;
        }
      } else {
        const errBody = await geminiRes.json().catch(() => ({}));
        console.error("Gemini API error:", errBody);
        const errMsg = errBody?.error?.message || "";
        const isRateLimit =
          geminiRes.status === 429 ||
          errMsg.toLowerCase().includes("quota") ||
          errMsg.toLowerCase().includes("rate");
        const retryMatch = errMsg.match(/(\d+\.?\d*)s/);
        const retrySeconds = retryMatch
          ? Math.ceil(parseFloat(retryMatch[1]))
          : 60;
        if (isRateLimit) {
          geminiRateLimitMessage = `AI service is temporarily rate-limited. Please try again in about ${retrySeconds} second${retrySeconds === 1 ? "" : "s"}.`;
        }
      }
    }

    if (!insight && groqApiKey) {
      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: MEDICAL_GROQ_AI_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are a veterinary health assistant. Provide concise and safe educational guidance.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.6,
            max_tokens: 700,
          }),
        },
      );

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        insight = groqData.choices?.[0]?.message?.content?.trim() || "";
        if (insight) {
          selectedModel = `groq:${MEDICAL_GROQ_AI_MODEL}`;
        }
      } else {
        const groqErr = await groqRes.json().catch(() => ({}));
        console.error("Groq API error:", groqErr);
      }
    }

    if (!insight) {
      if (geminiRateLimitMessage && !groqApiKey) {
        return res.status(429).json({ message: geminiRateLimitMessage });
      }
      return res.status(502).json({
        message: "AI service returned an error. Please try again.",
      });
    }

    const generatedAt = new Date();

    // ── Persist the insight so all users share the same result ──
    await prisma.medicalRecord.update({
      where: { id: record.id },
      data: {
        aiInsight: insight,
        aiInsightModel: selectedModel,
        aiInsightGeneratedAt: generatedAt,
      },
    });

    return res.json({
      insight,
      isAiGenerated: true,
      fromCache: false,
      aiModel: selectedModel,
      generatedAt: generatedAt.toISOString(),
      disclaimer: DISCLAIMER,
    });
  } catch (e) {
    console.error("AI insight error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/medical-records/:id/restore
exports.restoreMedicalRecord = async (req, res) => {
  try {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        vetId: true,
        isArchived: true,
        pet: { select: { ownerId: true } },
      },
    });
    if (!existing) return res.status(404).json({ message: "Record not found" });

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "pet_owner") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!existing.isArchived) {
      return res.json({ message: "Record is already active" });
    }

    await prisma.medicalRecord.update({
      where: { id: req.params.id },
      data: { isArchived: false, archivedAt: null },
    });
    res.json({ message: "Record restored" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
