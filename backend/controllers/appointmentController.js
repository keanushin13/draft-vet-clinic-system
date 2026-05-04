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

const getGlobalCheckupRate = () => {
  const raw =
    process.env.GLOBAL_CHECKUP_RATE || process.env.CHECKUP_RATE || "500";
  const parsed = Number(raw);
  if (Number.isNaN(parsed) || parsed < 0) return 500;
  return parsed;
};

const computeInventoryStatus = (stock) => {
  if (stock <= 0) return "OutOfStock";
  if (stock <= 10) return "LowStock";
  return "InStock";
};

const getAppointmentForAccess = async (appointmentId) =>
  prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: appointmentInclude,
  });

const canAccessAppointment = (user, appt) => {
  if (["admin", "staff"].includes(user.role)) return true;
  if (user.role === "pet_owner") return appt.ownerId === user.id;
  if (user.role === "veterinarian") return appt.vetId === user.id;
  return false;
};

const getBillingSummaryByAppointmentId = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      ...appointmentInclude,
      inventoryUsages: {
        include: {
          inventoryItem: {
            select: { id: true, name: true, unit: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!appointment) return null;

  const checkupRate = getGlobalCheckupRate();
  const inventorySubtotal = appointment.inventoryUsages.reduce(
    (sum, usage) => sum + Number(usage.lineTotal || 0),
    0,
  );
  const total = checkupRate + inventorySubtotal;

  return {
    appointment: {
      id: appointment.id,
      scheduledAt: appointment.scheduledAt,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      pet: appointment.pet,
      owner: appointment.owner,
      vet: appointment.vet,
    },
    checkupRate,
    inventorySubtotal,
    total,
    usageLines: appointment.inventoryUsages.map((usage) => ({
      id: usage.id,
      inventoryItemId: usage.inventoryItemId,
      inventoryItemName: usage.inventoryItem?.name,
      unit: usage.inventoryItem?.unit,
      quantityUsed: usage.quantityUsed,
      unitCostSnapshot: Number(usage.unitCostSnapshot || 0),
      lineTotal: Number(usage.lineTotal || 0),
    })),
  };
};

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

// GET /api/appointments/:id/billing-summary
exports.getAppointmentBillingSummary = async (req, res) => {
  try {
    const summary = await getBillingSummaryByAppointmentId(req.params.id);
    if (!summary) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appt = await getAppointmentForAccess(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (!canAccessAppointment(req.user, appt)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(summary);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/appointments/:id/inventory-usage
exports.addAppointmentInventoryUsage = async (req, res) => {
  try {
    if (!["admin", "staff", "veterinarian"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appt = await getAppointmentForAccess(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (!canAccessAppointment(req.user, appt)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const rawUsages = Array.isArray(req.body.usages)
      ? req.body.usages
      : [
          {
            inventoryItemId: req.body.inventoryItemId,
            quantityUsed: req.body.quantityUsed,
          },
        ];

    if (!rawUsages.length) {
      return res.status(400).json({ message: "No usage items provided" });
    }

    for (const usage of rawUsages) {
      if (!usage.inventoryItemId || !usage.quantityUsed) {
        return res.status(400).json({
          message: "inventoryItemId and quantityUsed are required for each item",
        });
      }
      const qty = Number(usage.quantityUsed);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({
          message: "quantityUsed must be a positive integer",
        });
      }
    }

    await prisma.$transaction(async (tx) => {
      for (const usage of rawUsages) {
        const item = await tx.inventoryItem.findUnique({
          where: { id: usage.inventoryItemId },
        });
        if (!item || item.isArchived) {
          throw new Error("Inventory item not found");
        }

        const qty = Number(usage.quantityUsed);
        if (item.stock < qty) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        const unitCost = Number(item.price || 0);
        const lineTotal = unitCost * qty;
        const nextStock = item.stock - qty;

        await tx.appointmentInventoryUsage.create({
          data: {
            appointmentId: appt.id,
            inventoryItemId: item.id,
            quantityUsed: qty,
            unitCostSnapshot: unitCost,
            lineTotal,
            createdById: req.user.id,
          },
        });

        await tx.inventoryItem.update({
          where: { id: item.id },
          data: {
            stock: nextStock,
            status: computeInventoryStatus(nextStock),
          },
        });
      }
    });

    const summary = await getBillingSummaryByAppointmentId(appt.id);
    res.status(201).json(summary);
  } catch (e) {
    if (e.message?.startsWith("Insufficient stock")) {
      return res.status(400).json({ message: e.message });
    }
    if (e.message === "Inventory item not found") {
      return res.status(404).json({ message: e.message });
    }
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/appointments/:id/inventory-usage/:usageId
exports.deleteAppointmentInventoryUsage = async (req, res) => {
  try {
    if (!["admin", "staff", "veterinarian"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appt = await getAppointmentForAccess(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (!canAccessAppointment(req.user, appt)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const usage = await prisma.appointmentInventoryUsage.findUnique({
      where: { id: req.params.usageId },
      include: { inventoryItem: true },
    });
    if (!usage || usage.appointmentId !== appt.id) {
      return res.status(404).json({ message: "Usage entry not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.appointmentInventoryUsage.delete({ where: { id: usage.id } });

      const nextStock = (usage.inventoryItem?.stock || 0) + usage.quantityUsed;
      await tx.inventoryItem.update({
        where: { id: usage.inventoryItemId },
        data: {
          stock: nextStock,
          status: computeInventoryStatus(nextStock),
        },
      });
    });

    const summary = await getBillingSummaryByAppointmentId(appt.id);
    res.json(summary);
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
