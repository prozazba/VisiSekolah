import { loadEnvConfig } from '@next/env';
// Load environment variables exactly how Next.js does
loadEnvConfig(process.cwd());

async function main() {
  console.log('🚀 Sending PWA Scanner invitation email to Student Tester: Apta...');

  // Dynamically import mailer AFTER env vars are loaded
  const { sendMail } = await import('../src/lib/mailer');

  const testerEmail = 'proto.sekolah.komite@gmail.com';
  const scannerUrl = 'https://visi-sekolah.vercel.app/scan';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Uji Coba PWA Presensi QR VisiSekolah</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f1f5f9;color:#1e293b;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
        <!-- Header Banner -->
        <tr>
          <td style="background:linear-gradient(135deg, #0f172a, #1e293b);padding:40px 30px;text-align:center;color:#ffffff;">
            <div style="display:inline-block;width:50px;height:50px;line-height:50px;background:linear-gradient(135deg, #3b82f6, #6366f1);border-radius:14px;font-weight:900;font-size:24px;margin-bottom:15px;box-shadow:0 4px 12px rgba(59,130,246,0.3);">V</div>
            <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.025em;color:#ffffff;">VisiSekolah Presensi QR</h1>
            <p style="margin:5px 0 0;font-size:13px;color:#94a3b8;">Portal Presensi Standalone Siswa - Akun Uji Coba</p>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding:40px 30px;">
            <h2 style="margin-top:0;font-size:20px;font-weight:700;color:#0f172a;">Halo Apta,</h2>
            <p style="font-size:15px;line-height:1.6;color:#475569;margin-bottom:20px;">
              Anda telah didaftarkan sebagai <strong>Personil Tester Utama (Siswa)</strong> untuk melakukan uji coba sistem kehadiran real-time menggunakan **QR Code & Geolocation GPS** VisiSekolah.
            </p>

            <!-- Test Steps -->
            <div style="background-color:#f8fafc;border-radius:16px;padding:20px;margin-bottom:30px;border:1px solid #f1f5f9;">
              <h3 style="margin-top:0;font-size:14px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">🛠️ Langkah Uji Coba Presensi QR:</h3>
              <ol style="margin:0;padding-left:20px;font-size:14px;color:#334155;line-height:1.6;">
                <li style="margin-bottom:8px;">Buka tautan aplikasi scanner di bawah ini melalui ponsel pintar Anda.</li>
                <li style="margin-bottom:8px;">Instal aplikasi sebagai **PWA (Progressive Web App)** di ponsel Anda (opsional, disarankan agar tampil layar penuh).</li>
                <li style="margin-bottom:8px;">Masuk menggunakan kredensial tester di bawah.</li>
                <li style="margin-bottom:8px;">Buka kamera pemindai di aplikasi, izinkan akses kamera & GPS, lalu arahkan ke QR Code yang digenerate oleh guru untuk mencatat presensi secara otomatis!</li>
              </ol>
            </div>

            <!-- Login Credentials -->
            <div style="border-left:4px solid #3b82f6;padding-left:15px;margin-bottom:30px;background-color:#eff6ff;padding:15px;border-radius:0 12px 12px 0;">
              <h4 style="margin:0 0 8px;font-size:15px;font-weight:700;color:#1e3a8a;">Kredensial Tester Siswa Anda:</h4>
              <p style="margin:0;font-size:14px;color:#1e40af;line-height:1.5;">
                Email: <strong style="color:#0f172a;">${testerEmail}</strong><br>
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

            <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:15px;">
              Tautan PWA: <a href="${scannerUrl}" style="color:#3b82f6;text-decoration:none;">${scannerUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8fafc;padding:30px;text-align:center;border-top:1px solid #f1f5f9;color:#94a3b8;font-size:12px;">
            <p style="margin:0 0 5px;">Materi dikirim secara otomatis oleh Portal VisiSekolah untuk kepentingan Uji Coba.</p>
            <p style="margin:0;">&copy; 2026 VisiSekolah. Seluruh hak cipta dilindungi.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const res = await sendMail({
      to: testerEmail,
      subject: '🚀 [Uji Coba] PWA Absensi QR Code VisiSekolah - Tester Siswa: Apta',
      html: htmlContent
    });

    console.log(`✅ Success sending to Apta (${testerEmail})! MsgID: ${res.messageId}`);
    if (res.previewUrl) {
      console.log(`🔗 Preview URL: ${res.previewUrl}`);
    }
  } catch (err) {
    console.error(`❌ Failed sending to Apta:`, err);
  }

  console.log('🎉 Test invitation email sent successfully!');
}

main()
  .catch((err) => {
    console.error('Fatal error during test script:', err);
    process.exit(1);
  });
