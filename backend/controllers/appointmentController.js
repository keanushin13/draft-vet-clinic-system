const prisma = require("../lib/prisma");
const { validateSlotForAppointment } = require("../utils/availability");

const appointmentInclude = {
  pet: { select: { id: true, name: true, species: true } },
  owner: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  vet: {
    select: { id: true, username: true, firstName: true, lastName: true },
  },
};

const APPOINTMENT_STATUSES = new Set([
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
]);

const canSetStatus = (role, fromStatus, toStatus) => {
  if (role === "admin" || role === "staff") return true;

  if (role === "pet_owner") {
    // Pet owners can only cancel appointments.
    return toStatus === "Cancelled";
  }

  if (role === "veterinarian") {
    // Vets can confirm or complete, and can still cancel when needed.
    if (toStatus === "Confirmed" || toStatus === "Completed") {
      return fromStatus !== "Cancelled";
    }
    return toStatus === "Cancelled";
  }

  return false;
};

const parseScheduledAt = (scheduledAt) => {
  if (scheduledAt === undefined) return null;
  const parsed = new Date(scheduledAt);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

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

// GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const where = {};
    const { role, id } = req.user;
    if (role === "pet_owner") where.ownerId = id;
    else if (role === "veterinarian") where.vetId = id;
    else if (role !== "staff" && role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: { scheduledAt: "asc" },
    });
    res.json(appointments);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/appointments/:id
exports.getAppointment = async (req, res) => {
  try {
    const appt = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: appointmentInclude,
    });
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });

    if (req.user.role === "pet_owner" && appt.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "veterinarian" && appt.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      !["admin", "staff", "pet_owner", "veterinarian"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { petId, scheduledAt, reason, vetId, notes } = req.body;
    if (!petId || !scheduledAt)
      return res
        .status(400)
        .json({ message: "petId and scheduledAt are required" });

    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (req.user.role === "pet_owner" && pet.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only book appointments for your own pets" });
    }

    if (
      !["admin", "staff", "pet_owner", "veterinarian"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const parsedScheduledAt = parseScheduledAt(scheduledAt);
    if (!parsedScheduledAt) {
      return res.status(400).json({ message: "Invalid scheduledAt" });
    }

    const ownerId = req.user.role === "pet_owner" ? req.user.id : pet.ownerId;

    const resolvedVetId =
      req.user.role === "veterinarian" ? req.user.id : vetId || null;

    if (!resolvedVetId) {
      return res.status(400).json({ message: "vetId is required" });
    }

    const vet = await prisma.user.findUnique({
      where: { id: resolvedVetId },
      select: { id: true, role: true, isActive: true },
    });
    if (!vet || vet.role !== "veterinarian" || !vet.isActive) {
      return res.status(400).json({ message: "Invalid veterinarian" });
    }

    const slotValidation = await validateSlotForAppointment({
      vetId: resolvedVetId,
      scheduledAt: parsedScheduledAt,
    });
    if (!slotValidation.ok) {
      return res.status(400).json({ message: slotValidation.message });
    }

    const appt = await prisma.appointment.create({
      data: {
        petId,
        ownerId,
        vetId: resolvedVetId,
        scheduledAt: parsedScheduledAt,
        reason,
        notes,
      },
      include: appointmentInclude,
    });

    await logStaffActivity(
      req,
      "Created appointment",
      `Appointment ${appt.id}`,
    );

    res.status(201).json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        ownerId: true,
        vetId: true,
        scheduledAt: true,
        status: true,
      },
    });
    if (!existing)
      return res.status(404).json({ message: "Appointment not found" });

    if (req.user.role === "pet_owner" && existing.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      !["admin", "staff", "pet_owner", "veterinarian"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { status, scheduledAt, reason, vetId, notes } = req.body;
    const data = {};
    if (status !== undefined) {
      if (!APPOINTMENT_STATUSES.has(status)) {
        return res.status(400).json({ message: "Invalid appointment status" });
      }
      if (!canSetStatus(req.user.role, existing.status, status)) {
        return res.status(403).json({
          message: "You are not allowed to set this appointment status",
        });
      }
      data.status = status;
    }
    if (scheduledAt !== undefined) {
      if (!["admin", "staff"].includes(req.user.role)) {
        return res.status(403).json({
          message: "Only staff or admin can reschedule appointments",
        });
      }
      const parsedScheduledAt = parseScheduledAt(scheduledAt);
      if (!parsedScheduledAt) {
        return res.status(400).json({ message: "Invalid scheduledAt" });
      }
      data.scheduledAt = parsedScheduledAt;
    }
    if (reason !== undefined) {
      if (!["admin", "staff", "veterinarian"].includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "You are not allowed to update reason" });
      }
      data.reason = reason;
    }
    if (vetId !== undefined) {
      if (!["admin", "staff"].includes(req.user.role)) {
        return res.status(403).json({
          message: "Only staff or admin can reassign veterinarian",
        });
      }
      data.vetId = vetId;
    }
    if (notes !== undefined) {
      if (!["admin", "staff", "veterinarian"].includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "You are not allowed to update notes" });
      }
      data.notes = notes;
    }

    const nextVetId =
      req.user.role === "veterinarian"
        ? req.user.id
        : data.vetId !== undefined
          ? data.vetId
          : existing.vetId;

    const nextScheduledAt =
      data.scheduledAt !== undefined ? data.scheduledAt : existing.scheduledAt;

    if (!nextVetId) {
      return res
        .status(400)
        .json({ message: "Appointment must have a veterinarian" });
    }

    const vet = await prisma.user.findUnique({
      where: { id: nextVetId },
      select: { id: true, role: true, isActive: true },
    });
    if (!vet || vet.role !== "veterinarian" || !vet.isActive) {
      return res.status(400).json({ message: "Invalid veterinarian" });
    }

    const slotValidation = await validateSlotForAppointment({
      vetId: nextVetId,
      scheduledAt: nextScheduledAt,
      excludeAppointmentId: existing.id,
    });
    if (!slotValidation.ok) {
      return res.status(400).json({ message: slotValidation.message });
    }

    const appt = await prisma.appointment.update({
      where: { id: req.params.id },
      data,
      include: appointmentInclude,
    });

    const updateAction =
      status !== undefined
        ? `Updated appointment status to ${status}`
        : "Updated appointment details";
    await logStaffActivity(req, updateAction, `Appointment ${appt.id}`);

    res.json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      select: { id: true, ownerId: true, vetId: true },
    });
    if (!existing)
      return res.status(404).json({ message: "Appointment not found" });

    if (req.user.role === "pet_owner" && existing.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      !["admin", "staff", "pet_owner", "veterinarian"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "Cancelled" },
    });
    await logStaffActivity(
      req,
      "Cancelled appointment",
      `Appointment ${existing.id}`,
    );
    res.json({ message: "Appointment cancelled" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
