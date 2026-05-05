'use client';

import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import { Heart, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { dict } = useLanguage();

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Refined Header */}
      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={`${styles.pageHeader} ${styles.left}`}>
            <span className={styles.pageTag}>{dict.about_page.tag}</span>
            <h1 className={styles.pageTitle}>{dict.about_page.title}</h1>
            <p className={styles.pageSubtitle}>
              {dict.about_page.subtitle}
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Vision - Primary Tile */}
            <div className={`${styles.bentoItem} ${styles['span-12']}`}>
              <div className={`${styles.flexGroup} items-center`} style={{ gap: '4rem' }}>
                <div style={{ flex: 1 }}>
                  <div className={styles.iconCircle}><Target size={28} /></div>
                  <h3 className={styles.bentoTitle}>{dict.about_page.vision.title}</h3>
                  <p className="text-2xl text-slate-600 leading-relaxed italic font-medium">
                    {dict.about_page.vision.desc}
                  </p>
                </div>
                <div style={{ flex: 1, height: '300px' }} className="bg-blue-50 rounded-3xl flex items-center justify-center">
                   <Target size={120} className="text-blue-200" />
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.red}`}><Heart size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.about_page.values.empathy.title}</h3>
                <p className={styles.bentoDesc}>{dict.about_page.values.empathy.desc}</p>
              </div>
            </div>

            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.purple}`}><Target size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.about_page.values.innovation.title}</h3>
                <p className={styles.bentoDesc}>{dict.about_page.values.innovation.desc}</p>
              </div>
            </div>

            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.amber}`}><Lightbulb size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.about_page.values.inspiration.title}</h3>
                <p className={styles.bentoDesc}>{dict.about_page.values.inspiration.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className={`${styles.sectionPadding} bg-white text-center`}>
        <div className={styles.container}>
          <h2 className={styles.pageTitle} style={{ fontSize: '2.5rem' }}>{dict.about_page.cta_title}</h2>
          <div className={`${styles.flexGroup} ${styles.center} mt-8`}>
            <Link href="/contact" className={styles.btnBentoPrimary} style={{ maxWidth: '300px' }}>
               {dict.about_page.cta_btn}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
