'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { processSimulatedPayment } from '@/app/actions/payment';
import styles from '@/styles/landing.module.scss';
import { CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Lock, Landmark, QrCode } from 'lucide-react';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetSlug, setTargetSlug] = useState('');

  const inquiryId = params.id as string;

  const handlePayment = async () => {
    setIsPending(true);
    setError(null);

    const result = await processSimulatedPayment(inquiryId);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setIsSuccess(true);
      setTargetSlug(result.slug || '');
      setIsPending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.paymentSuccessPage}>
        <div className={styles.successCard}>
          <div className={styles.successIconPulse}>
            <CheckCircle2 size={80} />
          </div>
          <h1>Pembayaran Berhasil!</h1>
          <p>Terima kasih. Akun sekolah Anda telah diaktifkan secara otomatis.</p>
          
          <div className={styles.nextStepsBox}>
            <h3>Langkah Selanjutnya:</h3>
            <ul>
              <li>Cek email Anda untuk detail login & password sementara.</li>
              <li>Akses dashboard sekolah Anda di link bawah ini.</li>
            </ul>
          </div>

          <div className={styles.accessLinkCard}>
            <span className={styles.accessLabel}>URL Akses Sekolah:</span>
            <code className={styles.accessCode}>{targetSlug}.visisekolah.id</code>
          </div>

          <button 
            onClick={() => window.location.href = `https://visi-sekolah.vercel.app/${targetSlug}/login`} 
            className={styles.btnPrimaryLarge}
          >
            Masuk ke Dashboard <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentPage}>
      <div className={styles.paymentHeader}>
        <h1>Selesaikan Pembayaran</h1>
        <p>Amankan paket VisiSekolah Anda sekarang.</p>
      </div>

      <div className={styles.paymentGrid}>
        <div className={styles.paymentMethods}>
          <h3>Pilih Metode Pembayaran</h3>
          
          <div className={styles.methodCard} onClick={handlePayment}>
            <div className={styles.methodIcon}><Landmark size={24} /></div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>Virtual Account (Transfer Bank)</div>
              <p>BCA, Mandiri, BNI, BRI</p>
            </div>
            <div className={styles.methodBadge}>Instan</div>
          </div>

          <div className={styles.methodCard} onClick={handlePayment}>
            <div className={styles.methodIcon}><QrCode size={24} /></div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>QRIS (Gopay, OVO, Dana)</div>
              <p>Scan & Bayar instan</p>
            </div>
            <div className={styles.methodBadge}>Instan</div>
          </div>

          <div className={styles.methodCard} onClick={handlePayment}>
            <div className={styles.methodIcon}><CreditCard size={24} /></div>
            <div className={styles.methodInfo}>
              <div className={styles.methodName}>Kartu Kredit / Debit</div>
              <p>Visa, Mastercard, JCB</p>
            </div>
          </div>

          <div className={styles.securityNote}>
            <Lock size={14} /> Transaksi Anda dilindungi oleh enkripsi 256-bit SSL.
          </div>
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.summaryBox}>
            <h3>Ringkasan Pesanan</h3>
            <div className={styles.summaryRow}>
              <span>ID Pendaftaran</span>
              <span className={styles.mono}>VS-{inquiryId.slice(-8).toUpperCase()}</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Paket Terpilih</span>
              <strong>Professional Plan</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Durasi</span>
              <span>1 Bulan</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotalRow}>
              <span>Total Bayar</span>
              <span className={styles.totalAmount}>Rp 1.500.000</span>
            </div>
          </div>

          <button 
            className={styles.payBtn} 
            disabled={isPending}
            onClick={handlePayment}
          >
            {isPending ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
          
          <div className={styles.guaranteeBox}>
            <ShieldCheck size={20} />
            <div>
              <strong>Garansi Aktivasi Instan</strong>
              <p>Akun aktif dalam &lt; 1 menit setelah pembayaran terdeteksi.</p>
            </div>
          </div>
        </div>
      </div>

      {error && <div className={styles.errorBannerPayment}>{error}</div>}
    </div>
  );
}
