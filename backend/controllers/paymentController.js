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
    if (req.user.role === "pet_owner") where.ownerId = req.user.id;
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

    const payment = await prisma.payment.create({
      data: {
        petId,
        ownerId,
        appointmentId,
        service,
        amount: parseFloat(amount),
        method,
        status,
        reference,
        notes,
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
    const { status, method, reference, notes } = req.body;
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status, method, reference, notes },
      include,
    });
    res.json(payment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
