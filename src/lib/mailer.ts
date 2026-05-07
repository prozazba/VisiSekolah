// Nodemailer transport for VisiSekolah
// Supports Gmail SMTP (production) and Ethereal (development/testing)

import nodemailer from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Create the Nodemailer transport.
 * 
 * Production (Gmail SMTP):
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your@gmail.com
 *   SMTP_PASS=your-app-password
 *   SMTP_FROM="VisiSekolah <your@gmail.com>"
 *
 * Development (Ethereal — auto-generated test account):
 *   Leave SMTP_HOST empty or unset.
 *   Emails are captured at https://ethereal.email
 */
let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create the transporter (lazy — reads env vars at first call, not import time).
 */
async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;

  if (host) {
    // ---- Production / configured SMTP ----
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: (process.env.SMTP_PORT === '465'),
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
    console.log(`📧 SMTP transport ready (${host})`);
    return transporter;
  }

  // ---- Development fallback: Ethereal ----
  console.log('⚠️  No SMTP_HOST configured — using Ethereal test account');
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('📧 Ethereal test account created:');
  console.log(`   User: ${testAccount.user}`);
  console.log(`   Pass: ${testAccount.pass}`);
  console.log('   Preview emails at: https://ethereal.email');

  return transporter;
}

/**
 * Send an email via Nodemailer.
 * Returns the preview URL (Ethereal) or messageId (production).
 */
export async function sendMail(options: MailOptions): Promise<{ messageId: string; previewUrl?: string | false }> {
  const transport = await getTransporter();
  const from = process.env.SMTP_FROM || 'VisiSekolah <noreply@visisekolah.id>';

  const info = await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo || undefined,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  
  if (previewUrl) {
    console.log(`📧 Email preview: ${previewUrl}`);
  }

  return {
    messageId: info.messageId,
    previewUrl,
  };
}
