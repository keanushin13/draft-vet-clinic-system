require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  const seeds = [
    {
      username: "admin_user",
      email: "admin@pawcruz.com",
      password,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      isVerified: true,
    },
    {
      username: "vet_user",
      email: "vet@pawcruz.com",
      password,
      role: "veterinarian",
      firstName: "Doc",
      lastName: "Smith",
      isVerified: true,
    },
    {
      username: "staff_user",
      email: "staff@pawcruz.com",
      password,
      role: "staff",
      firstName: "Staff",
      lastName: "Cruz",
      isVerified: true,
    },
    {
      username: "owner_user",
      email: "owner@pawcruz.com",
      password,
      role: "pet_owner",
      firstName: "Pet",
      lastName: "Owner",
      isVerified: true,
    },
  ];

  for (const data of seeds) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      console.log(`⚠️  Skipped (already exists): ${data.email}`);
      continue;
    }
    await prisma.user.create({ data });
    console.log(`✅ Created: ${data.role} → ${data.email}`);
  }

  console.log("\nDefault password for all accounts: Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
