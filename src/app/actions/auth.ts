'use server';

import { LoginFormSchema, FormState } from '@/lib/definitions';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function login(state: FormState, formData: FormData) {
  try {
    // 1. Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // 2. Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: 'Email atau kata sandi salah.',
      };
    }

    // 3. Verify password
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return {
        message: 'Email atau kata sandi salah.',
      };
    }

    // 4. Create session
    await createSession(user.id, user.role, user.schoolId);

    // 5. Redirect based on role
    if (user.role === 'SUPER_ADMIN') {
      redirect('/admin');
    } else if (user.role === 'SCHOOL_ADMIN' && user.schoolId) {
      const school = await prisma.school.findUnique({
        where: { id: user.schoolId },
        select: { logoUrl: true }
      });

      // If no branding set up yet, go to setup page
      if (!school?.logoUrl) {
        redirect('/dashboard/branding');
      }
      redirect('/dashboard');
    } else {
      redirect('/dashboard');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors as they are handled by Next.js
    }
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Login diagnostic:', { message: errorMessage, stack: errorStack });
    
    return {
      message: `Login gagal (Diagnostic: ${errorMessage})`,
    };

  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function checkAuthStatus() {
  const { verifySession } = await import('@/lib/session');
  const session = await verifySession();
  return session;
}
