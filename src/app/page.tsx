"use client";
import Link from 'next/link';
import { Shield, BookOpen, Users, Smartphone, Globe, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <nav className="flex justify-between items-center py-6">
            <div className="logo">
              <h1 style={{ fontSize: '1.5rem' }}>Visi<span style={{ color: 'var(--accent-color)' }}>Sekolah</span></h1>
            </div>
            <div className="nav-links flex gap-6">
              <Link href="#features">Fitur</Link>
              <Link href="#about">Tentang</Link>
              <Link href="/login" className="btn-primary">Masuk</Link>
            </div>
          </nav>

          <div className="hero-content text-center py-20">
            <h1 className="hero-title">Solusi White Label Aplikasi Sekolah Terpadu</h1>
            <p className="hero-subtitle">
              Bangun ekosistem digital sekolah Anda dengan branding sendiri. Satu platform untuk semua kebutuhan administrasi, pembelajaran, dan komunikasi.
            </p>
            <div className="flex justify-center gap-4 mt-10">
              <Link href="/register" className="btn-large">Mulai Sekarang</Link>
              <Link href="#demo" className="btn-outline">Lihat Demo</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-surface">
        <div className="container">
          <h2 className="text-center mb-12">Fitur Unggulan</h2>
          <div className="features-grid">
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

      <style jsx global>{`
        .hero {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 80vh;
        }
        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(to right, var(--primary-color), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .btn-large {
          background-color: var(--accent-color);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
          font-size: 1.1rem;
          transition: transform 0.2s;
        }
        .btn-large:hover {
          transform: translateY(-2px);
        }
        .btn-outline {
          border: 2px solid var(--primary-color);
          padding: 1rem 2.5rem;
          border-radius: var(--radius-lg);
          font-weight: 700;
        }
        .bg-surface {
          background-color: var(--surface-color);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        .icon-wrapper {
          color: var(--accent-color);
          margin-bottom: 1.5rem;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }
      `}</style>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="feature-card">
      <div className="icon-wrapper">{icon}</div>
      <h3>{title}</h3>
      <p style={{ marginTop: '0.5rem' }}>{description}</p>
    </div>
  );
}
