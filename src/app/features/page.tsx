'use client';

import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import { Globe, Shield, BookOpen, CreditCard, Smartphone, Users, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturesPage() {
  const { dict } = useLanguage();

  return (
    <main className={styles.pageBg}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={`${styles.pageHeader} ${styles.left}`}>
            <span className={styles.pageTag}>{dict.features_page.tag}</span>
            <h1 className={styles.pageTitle}>{dict.features_page.title}</h1>
            <p className={styles.pageSubtitle}>{dict.features_page.subtitle}</p>
          </div>

          <div className={styles.bentoGrid}>
            {/* White Label - Large */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={styles.iconCircle}><Globe size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.features_page.white_label.title}</h3>
                <p className={styles.bentoDesc}>{dict.features_page.white_label.desc}</p>
              </div>
              <div className={`${styles.bentoVisual} ${styles.blue}`}>
                <div className={styles.visualInner}>
                  <div className={styles.iconCircle} style={{ width: '48px', height: '48px' }}></div>
                  <div className={`${styles.flexGroup} ${styles.vertical}`} style={{ gap: '0.5rem' }}>
                    <div className={`${styles.skeletonLine} ${styles.long}`}></div>
                    <div className={`${styles.skeletonLine} ${styles.short}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.pink}`}><Shield size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.features_page.security.title}</h3>
                <p className={styles.bentoDesc}>{dict.features_page.security.desc}</p>
              </div>
              <div className={`${styles.flexGroup} ${styles.center}`} style={{ marginTop: '2rem' }}>
                <div className={`${styles.iconCircle} ${styles.pink}`} style={{ width: '100px', height: '100px', opacity: 0.1, marginBottom: 0 }}>
                  <Shield size={64} />
                </div>
              </div>
            </div>

            {/* LMS */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.purple}`}><BookOpen size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.features_page.lms.title}</h3>
                <p className={styles.bentoDesc}>{dict.features_page.lms.desc}</p>
              </div>
            </div>

            {/* Payments - Large */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.emerald}`}><CreditCard size={28} /></div>
                <h3 className={styles.bentoTitle}>{dict.features_page.payments.title}</h3>
                <p className={styles.bentoDesc}>{dict.features_page.payments.desc}</p>
              </div>
              <div className={`${styles.bentoVisual} ${styles.compact}`}>
                <div className={styles.innerGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', width: '80%', margin: '0 auto' }}>
                  <div className={styles.skeletonLine} style={{ height: '48px', background: 'rgba(16, 185, 129, 0.10)' }}></div>
                  <div className={styles.skeletonLine} style={{ height: '48px', background: 'rgba(16, 185, 129, 0.05)' }}></div>
                  <div className={styles.skeletonLine} style={{ height: '48px', background: 'rgba(16, 185, 129, 0.05)' }}></div>
                </div>
              </div>
            </div>

            {/* Small tiles */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.amber}`}><Smartphone size={24} /></div>
              <h4 className={styles.bentoTitle} style={{ fontSize: '1.25rem' }}>{dict.features_page.mobile.title}</h4>
              <p className={styles.bentoDesc}>{dict.features_page.mobile.desc}</p>
            </div>

            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.sky}`}><Users size={24} /></div>
              <h4 className={styles.bentoTitle} style={{ fontSize: '1.25rem' }}>{dict.features_page.parent_portal.title}</h4>
              <p className={styles.bentoDesc}>{dict.features_page.parent_portal.desc}</p>
            </div>

            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.red}`}><BarChart3 size={24} /></div>
              <h4 className={styles.bentoTitle} style={{ fontSize: '1.25rem' }}>{dict.features_page.analytics.title}</h4>
              <p className={styles.bentoDesc}>{dict.features_page.analytics.desc}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
