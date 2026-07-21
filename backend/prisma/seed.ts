/**
 * Prisma seed — run with:
 *   node_modules\.bin\prisma.cmd db seed
 * or directly:
 *   npx ts-node prisma/seed.ts
 */
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database…');

  // ── Studio Settings (singleton) ──────────────────────────────────────────
  await prisma.studioSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      studioName: 'IJ Group Studio',
      phone: '+250 788 000 000',
      email: 'hello@ijgroup.rw',
      location: 'Kigali, Rwanda',
      about: 'Premium photography, videography and event coverage in Rwanda.',
      requireDeposit: true,
      depositPercent: 30,
      autoWatermark: true,
      sendSmsOnBooking: true,
      allowWhatsApp: true,
      paymentIntegrations: {
        create: [
          { provider: 'MTN_MOMO', isConnected: true },
          { provider: 'AIRTEL_MONEY', isConnected: true },
          { provider: 'STRIPE', isConnected: false },
          { provider: 'BANK_OF_KIGALI', isConnected: true },
        ],
      },
    },
    update: {},
  });
  console.log('  ✓ Studio settings');

  // ── Services ─────────────────────────────────────────────────────────────
  const services = [
    { type: 'WEDDING_PHOTOGRAPHY', name: 'Wedding Photography', description: 'Full-day coverage, second shooter & cinematic edit.', basePrice: 350000, category: 'Weddings' },
    { type: 'STUDIO_PHOTOSHOOT', name: 'Studio Photoshoot', description: 'Portraits, products, brand and fashion in our studio.', basePrice: 50000, category: 'Studio shoots' },
    { type: 'GRADUATION_PHOTOGRAPHY', name: 'Graduation Photography', description: 'Solo, group and family graduation sessions.', basePrice: 35000, category: 'Birthdays' },
    { type: 'BIRTHDAY_COVERAGE', name: 'Birthday Event Coverage', description: 'Photo + video coverage of your celebration.', basePrice: 120000, category: 'Birthdays' },
    { type: 'DRONE_VIDEOGRAPHY', name: 'Drone Videography', description: 'Cinematic aerial footage for events and brands.', basePrice: 200000, category: 'Outdoor' },
    { type: 'MUSIC_VIDEO', name: 'Music Video Production', description: 'Concept, direction, shoot and post production.', basePrice: 800000, category: 'Music' },
    { type: 'LIVESTREAMING', name: 'Livestreaming', description: 'Multi-camera streaming to social or web.', basePrice: 250000, category: 'Corporate events' },
    { type: 'CORPORATE_EVENT', name: 'Corporate Events', description: 'Conference, summit and corporate coverage.', basePrice: 300000, category: 'Corporate events' },
  ] as const;

  for (const s of services) {
    await prisma.service.upsert({
      where: { type: s.type },
      create: s,
      update: { basePrice: s.basePrice, description: s.description },
    });
  }
  console.log('  ✓ Services (8)');

  // ── Add-ons ───────────────────────────────────────────────────────────────
  const addons = [
    { name: 'Drone coverage', price: 120000, priceUnit: '/ hr' },
    { name: 'Second shooter', price: 150000, priceUnit: '/ day' },
    { name: 'Same-day teaser reel', price: 200000, priceUnit: 'flat' },
    { name: 'Premium album (40 pages)', price: 180000, priceUnit: 'flat' },
    { name: 'Travel outside Kigali', price: 80000, priceUnit: 'from' },
    { name: 'Live event streaming', price: 350000, priceUnit: 'from' },
    { name: 'Highlight film (5 min)', price: 150000, priceUnit: 'flat' },
    { name: 'Extra editing hour', price: 40000, priceUnit: '/ hr' },
  ];

  for (const a of addons) {
    const existing = await prisma.addOn.findFirst({ where: { name: a.name } });
    if (!existing) await prisma.addOn.create({ data: a });
  }
  console.log('  ✓ Add-ons (8)');

  // ── Pricing Packages ──────────────────────────────────────────────────────
  const packages = [
    {
      name: 'ESSENTIAL' as const,
      subtitle: 'Studio session · 1 hour',
      price: 65000,
      isFeatured: false,
      features: [
        '1 hour studio time',
        '1 outfit / look',
        '10 retouched photos',
        'Online gallery, 30 days',
        'Personal usage license',
      ],
    },
    {
      name: 'SIGNATURE' as const,
      subtitle: 'Wedding · full day',
      price: 450000,
      isFeatured: true,
      features: [
        'Up to 10h coverage',
        '2 photographers',
        '300+ edited photos',
        '5-min highlight film',
        'Online + USB delivery',
        'Pre-shoot consultation',
      ],
    },
    {
      name: 'PRODUCTION' as const,
      subtitle: 'Music video / corporate',
      price: null,
      isFeatured: false,
      features: [
        'Director + DOP',
        'Drone / gimbal / lighting',
        'Color graded master',
        '2 revision rounds',
        'Behind-the-scenes reel',
      ],
    },
  ];

  for (const pkg of packages) {
    const { features, ...pkgData } = pkg;
    const existing = await prisma.pricingPackage.findUnique({ where: { name: pkgData.name } });
    if (!existing) {
      await prisma.pricingPackage.create({
        data: {
          ...pkgData,
          features: {
            create: features.map((text, i) => ({ text, sortOrder: i })),
          },
        },
      });
    }
  }
  console.log('  ✓ Pricing packages (3)');

  // ── Admin user ────────────────────────────────────────────────────────────
  const adminPhone = '+250780973387';
  const adminEmail = 'ijgroup.it@gmail.com';

  // Check by ref first (idempotent)
  const existingByRef = await prisma.user.findUnique({ where: { ref: 'IJ-A-0001' } });
  if (!existingByRef) {
    const hash = await bcrypt.hash('Admin@2026', 10);
    // Find a unique ref
    const count = await prisma.user.count();
    const ref = `IJ-A-${String(count + 1).padStart(4, '0')}`;
    await prisma.user.create({
      data: {
        ref,
        fullName: 'IJ Group Admin',
        phone: adminPhone,
        email: adminEmail,
        password: hash,
        role: 'ADMIN',
        preferences: { create: {} },
      },
    });
    console.log(`  ✓ Admin user created (ref: ${ref})`);
  } else {
    console.log('  ✓ Admin user already exists');
  }
  console.log('    Phone:    ' + adminPhone);
  console.log('    Email:    ' + adminEmail);
  console.log('    Password: Admin@2026');

  console.log('\n✅ Seed complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
