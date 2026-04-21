const prisma = require("../lib/prisma");

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

// GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const where = {};
    const { role, id } = req.user;
    if (role === "pet_owner") where.ownerId = id;
    else if (role === "veterinarian") where.vetId = id;

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

    const ownerId = req.user.role === "pet_owner" ? req.user.id : pet.ownerId;

    const appt = await prisma.appointment.create({
      data: {
        petId,
        ownerId,
        vetId: vetId || null,
        scheduledAt: new Date(scheduledAt),
        reason,
        notes,
      },
      include: appointmentInclude,
    });

    await prisma.activityLog.create({
      data: {
        staffId: req.user.id,
        action: "Created appointment",
        target: `Appointment ${appt.id}`,
        status: "Completed",
      },
    });

    res.status(201).json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const { status, scheduledAt, reason, vetId, notes } = req.body;
    const data = {};
    if (status !== undefined) data.status = status;
    if (scheduledAt !== undefined) data.scheduledAt = new Date(scheduledAt);
    if (reason !== undefined) data.reason = reason;
    if (vetId !== undefined) data.vetId = vetId;
    if (notes !== undefined) data.notes = notes;

    const appt = await prisma.appointment.update({
      where: { id: req.params.id },
      data,
      include: appointmentInclude,
    });

    await prisma.activityLog.create({
      data: {
        staffId: req.user.id,
        action: `Updated appointment status to ${status || "—"}`,
        target: `Appointment ${appt.id}`,
        status: "Completed",
      },
    });

    res.json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ message: "Appointment deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
