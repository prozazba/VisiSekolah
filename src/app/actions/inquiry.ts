'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const InquirySchema = z.object({
  email: z.string().email('Email tidak valid'),
  plan: z.string().optional(),
});

export async function submitInquiry(formData: FormData) {
  const email = formData.get('email') as string;
  const plan = formData.get('plan') as string;

  const validated = InquirySchema.safeParse({ email, plan });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await prisma.registrationInquiry.create({
      data: {
        email,
        plan,
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    return { error: 'Gagal mengirim permintaan. Silakan coba lagi nanti.' };
  }
}
