import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  
  if (!url) {
    throw new Error(`DATABASE_URL is missing. Please check your environment variables.`);
  }

  // Clean the URL (remove quotes and unsupported params)
  const connectionString = url.replace(/['"]/g, '').replace(/([?&])channel_binding=[^&]*(&|$)/, '$1').replace(/[?&]$/, '').trim();

  try {
    // Switching to the standard 'pg' driver which is more robust and fully compatible with Neon
    const pool = new Pool({ 
      connectionString
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error: any) {
    console.error('Failed to initialize Prisma with pg adapter:', error);
    throw error;
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
