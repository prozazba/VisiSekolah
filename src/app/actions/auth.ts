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
    await createSession(user.id, user.role);

    // 5. Redirect based on role
    if (user.role === 'SUPER_ADMIN') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors as they are handled by Next.js
    }
    return {
      message: 'Terjadi kesalahan sistem. Silakan coba lagi nanti.',
    };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
