'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const CreateSchoolSchema = z.object({
  name: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  adminId: z.string().min(1, 'Administrator harus dipilih'),
});

export async function createSchool(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const adminId = formData.get('adminId') as string;

  const validated = CreateSchoolSchema.safeParse({ name, slug, adminId });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    // Check if slug exists
    const existing = await prisma.school.findUnique({
      where: { slug }
    });

    if (existing) {
      return { error: 'Slug sudah digunakan oleh sekolah lain' };
    }

    // Check if admin is valid and available
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!adminUser || adminUser.schoolId) {
      return { error: 'User tidak valid atau sudah memiliki sekolah' };
    }

    // 1. Generate Temporary Password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // 2. Create School and Update Admin User in a transaction
    const school = await prisma.$transaction(async (tx) => {
      const newSchool = await tx.school.create({
        data: {
          name,
          slug,
          status: 'PENDING',
        }
      });

      await tx.user.update({
        where: { id: adminId },
        data: {
          role: 'SCHOOL_ADMIN',
          schoolId: newSchool.id,
          password: hashedTempPassword,
          // In a real app, we would add a 'mustChangePassword' field
        }
      });

      return newSchool;
    });

    // 3. Generate "Confirmation Link" (Simulation)
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const setupUrl = `http://localhost:3099/setup-school?token=${confirmationToken}&slug=${slug}`;

    revalidatePath('/admin');
    
    return { 
      success: true, 
      setupInfo: {
        email: adminUser.email,
        tempPassword,
        setupUrl
      }
    };
  } catch (error) {
    console.error('Failed to create school:', error);
    return { error: 'Terjadi kesalahan saat membuat sekolah' };
  }
}
