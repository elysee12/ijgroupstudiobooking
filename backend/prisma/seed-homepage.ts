import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding homepage content…');

  // ── Featured Services ─────────────────────────────────────────────────────
  const featuredServices = [
    { title: 'Wedding Photography', description: 'Cinematic full-day coverage from prep to last dance. Two photographers, highlight film included.', price: 'From 350,000 RWF', iconName: 'Heart', sortOrder: 1 },
    { title: 'Studio Photoshoot', description: 'Portrait, fashion and branded sessions in our fully equipped Kigali studio.', price: 'From 50,000 RWF', iconName: 'Camera', sortOrder: 2 },
    { title: 'Music Video Production', description: 'Full production with directing, lighting, drone and professional post-production edit.', price: 'From 800,000 RWF', iconName: 'Video', sortOrder: 3 },
  ];

  for (const s of featuredServices) {
    const exists = await prisma.featuredService.findFirst({ where: { title: s.title } });
    if (!exists) await prisma.featuredService.create({ data: s });
  }
  console.log('  ✓ Featured services (3)');

  // ── Homepage Work ─────────────────────────────────────────────────────────
  const workItems = [
    { title: 'Aline & Eric Wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', category: 'Weddings', sortOrder: 1 },
    { title: 'KOTEX Brand Shoot', imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', category: 'Fashion', sortOrder: 2 },
    { title: 'Sarah 25th Birthday', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', category: 'Birthdays', sortOrder: 3 },
    { title: 'Akagera Drone Reel', imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', category: 'Outdoor', sortOrder: 4 },
  ];

  for (const w of workItems) {
    const exists = await prisma.homepageWork.findFirst({ where: { title: w.title } });
    if (!exists) await prisma.homepageWork.create({ data: w });
  }
  console.log('  ✓ Homepage work items (4)');

  // ── Testimonials ──────────────────────────────────────────────────────────
  const testimonials = [
    { clientName: 'Aline U.', quote: 'Booking was effortless and our wedding photos exceeded every expectation.', rating: 5, sortOrder: 1 },
    { clientName: 'Eric M.', quote: 'The team is professional, on time, and the music video edit was world-class.', rating: 5, sortOrder: 2 },
    { clientName: 'Sarah K.', quote: 'Loved the QR ticket, the live chat support and the watermarked previews.', rating: 5, sortOrder: 3 },
  ];

  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { clientName: t.clientName } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }
  console.log('  ✓ Testimonials (3)');

  console.log('\n✅ Homepage seed complete!\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
