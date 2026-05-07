'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { sendMail } from '@/lib/mailer';
import { getActivationEmail } from '@/lib/email-templates';

const CreateSchoolSchema = z.object({
  name: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'),
  adminId: z.string().optional(),
  inquiryId: z.string().optional(),
  email: z.string().email('Email tidak valid').optional(),
}).refine(data => data.adminId || data.inquiryId || data.email, {
  message: 'Administrator harus ditentukan (ID, Inquiry ID, atau Email)',
});

/**
 * Core logic to provision a new school tenant and its administrator.
 * Used by both manual admin actions and automated registration flows.
 */
export async function provisionSchool(data: {
  name: string;
  slug: string;
  adminEmail: string;
  inquiryId?: string;
  adminId?: string;
}) {
  const { name, slug, adminEmail, inquiryId, adminId } = data;

  // 1. Check if slug exists
  const existing = await prisma.school.findUnique({
    where: { slug }
  });

  if (existing) {
    throw new Error('Slug sudah digunakan oleh sekolah lain');
  }

  // 2. Generate Credentials
  const tempPassword = crypto.randomBytes(8).toString('hex');
  const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

  let schoolId = '';

  // 3. Database Operations
  await prisma.$transaction(async (tx) => {
    // Create School
    const newSchool = await tx.school.create({
      data: {
        name,
        slug,
        status: 'PENDING', // Awaiting final setup
      }
    });
    schoolId = newSchool.id;

    if (inquiryId) {
      // Create or Update user from inquiry
      await tx.user.upsert({
        where: { email: adminEmail },
        update: {
          role: 'SCHOOL_ADMIN',
          schoolId: newSchool.id,
          password: hashedTempPassword,
        },
        create: {
          email: adminEmail,
          name: adminEmail.split('@')[0],
          password: hashedTempPassword,
          role: 'SCHOOL_ADMIN',
          schoolId: newSchool.id,
        }
      });

      // Mark inquiry as accepted
      await tx.registrationInquiry.update({
        where: { id: inquiryId },
        data: { status: 'ACCEPTED' }
      });
    } else if (adminId) {
      // Assign existing user (explicitly by ID)
      await tx.user.update({
        where: { id: adminId },
        data: {
          role: 'SCHOOL_ADMIN',
          schoolId: newSchool.id,
          password: hashedTempPassword,
        }
      });
    } else {
      // Create or Update brand new user from email only
      await tx.user.upsert({
        where: { email: adminEmail },
        update: {
          role: 'SCHOOL_ADMIN',
          schoolId: newSchool.id,
          password: hashedTempPassword,
        },
        create: {
          email: adminEmail,
          name: adminEmail.split('@')[0],
          password: hashedTempPassword,
          role: 'SCHOOL_ADMIN',
          schoolId: newSchool.id,
        }
      });
    }
  });

  // 4. Send Activation Email
  try {
    const loginUrl = `${process.env.NEXTAUTH_URL || 'https://visi-sekolah.vercel.app'}/${slug}/login`;
    
    await sendMail({
      to: adminEmail,
      subject: 'Akun Anda Aktif - VisiSekolah',
      html: getActivationEmail({
        email: adminEmail,
        schoolName: name,
        slug: slug,
        tempPassword: tempPassword,
        loginUrl: loginUrl,
      }),
    });
    console.log(`✅ Activation email sent to ${adminEmail}`);
  } catch (emailError) {
    console.error('⚠️ Failed to send activation email:', emailError);
    // We don't throw here because the school is already created in DB
  }

  return {
    schoolId,
    tempPassword,
    slug
  };
}

export async function activateInquiry(inquiryId: string) {
  try {
    const inquiry = await prisma.registrationInquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) {
      return { error: 'Inquiry tidak ditemukan' };
    }

    const schoolName = inquiry.schoolName || 'Sekolah Baru';
    // Generate a clean slug
    const baseSlug = schoolName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Ensure uniqueness (basic check)
    let finalSlug = baseSlug;
    const existing = await prisma.school.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const result = await provisionSchool({
      name: schoolName,
      slug: finalSlug,
      adminEmail: inquiry.email,
      inquiryId: inquiryId,
    });

    revalidatePath('/admin');

    return { 
      success: true, 
      setupInfo: {
        email: inquiry.email,
        tempPassword: result.tempPassword,
        slug: result.slug
      }
    };
  } catch (error: any) {
    console.error('Failed to activate inquiry:', error);
    return { error: error.message || 'Gagal mengaktivasi sekolah' };
  }
}

export async function createSchool(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const adminId = formData.get('adminId') as string | null;
  const inquiryId = formData.get('inquiryId') as string | null;

  const validated = CreateSchoolSchema.safeParse({ name, slug, adminId, inquiryId });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    let adminEmail = '';
    
    if (inquiryId) {
      const inquiry = await prisma.registrationInquiry.findUnique({ where: { id: inquiryId } });
      if (!inquiry) return { error: 'Inquiry tidak ditemukan' };
      adminEmail = inquiry.email;
    } else if (adminId) {
      const user = await prisma.user.findUnique({ where: { id: adminId } });
      if (!user || !user.email) return { error: 'User tidak ditemukan' };
      adminEmail = user.email;
    }

    const result = await provisionSchool({
      name,
      slug,
      adminEmail,
      inquiryId: inquiryId || undefined,
      adminId: adminId || undefined,
    });

    revalidatePath('/admin');
    
    return { 
      success: true, 
      setupInfo: {
        email: adminEmail,
        tempPassword: result.tempPassword,
        slug: result.slug
      }
    };
  } catch (error: any) {
    console.error('Failed to create school:', error);
    return { error: error.message || 'Terjadi kesalahan saat membuat sekolah' };
  }
}
