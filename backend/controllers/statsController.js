const prisma = require("../lib/prisma");

// GET /api/stats/admin
exports.getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalUsers,
      activeAppointments,
      lowStockCount,
      totalRevenue,
      usersByRole,
      totalPets,
      topDiagnosesRaw,
      revenueRaw,
      appointmentsRaw,
      appointmentsByStatus,
      expiringCount,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.appointment.count({
        where: { status: { in: ["Pending", "Confirmed"] } },
      }),
      prisma.inventoryItem.count({
        where: {
          status: { in: ["LowStock", "OutOfStock"] },
          isArchived: false,
        },
      }),
      prisma.payment.aggregate({
        where: { status: "Paid" },
        _sum: { amount: true },
      }),
      // users per role
      prisma.user.groupBy({
        by: ["role"],
        where: { deletedAt: null },
        _count: { _all: true },
      }),
      prisma.pet.count({ where: { isArchived: false } }),
      // top 5 diagnoses
      prisma.medicalRecord.groupBy({
        by: ["diagnosis"],
        where: { isArchived: false },
        _count: { _all: true },
        orderBy: { _count: { diagnosis: "desc" } },
        take: 5,
      }),
      // revenue by month (last 6)
      prisma.payment.findMany({
        where: {
          status: "Paid",
          createdAt: { gte: sixMonthsAgo },
        },
        select: { amount: true, createdAt: true },
      }),
      // appointments by month (last 6)
      prisma.appointment.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, status: true },
      }),
      // appointments by status
      prisma.appointment.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      // expiring in 30 days
      prisma.inventoryItem.count({
        where: {
          isArchived: false,
          expirationDate: {
            gte: now,
            lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Build roles map
    const roleMap = {};
    usersByRole.forEach((r) => {
      roleMap[r.role] = r._count._all;
    });

    // Build monthly buckets (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }

    const revenueByMonth = months.map(({ label, year, month }) => ({
      month: label,
      revenue: revenueRaw
        .filter((p) => {
          const d = new Date(p.createdAt);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, p) => sum + Number(p.amount), 0),
    }));

    const appointmentsByMonth = months.map(({ label, year, month }) => ({
      month: label,
      count: appointmentsRaw.filter((a) => {
        const d = new Date(a.createdAt);
        return d.getFullYear() === year && d.getMonth() === month;
      }).length,
    }));

    const statusMap = {};
    appointmentsByStatus.forEach((s) => {
      statusMap[s.status] = s._count._all;
    });

    res.json({
      totalUsers,
      activeAppointments,
      lowStockCount,
      monthlyRevenue: totalRevenue._sum.amount || 0,
      usersByRole: roleMap,
      totalPets,
      topDiagnoses: topDiagnosesRaw.map((d) => ({
        diagnosis: d.diagnosis,
        count: d._count._all,
      })),
      revenueByMonth,
      appointmentsByMonth,
      appointmentsByStatus: statusMap,
      expiringCount,
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
