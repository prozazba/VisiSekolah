'use server';

import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';
import { getUrlUpdateEmail } from '@/lib/email-templates';

import { siteConfig } from '@/config/site';

export async function runUrlUpdateBlast() {
  try {
    // 1. Get all schools with their admins
    const schools = await prisma.school.findMany({
      include: {
        users: {
          where: { role: 'SCHOOL_ADMIN' },
          take: 1
        }
      }
    });

    console.log(`📣 Starting URL Update Blast for ${schools.length} schools...`);
    let successCount = 0;
    let failCount = 0;

    for (const school of schools) {
      const admin = school.users[0];
      if (!admin || !admin.email) {
        console.log(`⚠️ Skipping ${school.name}: No admin found.`);
        failCount++;
        continue;
      }

      const loginUrl = `${siteConfig.url}/login`;

      try {
        await sendMail({
          to: admin.email,
          subject: `[PENTING] Alamat Baru Dashboard Sekolah ${school.name}`,
          html: getUrlUpdateEmail({
            schoolName: school.name,
            loginUrl,
          }),
        });
        console.log(`✅ Sent to ${school.name} (${admin.email})`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed for ${school.name}:`, err);
        failCount++;
      }
    }

    return { 
      success: true, 
      message: `Blast selesai. Berhasil: ${successCount}, Gagal: ${failCount}.` 
    };
  } catch (error) {
    console.error('Blast failed:', error);
    return { error: 'Terjadi kesalahan sistem saat menjalankan blast.' };
  }
}
