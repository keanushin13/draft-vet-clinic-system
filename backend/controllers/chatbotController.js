const { buildPetOwnerReply } = require("../services/petOwnerChatbotService");

/**
 * Pet Owner chatbot endpoint (Quick Assist).
 * Expects: { message: string, context?: object, conversationHistory?: Array<{ role, content }> }
 * Returns: { reply: string }
 */
exports.petOwnerChat = async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    const reply = await buildPetOwnerReply({
      message: message.trim(),
      user: req.user,
      context: context && typeof context === "object" ? context : {},
      conversationHistory: Array.isArray(conversationHistory)
        ? conversationHistory
        : [],
    });

    return res.json({ reply });
  } catch (error) {
    const message =
      error?.message || "Failed to generate a chatbot response.";
    return res.status(500).json({ message });
  }
};

