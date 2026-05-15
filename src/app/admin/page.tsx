import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export default async function AdminDashboard() {
  const session = await verifySession();

  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'SCHOOL_ADMIN')) {
    redirect('/login');
  }

  const isPrincipal = session.role === 'SUPER_ADMIN';
  const roleTitle = isPrincipal ? 'Principal' : 'Administrator';

  // Fetch School Stats
  const studentCount = await prisma.user.count({ where: { role: 'SISWA' } });
  const teacherCount = await prisma.user.count({ where: { role: 'GURU' } });
  const classCount = await prisma.class.count();
  const subjectCount = await prisma.subject.count();

  return (
    <DashboardClient 
      stats={{ studentCount, teacherCount, classCount, subjectCount }}
      roleTitle={roleTitle}
    />
  );
}
