// Professional HTML email templates for VisiSekolah transactional emails
// Used with Nodemailer transport

// ─────────────────────────────────────────────
// 1. Inquiry Confirmation (sent on form submit)
// ─────────────────────────────────────────────

interface InquiryConfirmationData {
  email: string;
  plan: string;
  planPrice: string;
  submissionId: string;
  isAutoApproved: boolean;
  paymentUrl?: string;
}

export function getInquiryConfirmationEmail(data: InquiryConfirmationData): string {
  const nextSteps = data.isAutoApproved
    ? `<strong>Paket Starter — Disetujui Otomatis!</strong> Akun Anda sedang disiapkan. Anda akan menerima email kredensial login dalam beberapa saat.`
    : `<strong>Langkah selanjutnya:</strong> Silakan selesaikan pembayaran untuk mengaktifkan layanan. Gunakan tombol di bawah atau link yang tersedia untuk melanjutkan ke halaman pembayaran aman kami.`;

  const statusLabel = data.isAutoApproved ? 'Disetujui' : 'Menunggu Pembayaran';
  const statusBg = data.isAutoApproved ? '#ecfdf5' : '#fef3c7';
  const statusColor = data.isAutoApproved ? '#065f46' : '#92400e';

  const paymentButton = (!data.isAutoApproved && data.paymentUrl) ? `
    <!-- Payment Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-top:24px;">
          <a href="${data.paymentUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;font-size:15px;font-weight:700;padding:12px 32px;border-radius:10px;text-decoration:none;">
            Bayar Sekarang →
          </a>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-top:12px;">
          <span style="font-size:12px;color:#94a3b8;">Link: <a href="${data.paymentUrl}" style="color:#2563eb;text-decoration:none;">${data.paymentUrl}</a></span>
        </td>
      </tr>
    </table>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konfirmasi Pendaftaran - VisiSekolah</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0f172a,#1e293b);width:48px;height:48px;border-radius:14px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;line-height:48px;">V</span>
                  </td>
                  <td style="padding-left:14px;">
                    <span style="font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">VisiSekolah</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:48px 40px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
              
              <!-- Success Icon -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;background:#ecfdf5;border-radius:50%;text-align:center;line-height:64px;">
                      <span style="font-size:32px;color:#10b981;">&#10003;</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">
                      Permintaan Anda Telah Diterima
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;font-size:16px;color:#64748b;line-height:1.6;max-width:440px;">
                      Terima kasih telah mendaftar di VisiSekolah. Berikut adalah ringkasan pendaftaran Anda.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Summary Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="margin:0 0 20px;font-size:16px;font-weight:800;color:#0f172a;">Ringkasan Pendaftaran</h3>
                    
                    <!-- Submission ID Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">ID Pendaftaran</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:700;color:#1e293b;font-family:monospace;letter-spacing:0.02em;">${data.submissionId}</td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Plan Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">Paket Dipilih</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:15px;font-weight:700;color:#1e293b;">${data.plan} Plan</td>
                              <td align="right" style="font-size:15px;font-weight:800;color:#2563eb;">${data.planPrice}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Email Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">Email Administrator</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:600;color:#1e293b;">${data.email}</td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Status Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">Status</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="display:inline-block;background:${statusBg};color:${statusColor};font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;">${statusLabel}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top:28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                            ${nextSteps}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${paymentButton}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} VisiSekolah. Platform Digitalisasi Sekolah Indonesia.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                Email ini dikirim secara otomatis. Jika Anda tidak merasa mendaftar, abaikan email ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 2. Payment Receipt Email
// ─────────────────────────────────────────────

interface PaymentReceiptData {
  email: string;
  submissionId: string;
  plan: string;
  planPrice: string;
  paymentDate: string;
  paymentMethod?: string;
}

export function getPaymentReceiptEmail(data: PaymentReceiptData): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bukti Pembayaran - VisiSekolah</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0f172a,#1e293b);width:48px;height:48px;border-radius:14px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;line-height:48px;">V</span>
                  </td>
                  <td style="padding-left:14px;">
                    <span style="font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">VisiSekolah</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:48px 40px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
              
              <!-- Receipt Icon -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;background:#ecfdf5;border-radius:50%;text-align:center;line-height:64px;">
                      <span style="font-size:28px;color:#10b981;">&#9733;</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">
                      Pembayaran Berhasil!
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;font-size:16px;color:#64748b;line-height:1.6;max-width:440px;">
                      Pembayaran Anda telah dikonfirmasi. Akun sekolah Anda sedang diaktifkan.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Receipt Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="margin:0 0 20px;font-size:16px;font-weight:800;color:#0f172a;">Bukti Pembayaran</h3>
                    
                    <!-- Submission ID -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">ID Pendaftaran</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:700;color:#1e293b;font-family:monospace;">${data.submissionId}</td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Plan -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">Paket</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:700;color:#1e293b;">${data.plan} Plan</td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Payment Date -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;text-transform:uppercase;color:#94a3b8;font-weight:700;letter-spacing:0.05em;">Tanggal Pembayaran</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:15px;font-weight:600;color:#1e293b;">${data.paymentDate}</td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Total -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:16px;font-weight:800;color:#0f172a;">Total Dibayar</td>
                              <td align="right" style="font-size:18px;font-weight:900;color:#10b981;">${data.planPrice}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding:12px 0;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
                    </table>

                    <!-- Status -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="display:inline-block;background:#ecfdf5;color:#065f46;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;">✓ Lunas</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top:28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                            <strong>Langkah selanjutnya:</strong> Tim kami sedang menyiapkan platform sekolah Anda. Anda akan menerima email berisi kredensial login dan panduan setup dalam waktu singkat.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} VisiSekolah. Platform Digitalisasi Sekolah Indonesia.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                Simpan email ini sebagai bukti pembayaran Anda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 3. Activation / Credentials Email
// ─────────────────────────────────────────────

interface ActivationEmailData {
  email: string;
  schoolName: string;
  tempPassword: string;
  loginUrl: string;
}

export function getActivationEmail(data: ActivationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Akun Anda Aktif - VisiSekolah</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0f172a,#1e293b);width:48px;height:48px;border-radius:14px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;line-height:48px;">V</span>
                  </td>
                  <td style="padding-left:14px;">
                    <span style="font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">VisiSekolah</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:48px 40px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
              
              <!-- Rocket Icon -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;background:#eff6ff;border-radius:50%;text-align:center;line-height:64px;">
                      <span style="font-size:32px;">&#128640;</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">
                      Selamat! Akun Anda Aktif
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;font-size:16px;color:#64748b;line-height:1.6;max-width:440px;">
                      Platform <strong style="color:#0f172a;">${data.schoolName}</strong> sudah siap digunakan. Gunakan kredensial berikut untuk login.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Credentials Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:16px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="margin:0 0 20px;font-size:14px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Kredensial Login</h3>
                    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:11px;color:#64748b;font-weight:600;">EMAIL</span><br>
                          <span style="font-size:16px;color:#ffffff;font-weight:600;">${data.email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:11px;color:#64748b;font-weight:600;">PASSWORD SEMENTARA</span><br>
                          <span style="font-size:16px;color:#fbbf24;font-weight:700;font-family:monospace;letter-spacing:0.05em;">${data.tempPassword}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size:11px;color:#64748b;font-weight:600;">LINK DASHBOARD</span><br>
                          <span style="font-size:14px;color:#38bdf8;font-weight:600;">sma-visisekolah.sch.id/login</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Login Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-top:28px;">
                    <a href="${data.loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:12px;text-decoration:none;">
                      Login ke Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top:28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                            <strong>Penting:</strong> Segera ubah password sementara setelah login pertama. Jangan bagikan kredensial ini kepada pihak lain.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                &copy; ${new Date().getFullYear()} VisiSekolah. Platform Digitalisasi Sekolah Indonesia.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                Email ini bersifat rahasia. Jangan forward ke pihak yang tidak berkepentingan.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
export function getUrlUpdateEmail({ schoolName, loginUrl }: { schoolName: string; loginUrl: string }) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f172a; padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Pembaruan Sistem VisiSekolah</h1>
      </div>
      <div style="padding: 30px; line-height: 1.6; color: #334155;">
        <p>Halo Administrator <strong>${schoolName}</strong>,</p>
        <p>Kami ingin menginformasikan bahwa sistem VisiSekolah telah beralih ke domain produksi resmi. Untuk mengakses dashboard sekolah Anda, silakan gunakan link terbaru di bawah ini:</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${loginUrl}" style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Masuk ke Dashboard Baru</a>
        </div>
        
        <p style="background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px;">
          <strong>Link Akses Anda:</strong><br/>
          <code style="color: #2563eb;">${loginUrl}</code>
        </p>

        <p>Password dan data akun Anda tetap sama. Jika Anda mengalami kesulitan akses, silakan hubungi tim dukungan kami.</p>
        
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          &copy; 2026 VisiSekolah by Komite. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </div>
  `;
}
