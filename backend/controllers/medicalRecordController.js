const prisma = require("../lib/prisma");

const include = {
  pet: { select: { id: true, name: true, species: true } },
  vet: {
    select: { id: true, username: true, firstName: true, lastName: true },
  },
  appointment: { select: { id: true, scheduledAt: true } },
};

// GET /api/medical-records
exports.getMedicalRecords = async (req, res) => {
  try {
    const where = {};
    const { role, id } = req.user;
    if (role === "veterinarian") where.vetId = id;
    else if (role === "pet_owner") where.pet = { ownerId: id };

    if (req.query.petId) where.petId = req.query.petId;

    const records = await prisma.medicalRecord.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
    });
    res.json(records);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/medical-records/:id
exports.getMedicalRecord = async (req, res) => {
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      include,
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (req.user.role === "veterinarian" && record.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "pet_owner") {
      const pet = await prisma.pet.findUnique({
        where: { id: record.petId },
        select: { ownerId: true },
      });
      if (!pet || pet.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    res.json(record);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/medical-records
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      petId,
      appointmentId,
      diagnosis,
      treatment,
      prescription,
      notes,
      status,
      followUpDate,
    } = req.body;
    if (!petId || !diagnosis)
      return res
        .status(400)
        .json({ message: "petId and diagnosis are required" });

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true, ownerId: true },
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (req.user.role === "pet_owner" && pet.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let resolvedVetId = req.user.id;
    if (req.user.role === "pet_owner") {
      if (!appointmentId) {
        return res
          .status(400)
          .json({ message: "appointmentId is required for pet owners" });
      }

      const appt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: { id: true, ownerId: true, petId: true, vetId: true },
      });
      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appt.ownerId !== req.user.id || appt.petId !== petId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (!appt.vetId) {
        return res
          .status(400)
          .json({ message: "Appointment has no assigned veterinarian" });
      }
      resolvedVetId = appt.vetId;
    }

    const record = await prisma.medicalRecord.create({
      data: {
        petId,
        appointmentId,
        vetId: resolvedVetId,
        diagnosis,
        treatment,
        prescription,
        notes,
        status,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
      include,
    });
    res.status(201).json(record);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/medical-records/:id
exports.updateMedicalRecord = async (req, res) => {
  try {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      select: { id: true, vetId: true, pet: { select: { ownerId: true } } },
    });
    if (!existing) return res.status(404).json({ message: "Record not found" });

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      req.user.role === "pet_owner" &&
      existing.pet?.ownerId !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { diagnosis, treatment, prescription, notes, status, followUpDate } =
      req.body;
    const record = await prisma.medicalRecord.update({
      where: { id: req.params.id },
      data: {
        diagnosis,
        treatment,
        prescription,
        notes,
        status,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
      include,
    });
    res.json(record);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/medical-records/:id
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: req.params.id },
      select: { id: true, vetId: true, pet: { select: { ownerId: true } } },
    });
    if (!existing) return res.status(404).json({ message: "Record not found" });

    if (req.user.role === "veterinarian" && existing.vetId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      req.user.role === "pet_owner" &&
      existing.pet?.ownerId !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.medicalRecord.delete({ where: { id: req.params.id } });
    res.json({ message: "Record deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
