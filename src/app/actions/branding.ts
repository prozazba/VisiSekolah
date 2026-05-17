'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

// Helper to get the school ID from session or fallback to default
async function getEffectiveSchoolId(session?: any) {
  // In this single-tenant implementation, we should ALWAYS target 'default-school'
  // if it exists, to ensure everyone is looking at the same institutional record.
  
  const defaultSchool = await prisma.school.findUnique({
    where: { id: 'default-school' }
  });

  if (defaultSchool) return defaultSchool.id;

  // Fallback to first school if 'default-school' doesn't exist
  const firstSchool = await prisma.school.findFirst();
  return firstSchool?.id || null;
}

export async function getBranding() {
  const session = await verifySession();
  const schoolId = await getEffectiveSchoolId(session || undefined);
  
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId || 'default-school' },
      select: {
        name: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        fontFamily: true,
        logoUrl: true,
        faviconUrl: true,
      }
    });

    if (!school) {
      return {
        name: 'SMA VisiSekolah',
        primaryColor: '#6366f1',
        secondaryColor: '#a855f7',
        accentColor: '#10b981',
        fontFamily: 'Outfit',
        logoUrl: null,
        faviconUrl: null,
      };
    }

    return school;
  } catch (error) {
    console.error('Failed to fetch branding:', error);
    return {
      name: 'SMA VisiSekolah',
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      accentColor: '#10b981',
      fontFamily: 'Outfit',
      logoUrl: null,
      faviconUrl: null,
    };
  }
}

export async function updateBranding(data: {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}) {
  const session = await verifySession();
  
  if (!session || (session.role !== 'SCHOOL_ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  const schoolId = await getEffectiveSchoolId(session);
  if (!schoolId) {
    return { error: 'Target school not found' };
  }

  try {
    await prisma.school.update({
      where: { id: schoolId },
      data: {
        name: data.name,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        fontFamily: data.fontFamily,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
      }
    });

    revalidatePath('/admin/branding');
    revalidatePath('/admin/settings');
    revalidatePath('/'); 
    revalidatePath('/(public)', 'layout'); 
    return { success: true };
  } catch (error) {
    console.error('Failed to update branding:', error);
    return { error: 'Gagal memperbarui branding' };
  }
}
