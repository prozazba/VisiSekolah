'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function createClass(data: {
  name: string;
  teacherId?: string;
  capacity?: number;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    const newClass = await prisma.class.create({
      data: {
        name: data.name,
        teacherId: data.teacherId,
        schoolId: session.schoolId || 'default-school',
      }
    });

    revalidatePath('/admin/academic');
    return { success: true, class: newClass };
  } catch (error: any) {
    console.error('Failed to create class:', error);
    return { error: 'Failed to create class' };
  }
}

export async function createSubject(data: {
  name: string;
  code: string;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        code: data.code,
        schoolId: session.schoolId || 'default-school',
      }
    });

    revalidatePath('/admin/academic');
    return { success: true, subject };
  } catch (error: any) {
    console.error('Failed to create subject:', error);
    return { error: 'Failed to create subject' };
  }
}

export async function getClasses() {
  try {
    return await prisma.class.findMany({
      include: { teacher: true, students: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    return [];
  }
}

export async function getSubjects() {
  try {
    return await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    return [];
  }
}
