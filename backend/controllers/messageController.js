const prisma = require("../lib/prisma");

const senderSelect = {
  select: {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    role: true,
  },
};

// GET /api/messages/threads  — inbox: one entry per conversation partner
exports.getThreads = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: { sender: senderSelect, receiver: senderSelect },
      orderBy: { createdAt: "desc" },
    });

    // Group by the OTHER participant
    const threadMap = new Map();
    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!threadMap.has(partner.id)) {
        threadMap.set(partner.id, {
          partner,
          lastMessage: msg.body,
          lastAt: msg.createdAt,
          unread: !msg.isRead && msg.receiverId === userId ? 1 : 0,
        });
      } else {
        if (!msg.isRead && msg.receiverId === userId) {
          threadMap.get(partner.id).unread += 1;
        }
      }
    }

    res.json(Array.from(threadMap.values()));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/messages/:userId  — messages with a specific user
exports.getThread = async (req, res) => {
  try {
    const me = req.user.id;
    const other = req.params.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: me, receiverId: other },
          { senderId: other, receiverId: me },
        ],
      },
      include: { sender: senderSelect },
      orderBy: { createdAt: "asc" },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: other, receiverId: me, isRead: false },
      data: { isRead: true },
    });

    res.json(messages);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, body } = req.body;
    if (!receiverId || !body)
      return res
        .status(400)
        .json({ message: "receiverId and body are required" });

    const message = await prisma.message.create({
      data: { senderId: req.user.id, receiverId, body },
      include: { sender: senderSelect },
    });
    res.status(201).json(message);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/messages/:id
exports.updateMessage = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ message: "Message body is required" });
    }

    const existing = await prisma.message.findUnique({
      where: { id: req.params.id },
      select: { id: true, senderId: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existing.senderId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { body: body.trim() },
      include: { sender: senderSelect },
    });

    res.json(message);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/messages/:id
exports.deleteMessage = async (req, res) => {
  try {
    const existing = await prisma.message.findUnique({
      where: { id: req.params.id },
      select: { id: true, senderId: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existing.senderId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ message: "Message deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/messages/:id/read
exports.markRead = async (req, res) => {
  try {
    const existing = await prisma.message.findUnique({
      where: { id: req.params.id },
      select: { id: true, receiverId: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (existing.receiverId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(message);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
