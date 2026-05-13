import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is missing in the environment');
}

// Clean the URL (remove quotes and unsupported params)
const connectionString = url.replace(/['"]/g, '').replace(/([?&])channel_binding=[^&]*(&|$)/, '$1').replace(/[?&]$/, '').trim();

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // 1. Create Default School (Institutional Settings)
  const school = await prisma.school.upsert({
    where: { id: 'default-school' },
    update: {},
    // @ts-ignore - slug is removed from schema
    create: {
      id: 'default-school',
      name: 'SMA VisiSekolah',
      address: 'Jl. Pendidikan No. 123, Digital Hub BSD, Tangerang',
      phone: '021-12345678',
      email: 'info@sma-visisekolah.sch.id',
    },
  });

  console.log('Default School Created:', school.name);

  // 2. Create Institutional Users (Roles)
  
  // Principal (Super Admin)
  const principal = await prisma.user.upsert({
    where: { email: 'principal@visisekolah.id' },
    update: {},
    create: {
      email: 'principal@visisekolah.id',
      name: 'Drs. H. Ahmad Fauzi (Principal)',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      schoolId: school.id,
    },
  });

  // Finance (School Admin)
  const finance = await prisma.user.upsert({
    where: { email: 'finance@visisekolah.id' },
    update: {},
    create: {
      email: 'finance@visisekolah.id',
      name: 'Siti Aminah, S.E. (Finance Manager)',
      password: hashedPassword,
      role: 'SCHOOL_ADMIN',
      schoolId: school.id,
    },
  });

  // Teacher (Guru Role)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@visisekolah.id' },
    update: {},
    create: {
      email: 'teacher@visisekolah.id',
      name: 'Budi Santoso, S.Pd. (Senior Teacher)',
      password: hashedPassword,
      role: 'GURU',
      schoolId: school.id,
    },
  });

  // Student (Siswa Role)
  const student = await prisma.user.upsert({
    where: { email: 'student@visisekolah.id' },
    update: {},
    create: {
      email: 'student@visisekolah.id',
      name: 'Rizky Pratama (Student)',
      password: hashedPassword,
      role: 'SISWA',
      schoolId: school.id,
    },
  });

  console.log('Institutional accounts seeded:');
  console.log('- Principal:', principal.email);
  console.log('- Finance:', finance.email);
  console.log('- Teacher:', teacher.email);
  console.log('- Student:', student.email);
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
