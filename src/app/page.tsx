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

      {/* Features Grid */}
      <section id="features" className={`py-20 ${styles.bgSurface}`}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Fitur Unggulan</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Platform terlengkap untuk mendukung digitalisasi ekosistem pendidikan sekolah Anda.
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            <FeatureCard 
              icon={<Globe size={32} />} 
              title="White Label & Custom Branding" 
              description="Gunakan logo, nama aplikasi, dan warna identitas sekolah Anda sendiri untuk memperkuat brand." 
            />
            <FeatureCard 
              icon={<Shield size={32} />} 
              title="Keamanan Data Terjamin" 
              description="Sistem multi-tenant yang aman dengan enkripsi tingkat tinggi untuk data siswa dan guru." 
            />
            <FeatureCard 
              icon={<Smartphone size={32} />} 
              title="Aplikasi Mobile & Web" 
              description="Akses tanpa batas dari mana saja. Tersedia versi web responsif dan aplikasi mobile native." 
            />
            <FeatureCard 
              icon={<BookOpen size={32} />} 
              title="E-Learning Terintegrasi" 
              description="Manajemen tugas, materi, kuis otomatis, dan rapor digital dalam satu alur kerja." 
            />
            <FeatureCard 
              icon={<Users size={32} />} 
              title="Komunikasi Efektif" 
              description="Forum kelas interaktif, pengumuman broadcast, dan pesan langsung ke orang tua." 
            />
            <FeatureCard 
              icon={<CreditCard size={32} />} 
              title="Pembayaran Digital (SPP)" 
              description="Integrasi pembayaran otomatis melalui Virtual Account, E-Wallet, dan QRIS." 
            />
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
      <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
}
