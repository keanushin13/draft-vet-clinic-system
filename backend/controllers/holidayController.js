const prisma = require("../lib/prisma");

const ALLOWED_REASONS = new Set([
  "Regular Holiday",
  "Special Non-working Holiday",
  "Emergency Closure",
  "Special Clinic Event",
  "Maintenance Closure",
]);

// GET /api/holidays
exports.getHolidays = async (req, res) => {
  try {
    const { year } = req.query;
    const where = {};
    if (year) {
      const y = Number(year);
      where.date = {
        gte: new Date(`${y}-01-01`),
        lt: new Date(`${y + 1}-01-01`),
      };
    }
    const holidays = await prisma.clinicHoliday.findMany({
      where,
      orderBy: { date: "asc" },
    });
    res.json(holidays);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/holidays
exports.createHoliday = async (req, res) => {
  try {
    const { date, name, reason } = req.body;
    if (!date || !name || !reason) {
      return res.status(400).json({ message: "date, name, and reason are required" });
    }
    if (!ALLOWED_REASONS.has(reason)) {
      return res.status(400).json({ message: "Invalid reason" });
    }
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }
    parsed.setUTCHours(0, 0, 0, 0);

    const holiday = await prisma.clinicHoliday.create({
      data: { date: parsed, name, reason },
    });
    res.status(201).json(holiday);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/holidays/:id
exports.deleteHoliday = async (req, res) => {
  try {
    const holiday = await prisma.clinicHoliday.findUnique({
      where: { id: req.params.id },
    });
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });
    await prisma.clinicHoliday.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
