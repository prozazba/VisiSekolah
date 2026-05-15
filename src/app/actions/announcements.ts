'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function createAnnouncement(data: {
  title: string;
  content: string;
  target: string;
  priority: string;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    // Map target string to Role enum if possible, or just store as is if schema allows
    // In schema, target is Role[]
    // Role enum: SUPER_ADMIN, SCHOOL_ADMIN, GURU, SISWA, ORANG_TUA
    
    let targetRoles: any[] = [];
    if (data.target.includes('Students')) targetRoles.push('SISWA');
    if (data.target.includes('Teachers')) targetRoles.push('GURU');
    if (data.target.includes('Staff')) targetRoles.push('SCHOOL_ADMIN');
    if (data.target.includes('Whole School')) targetRoles = ['SISWA', 'GURU', 'SCHOOL_ADMIN', 'ORANG_TUA'];

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        schoolId: session.schoolId || 'default-school',
        target: targetRoles,
      }
    });

    revalidatePath('/admin/announcements');
    revalidatePath('/'); 
    return { success: true, announcement };
  } catch (error: any) {
    console.error('Failed to create announcement:', error);
    return { error: 'Failed to create announcement' };
  }
}

export async function getAnnouncements() {
  try {
    return await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return [];
  }
}
