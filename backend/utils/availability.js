const prisma = require("../lib/prisma");

const SLOT_MINUTES_DEFAULT = 30;

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const minutesFromTimeString = (value) => {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) {
    return null;
  }
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m) || h > 23 || m > 59) {
    return null;
  }
  return h * 60 + m;
};

const overlap = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

const getDayBounds = (dateInput) => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // Normalise to a YYYY-MM-DD string so we are always working with
  // the calendar date the caller intended, regardless of server TZ.
  const dateStr =
    typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateInput)
      ? dateInput.slice(0, 10)
      : date.toISOString().slice(0, 10);

  const dayStart = new Date(`${dateStr}T00:00:00.000+08:00`);
  const dayEnd = new Date(`${dateStr}T23:59:59.999+08:00`);

  return { dayStart, dayEnd, dateStr };
};

const getVetWeeklySchedule = async (vetId) => {
  const rows = await prisma.vetSchedule.findMany({
    where: { vetId },
    orderBy: { dayOfWeek: "asc" },
  });

  return rows;
};

const getVetExceptionsOnDay = async (vetId, dayStart, dayEnd) => {
  return prisma.vetScheduleException.findMany({
    where: {
      vetId,
      startsAt: { lt: dayEnd },
      endsAt: { gt: dayStart },
    },
    orderBy: { startsAt: "asc" },
  });
};

const getVetBookedAppointmentsOnDay = async (
  vetId,
  dayStart,
  dayEnd,
  excludeAppointmentId,
) => {
  const where = {
    vetId,
    scheduledAt: {
      gte: dayStart,
      lt: dayEnd,
    },
    status: {
      notIn: ["Cancelled"],
    },
  };

  if (excludeAppointmentId) {
    where.id = { not: excludeAppointmentId };
  }

  return prisma.appointment.findMany({
    where,
    select: { id: true, scheduledAt: true },
    orderBy: { scheduledAt: "asc" },
  });
};

const getSlotDuration = (scheduleRow) => {
  const minutes = scheduleRow?.slotDurationMinutes || SLOT_MINUTES_DEFAULT;
  if (![15, 20, 30, 45, 60].includes(minutes)) {
    return SLOT_MINUTES_DEFAULT;
  }
  return minutes;
};

const computeDaySlots = async ({
  vetId,
  date,
  includeBooked = false,
  excludeAppointmentId,
}) => {
  const bounds = getDayBounds(date);
  if (!bounds) {
    return { error: "Invalid date" };
  }

  const { dayStart, dayEnd, dateStr } = bounds;
  // Derive weekday from the date string to avoid UTC-offset skew
  const weekday = new Date(`${dateStr}T12:00:00.000+08:00`).getDay();

  const scheduleRow = await prisma.vetSchedule.findUnique({
    where: {
      vetId_dayOfWeek: {
        vetId,
        dayOfWeek: weekday,
      },
    },
  });

  if (!scheduleRow || !scheduleRow.isActive) {
    return {
      slots: [],
      schedule: null,
      reason: `No working schedule for ${dayNames[weekday]}`,
    };
  }

  const startMin = minutesFromTimeString(scheduleRow.startTime);
  const endMin = minutesFromTimeString(scheduleRow.endTime);
  if (startMin === null || endMin === null || endMin <= startMin) {
    return {
      slots: [],
      schedule: scheduleRow,
      reason: "Invalid time range in schedule",
    };
  }

  const slotDuration = getSlotDuration(scheduleRow);

  const [exceptions, booked] = await Promise.all([
    getVetExceptionsOnDay(vetId, dayStart, dayEnd),
    getVetBookedAppointmentsOnDay(
      vetId,
      dayStart,
      dayEnd,
      excludeAppointmentId,
    ),
  ]);

  const slots = [];
  for (
    let cursor = startMin;
    cursor + slotDuration <= endMin;
    cursor += slotDuration
  ) {
    const hh = String(Math.floor(cursor / 60)).padStart(2, "0");
    const mm = String(cursor % 60).padStart(2, "0");
    const slotStart = new Date(`${dateStr}T${hh}:${mm}:00.000+08:00`);

    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

    const blockedByException = exceptions.some((e) =>
      overlap(slotStart, slotEnd, new Date(e.startsAt), new Date(e.endsAt)),
    );

    const blockedByBooking = booked.some((b) => {
      const apptStart = new Date(b.scheduledAt);
      const apptEnd = new Date(apptStart);
      apptEnd.setMinutes(apptStart.getMinutes() + slotDuration);
      return overlap(slotStart, slotEnd, apptStart, apptEnd);
    });

    if (!blockedByException && !blockedByBooking) {
      slots.push({
        startsAt: slotStart.toISOString(),
        endsAt: slotEnd.toISOString(),
      });
    }
  }

  if (includeBooked) {
    return {
      slots,
      booked,
      exceptions,
      schedule: scheduleRow,
      slotDuration,
    };
  }

  return {
    slots,
    schedule: scheduleRow,
    slotDuration,
  };
};

const validateSlotForAppointment = async ({
  vetId,
  scheduledAt,
  excludeAppointmentId,
}) => {
  if (!vetId) {
    return { ok: false, message: "A veterinarian is required" };
  }

  const slotStart = new Date(scheduledAt);
  if (Number.isNaN(slotStart.getTime())) {
    return { ok: false, message: "Invalid scheduledAt" };
  }

  const computed = await computeDaySlots({
    vetId,
    date: slotStart,
    excludeAppointmentId,
  });

  if (computed.error) {
    return { ok: false, message: computed.error };
  }

  const match = computed.slots.some(
    (slot) => new Date(slot.startsAt).getTime() === slotStart.getTime(),
  );

  if (!match) {
    return {
      ok: false,
      message: "Selected time is not available for this veterinarian",
    };
  }

  return {
    ok: true,
    slotDuration: computed.slotDuration || SLOT_MINUTES_DEFAULT,
  };
};

module.exports = {
  dayNames,
  minutesFromTimeString,
  SLOT_MINUTES_DEFAULT,
  computeDaySlots,
  validateSlotForAppointment,
};
