const prisma = require("../lib/prisma");
const logActivity = require("../utils/logActivity");

// GET /api/pets
exports.getPets = async (req, res) => {
  try {
    const where = { isArchived: false };
    if (req.user.role === "pet_owner") {
      where.ownerId = req.user.id;
    } else if (req.query.ownerId) {
      where.ownerId = req.query.ownerId;
    }

    const pets = await prisma.pet.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(pets);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/pets/:id
exports.getPet = async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (req.user.role === "pet_owner" && pet.ownerId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    res.json(pet);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/pets
exports.createPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      status,
      notes,
      ownerId,
      birthday,
      weight,
    } = req.body;
    if (!name || !species)
      return res.status(400).json({ message: "name and species are required" });

    const resolvedOwnerId =
      req.user.role === "pet_owner" ? req.user.id : ownerId;
    if (!resolvedOwnerId)
      return res.status(400).json({ message: "ownerId is required" });

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age: age ? parseInt(age) : null,
        gender,
        status,
        notes,
        birthday: birthday ? new Date(birthday) : null,
        weight: weight ? parseFloat(weight) : null,
        isArchived: false,
        ownerId: resolvedOwnerId,
      },
    });

    if (req.user.role !== "pet_owner") {
      await logActivity({
        action: `Created pet: ${name}`,
        target: pet.id,
        staffId: req.user.id,
      });
    }

    res.status(201).json(pet);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/pets/:id
exports.updatePet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      status,
      notes,
      birthday,
      weight,
    } = req.body;
    const existing = await prisma.pet.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Pet not found" });
    if (req.user.role === "pet_owner" && existing.ownerId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const pet = await prisma.pet.update({
      where: { id: req.params.id },
      data: {
        name,
        species,
        breed,
        age: age !== undefined ? (age ? parseInt(age) : null) : undefined,
        gender,
        status,
        notes,
        birthday:
          birthday !== undefined
            ? birthday
              ? new Date(birthday)
              : null
            : undefined,
        weight:
          weight !== undefined
            ? weight
              ? parseFloat(weight)
              : null
            : undefined,
      },
    });
    res.json(pet);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/pets/:id
exports.deletePet = async (req, res) => {
  try {
    const existing = await prisma.pet.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Pet not found" });
    if (req.user.role === "pet_owner" && existing.ownerId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await prisma.pet.update({
      where: { id: req.params.id },
      data: { isArchived: true, archivedAt: new Date() },
    });

    if (req.user.role !== "pet_owner") {
      await logActivity({
        action: `Archived pet: ${existing.name}`,
        target: existing.id,
        staffId: req.user.id,
      });
    }

    res.json({ message: "Pet archived" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/pets/:id/restore
exports.restorePet = async (req, res) => {
  try {
    const existing = await prisma.pet.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Pet not found" });
    if (req.user.role === "pet_owner" && existing.ownerId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await prisma.pet.update({
      where: { id: req.params.id },
      data: { isArchived: false, archivedAt: null },
    });

    if (req.user.role !== "pet_owner") {
      await logActivity({
        action: `Restored pet: ${existing.name}`,
        target: existing.id,
        staffId: req.user.id,
      });
    }

    res.json({ message: "Pet restored" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
