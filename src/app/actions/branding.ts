'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function updateBranding(formData: FormData) {
  const session = await verifySession();
  
  if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
    return { error: 'Unauthorized' };
  }

  const primaryColor = formData.get('primaryColor') as string;
  const secondaryColor = formData.get('secondaryColor') as string;
  const accentColor = formData.get('accentColor') as string;
  const name = formData.get('name') as string;

  try {
    await prisma.school.update({
      where: { id: session.schoolId },
      data: {
        name,
        primaryColor,
        secondaryColor,
        accentColor,
      }
    });

    revalidatePath('/school-admin/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to update branding:', error);
    return { error: 'Gagal memperbarui branding' };
  }
}
