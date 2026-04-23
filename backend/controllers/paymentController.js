const prisma = require("../lib/prisma");

const include = {
  pet: { select: { id: true, name: true } },
  owner: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  appointment: { select: { id: true, scheduledAt: true } },
};

// GET /api/payments
exports.getPayments = async (req, res) => {
  try {
    const where = {};
    const includeArchived =
      String(req.query.includeArchived || "").toLowerCase() === "true";
    if (req.user.role === "pet_owner") where.ownerId = req.user.id;
    if (!includeArchived) where.isArchived = false;

    const payments = await prisma.payment.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments/:id
exports.getPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include,
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (req.user.role === "pet_owner" && payment.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      payment.isArchived &&
      String(req.query.includeArchived || "").toLowerCase() !== "true"
    ) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/payments
exports.createPayment = async (req, res) => {
  try {
    const {
      petId,
      ownerId,
      appointmentId,
      service,
      amount,
      method,
      status,
      reference,
      notes,
    } = req.body;
    if (!petId || !service || !amount)
      return res
        .status(400)
        .json({ message: "petId, service, amount are required" });

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { ownerId: true },
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    const resolvedOwnerId = ownerId || pet.ownerId;

    const payment = await prisma.payment.create({
      data: {
        petId,
        ownerId: resolvedOwnerId,
        appointmentId,
        service,
        amount: parseFloat(amount),
        method,
        status,
        reference,
        notes,
        isArchived: false,
        archivedAt: null,
      },
      include,
    });
    res.status(201).json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/payments/:id
exports.updatePayment = async (req, res) => {
  try {
    const { status, method, reference, notes, service, amount } = req.body;
    const data = {};
    if (status !== undefined) data.status = status;
    if (method !== undefined) data.method = method;
    if (reference !== undefined) data.reference = reference;
    if (notes !== undefined) data.notes = notes;
    if (service !== undefined) data.service = service;
    if (amount !== undefined) data.amount = parseFloat(amount);

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data,
      include,
    });
    res.json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/payments/:id (soft delete)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { isArchived: true, archivedAt: new Date() },
      include,
    });
    res.json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/payments/:id/restore
exports.restorePayment = async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { isArchived: false, archivedAt: null },
      include,
    });
    res.json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
