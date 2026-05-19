'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function recordAttendance(data: { 
  token: string; 
  latitude?: number; 
  longitude?: number;
  subject?: string;
  className?: string;
  teacher?: string;
  timeStr?: string;
}) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'SISWA') {
      return { error: 'Unauthorized. Hanya siswa yang dapat melakukan presensi.' };
    }

    // Find student profile
    const student = await prisma.siswaProfile.findUnique({
      where: { userId: session.userId },
      include: { user: true }
    });

    if (!student) {
      return { error: 'Profil siswa tidak ditemukan.' };
    }

    const activeClassName = data.className || 'Unknown Class';
    const activeSubjectName = data.subject || 'Unknown Subject';
    const activeTeacherName = data.teacher || 'Unknown Teacher';
    const activeTimeRange = data.timeStr || 'Unknown Time';

    // Format the note for the database
    const noteContent = `${activeClassName} | ${activeSubjectName} | ${activeTeacherName} | ${activeTimeRange}`;

    // Check if attendance already recorded today for this student and this specific subject
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        date: {
          gte: todayStart
        },
        note: {
          contains: activeSubjectName
        }
      }
    });

    if (existing) {
      return { success: true, message: 'Kehadiran Anda sudah tercatat sebelumnya untuk kelas ini.' };
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        status: 'HADIR',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        note: noteContent,
      }
    });

    revalidatePath('/admin/attendance');
    return { success: true, attendance };
  } catch (error: any) {
    console.error('Failed to record attendance:', error);
    return { error: error.message || 'Gagal merekam presensi.' };
  }
}

export async function getTodayAttendance() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const records = await prisma.attendance.findMany({
      where: {
        date: {
          gte: todayStart
        }
      },
      include: {
        student: {
          include: { user: true }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return records.map(r => ({
      id: r.id,
      name: r.student.user.name,
      nisn: r.student.nisn || r.student.nis || 'N/A',
      time: r.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: r.status,
      note: r.note
    }));
  } catch (error) {
    console.error('Failed to fetch today attendance:', error);
    return [];
  }
}
