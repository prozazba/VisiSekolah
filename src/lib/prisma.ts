import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  
  if (!url || typeof url !== 'string' || url.trim() === '') {
    const typeOfUrl = typeof url;
    throw new Error(`DATABASE_URL is missing or empty. Type: ${typeOfUrl}. Value: "${String(url)}". Please set it in Vercel environment variables.`);
  }

  // Clean the URL (remove quotes if any, strip unsupported params, and trim whitespace)
  const connectionString = url.replace(/['"]/g, '').replace(/([?&])channel_binding=[^&]*(&|$)/, '$1').replace(/[?&]$/, '').trim();
  
  // Debug log (masked)
  console.log(`Initializing Pool with connectionString (length: ${connectionString.length}): ${connectionString.substring(0, 15)}...`);



  try {
    const pool = new Pool({ connectionString });
    
    // Add event listener to catch pool errors early
    pool.on('error', (err: any) => {
      console.error('Unexpected error on idle client', err);
    });


    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
  } catch (error: any) {
    console.error('Failed to initialize Prisma with Neon adapter:', error);
    throw error;
  }
};



declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
