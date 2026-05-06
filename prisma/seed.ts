import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import "dotenv/config";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error('DATABASE_URL is missing in the environment');
}

// Clean the URL (remove quotes and unsupported params)
const connectionString = rawUrl.replace(/['"]/g, '').replace(/([?&])channel_binding=[^&]*(&|$)/, '$1').replace(/[?&]$/, '').trim();

const pool = new Pool({ 
  connectionString,
  ssl: true 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@visisekolah.id' },
    update: {},
    create: {
      email: 'admin@visisekolah.id',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Super Admin created:', admin.email);

  // Create sample schools
  const schools = [
    { name: 'SMP Negeri 1 Jakarta', slug: 'smp1', status: 'ACTIVE' as const },
    { name: 'SMA Negeri 5 Bandung', slug: 'sma5', status: 'ACTIVE' as const },
    { name: 'SD Al-Azhar 1', slug: 'sd-alazhar1', status: 'PENDING' as const },
    { name: 'SMK Telkom Malang', slug: 'smk-telkom', status: 'SUSPENDED' as const },
  ];

  for (const school of schools) {
    await prisma.school.upsert({
      where: { slug: school.slug },
      update: { status: school.status },
      create: {
        name: school.name,
        slug: school.slug,
        status: school.status,
      },
    });
  }

  console.log('Sample schools seeded.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
