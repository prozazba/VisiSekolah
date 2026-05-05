import Link from 'next/link';
import { Shield, BookOpen, Users, Smartphone, Globe, CreditCard, ChevronRight } from 'lucide-react';
import styles from '../styles/landing.module.scss';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Full-Screen Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Solusi White Label Aplikasi Sekolah Terpadu</h1>
          <p className={styles.heroSubtitle}>
            Transformasikan manajemen pendidikan Anda dengan platform yang sepenuhnya dapat disesuaikan. 
            Satu ekosistem digital untuk kemajuan sekolah masa depan.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/register" className={styles.btnLarge}>Start Now</Link>
            <Link href="/features" className={styles.btnOutline}>View Features</Link>
          </div>
        </div>
      </section>

      {/* Bento Features Section */}
      <section id="features" className={`${styles.sectionPadding} bg-slate-50`}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Solusi Digital Terpadu</h2>
            <p className={styles.pageSubtitle}>Satu platform untuk seluruh ekosistem sekolah Anda.</p>
          </div>
          
          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={styles.iconCircle}><Globe size={28} /></div>
                <h3 className={styles.bentoTitle}>White Label & Branding</h3>
                <p className={styles.bentoDesc}>Identitas sekolah Anda di mana saja. Domain kustom, logo, and aplikasi mobile dengan branding sendiri.</p>
              </div>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.purple}`}><BookOpen size={28} /></div>
                <h3 className={styles.bentoTitle}>LMS Digital</h3>
                <p className={styles.bentoDesc}>Manajemen pembelajaran modern untuk guru dan siswa.</p>
              </div>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.emerald}`}><CreditCard size={28} /></div>
                <h3 className={styles.bentoTitle}>SPP Otomatis</h3>
                <p className={styles.bentoDesc}>Sistem pembayaran terintegrasi VA & QRIS.</p>
              </div>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.sky}`}><Users size={28} /></div>
                <h3 className={styles.bentoTitle}>Portal Orang Tua</h3>
                <p className={styles.bentoDesc}>Pantau kehadiran dan nilai anak secara real-time langsung dari smartphone.</p>
              </div>
            </div>
          </div>
          
          <div className={`${styles.flexGroup} ${styles.center} mt-12`}>
            <Link href="/features" className={styles.btnBento} style={{ maxWidth: '240px' }}>
              Lihat Semua Fitur <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
