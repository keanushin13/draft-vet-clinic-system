const prisma = require("../lib/prisma");

// GET /api/stats/admin
exports.getAdminStats = async (req, res) => {
  try {
    const [totalUsers, activeAppointments, lowStockCount, totalRevenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.appointment.count({
          where: { status: { in: ["Pending", "Confirmed"] } },
        }),
        prisma.inventoryItem.count({
          where: { status: { in: ["LowStock", "OutOfStock"] } },
        }),
        prisma.payment.aggregate({
          where: { status: "Paid" },
          _sum: { amount: true },
        }),
      ]);
    res.json({
      totalUsers,
      activeAppointments,
      lowStockCount,
      monthlyRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/stats/staff
exports.getStaffStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [totalAppointments, todayAppointments, totalPets, pendingPayments] =
      await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({
          where: { scheduledAt: { gte: today, lt: tomorrow } },
        }),
        prisma.pet.count(),
        prisma.payment.count({ where: { status: "Pending" } }),
      ]);
    res.json({
      totalAppointments,
      todayAppointments,
      totalPets,
      pendingPayments,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/stats/vet
exports.getVetStats = async (req, res) => {
  try {
    const vetId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [totalPatients, todayAppointments, totalRecords] = await Promise.all([
      prisma.appointment
        .groupBy({ by: ["petId"], where: { vetId }, _count: true })
        .then((r) => r.length),
      prisma.appointment.count({
        where: { vetId, scheduledAt: { gte: today, lt: tomorrow } },
      }),
      prisma.medicalRecord.count({ where: { vetId } }),
    ]);
    res.json({ totalPatients, todayAppointments, totalRecords });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/stats/pet-owner
exports.getPetOwnerStats = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [totalPets, upcomingAppointments, unreadMessages] = await Promise.all(
      [
        prisma.pet.count({ where: { ownerId } }),
        prisma.appointment.count({
          where: { ownerId, status: { in: ["Pending", "Confirmed"] } },
        }),
        prisma.message.count({ where: { receiverId: ownerId, isRead: false } }),
      ],
    );
    res.json({ totalPets, upcomingAppointments, unreadMessages });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
