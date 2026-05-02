const API_BASE_URL =
  process.env.APP_PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL || "";

const normalize = (s) => String(s || "").toLowerCase();

const buildRuleBasedReply = (message) => {
  const m = normalize(message);

  if (/\b(hours|open|close|closing|schedule|clinic hours)\b/.test(m)) {
    return (
      "Clinic hours depend on your branch. If you tell me your branch/city, I can be specific. " +
      "You can also check the clinic’s posted schedule in the dashboard announcements or contact staff via Messages."
    );
  }

  if (/\b(appointment|book|booking|schedule an appointment|reschedule|cancel)\b/.test(m)) {
    return (
      "For appointments: open **Appointments** in your dashboard, choose a date, and select an available vet slot. " +
      "If you share your pet’s name and preferred date/time, I can guide you step-by-step."
    );
  }

  if (/\b(vaccine|vaccination|rabies|shot|immunization|deworm)\b/.test(m)) {
    return (
      "Vaccine schedules vary by age and species. Tell me your pet’s species and age (and last vaccine date if known), " +
      "and I’ll suggest what to ask the clinic for next. For official records, check **Medical Records** in your dashboard."
    );
  }

  if (/\b(emergency|urgent|poison|bleeding|seizure|not breathing)\b/.test(m)) {
    return (
      "If this is an emergency, please contact the clinic immediately or go to the nearest emergency vet. " +
      "If you share the symptoms and your pet’s age/weight, I can also provide general first-aid guidance while you seek care."
    );
  }

  return (
    "I can help with appointments, vaccine schedules, clinic hours, and general pet care questions. " +
    "What do you need help with today?"
  );
};

const callOpenAi = async ({ message, user, context }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const system = [
    "You are a helpful veterinary clinic assistant for pet owners.",
    "You must be concise, safe, and avoid diagnosing.",
    "Encourage booking an appointment for concerning symptoms.",
    "If the user asks for clinic-specific info you do not have, ask clarifying questions.",
  ].join(" ");

  const payload = {
    model,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          `UserRole: ${user?.role || "unknown"}`,
          `UserId: ${user?.id || "unknown"}`,
          `Context: ${JSON.stringify(context || {})}`,
          `Message: ${message}`,
        ].join("\n"),
      },
    ],
    temperature: 0.4,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(
      `OpenAI request failed (${res.status}): ${text || res.statusText}`,
    );
    err.statusCode = 502;
    throw err;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) return null;
  return content.trim();
};

/**
 * Build a chatbot reply for pet owners.
 * Uses OpenAI if OPENAI_API_KEY is configured; otherwise falls back to safe rule-based replies.
 * @param {{ message: string, user: {id?: string, role?: string}, context: object }} params
 * @returns {Promise<string>}
 */
exports.buildPetOwnerReply = async ({ message, user, context }) => {
  try {
    const ai = await callOpenAi({ message, user, context });
    if (ai) return ai;
    return buildRuleBasedReply(message);
  } catch (error) {
    // If AI provider fails, fall back to deterministic guidance.
    console.error("Chatbot provider error", {
      message: error?.message,
      baseUrl: API_BASE_URL,
    });
    return buildRuleBasedReply(message);
  }
};

