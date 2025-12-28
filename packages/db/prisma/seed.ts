import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Impulse Types
  const impulseTypes = [
    {
      type: 'PHONE_USAGE',
      name: 'Phone Usage',
      description: 'Reduce excessive phone checking and scrolling',
    },
    {
      type: 'LATE_NIGHT_EATING',
      name: 'Late Night Eating',
      description: 'Control late-night snacking and binge eating',
    },
    {
      type: 'ONLINE_SHOPPING',
      name: 'Online Shopping',
      description: 'Manage impulsive online purchases',
    },
    {
      type: 'DOOM_SCROLLING',
      name: 'Doom Scrolling',
      description: 'Break the cycle of endless negative news consumption',
    },
  ];

  for (const impulseType of impulseTypes) {
    await prisma.impulseType.upsert({
      where: { type: impulseType.type },
      update: {},
      create: impulseType,
    });
  }

  console.log('✅ Seeded impulse types');
  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

