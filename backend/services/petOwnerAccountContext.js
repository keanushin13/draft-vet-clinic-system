const prisma = require("../lib/prisma");

const trunc = (value, max = 400) => {
  const s = String(value ?? "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
};

/**
 * Load a compact, pet-owner–scoped snapshot for Quick Assist (LLM context only).
 * @param {string} ownerId
 * @returns {Promise<object>}
 */
async function fetchPetOwnerAccountContext(ownerId) {
  if (!ownerId) {
    return { error: "missing_owner" };
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [user, pets, upcoming, past, medicalRecords] = await Promise.all([
    prisma.user.findUnique({
      where: { id: ownerId },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
      },
    }),
    prisma.pet.findMany({
      where: { ownerId, isArchived: false },
      select: {
        id: true,
        name: true,
        species: true,
        breed: true,
        gender: true,
        age: true,
        status: true,
      },
      orderBy: { name: "asc" },
      take: 30,
    }),
    prisma.appointment.findMany({
      where: { ownerId, scheduledAt: { gte: startOfToday } },
      orderBy: { scheduledAt: "asc" },
      take: 20,
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        reason: true,
        notes: true,
        pet: { select: { name: true, species: true } },
        vet: { select: { firstName: true, lastName: true, username: true } },
      },
    }),
    prisma.appointment.findMany({
      where: { ownerId, scheduledAt: { lt: startOfToday } },
      orderBy: { scheduledAt: "desc" },
      take: 15,
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        reason: true,
        notes: true,
        pet: { select: { name: true, species: true } },
        vet: { select: { firstName: true, lastName: true, username: true } },
      },
    }),
    prisma.medicalRecord.findMany({
      where: { pet: { ownerId }, isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        diagnosis: true,
        treatment: true,
        prescription: true,
        notes: true,
        status: true,
        followUpDate: true,
        createdAt: true,
        pet: { select: { name: true, species: true } },
        vet: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  const fmtName = (u) =>
    [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() ||
    u?.username ||
    "";

  const fmtAppt = (row) => ({
    id: row.id,
    scheduledAt: row.scheduledAt?.toISOString?.() ?? String(row.scheduledAt),
    status: row.status,
    reason: trunc(row.reason, 200),
    notes: trunc(row.notes, 200),
    petName: row.pet?.name,
    petSpecies: row.pet?.species,
    vetName: fmtName(row.vet) || row.vet?.username || null,
  });

  const fmtRecord = (row) => ({
    id: row.id,
    date: row.createdAt?.toISOString?.() ?? String(row.createdAt),
    status: row.status,
    petName: row.pet?.name,
    diagnosis: trunc(row.diagnosis, 500),
    treatment: trunc(row.treatment, 400),
    prescription: trunc(row.prescription, 300),
    notes: trunc(row.notes, 300),
    followUpDate: row.followUpDate
      ? row.followUpDate.toISOString?.() ?? String(row.followUpDate)
      : null,
    vetName: fmtName(row.vet),
  });

  return {
    kind: "pet_owner_account_snapshot",
    generatedAt: new Date().toISOString(),
    owner: {
      displayName: fmtName(user) || "Pet owner",
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
    },
    pets: pets.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      breed: p.breed,
      gender: p.gender,
      age: p.age,
      status: p.status,
    })),
    appointmentsUpcoming: upcoming.map(fmtAppt),
    appointmentsPast: past.map(fmtAppt),
    medicalRecords: medicalRecords.map(fmtRecord),
  };
}

module.exports = { fetchPetOwnerAccountContext };
