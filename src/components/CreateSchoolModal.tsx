'use client';

import { useState } from 'react';
import styles from '../styles/admin.module.scss';
import { activateInquiry } from '@/app/actions/school';
import { resendPaymentLink } from '@/app/actions/inquiry';
import { Rocket, Mail, Calendar, CheckCircle2, AlertCircle, Clock, X, Send } from 'lucide-react';

interface Inquiry {
  id: string;
  email: string;
  schoolName: string;
  plan: string | null;
  status: string;
  createdAt: string;
}

interface CreateSchoolModalProps {
  onClose: () => void;
  users: { id: string; name: string; email: string | null }[];
  inquiries: Inquiry[];
}

export default function CreateSchoolModal({ onClose, inquiries }: CreateSchoolModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<string | null>(null); // Stores ID of inquiry being processed
  const [setupInfo, setSetupInfo] = useState<{ email: string | null; tempPassword: string; slug: string } | null>(null);

  const handleActivate = async (inquiryId: string) => {
    setError(null);
    setSuccessMsg(null);
    setIsPending(inquiryId);

    const result = await activateInquiry(inquiryId);

    if (result?.error) {
      setError(result.error);
      setIsPending(null);
    } else if (result?.setupInfo) {
      setSetupInfo(result.setupInfo);
      setIsPending(null);
    }
  };

  const handleResend = async (inquiryId: string) => {
    setError(null);
    setSuccessMsg(null);
    setIsPending(`resend-${inquiryId}`);

    const result = await resendPaymentLink(inquiryId);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccessMsg('Link pembayaran telah dikirim ulang ke administrator.');
    }
    setIsPending(null);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.largeModal}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>

        {setupInfo ? (
          <div className={styles.successScreen}>
            <div className={styles.modalHeader}>
              <div className={styles.successBadge}>✓</div>
              <h2>Sekolah Berhasil Diluncurkan!</h2>
              <p>Akun sekolah telah aktif dan kredensial telah dikirim ke administrator.</p>
            </div>

            <div className={styles.setupDetails}>
              <div className={styles.detailItem}>
                <label>Email Administrator</label>
                <div className={styles.detailValue}>{setupInfo.email}</div>
              </div>
              <div className={styles.detailItem}>
                <label>Password Sementara</label>
                <div className={styles.detailValue}>
                  <code>{setupInfo.tempPassword}</code>
                </div>
              </div>
              <div className={styles.detailItem}>
                <label>Subdomain Akses</label>
                <div className={styles.detailValue}>
                  <code>visi-sekolah.vercel.app/{setupInfo.slug}/</code>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnPrimary} onClick={onClose}>Tutup Panel</button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.headerIcon}><Rocket size={28} /></div>
              <h2>Panel Aktivasi Sekolah</h2>
              <p>Daftar permintaan pendaftaran yang siap untuk diluncurkan.</p>
            </div>

            {error && (
              <div className={styles.errorMsg}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {successMsg && (
              <div className={styles.successMsgActivation}>
                <CheckCircle2 size={18} /> {successMsg}
              </div>
            )}

            <div className={styles.inquiryListContainer}>
              {inquiries.length > 0 ? (
                <table className={styles.activationTable}>
                  <thead>
                    <tr>
                      <th>Detail Sekolah</th>
                      <th>Paket</th>
                      <th>Status Pembayaran</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td>
                          <div className={styles.schoolInfoCell}>
                            <span className={styles.name}>{inq.schoolName}</span>
                            <span className={styles.email}><Mail size={12} /> {inq.email}</span>
                            <span className={styles.date}><Calendar size={12} /> {new Date(inq.createdAt).toLocaleDateString('id-ID')}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.planBadge}>{inq.plan || 'Starter'}</span>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[inq.status.toLowerCase()]}`}>
                            {inq.status === 'ACCEPTED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {inq.status === 'ACCEPTED' ? 'Lunas' : 'Menunggu'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionCell}>
                            {inq.status === 'PENDING' ? (
                              <button
                                className={styles.resendBtn}
                                onClick={() => handleResend(inq.id)}
                                disabled={!!isPending}
                                title="Kirim ulang link pembayaran"
                              >
                                {isPending === `resend-${inq.id}` ? 'Mengirim...' : <><Send size={14} /> Link Bayar</>}
                              </button>
                            ) : inq.status === 'ACCEPTED' && inq.schoolName && inq.schoolName !== 'N/A' ? (
                              <button
                                className={styles.activateBtn}
                                onClick={() => handleActivate(inq.id)}
                                disabled={!!isPending}
                              >
                                {isPending === inq.id ? 'Memproses...' : 'Luncurkan Now'}
                              </button>
                            ) : (
                              <span className={styles.missingInfo}>Data belum lengkap</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✨</div>
                  <p>Tidak ada permintaan pendaftaran yang menunggu aktivasi.</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={onClose}>Batal</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
