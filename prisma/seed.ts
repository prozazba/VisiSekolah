import { PrismaClient } from './generated/prisma/client';
import bcrypt from 'bcryptjs';
import "dotenv/config";

import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding failed with error:');
    console.dir(e, { depth: null });
    await prisma.$disconnect();
    process.exit(1);
  });
