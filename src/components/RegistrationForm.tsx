'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../styles/landing.module.scss';
import { submitInquiry } from '@/app/actions/inquiry';
import { Mail, Send, CheckCircle2, Shield, Zap, Award } from 'lucide-react';

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
    formData.append('plan', selectedPlan); // Explicitly append selected plan

    const result = await submitInquiry(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setIsSuccess(true);
      setIsPending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>
          <CheckCircle2 size={48} />
        </div>
        <h2>Satu Langkah Lagi!</h2>
        <p>Permintaan Anda telah kami terima. Tim kami akan segera memverifikasi email Anda dan mengirimkan prosedur pendaftaran selanjutnya.</p>
        <button onClick={() => window.location.href = '/'} className={styles.btnBentoPrimary}>
          Kembali ke Beranda
        </button>
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
          <label><Mail size={16} /> Email Institusi / Administrator</label>
          <input 
            name="email" 
            type="email" 
            placeholder="nama@sekolah.sch.id" 
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
