import prisma from './prisma';

async function test() {
  try {
    console.log('Testing database connection...');
    const schoolCount = await prisma.school.count();
    console.log('Connection successful! School count:', schoolCount);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
