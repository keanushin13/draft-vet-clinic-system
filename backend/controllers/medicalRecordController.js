const prisma = require("../lib/prisma");

const ALLOWED_STATUSES = new Set(["Finalized", "FollowUp"]);

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
