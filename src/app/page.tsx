import Link from 'next/link';
import { Shield, BookOpen, Users, Smartphone, Globe, CreditCard } from 'lucide-react';
import styles from './landing.module.scss';

export default function Home() {
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <nav className="flex justify-between items-center py-6">
            <div className="logo">
              <h1 style={{ fontSize: '1.5rem' }}>Visi<span style={{ color: 'var(--accent-color)' }}>Sekolah</span></h1>
            </div>
            <div className="nav-links flex gap-6">
              <Link href="#features">Fitur</Link>
              <Link href="#about">Tentang</Link>
              <Link href="/login" className={styles.btnPrimary}>Masuk</Link>
            </div>
          </nav>

          <div className="hero-content text-center py-20">
            <h1 className={styles.heroTitle}>Solusi White Label Aplikasi Sekolah Terpadu</h1>
            <p className={styles.heroSubtitle}>
              Bangun ekosistem digital sekolah Anda dengan branding sendiri. Satu platform untuk semua kebutuhan administrasi, pembelajaran, dan komunikasi.
            </p>
            <div className="flex justify-center gap-4 mt-10">
              <Link href="/register" className={styles.btnLarge}>Mulai Sekarang</Link>
              <Link href="#demo" className={styles.btnOutline}>Lihat Demo</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className={`py-20 ${styles.bgSurface}`}>
        <div className="container">
          <h2 className="text-center mb-12">Fitur Unggulan</h2>
          <div className={styles.featuresGrid}>
            <FeatureCard 
              icon={<Globe size={32} />} 
              title="White Label & Custom Branding" 
              description="Gunakan logo, nama aplikasi, dan warna identitas sekolah Anda sendiri." 
            />
            <FeatureCard 
              icon={<Shield size={32} />} 
              title="Keamanan Data Terjamin" 
              description="Sistem multi-tenant yang aman dengan enkripsi data siswa dan guru." 
            />
            <FeatureCard 
              icon={<Smartphone size={32} />} 
              title="Aplikasi Mobile & Web" 
              description="Akses dari mana saja. Tersedia versi web responsif dan aplikasi mobile." 
            />
            <FeatureCard 
              icon={<BookOpen size={32} />} 
              title="E-Learning Terintegrasi" 
              description="Manajemen tugas, materi, kuis, dan rapor digital dalam satu tempat." 
            />
            <FeatureCard 
              icon={<Users size={32} />} 
              title="Komunikasi Efektif" 
              description="Forum kelas, pengumuman broadcast, dan pesan langsung ke orang tua." 
            />
            <FeatureCard 
              icon={<CreditCard size={32} />} 
              title="Pembayaran Digital (SPP)" 
              description="Integrasi pembayaran otomatis melalui Virtual Account dan E-Wallet." 
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
      <p style={{ marginTop: '0.5rem' }}>{description}</p>
    </div>
  );
}
