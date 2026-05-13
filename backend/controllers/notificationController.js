const prisma = require("../lib/prisma");

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/notifications/mark-all-read
exports.markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/notifications/:id/read
exports.markOneRead = async (req, res) => {
  try {
    const notif = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(notif);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/notifications/broadcast  (admin only)
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, body, type = "announcement", targetRole } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }

    const where = { deletedAt: null };
    if (targetRole && targetRole !== "all") where.role = targetRole;

    const users = await prisma.user.findMany({ where, select: { id: true } });
    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "No users match the target role" });
    }

    await prisma.notification.createMany({
      data: users.map((u) => ({ userId: u.id, type, title, body })),
    });

    res.json({ message: `Announcement sent to ${users.length} user(s)` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
