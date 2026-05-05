import { PrismaClient } from './generated/prisma/client';
import bcrypt from 'bcryptjs';
import "dotenv/config";

const prisma = new PrismaClient();

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
