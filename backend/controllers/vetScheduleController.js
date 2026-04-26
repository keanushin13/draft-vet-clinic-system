const prisma = require("../lib/prisma");
const {
  dayNames,
  minutesFromTimeString,
  SLOT_MINUTES_DEFAULT,
  computeDaySlots,
} = require("../utils/availability");

const allowedDurations = [15, 20, 30, 45, 60];

const logStaffActivity = async (req, action, target) => {
  if (req.user.role !== "staff") return;
  await prisma.activityLog.create({
    data: {
      staffId: req.user.id,
      action,
      target,
      status: "Completed",
    },
  });
};

const ensureVet = async (vetId) => {
  const vet = await prisma.user.findUnique({
    where: { id: vetId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!vet || vet.role !== "veterinarian" || !vet.isActive) {
    return null;
  }

  return vet;
};

const normalizeWeeklyInput = (body) => {
  if (!Array.isArray(body)) {
    return { error: "Schedule payload must be an array" };
  }

  const normalized = [];
  const seenDays = new Set();

  for (const row of body) {
    const dayOfWeek = Number(row.dayOfWeek);
    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return { error: "dayOfWeek must be an integer from 0 to 6" };
    }

    if (seenDays.has(dayOfWeek)) {
      return { error: `Duplicate dayOfWeek ${dayOfWeek}` };
    }
    seenDays.add(dayOfWeek);

    const isActive = row.isActive !== false;
    const startTime = row.startTime || "09:00";
    const endTime = row.endTime || "17:00";

    const startMin = minutesFromTimeString(startTime);
    const endMin = minutesFromTimeString(endTime);

    if (startMin === null || endMin === null || endMin <= startMin) {
      return { error: `Invalid time range for ${dayNames[dayOfWeek]}` };
    }

    const slotDurationMinutes = Number(
      row.slotDurationMinutes || SLOT_MINUTES_DEFAULT,
    );
    if (!allowedDurations.includes(slotDurationMinutes)) {
      return {
        error: `slotDurationMinutes must be one of: ${allowedDurations.join(", ")}`,
      };
    }

    if (endMin - startMin < slotDurationMinutes) {
      return {
        error: `Working hours for ${dayNames[dayOfWeek]} are shorter than slot duration`,
      };
    }

    normalized.push({
      dayOfWeek,
      startTime,
      endTime,
      isActive,
      slotDurationMinutes,
    });
  }

  return { data: normalized };
};

const canManageVet = (req, vetId) =>
  req.user.role === "staff" ||
  req.user.role === "admin" ||
  req.user.id === vetId;

// GET /api/vet-schedules/vets
exports.getAvailableVets = async (_req, res) => {
  try {
    const vets = await prisma.user.findMany({
      where: { role: "veterinarian", isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }, { username: "asc" }],
    });

    res.json(vets);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vet-schedules/me
exports.getMySchedule = async (req, res) => {
  try {
    const vetId = req.user.id;
    const [weekly, exceptions] = await Promise.all([
      prisma.vetSchedule.findMany({
        where: { vetId },
        orderBy: { dayOfWeek: "asc" },
      }),
      prisma.vetScheduleException.findMany({
        where: {
          vetId,
          endsAt: { gte: new Date() },
        },
        orderBy: { startsAt: "asc" },
      }),
    ]);

    res.json({ weekly, exceptions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vet-schedules/:vetId
exports.getVetSchedule = async (req, res) => {
  try {
    const { vetId } = req.params;
    if (!canManageVet(req, vetId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const vet = await ensureVet(vetId);
    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    const [weekly, exceptions] = await Promise.all([
      prisma.vetSchedule.findMany({
        where: { vetId },
        orderBy: { dayOfWeek: "asc" },
      }),
      prisma.vetScheduleException.findMany({
        where: {
          vetId,
          endsAt: { gte: new Date() },
        },
        orderBy: { startsAt: "asc" },
      }),
    ]);

    res.json({ vet, weekly, exceptions });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/vet-schedules/me
exports.replaceMyWeeklySchedule = async (req, res) => {
  try {
    const parsed = normalizeWeeklyInput(req.body.weekly);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const vetId = req.user.id;

    await prisma.$transaction(async (tx) => {
      await tx.vetSchedule.deleteMany({ where: { vetId } });
      if (parsed.data.length) {
        await tx.vetSchedule.createMany({
          data: parsed.data.map((row) => ({ ...row, vetId })),
        });
      }
    });

    const weekly = await prisma.vetSchedule.findMany({
      where: { vetId },
      orderBy: { dayOfWeek: "asc" },
    });

    res.json({ weekly });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/vet-schedules/:vetId/weekly
exports.replaceVetWeeklySchedule = async (req, res) => {
  try {
    const { vetId } = req.params;
    if (!canManageVet(req, vetId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const vet = await ensureVet(vetId);
    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    const parsed = normalizeWeeklyInput(req.body.weekly);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    await prisma.$transaction(async (tx) => {
      await tx.vetSchedule.deleteMany({ where: { vetId } });
      if (parsed.data.length) {
        await tx.vetSchedule.createMany({
          data: parsed.data.map((row) => ({ ...row, vetId })),
        });
      }
    });

    const weekly = await prisma.vetSchedule.findMany({
      where: { vetId },
      orderBy: { dayOfWeek: "asc" },
    });

    await logStaffActivity(
      req,
      "Updated veterinarian weekly schedule",
      `Veterinarian ${vetId}`,
    );

    res.json({ vet, weekly });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/vet-schedules/:vetId/exceptions
exports.createScheduleException = async (req, res) => {
  try {
    const { vetId } = req.params;
    if (!canManageVet(req, vetId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const vet = await ensureVet(vetId);
    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    const { startsAt, endsAt, reason } = req.body;
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid startsAt or endsAt" });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ message: "endsAt must be after startsAt" });
    }

    const exception = await prisma.vetScheduleException.create({
      data: {
        vetId,
        startsAt: startDate,
        endsAt: endDate,
        reason: reason || null,
      },
    });

    await logStaffActivity(
      req,
      "Created veterinarian schedule exception",
      `Veterinarian ${vetId}`,
    );

    res.status(201).json(exception);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/vet-schedules/me/exceptions
exports.createMyScheduleException = async (req, res) => {
  try {
    req.params.vetId = req.user.id;
    return exports.createScheduleException(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/vet-schedules/exceptions/:id
exports.deleteScheduleException = async (req, res) => {
  try {
    const exception = await prisma.vetScheduleException.findUnique({
      where: { id: req.params.id },
      select: { id: true, vetId: true },
    });

    if (!exception) {
      return res.status(404).json({ message: "Exception not found" });
    }

    if (!canManageVet(req, exception.vetId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.vetScheduleException.delete({ where: { id: exception.id } });
    await logStaffActivity(
      req,
      "Deleted veterinarian schedule exception",
      `Veterinarian ${exception.vetId}`,
    );
    res.json({ message: "Exception deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vet-schedules/:vetId/available-slots?date=YYYY-MM-DD
exports.getAvailableSlots = async (req, res) => {
  try {
    const { vetId } = req.params;
    const date = req.query.date;

    if (!date) {
      return res
        .status(400)
        .json({ message: "date query parameter is required" });
    }

    const vet = await ensureVet(vetId);
    if (!vet) {
      return res.status(404).json({ message: "Veterinarian not found" });
    }

    const slots = await computeDaySlots({ vetId, date });
    if (slots.error) {
      return res.status(400).json({ message: slots.error });
    }

    res.json({
      vet,
      date,
      schedule: slots.schedule,
      slotDurationMinutes: slots.slotDuration || SLOT_MINUTES_DEFAULT,
      slots: slots.slots,
      reason: slots.reason || null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
