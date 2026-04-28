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

const getGlobalCheckupRate = () => {
  const raw =
    process.env.GLOBAL_CHECKUP_RATE || process.env.CHECKUP_RATE || "500";
  const parsed = Number(raw);
  if (Number.isNaN(parsed) || parsed < 0) return 500;
  return parsed;
};

const getAppointmentComputedTotal = async (appointmentId) => {
  const checkupRate = getGlobalCheckupRate();
  const usages = await prisma.appointmentInventoryUsage.findMany({
    where: { appointmentId },
    select: { lineTotal: true },
  });
  const inventorySubtotal = usages.reduce(
    (sum, usage) => sum + Number(usage.lineTotal || 0),
    0,
  );

  return {
    checkupRate,
    inventorySubtotal,
    total: checkupRate + inventorySubtotal,
  };
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
      adjustmentReason,
      method,
      status,
      reference,
      notes,
    } = req.body;

    let resolvedPetId = petId;
    let resolvedOwnerId = ownerId;
    let resolvedService = service;
    let resolvedAmount = amount;

    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: {
          id: true,
          petId: true,
          ownerId: true,
          reason: true,
          payment: { select: { id: true } },
        },
      });
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.payment) {
        return res.status(409).json({
          message: "This appointment already has a linked payment",
        });
      }

      resolvedPetId = appointment.petId;
      resolvedOwnerId = appointment.ownerId;
      resolvedService = service || appointment.reason || "Veterinary Checkup";

      const computed = await getAppointmentComputedTotal(appointmentId);
      const hasManualAmount =
        amount !== undefined && amount !== null && String(amount) !== "";
      if (!hasManualAmount) {
        resolvedAmount = computed.total;
      } else {
        const manualAmount = Number(amount);
        if (Number.isNaN(manualAmount)) {
          return res.status(400).json({ message: "amount must be a number" });
        }
        if (
          Math.abs(manualAmount - computed.total) > 0.009 &&
          !adjustmentReason
        ) {
          return res.status(400).json({
            message:
              "adjustmentReason is required when overriding auto-computed total",
          });
        }
        resolvedAmount = manualAmount;
      }
    } else {
      if (!petId || !service || amount === undefined || String(amount) === "") {
        return res
          .status(400)
          .json({ message: "petId, service, amount are required" });
      }

      const pet = await prisma.pet.findUnique({
        where: { id: petId },
        select: { ownerId: true },
      });
      if (!pet) return res.status(404).json({ message: "Pet not found" });
      resolvedOwnerId = ownerId || pet.ownerId;
      resolvedAmount = Number(amount);
    }

    if (!resolvedPetId || !resolvedService) {
      return res.status(400).json({
        message: "Unable to resolve pet and service for payment",
      });
    }

    if (Number.isNaN(Number(resolvedAmount))) {
      return res.status(400).json({ message: "amount must be a number" });
    }

    const payment = await prisma.payment.create({
      data: {
        petId: resolvedPetId,
        ownerId: resolvedOwnerId,
        appointmentId,
        service: resolvedService,
        amount: parseFloat(resolvedAmount),
        adjustmentReason,
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
    const {
      status,
      method,
      reference,
      notes,
      service,
      amount,
      adjustmentReason,
    } = req.body;
    const data = {};
    if (status !== undefined) data.status = status;
    if (method !== undefined) data.method = method;
    if (reference !== undefined) data.reference = reference;
    if (notes !== undefined) data.notes = notes;
    if (service !== undefined) data.service = service;
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (adjustmentReason !== undefined)
      data.adjustmentReason = adjustmentReason;

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
