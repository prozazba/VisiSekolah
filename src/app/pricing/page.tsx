import Navbar from '@/components/Navbar';
import styles from '../landing.module.scss';
import { Check, Shield, Zap, Award } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className={styles.pageSection}>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
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
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black">Rp 500rb</span>
                  <span className="text-sm opacity-50">/bln</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">Perfect for small learning centers.</p>
                <ul className="space-y-3 mb-8">
                  <Feature text="Hingga 200 Siswa" />
                  <Feature text="Absensi QR Code" />
                  <Feature text="Manajemen Nilai" />
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBento}>Get Started</Link>
            </div>

            {/* Professional Plan - Highlighted */}
            <div className={`${styles.bentoItem} ${styles['span-4']} ${styles.highlighted}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={styles.iconCircle}><Zap size={24} /></div>
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>
                </div>
                <h3 className={styles.bentoTitle}>Professional</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-blue-600">Rp 1.5jt</span>
                  <span className="text-sm opacity-50">/bln</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">Comprehensive solution for large schools.</p>
                <ul className="space-y-3 mb-8">
                  <Feature text="Hingga 1000 Siswa" />
                  <Feature text="Full White Label" />
                  <Feature text="Mobile Native App" />
                  <Feature text="LMS & Rapor Digital" />
                </ul>
              </div>
              <Link href="/contact" className={styles.btnBentoPrimary}>Select Plan</Link>
            </div>

            {/* Enterprise Plan */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.dark}`}><Award size={24} /></div>
                <h3 className={styles.bentoTitle}>Enterprise</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black">Custom</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">For large school foundations.</p>
                <ul className="space-y-3 mb-8">
                  <Feature text="Unlimited Siswa" />
                  <Feature text="Dedicated Support" />
                  <Feature text="Custom Integration" />
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

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
      <Check size={14} className="text-blue-500" /> {text}
    </li>
  );
}
