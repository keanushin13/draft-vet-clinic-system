const prisma = require("../lib/prisma");

// GET /api/activity-logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        staff: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
