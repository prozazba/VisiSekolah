'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function createEvent(data: {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  type?: string;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startDate,
        endTime: data.endDate || data.startDate,
        location: data.location,
        schoolId: session.schoolId || 'default-school',
      }
    });

    revalidatePath('/admin/calendar');
    return { success: true, event };
  } catch (error: any) {
    console.error('Failed to create event:', error);
    return { error: 'Failed to create event' };
  }
}

export async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: { startTime: 'asc' }
    });
  } catch (error) {
    return [];
  }
}
