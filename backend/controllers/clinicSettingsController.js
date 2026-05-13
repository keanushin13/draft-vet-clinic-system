const prisma = require("../lib/prisma");

const DAYS = [
  { dayOfWeek: 0, label: "Sunday" },
  { dayOfWeek: 1, label: "Monday" },
  { dayOfWeek: 2, label: "Tuesday" },
  { dayOfWeek: 3, label: "Wednesday" },
  { dayOfWeek: 4, label: "Thursday" },
  { dayOfWeek: 5, label: "Friday" },
  { dayOfWeek: 6, label: "Saturday" },
];

// GET /api/clinic-settings
exports.getClinicSettings = async (req, res) => {
  try {
    // Ensure all 7 days exist, upsert defaults if missing
    await Promise.all(
      DAYS.map((d) =>
        prisma.clinicSettings.upsert({
          where: { dayOfWeek: d.dayOfWeek },
          create: {
            dayOfWeek: d.dayOfWeek,
            isOpen: d.dayOfWeek !== 0, // Sunday closed by default
            openTime: "08:00",
            closeTime: "17:00",
          },
          update: {},
        }),
      ),
    );

    const settings = await prisma.clinicSettings.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    res.json(settings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/clinic-settings
exports.updateClinicSettings = async (req, res) => {
  try {
    const { settings } = req.body; // array of { dayOfWeek, isOpen, openTime, closeTime, breakStart, breakEnd }
    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({ message: "settings array is required" });
    }

    const updated = await prisma.$transaction(
      settings.map((s) =>
        prisma.clinicSettings.upsert({
          where: { dayOfWeek: s.dayOfWeek },
          create: {
            dayOfWeek: s.dayOfWeek,
            isOpen: s.isOpen ?? true,
            openTime: s.openTime || "08:00",
            closeTime: s.closeTime || "17:00",
            breakStart: s.breakStart || null,
            breakEnd: s.breakEnd || null,
          },
          update: {
            isOpen: s.isOpen ?? true,
            openTime: s.openTime || "08:00",
            closeTime: s.closeTime || "17:00",
            breakStart: s.breakStart || null,
            breakEnd: s.breakEnd || null,
          },
        }),
      ),
    );

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
