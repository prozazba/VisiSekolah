'use server';

import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';
import { getInquiryConfirmationEmail } from '@/lib/email-templates';
import { z } from 'zod';
import crypto from 'crypto';

const VALID_PLANS = ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'] as const;

const PLAN_PRICES: Record<string, string> = {
  STARTER: 'Rp 500rb',
  PROFESSIONAL: 'Rp 1.5jt',
  ENTERPRISE: 'Custom',
};

const PLAN_NAMES: Record<string, string> = {
  STARTER: 'Starter',
  PROFESSIONAL: 'Professional',
  ENTERPRISE: 'Enterprise',
};

import { provisionSchool } from './school';

const InquirySchema = z.object({
  email: z.string().email('Email tidak valid'),
  schoolName: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  plan: z.string().refine(
    (val) => VALID_PLANS.includes(val as typeof VALID_PLANS[number]),
    { message: 'Paket yang dipilih tidak tersedia' }
  ),
});

/**
 * Generate a slug from a string.
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Generate a human-readable submission ID.
 * Format: VS-YYYYMMDD-XXXX (e.g., VS-20260507-A3F2)
 */
function generateSubmissionId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `VS-${dateStr}-${random}`;
}

export async function submitInquiry(formData: FormData) {
  const email = formData.get('email') as string;
  const schoolName = formData.get('schoolName') as string;
  const plan = formData.get('plan') as string;

  // ── Step 2: Validate Input ──
  const validated = InquirySchema.safeParse({ email, schoolName, plan });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    // Check if slug is available if we're going to auto-approve
    const slug = slugify(schoolName);
    if (plan === 'STARTER') {
      const existing = await prisma.school.findUnique({ where: { slug } });
      if (existing) {
        return { error: 'Nama sekolah sudah digunakan atau slug tidak tersedia. Silakan gunakan nama yang lebih spesifik.' };
      }
    }

    // ── Step 3: Create Submission ──
    const submissionId = generateSubmissionId();
    const isAutoApproved = plan === 'STARTER';
    const initialStatus = isAutoApproved ? 'ACCEPTED' : 'PENDING';

    const inquiry = await prisma.registrationInquiry.create({
      data: {
        email,
        schoolName,
        plan,
        notes: submissionId, // Store submission ID in notes field
        status: initialStatus,
      }
    });

    // ── Step 4: Auto-Provision for STARTER Plan ──
    if (isAutoApproved) {
      try {
        await provisionSchool({
          name: schoolName,
          slug: slug,
          adminEmail: email,
          inquiryId: inquiry.id,
        });
        console.log(`🚀 Automated provisioning completed for ${schoolName} (${email})`);
      } catch (provisionError) {
        console.error('⚠️ Automated provisioning failed:', provisionError);
        // We don't fail the submission here, but the school isn't created.
        // The admin can still manually create it later.
      }
    }

    // ── Step 5: Send Confirmation Email ──
    const planName = PLAN_NAMES[plan] || plan;
    const planPrice = PLAN_PRICES[plan] || 'Hubungi kami';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3099';
    const paymentUrl = `${baseUrl}/payment/${inquiry.id}`;

    try {
      const result = await sendMail({
        to: email,
        subject: `Konfirmasi Pendaftaran ${submissionId} - VisiSekolah`,
        html: getInquiryConfirmationEmail({
          email,
          plan: planName,
          planPrice,
          submissionId,
          isAutoApproved,
          paymentUrl: isAutoApproved ? undefined : paymentUrl,
        }),
        replyTo: 'proto.sekolah.komite@gmail.com',
      });

      console.log(`✅ Confirmation email sent to ${email} (${result.messageId})`);
    } catch (emailError) {
      console.error('⚠️ Email sending failed (data saved):', emailError);
    }

    return {
      success: true,
      id: inquiry.id,
      submissionId,
      isAutoApproved,
    };
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { error: `Gagal mengirim permintaan: ${errorMessage}` };
  }
}

export async function resendPaymentLink(inquiryId: string) {
  try {
    const inquiry = await prisma.registrationInquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) return { error: 'Inquiry tidak ditemukan' };

    const plan = inquiry.plan || 'PROFESSIONAL';
    const planName = PLAN_NAMES[plan] || plan;
    const planPrice = PLAN_PRICES[plan] || 'Rp 1.5jt';
    const baseUrl = process.env.NEXTAUTH_URL || 'https://visi-sekolah.vercel.app';
    const paymentUrl = `${baseUrl}/payment/${inquiry.id}`;

    await sendMail({
      to: inquiry.email,
      subject: `[Reminder] Link Pembayaran ${inquiry.notes || inquiry.id} - VisiSekolah`,
      html: getInquiryConfirmationEmail({
        email: inquiry.email,
        plan: planName,
        planPrice,
        submissionId: inquiry.notes || inquiry.id,
        isAutoApproved: false,
        paymentUrl,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to resend payment link:', error);
    return { error: 'Gagal mengirim ulang link pembayaran' };
  }
}

