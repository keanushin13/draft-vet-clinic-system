const { QUICK_ASSIST_SYSTEM_PROMPT } = require("../constants/quickAssistSystemPrompt");

const API_BASE_URL =
  process.env.APP_PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL || "";

const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 4000;

const normalize = (s) => String(s || "").toLowerCase();

const buildRuleBasedReply = (message) => {
  const m = normalize(message);

  if (/\b(hours|open|close|closing|schedule|clinic hours)\b/.test(m)) {
    return (
      "We are open Monday to Saturday, 8:00 AM to 6:00 PM. Closed on Sundays and public holidays."
    );
  }

  if (
    /\b(appointment|book|booking|schedule an appointment|reschedule|cancel)\b/.test(
      m,
    )
  ) {
    return (
      "You can book through the PawCruz app or by calling the clinic. Walk-ins are accepted subject to availability."
    );
  }

  if (/\b(vaccine|vaccination|rabies|shot|immunization|deworm)\b/.test(m)) {
    return (
      "General schedule: 6–8 weeks DHPP; 10–12 weeks DHPP + Bordetella; 14–16 weeks DHPP + Rabies; annually Rabies + DHPP. Verify your pet's profile for specifics."
    );
  }

  if (/\b(emergency|urgent|poison|bleeding|seizure|not breathing)\b/.test(m)) {
    return (
      "During clinic hours we accept emergency consultations — call ahead. We do not offer overnight emergency care; after hours use the nearest 24-hour emergency clinic."
    );
  }

  return (
    "I don't have that information. Please check with the front desk or your supervisor. " +
      "I can help with hours (Mon–Sat 8–6), appointments, vaccines, and general clinic FAQs."
  );
};

/**
 * @param {unknown} raw
 * @param {string} latestUserMessage
 * @returns {Array<{ role: 'user' | 'assistant'; content: string }>}
 */
const sanitizeConversationHistory = (raw, latestUserMessage) => {
  const out = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const role =
        item.role === "assistant"
          ? "assistant"
          : item.role === "user"
            ? "user"
            : null;
      if (!role) continue;
      const content = String(item.content ?? "")
        .trim()
        .slice(0, MAX_MESSAGE_CHARS);
      if (!content) continue;
      out.push({ role, content });
    }
  }

  const latest = String(latestUserMessage || "")
    .trim()
    .slice(0, MAX_MESSAGE_CHARS);
  if (
    latest &&
    (!out.length ||
      out[out.length - 1].role !== "user" ||
      out[out.length - 1].content !== latest)
  ) {
    out.push({ role: "user", content: latest });
  }

  return out.slice(-MAX_HISTORY_MESSAGES);
};

/**
 * @param {{ message: string, user: object, context: object, conversationHistory: Array<{role: string, content: string}> }} params
 */
const callOpenAi = async ({
  message,
  user,
  context,
  conversationHistory,
}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const systemContent = [
    QUICK_ASSIST_SYSTEM_PROMPT,
    "",
    `Current user (JWT): role=${user?.role ?? "unknown"}, id=${user?.id ?? "unknown"}.`,
    `Extra context JSON: ${JSON.stringify(context && typeof context === "object" ? context : {})}`,
  ].join("\n");

  const thread = sanitizeConversationHistory(conversationHistory, message);

  /** @type {Array<{ role: string; content: string }>} */
  const openAiMessages = [{ role: "system", content: systemContent }];

  for (const turn of thread) {
    openAiMessages.push({
      role: turn.role,
      content: turn.content,
    });
  }

  const temp = Number(process.env.OPENAI_TEMPERATURE);
  const maxTok = Number(process.env.OPENAI_MAX_TOKENS);
  const payload = {
    model,
    messages: openAiMessages,
    temperature: Number.isFinite(temp) ? temp : 0.35,
    max_tokens: Number.isFinite(maxTok) ? maxTok : 700,
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
 * Build a chatbot reply for pet owners (Quick Assist).
 * Uses OpenAI if OPENAI_API_KEY is configured; otherwise falls back to rule-based replies.
 * @param {{ message: string, user: {id?: string, role?: string}, context: object, conversationHistory?: Array<{role: string, content: string}> }} params
 * @returns {Promise<string>}
 */
exports.buildPetOwnerReply = async ({
  message,
  user,
  context,
  conversationHistory,
}) => {
  try {
    const ai = await callOpenAi({
      message,
      user,
      context,
      conversationHistory,
    });
    if (ai) return ai;
    return buildRuleBasedReply(message);
  } catch (error) {
    console.error("Chatbot provider error", {
      message: error?.message,
      baseUrl: API_BASE_URL,
    });
    return buildRuleBasedReply(message);
  }
};
