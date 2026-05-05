import Navbar from '@/components/Navbar';
import styles from '../landing.module.scss';
import { Check, Shield, Zap, Award } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <span className={styles.pageTag}>Pricing Plans</span>
            <h1 className={styles.pageTitle}>Simple, Transparent Pricing.</h1>
            <p className={styles.pageSubtitle}>
              No hidden fees. Choose the best plan for your school's digital growth.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Starter Plan */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.slate}`}><Shield size={24} /></div>
                <h3 className={styles.bentoTitle}>Starter</h3>
                <div className={`${styles.flexGroup} items-baseline mb-4`} style={{ gap: '0.25rem' }}>
                  <span className="text-3xl font-black text-slate-900">Rp 500rb</span>
                  <span className="text-sm text-slate-400">/bln</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium">Perfect for small learning centers.</p>
                <ul className={styles.featureList}>
                  <li><Check size={14} className="text-blue-500" /> Hingga 200 Siswa</li>
                  <li><Check size={14} className="text-blue-500" /> Absensi QR Code</li>
                  <li><Check size={14} className="text-blue-500" /> Manajemen Nilai</li>
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBento}>Get Started</Link>
            </div>

            {/* Professional Plan - Highlighted */}
            <div className={`${styles.bentoItem} ${styles['span-4']} ${styles.highlighted}`}>
              <div>
                <div className={`${styles.flexGroup} ${styles.between} mb-4`}>
                  <div className={styles.iconCircle} style={{ marginBottom: 0 }}><Zap size={24} /></div>
                  <span className={styles.bentoBadge}>Most Popular</span>
                </div>
                <h3 className={styles.bentoTitle}>Professional</h3>
                <div className={`${styles.flexGroup} items-baseline mb-4`} style={{ gap: '0.25rem' }}>
                  <span className="text-3xl font-black text-blue-600">Rp 1.5jt</span>
                  <span className="text-sm text-slate-400">/bln</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium">Comprehensive solution for large schools.</p>
                <ul className={styles.featureList}>
                  <li><Check size={14} className="text-blue-500" /> Hingga 1000 Siswa</li>
                  <li><Check size={14} className="text-blue-500" /> Full White Label</li>
                  <li><Check size={14} className="text-blue-500" /> Mobile Native App</li>
                  <li><Check size={14} className="text-blue-500" /> LMS & Rapor Digital</li>
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBentoPrimary}>Select Plan</Link>
            </div>

            {/* Enterprise Plan */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.dark}`}><Award size={24} /></div>
                <h3 className={styles.bentoTitle}>Enterprise</h3>
                <div className={`${styles.flexGroup} items-baseline mb-4`} style={{ gap: '0.25rem' }}>
                  <span className="text-3xl font-black text-slate-900">Custom</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium">For large school foundations.</p>
                <ul className={styles.featureList}>
                  <li><Check size={14} className="text-blue-500" /> Unlimited Siswa</li>
                  <li><Check size={14} className="text-blue-500" /> Dedicated Support</li>
                  <li><Check size={14} className="text-blue-500" /> Custom Integration</li>
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBentoDark}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
