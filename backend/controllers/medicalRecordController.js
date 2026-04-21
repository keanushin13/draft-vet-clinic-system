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

    const record = await prisma.medicalRecord.create({
      data: {
        petId,
        appointmentId,
        vetId: req.user.id,
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
