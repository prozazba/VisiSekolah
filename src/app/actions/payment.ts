'use server';

import prisma from '@/lib/prisma';
import { provisionSchool } from './school';
import { sendMail } from '@/lib/mailer';
import { getPaymentReceiptEmail } from '@/lib/email-templates';
import { revalidatePath } from 'next/cache';

const PLAN_PRICES: Record<string, string> = {
  STARTER: 'Rp 500rb',
  PROFESSIONAL: 'Rp 1.5jt',
  ENTERPRISE: 'Custom',
};

export async function processSimulatedPayment(inquiryId: string) {
  try {
    const inquiry = await prisma.registrationInquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) {
      return { error: 'Inquiry tidak ditemukan' };
    }

    if (inquiry.status === 'ACCEPTED') {
      return { error: 'Pembayaran sudah dilakukan untuk pendaftaran ini' };
    }

    // 1. Update Inquiry Status
    const updatedInquiry = await prisma.registrationInquiry.update({
      where: { id: inquiryId },
      data: { status: 'ACCEPTED' }
    });

    // 2. Trigger School Provisioning
    const schoolName = inquiry.schoolName || 'Sekolah Baru';
    const slug = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    let result;
    try {
      result = await provisionSchool({
        name: schoolName,
        slug: slug,
        adminEmail: inquiry.email,
        inquiryId: inquiry.id,
      });
      console.log(`🚀 School provisioned after payment for ${schoolName}`);
    } catch (provisionError: any) {
      console.error('⚠️ Provisioning failed after payment:', provisionError);
      // Even if provisioning fails (e.g. slug conflict), we still consider payment successful
    }

    // 3. Send Payment Receipt Email
    try {
      const planName = inquiry.plan || 'Professional';
      const planPrice = PLAN_PRICES[planName] || 'Rp 1.5jt';
      
      await sendMail({
        to: inquiry.email,
        subject: `Bukti Pembayaran ${inquiry.notes} - VisiSekolah`,
        html: getPaymentReceiptEmail({
          email: inquiry.email,
          submissionId: inquiry.notes || inquiryId,
          plan: planName.charAt(0) + planName.slice(1).toLowerCase(),
          planPrice,
          paymentDate: new Date().toLocaleString('id-ID', { 
            dateStyle: 'long', 
            timeStyle: 'short',
            timeZone: 'Asia/Jakarta' 
          }) + ' WIB',
        }),
      });
      console.log(`✅ Payment receipt sent to ${inquiry.email}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send payment receipt:', emailError);
    }

    revalidatePath(`/payment/${inquiryId}`);
    
    return { 
      success: true, 
      slug: result?.slug || slug 
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return { error: 'Gagal memproses pembayaran' };
  }
}
