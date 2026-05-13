const prisma = require("../lib/prisma");

// Category → action keyword mapping
const CATEGORY_KEYWORDS = {
  login: ["login", "failed login"],
  appointments: ["appointment"],
  medical: ["medical record", "record"],
  payments: ["payment"],
  inventory: ["inventory", "stock"],
  users: ["user", "account", "password"],
  pets: ["pet"],
};

// GET /api/activity-logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { q, status, from, to, category, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    const searchTerms = [];

    if (q) {
      searchTerms.push(
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
      );
    }

    if (category && CATEGORY_KEYWORDS[category]) {
      const keywords = CATEGORY_KEYWORDS[category];
      const catTerms = keywords.map((kw) => ({
        action: { contains: kw, mode: "insensitive" },
      }));
      // combine with q if present
      if (searchTerms.length > 0) {
        where.AND = [{ OR: searchTerms }, { OR: catTerms }];
      } else {
        where.OR = catTerms;
      }
    } else if (searchTerms.length > 0) {
      where.OR = searchTerms;
    }

    if (status) where.status = status;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    const [logs, total] = await prisma.$transaction([
      prisma.activityLog.findMany({
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
        skip,
        take: limitNum,
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({
      logs,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
