import Link from 'next/link';
import { Shield, BookOpen, Users, Smartphone, Globe, CreditCard } from 'lucide-react';
import styles from './landing.module.scss';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="landing-page">
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
            <Link href="#demo" className={styles.btnOutline}>View Demo</Link>
          </div>
        </div>
      </section>

      {/* Bento Features Section */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Solusi Digital Terpadu</h2>
            <p className="text-xl text-slate-500">Satu platform untuk seluruh ekosistem sekolah Anda.</p>
          </div>
          
          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div className={styles.iconCircle}><Globe size={28} /></div>
              <h3 className={styles.bentoTitle}>White Label & Branding</h3>
              <p className={styles.bentoDesc}>Identitas sekolah Anda di mana saja. Domain kustom, logo, dan aplikasi mobile dengan branding sendiri.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.purple}`}><BookOpen size={28} /></div>
              <h3 className={styles.bentoTitle}>LMS Digital</h3>
              <p className={styles.bentoDesc}>Manajemen pembelajaran modern untuk guru dan siswa.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.emerald}`}><CreditCard size={28} /></div>
              <h3 className={styles.bentoTitle}>SPP Otomatis</h3>
              <p className={styles.bentoDesc}>Sistem pembayaran terintegrasi VA & QRIS.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div className={`${styles.iconCircle} ${styles.sky}`}><Users size={28} /></div>
              <h3 className={styles.bentoTitle}>Portal Orang Tua</h3>
              <p className={styles.bentoDesc}>Pantau kehadiran dan nilai anak secara real-time langsung dari smartphone.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/features" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-2">
              Lihat Semua Fitur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3>{title}</h3>
      <p className={styles.featureCardDesc}>{description}</p>
    </div>
  );
}
