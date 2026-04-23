const prisma = require("../lib/prisma");

// GET /api/activity-logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { q, status, from, to } = req.query;
    const where = {};

    if (q) {
      where.OR = [
        { action: { contains: q, mode: "insensitive" } },
        { target: { contains: q, mode: "insensitive" } },
        {
          staff: {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    if (status) where.status = status;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const logs = await prisma.activityLog.findMany({
      where,
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
