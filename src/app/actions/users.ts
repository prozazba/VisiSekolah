'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/session';

import { getUserWelcomeEmail, getStudentPwaScannerWelcomeEmail } from '@/lib/email-templates';

export async function createUser(data: {
  name: string;
  email: string;
  role: string;
  schoolId?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
  address?: string;
  jobAssignments?: string[];
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

    // Automatically create corresponding profiles and handle linkages
    if (data.role === 'SISWA') {
      await prisma.siswaProfile.create({
        data: { userId: user.id }
      });
    } else if (data.role === 'GURU') {
      await prisma.guruProfile.create({
        data: { userId: user.id }
      });
    } else if (data.role === 'ORANG_TUA') {
      const parentProfile = await prisma.parentProfile.create({
        data: { userId: user.id }
      });

      // Process student link if provided
      if (data.studentId) {
        await prisma.siswaProfile.upsert({
          where: { userId: data.studentId },
          update: { parentId: parentProfile.id },
          create: { userId: data.studentId, parentId: parentProfile.id }
        });
      }
    }

    // Send Welcome Email
    try {
      const { sendMail } = await import('@/lib/mailer');
      if (user.role === 'SISWA') {
        const scannerUrl = 'https://visi-sekolah.vercel.app/scan';
        const emailHtml = getStudentPwaScannerWelcomeEmail({
          name: user.name || data.name,
          email: user.email || data.email,
          scannerUrl
        });

        await sendMail({
          to: user.email || data.email,
          subject: '🚀 Buka & Pasang Aplikasi Standalone Presensi QR Code VisiSekolah',
          html: emailHtml
        });
      } else {
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
      }
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
      orderBy: { createdAt: 'desc' },
      include: {
        guruProfile: true,
        siswaProfile: true,
      }
    });
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        guruProfile: {
          include: {
            subjects: true,
            classes: true
          }
        },
        siswaProfile: {
          include: {
            parent: {
              include: {
                user: true
              }
            },
            academicRecords: {
              include: {
                term: true,
                class: true
              }
            },
            grades: {
              include: {
                subject: true
              }
            }
          }
        },
        parentProfile: {
          include: {
            students: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export async function updateUser(id: string, data: { 
  name?: string; 
  email?: string; 
  phone?: string; 
  address?: string;
  nisn?: string; 
  nis?: string;
  birthPlace?: string;
  birthDate?: string | Date;
  gender?: string;
  religion?: string;
  citizenship?: string;
  nip?: string; 
  position?: string; 
}) {
  const session = await verifySession();
  if (!session) return { error: 'Unauthorized' };
  
  if (session.role !== 'SUPER_ADMIN' && session.userId !== id) {
    return { error: 'Unauthorized' };
  }

  const user = await prisma.user.findUnique({ where: { id }});
  if (!user) return { error: 'User not found' };

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
      }
    });

    if (user.role === 'SISWA') {
      await prisma.siswaProfile.upsert({
        where: { userId: id },
        update: { 
          nisn: data.nisn || null,
          nis: data.nis || null,
          birthPlace: data.birthPlace || null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          gender: data.gender || null,
          religion: data.religion || null,
          citizenship: data.citizenship || null
        },
        create: { 
          userId: id, 
          nisn: data.nisn || null,
          nis: data.nis || null,
          birthPlace: data.birthPlace || null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          gender: data.gender || null,
          religion: data.religion || null,
          citizenship: data.citizenship || null
        }
      });
    }

    if (user.role === 'GURU' && (data.nip !== undefined || data.position !== undefined)) {
      await prisma.guruProfile.upsert({
        where: { userId: id },
        update: { 
          nip: data.nip !== undefined ? data.nip : undefined,
          position: data.position !== undefined ? data.position : undefined,
        },
        create: { 
          userId: id, 
          nip: data.nip || null,
          position: data.position || null,
        }
      });
    }

    revalidatePath('/admin/users');
    return { success: true, user: updated };
  } catch (error) {
    console.error('Failed to update user:', error);
    return { error: 'Failed to update user' };
  }
}

export async function deleteUser(id: string) {
  const session = await verifySession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { error: 'Failed to delete user' };
  }
}

export async function linkParentToStudent(parentUserId: string, studentUserId: string) {
  const session = await verifySession();
  if (!session || session.role !== 'SUPER_ADMIN') return { error: 'Unauthorized' };

  try {
    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: parentUserId }});
    if (!parentProfile) return { error: 'Parent not found' };

    await prisma.siswaProfile.update({
      where: { userId: studentUserId },
      data: { parentId: parentProfile.id }
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${parentUserId}`);
    revalidatePath(`/admin/users/${studentUserId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to link parent to student' };
  }
}

export async function unlinkStudentFromParent(studentUserId: string) {
  const session = await verifySession();
  if (!session || session.role !== 'SUPER_ADMIN') return { error: 'Unauthorized' };

  try {
    await prisma.siswaProfile.update({
      where: { userId: studentUserId },
      data: { parentId: null }
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to unlink' };
  }
}

export async function getAcademicTerms() {
  try {
    return await prisma.academicTerm.findMany({
      orderBy: { startDate: 'desc' }
    });
  } catch (error) {
    console.error('Failed to get academic terms:', error);
    return [];
  }
}

export async function upsertAcademicRecord(data: {
  id?: string;
  studentId: string;
  classId: string;
  termId: string;
  promotionStatus: string;
  averageScore?: number;
  ranking?: number;
  teacherNotes?: string;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN' && session.role !== 'GURU')) {
    return { error: 'Unauthorized' };
  }

  try {
    const record = await prisma.academicRecord.upsert({
      where: { id: data.id || 'new-record' },
      update: {
        classId: data.classId,
        termId: data.termId,
        promotionStatus: data.promotionStatus,
        averageScore: data.averageScore,
        ranking: data.ranking,
        teacherNotes: data.teacherNotes
      },
      create: {
        studentId: data.studentId,
        classId: data.classId,
        termId: data.termId,
        promotionStatus: data.promotionStatus,
        averageScore: data.averageScore,
        ranking: data.ranking,
        teacherNotes: data.teacherNotes
      }
    });

    revalidatePath(`/admin/users`);
    return { success: true, record };
  } catch (error) {
    console.error('Failed to upsert academic record:', error);
    return { error: 'Failed to save academic record' };
  }
}

export async function deleteAcademicRecord(id: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.academicRecord.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete academic record:', error);
    return { error: 'Failed to delete record' };
  }
}

export async function upsertGrade(data: {
  id?: string;
  studentId: string;
  type: string;
  score: number;
  subjectId: string;
  term: string;
}) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN' && session.role !== 'GURU')) {
    return { error: 'Unauthorized' };
  }

  try {
    const grade = await prisma.grade.upsert({
      where: { id: data.id || 'new-grade' },
      update: {
        type: data.type,
        score: data.score,
        subjectId: data.subjectId,
        term: data.term
      },
      create: {
        studentId: data.studentId,
        type: data.type,
        score: data.score,
        subjectId: data.subjectId,
        term: data.term
      }
    });

    return { success: true, grade };
  } catch (error) {
    console.error('Failed to upsert grade:', error);
    return { error: 'Failed to save grade' };
  }
}

export async function deleteGrade(id: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN' && session.role !== 'GURU')) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.grade.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete grade:', error);
    return { error: 'Failed to delete grade' };
  }
}

export async function assignSubjectToGuru(guruProfileId: string, subjectId: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.guruProfile.update({
      where: { id: guruProfileId },
      data: {
        subjects: {
          connect: { id: subjectId }
        }
      }
    });

    revalidatePath(`/admin/users`);
    return { success: true };
  } catch (error) {
    console.error('Failed to assign subject:', error);
    return { error: 'Failed to assign subject' };
  }
}

export async function unassignSubjectFromGuru(guruProfileId: string, subjectId: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.guruProfile.update({
      where: { id: guruProfileId },
      data: {
        subjects: {
          disconnect: { id: subjectId }
        }
      }
    });

    revalidatePath(`/admin/users`);
    return { success: true };
  } catch (error) {
    console.error('Failed to unassign subject:', error);
    return { error: 'Failed to unassign subject' };
  }
}

export async function assignHomeroomToGuru(guruProfileId: string, classId: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.class.update({
      where: { id: classId },
      data: {
        teacherId: guruProfileId
      }
    });

    revalidatePath(`/admin/users`);
    return { success: true };
  } catch (error) {
    console.error('Failed to assign class:', error);
    return { error: 'Failed to assign class' };
  }
}

export async function unassignHomeroomFromGuru(classId: string) {
  const session = await verifySession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.class.update({
      where: { id: classId },
      data: {
        teacherId: null
      }
    });

    revalidatePath(`/admin/users`);
    return { success: true };
  } catch (error) {
    console.error('Failed to unassign class:', error);
    return { error: 'Failed to unassign class' };
  }
}
