'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/session';

export async function createUser(data: {
  name: string;
  email: string;
  role: string;
  schoolId?: string;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    const hashedPassword = await bcrypt.hash('password123', 10); // Default password
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role as any,
        password: hashedPassword,
        schoolId: data.schoolId || session.schoolId || 'default-school',
      }
    });

    revalidatePath('/admin/users');
    return { success: true, user };
  } catch (error: any) {
    console.error('Failed to create user:', error);
    if (error.code === 'P2002') {
      return { error: 'Email already exists' };
    }
    return { error: 'Failed to create user' };
  }
}

export async function getUsersByRole(role: string) {
  try {
    const users = await prisma.user.findMany({
      where: { role: role as any },
      orderBy: { createdAt: 'desc' }
    });
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
