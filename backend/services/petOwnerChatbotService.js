const { QUICK_ASSIST_SYSTEM_PROMPT } = require("../constants/quickAssistSystemPrompt");

const API_BASE_URL =
  process.env.APP_PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL || "";

const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 4000;

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

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
 * OpenAI-style messages array (system + thread).
 */
const buildChatMessages = ({ message, user, context, conversationHistory }) => {
  const systemContent = [
    QUICK_ASSIST_SYSTEM_PROMPT,
    "",
    `Current user (JWT): role=${user?.role ?? "unknown"}, id=${user?.id ?? "unknown"}.`,
    `Extra context JSON: ${JSON.stringify(context && typeof context === "object" ? context : {})}`,
  ].join("\n");

  const thread = sanitizeConversationHistory(conversationHistory, message);

  /** @type {Array<{ role: string; content: string }>} */
  const messages = [{ role: "system", content: systemContent }];

  for (const turn of thread) {
    messages.push({
      role: turn.role,
      content: turn.content,
    });
  }

  return messages;
};

/**
 * Groq is OpenAI-compatible and offers a generous free API tier.
 * @param {object} params
 * @returns {Promise<string|null>}
 */
const callGroq = async (params) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model =
    process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const messages = buildChatMessages(params);

  const temp = Number(process.env.GROQ_TEMPERATURE ?? process.env.OPENAI_TEMPERATURE);
  const maxTok = Number(process.env.GROQ_MAX_TOKENS ?? process.env.OPENAI_MAX_TOKENS);

  const payload = {
    model,
    messages,
    temperature: Number.isFinite(temp) ? temp : 0.35,
    max_tokens: Number.isFinite(maxTok) ? maxTok : 700,
  };

  const res = await fetch(GROQ_CHAT_URL, {
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
      `Groq request failed (${res.status}): ${text || res.statusText}`,
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
 * Google Gemini (often has free quota). Uses generateContent API.
 * @param {object} params
 * @returns {Promise<string|null>}
 */
const callGemini = async (params) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model =
    process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const thread = sanitizeConversationHistory(
    params.conversationHistory,
    params.message,
  );

  const systemContent = [
    QUICK_ASSIST_SYSTEM_PROMPT,
    "",
    `Current user (JWT): role=${params.user?.role ?? "unknown"}, id=${params.user?.id ?? "unknown"}.`,
    `Extra context JSON: ${JSON.stringify(params.context && typeof params.context === "object" ? params.context : {})}`,
  ].join("\n");

  /** @type {Array<{ role: string; parts: Array<{ text: string }> }>} */
  const contents = [];
  for (const turn of thread) {
    contents.push({
      role: turn.role === "user" ? "user" : "model",
      parts: [{ text: turn.content }],
    });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    systemInstruction: {
      parts: [{ text: systemContent }],
    },
    contents,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 700,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(
      `Gemini request failed (${res.status}): ${text || res.statusText}`,
    );
    err.statusCode = 502;
    throw err;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const textOut = Array.isArray(parts)
    ? parts.map((p) => p?.text || "").join("")
    : "";
  if (typeof textOut !== "string" || !textOut.trim()) return null;
  return textOut.trim();
};

/**
 * OpenAI (paid — used only if Groq/Gemini unavailable or no keys).
 * @param {object} params
 * @returns {Promise<string|null>}
 */
const callOpenAi = async (params) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const messages = buildChatMessages(params);

  const temp = Number(process.env.OPENAI_TEMPERATURE);
  const maxTok = Number(process.env.OPENAI_MAX_TOKENS);
  const payload = {
    model,
    messages,
    temperature: Number.isFinite(temp) ? temp : 0.35,
    max_tokens: Number.isFinite(maxTok) ? maxTok : 700,
  };

  const res = await fetch(OPENAI_CHAT_URL, {
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
 * Prefer free/cheap providers first: Groq → Gemini → OpenAI → rules.
 * Set CHATBOT_PROVIDER_ORDER=groq,gemini,openai to override (comma-separated).
 */
const callAiInPriorityOrder = async (params) => {
  const orderRaw =
    process.env.CHATBOT_PROVIDER_ORDER || "groq,gemini,openai";
  const order = orderRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const runners = {
    groq: callGroq,
    gemini: callGemini,
    openai: callOpenAi,
  };

  let lastError = null;
  for (const name of order) {
    const fn = runners[name];
    if (!fn) continue;
    try {
      const keyPresent =
        (name === "groq" && process.env.GROQ_API_KEY) ||
        (name === "gemini" && process.env.GEMINI_API_KEY) ||
        (name === "openai" && process.env.OPENAI_API_KEY);
      if (!keyPresent) continue;

      const out = await fn(params);
      if (out) return out;
    } catch (e) {
      lastError = e;
      console.error(`Chatbot provider ${name} failed`, e?.message);
    }
  }

  if (lastError) throw lastError;
  return null;
};

/**
 * Build a chatbot reply for pet owners (Quick Assist).
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
    const ai = await callAiInPriorityOrder({
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
