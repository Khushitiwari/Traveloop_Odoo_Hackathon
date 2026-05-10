import 'dotenv/config';
import prisma from '../src/config/db.js';
import { hashPassword } from '../src/utils/hashPassword.js';

async function main() {
  const cities = [
    { name: 'Paris', country: 'France', region: 'Europe', costIndex: 1.9, popularity: 95 },
    { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 2.1, popularity: 96 },
    { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 1.6, popularity: 88 },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: `${city.name}-${city.country}` },
      update: {},
      create: { ...city, id: `${city.name}-${city.country}` },
    });
  }

  const cityRecords = await prisma.city.findMany();
  for (const city of cityRecords) {
    await prisma.activity.createMany({
      data: [
        { name: `${city.name} Walking Tour`, type: 'sightseeing', cost: 25, duration: 120, cityId: city.id },
        { name: `${city.name} Food Tasting`, type: 'food', cost: 40, duration: 90, cityId: city.id },
      ],
      skipDuplicates: true,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@traveloop.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashed = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      name: 'Traveloop Admin',
      email: adminEmail,
      password: hashed,
      role: 'ADMIN',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
