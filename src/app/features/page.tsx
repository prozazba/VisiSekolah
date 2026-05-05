import Navbar from '@/components/Navbar';
import styles from '../landing.module.scss';
import { Globe, Shield, BookOpen, CreditCard, Zap, Smartphone, Users, BarChart3 } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className={styles.pageSection}>
        <div className="container">
          <div className="max-w-3xl mb-16">
            <span className={styles.pageTag}>Product Features</span>
            <h1 className={styles.pageTitle}>Everything you need to run your school.</h1>
            <p className={styles.pageSubtitle}>
              Powerful tools designed for administrators, teachers, and parents to create a seamless educational experience.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Primary Feature - Large */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={styles.iconCircle}><Globe size={28} /></div>
                <h3 className={styles.bentoTitle}>White Label Branding</h3>
                <p className={styles.bentoDesc}>Your school's identity, everywhere. Custom domain, logo, and mobile apps fully branded under your name.</p>
              </div>
              <div className={`${styles.bentoVisual} ${styles.blue}`}>
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-slate-200 rounded"></div>
                    <div className="h-2 w-20 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Feature */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.pink}`}><Shield size={28} /></div>
                <h3 className={styles.bentoTitle}>Security</h3>
                <p className={styles.bentoDesc}>Enterprise-grade data protection for your students.</p>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="p-6 bg-pink-50 rounded-full">
                  <Shield size={64} className="text-pink-500" />
                </div>
              </div>
            </div>

            {/* Learning Feature */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.purple}`}><BookOpen size={28} /></div>
                <h3 className={styles.bentoTitle}>LMS & Rapor</h3>
                <p className={styles.bentoDesc}>Digital curriculum and automated grading.</p>
              </div>
            </div>

            {/* Financial Feature */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.emerald}`}><CreditCard size={28} /></div>
                <h3 className={styles.bentoTitle}>Automated Payments</h3>
                <p className={styles.bentoDesc}>Integrate Virtual Accounts and QRIS for SPP payments. Real-time reconciliation and parent notifications.</p>
              </div>
              <div className={`${styles.bentoVisual} ${styles.compact}`}>
                <div className="flex gap-4">
                  <div className="w-20 h-12 bg-emerald-100 rounded-lg border border-emerald-200"></div>
                  <div className="w-20 h-12 bg-emerald-50 rounded-lg border border-emerald-100"></div>
                  <div className="w-20 h-12 bg-emerald-50 rounded-lg border border-emerald-100"></div>
                </div>
              </div>
            </div>

            {/* Small Grid Items */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.amber}`}><Smartphone size={24} /></div>
              <h4 className="font-bold text-lg mb-2">Mobile Native</h4>
              <p className="text-sm text-slate-500">Android & iOS dedicated apps.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.sky}`}><Users size={24} /></div>
              <h4 className="font-bold text-lg mb-2">Parent Portal</h4>
              <p className="text-sm text-slate-500">Real-time student progress tracking.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.red}`}><BarChart3 size={24} /></div>
              <h4 className="font-bold text-lg mb-2">Analytics</h4>
              <p className="text-sm text-slate-500">Data-driven school insights.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
