const prisma = require("../lib/prisma");

// GET /api/pets
exports.getPets = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === "pet_owner") where.ownerId = req.user.id;

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
    const { name, species, breed, age, gender, status, notes, ownerId } =
      req.body;
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
        ownerId: resolvedOwnerId,
      },
    });
    res.status(201).json(pet);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/pets/:id
exports.updatePet = async (req, res) => {
  try {
    const { name, species, breed, age, gender, status, notes } = req.body;
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
        age: age ? parseInt(age) : null,
        gender,
        status,
        notes,
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

    await prisma.pet.delete({ where: { id: req.params.id } });
    res.json({ message: "Pet deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
