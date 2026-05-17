'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/session';

import { sendMail } from '@/lib/mailer';
import { getUserWelcomeEmail } from '@/lib/email-templates';

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

    // Send Welcome Email
    try {
      const loginUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/login` 
        : 'http://localhost:3099/login';

      const emailHtml = getUserWelcomeEmail({
        name: user.name || data.name,
        email: user.email || data.email,
        role: user.role,
        loginUrl: loginUrl
      });

      await sendMail({
        to: user.email || data.email,
        subject: 'Selamat Datang di VisiSekolah - Informasi Akun Anda',
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // We don't return error here because the user was already created successfully
    }

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
