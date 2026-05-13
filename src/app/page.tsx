'use client';

import Link from 'next/link';
import { Shield, BookOpen, Users, Globe, CreditCard, ChevronRight } from 'lucide-react';
import styles from '../styles/landing.module.scss';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { dict, branding } = useLanguage();

  // Helper to replace "SMA VisiSekolah" with the actual branding name
  const brandify = (text: string) => text.replace(/SMA VisiSekolah/g, branding.name);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Full-Screen Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{brandify(dict.hero.title)}</h1>
          <p className={styles.heroSubtitle}>
            {brandify(dict.hero.subtitle)}
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/contact" className={styles.btnLarge}>{dict.hero.cta_start}</Link>
            <Link href="/features" className={styles.btnOutline}>{dict.hero.cta_features}</Link>
          </div>
        </div>
      </section>

      {/* Bento Features Section - FULLY LOCALIZED */}
      <section id="features" className={`${styles.sectionPadding} bg-slate-50`}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>{brandify(dict.home_features.title)}</h2>
            <p className={styles.pageSubtitle}>{dict.home_features.subtitle}</p>
          </div>
          
          <div className={styles.bentoGrid}>
            {/* White Label Item */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={styles.iconCircle}><Globe size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.home_features.white_label.title}</h3>
                <p className={styles.bentoDesc}>{dict.home_features.white_label.desc}</p>
              </div>
            </div>

            {/* LMS Item */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.purple}`}><BookOpen size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.home_features.lms.title}</h3>
                <p className={styles.bentoDesc}>{dict.home_features.lms.desc}</p>
              </div>
            </div>

            {/* Payments Item */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.emerald}`}><CreditCard size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.home_features.payments.title}</h3>
                <p className={styles.bentoDesc}>{dict.home_features.payments.desc}</p>
              </div>
            </div>

            {/* Parent Portal Item */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={styles.iconCircle}><Users size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.home_features.parent_portal.title}</h3>
                <p className={styles.bentoDesc}>{dict.home_features.parent_portal.desc}</p>
              </div>
            </div>
          </div>
          
          <div className={`${styles.flexGroup} ${styles.center} mt-12`}>
            <Link href="/features" className={styles.btnBento} style={{ maxWidth: '240px' }}>
              {dict.home_features.view_all} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
