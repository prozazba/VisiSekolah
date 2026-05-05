'use client';

import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import { Check, Shield, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PricingPage() {
  const { dict } = useLanguage();
  const p = dict.pricing_page;

  return (
    <main className={styles.pageBg}>
      <Navbar />

      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <span className={styles.pageTag}>{p.tag}</span>
            <h1 className={styles.pageTitle}>{p.title}</h1>
            <p className={styles.pageSubtitle}>{p.subtitle}</p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Starter Plan */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.slate}`}><Shield size={24} /></div>
                <h3 className={styles.bentoTitle}>{p.starter.name}</h3>
                <div className={`${styles.priceLine}`}>
                  <span className={styles.priceAmount}>Rp 500rb</span>
                  <span className={styles.pricePer}>{p.per_month}</span>
                </div>
                <p className={styles.planDesc}>{p.starter.desc}</p>
                <ul className={styles.featureList}>
                  <li><Check size={14} /> {p.starter.f1}</li>
                  <li><Check size={14} /> {p.starter.f2}</li>
                  <li><Check size={14} /> {p.starter.f3}</li>
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBento}>{p.starter.cta}</Link>
            </div>

            {/* Professional Plan — Highlighted */}
            <div className={`${styles.bentoItem} ${styles['span-4']} ${styles.highlighted}`}>
              <div>
                <div className={`${styles.flexGroup} ${styles.between}`} style={{ marginBottom: '1rem' }}>
                  <div className={styles.iconCircle} style={{ marginBottom: 0 }}><Zap size={24} /></div>
                  <span className={styles.bentoBadge}>{p.most_popular}</span>
                </div>
                <h3 className={styles.bentoTitle}>{p.pro.name}</h3>
                <div className={styles.priceLine}>
                  <span className={styles.priceAmount} style={{ color: '#2563eb' }}>Rp 1.5jt</span>
                  <span className={styles.pricePer}>{p.per_month}</span>
                </div>
                <p className={styles.planDesc}>{p.pro.desc}</p>
                <ul className={styles.featureList}>
                  <li><Check size={14} /> {p.pro.f1}</li>
                  <li><Check size={14} /> {p.pro.f2}</li>
                  <li><Check size={14} /> {p.pro.f3}</li>
                  <li><Check size={14} /> {p.pro.f4}</li>
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBentoPrimary}>{p.pro.cta}</Link>
            </div>

            {/* Enterprise Plan */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.dark}`}><Award size={24} /></div>
                <h3 className={styles.bentoTitle}>{p.enterprise.name}</h3>
                <div className={styles.priceLine}>
                  <span className={styles.priceAmount}>Custom</span>
                </div>
                <p className={styles.planDesc}>{p.enterprise.desc}</p>
                <ul className={styles.featureList}>
                  <li><Check size={14} /> {p.enterprise.f1}</li>
                  <li><Check size={14} /> {p.enterprise.f2}</li>
                  <li><Check size={14} /> {p.enterprise.f3}</li>
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBentoDark}>{p.enterprise.cta}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
