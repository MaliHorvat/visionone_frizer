import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_SERVICES = [
  {
    name: "Striženje moški",
    description: "Klasično moško striženje",
    durationMin: 30,
    priceCents: 1500,
  },
  {
    name: "Striženje ženske",
    description: "Žensko striženje in oblikovanje",
    durationMin: 45,
    priceCents: 2500,
  },
  {
    name: "Barvanje",
    description: "Popolno barvanje las",
    durationMin: 90,
    priceCents: 4500,
  },
  {
    name: "Pranje in sušenje",
    description: "Pranje in profesionalno sušenje",
    durationMin: 20,
    priceCents: 1000,
  },
];

const DEFAULT_STYLISTS = [
  { name: "Ana Novak", bio: "Specialistka za barvanje in oblikovanje." },
  { name: "Marko Kovač", bio: "Moško striženje in brada." },
];

const DEFAULT_HOURS = [
  { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 2, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 4, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 5, startTime: "08:00", endTime: "16:00" },
  { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@salon.si";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "SpremeniGeslo123!";
  const adminName = process.env.ADMIN_NAME ?? "Administrator";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: UserRole.ADMIN,
    },
  });

  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    for (const service of DEFAULT_SERVICES) {
      await prisma.service.create({ data: service });
    }
  }

  const existingStylists = await prisma.stylist.count();
  if (existingStylists === 0) {
    const services = await prisma.service.findMany();

    for (const stylist of DEFAULT_STYLISTS) {
      const created = await prisma.stylist.create({
        data: {
          name: stylist.name,
          bio: stylist.bio,
          services: { connect: services.map((s) => ({ id: s.id })) },
        },
      });

      for (const hours of DEFAULT_HOURS) {
        await prisma.workingHour.create({
          data: { stylistId: created.id, ...hours },
        });
      }
    }
  }

  console.log("Seed končan.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
