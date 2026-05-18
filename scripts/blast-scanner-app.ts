import { loadEnvConfig } from '@next/env';
// Load environment variables exactly how Next.js does
loadEnvConfig(process.cwd());

async function main() {
  console.log('🚀 Starting Student Scanner App Email Blast...');

  // Dynamically import prisma and mailer AFTER env vars are loaded
  const { default: prisma } = await import('../src/lib/prisma');
  const { sendMail } = await import('../src/lib/mailer');

  // 1. Fetch all students from database
  const students = await prisma.user.findMany({
    where: {
      role: 'SISWA',
      email: { not: null }
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  }) as { id: string; email: string; role: string }[];

  if (students.length === 0) {
    console.log('⚠️  No students found in the database to blast emails to.');
    return;
  }

  console.log(`📋 Found ${students.length} students in the database. Generating and sending emails...`);

  // 2. Base scanner URL
  const scannerUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3099/scan';

  // 3. Loop through students and blast emails
  for (const student of students) {
    console.log(`✉️  Sending email to student: ${student.email}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aplikasi Presensi QR VisiSekolah</title>
      </head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f1f5f9;color:#1e293b;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #0f172a, #1e293b);padding:40px 30px;text-align:center;color:#ffffff;">
              <div style="display:inline-block;width:50px;height:50px;line-height:50px;background:linear-gradient(135deg, #3b82f6, #6366f1);border-radius:14px;font-weight:900;font-size:24px;margin-bottom:15px;box-shadow:0 4px 12px rgba(59,130,246,0.3);">V</div>
              <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.025em;color:#ffffff;">VisiSekolah Presensi QR</h1>
              <p style="margin:5px 0 0;font-size:13px;color:#94a3b8;">Aplikasi Standalone Mobile Scanner Siswa</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:40px 30px;">
              <h2 style="margin-top:0;font-size:20px;font-weight:700;color:#0f172a;">Halo Siswa VisiSekolah,</h2>
              <p style="font-size:15px;line-height:1.6;color:#475569;margin-bottom:20px;">
                Sekolah telah resmi merilis <strong>Aplikasi Standalone Presensi QR Code</strong>. Anda kini dapat melakukan pemindaian presensi kehadiran kelas secara langsung dan aman melalui ponsel pintar Anda masing-masing!
              </p>

              <!-- Features list -->
              <div style="background-color:#f8fafc;border-radius:16px;padding:20px;margin-bottom:30px;border:1px solid #f1f5f9;">
                <h3 style="margin-top:0;font-size:14px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">🌟 Fitur Aplikasi Standalone:</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#334155;">📱 <strong>Instal sebagai PWA</strong> — Tambahkan langsung ke layar utama ponsel cerdas Anda.</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#334155;">📷 <strong>Rear-Camera Scanner</strong> — Pemindaian cepat QR Code guru di dalam kelas.</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#334155;">📍 <strong>GPS Verification</strong> — Penanda koordinat geografis otomatis anti-kecurangan.</td>
                  </tr>
                </table>
              </div>

              <!-- Login Instruction -->
              <div style="border-left:4px solid #6366f1;padding-left:15px;margin-bottom:30px;">
                <h4 style="margin:0 0 5px;font-size:15px;font-weight:700;color:#0f172a;">Kredensial Masuk Uji Coba:</h4>
                <p style="margin:0;font-size:14px;color:#64748b;">
                  Email: <strong style="color:#0f172a;">${student.email}</strong><br>
                  Password: <strong style="color:#0f172a;">password123</strong>
                </p>
              </div>

              <!-- Button CTA -->
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:30px auto 10px;">
                <tr>
                  <td align="center" style="background-color:#3b82f6;border-radius:14px;box-shadow:0 4px 14px rgba(59,130,246,0.4);">
                    <a href="${scannerUrl}" target="_blank" style="display:inline-block;padding:16px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Buka & Pasang Scanner App</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:10px;">
                Tautan aplikasi PWA: <a href="${scannerUrl}" style="color:#3b82f6;text-decoration:none;">${scannerUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:30px;text-align:center;border-top:1px solid #f1f5f9;color:#94a3b8;font-size:12px;">
              <p style="margin:0 0 5px;">Materi dikirim secara otomatis oleh Portal VisiSekolah.</p>
              <p style="margin:0;">&copy; 2026 VisiSekolah. Seluruh hak cipta dilindungi.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      const res = await sendMail({
        to: student.email,
        subject: '🚀 Buka & Pasang Aplikasi Standalone Presensi QR Code VisiSekolah',
        html: htmlContent
      });

      console.log(`✅ Success sending to ${student.email}! MsgID: ${res.messageId}`);
      if (res.previewUrl) {
        console.log(`🔗 Preview URL: ${res.previewUrl}`);
      }
    } catch (err) {
      console.error(`❌ Failed sending to ${student.email}:`, err);
    }
  }

  console.log('🎉 Student Scanner App Email Blast completed successfully!');
}

main()
  .catch((err) => {
    console.error('Fatal error during blast script:', err);
    process.exit(1);
  });
