'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../styles/landing.module.scss';
import { submitInquiry } from '@/app/actions/inquiry';
import { Mail, Send, CheckCircle2, Shield, Zap, Award, Clock, Sparkles, ArrowRight } from 'lucide-react';

const PLANS = [
  { 
    id: 'STARTER', 
    name: 'Starter', 
    price: 'Rp 500rb', 
    desc: 'Perfect for small learning centers.',
    icon: <Shield size={20} /> 
  },
  { 
    id: 'PROFESSIONAL', 
    name: 'Professional', 
    price: 'Rp 1.5jt', 
    desc: 'Comprehensive solution for large schools.',
    icon: <Zap size={20} />,
    popular: true 
  },
  { 
    id: 'ENTERPRISE', 
    name: 'Enterprise', 
    price: 'Custom', 
    desc: 'For large school foundations.',
    icon: <Award size={20} /> 
  }
];

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState('PROFESSIONAL');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [inquiryId, setInquiryId] = useState('');
  const [isAutoApproved, setIsAutoApproved] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan')?.toUpperCase();
    if (planParam && PLANS.find(p => p.id === planParam)) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('plan', selectedPlan);
    const email = formData.get('email') as string;

    const result = await submitInquiry(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setSubmittedEmail(email);
      setSubmissionId(result.submissionId || '');
      setInquiryId(result.id || '');
      setIsAutoApproved(result.isAutoApproved || false);
      setIsSuccess(true);
      setIsPending(false);
    }
  };

  if (isSuccess) {
    const planDetails = PLANS.find(p => p.id === selectedPlan);

    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>
          {isAutoApproved ? <Sparkles size={64} /> : <CheckCircle2 size={64} />}
        </div>
        <h2>{isAutoApproved ? 'Pendaftaran Disetujui!' : 'Terima kasih atas permintaan Anda'}</h2>
        <p>
          {isAutoApproved
            ? 'Paket Starter Anda telah disetujui secara otomatis. Kami akan segera menyiapkan akun Anda.'
            : 'Kami telah menerima permintaan Anda. Silakan selesaikan pembayaran untuk mengaktifkan layanan.'}
        </p>

        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Ringkasan Pendaftaran</h3>

          {/* Submission ID */}
          <div className={styles.summaryItem}>
            <div className={styles.summaryItemLeft}>
              <span className={styles.summaryLabel}>ID Pendaftaran</span>
              <span className={styles.summaryValue} style={{ fontFamily: 'monospace', letterSpacing: '0.02em' }}>{submissionId}</span>
            </div>
          </div>

          <div className={styles.summaryDivider} />
          
          {/* Plan */}
          <div className={styles.summaryItem}>
            <div className={styles.summaryItemLeft}>
              <span className={styles.summaryLabel}>Paket Dipilih</span>
              <span className={styles.summaryValue}>{planDetails?.name} Plan</span>
            </div>
            <span className={styles.summaryPrice}>{planDetails?.price}</span>
          </div>

          <div className={styles.summaryDivider} />

          {/* Email */}
          <div className={styles.summaryItem}>
            <div className={styles.summaryItemLeft}>
              <span className={styles.summaryLabel}>Email Administrator</span>
              <span className={styles.summaryValue}>{submittedEmail}</span>
            </div>
          </div>

          <div className={styles.summaryDivider} />

          {/* Status */}
          <div className={styles.summaryItem}>
            <div className={styles.summaryItemLeft}>
              <span className={styles.summaryLabel}>Status</span>
              <span className={styles.summaryValue} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: isAutoApproved ? '#065f46' : '#92400e',
                fontWeight: 600,
              }}>
                {isAutoApproved ? <><CheckCircle2 size={14} /> Disetujui</> : <><Clock size={14} /> Menunggu Pembayaran</>}
              </span>
            </div>
          </div>

          <div className={styles.summaryDivider} />

          <div className={styles.summaryTotal}>
            <span className={styles.summaryTotalLabel}>Total Estimasi</span>
            <span className={styles.summaryTotalPrice}>{planDetails?.price}</span>
          </div>
        </div>

        <div className={styles.successActions}>
          {!isAutoApproved && (
            <button 
              onClick={() => window.location.href = `/payment/${inquiryId}`} 
              className={styles.submitBtn}
              style={{ width: 'auto', padding: '1rem 3rem', marginBottom: '1rem' }}
            >
              Bayar Sekarang <ArrowRight size={18} />
            </button>
          )}
          
          <button 
            onClick={() => window.location.href = '/'} 
            className={styles.btnOutlineDark}
            style={{ width: 'auto', padding: '1rem 3rem' }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2>Mulai VisiSekolah</h2>
        <p>Cukup masukkan email Anda untuk memulai proses digitalisasi.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={styles.inputGroup}>
          <label><Shield size={16} /> Nama Sekolah / Institusi</label>
          <input 
            name="schoolName" 
            type="text" 
            placeholder="Contoh: SMPN 1 Jakarta" 
            required 
            disabled={isPending} 
            className={styles.formInputLarge}
          />
        </div>

        <div className={styles.inputGroup}>
          <label><Mail size={16} /> Email Administrator</label>
          <input 
            name="email" 
            type="email" 
            placeholder="admin@sekolah.sch.id" 
            required 
            disabled={isPending} 
            className={styles.formInputLarge}
          />
        </div>

        <div className={styles.planSelector}>
          <label>Pilih Paket Sekolah</label>
          <div className={styles.planCards}>
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`${styles.planCardSmall} ${selectedPlan === plan.id ? styles.active : ''}`}
                onClick={() => !isPending && setSelectedPlan(plan.id)}
              >
                {plan.popular && <span className={styles.popularTag}>Populer</span>}
                <div className={styles.planIcon}>{plan.icon}</div>
                <div className={styles.planInfo}>
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPrice}>{plan.price}<small>/mo</small></div>
                  <p className={styles.planDescSmall}>{plan.desc}</p>
                </div>
                <div className={styles.checkIndicator}>
                  <div className={styles.checkInner}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? 'Memproses...' : (
            <>
              Dapatkan Akses Sekarang <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
