import Navbar from '@/components/Navbar';
import styles from '../landing.module.scss';
import { Globe, Shield, BookOpen, CreditCard, Smartphone, Users, BarChart3 } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={`${styles.pageHeader} ${styles.left}`}>
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
                <div className={`${styles.iconCircle}`}><Globe size={28} /></div>
                <h3 className={styles.bentoTitle}>White Label Branding</h3>
                <p className={styles.bentoDesc}>Your school's identity, everywhere. Custom domain, logo, and mobile apps fully branded under your name.</p>
              </div>
              <div className={`${styles.bentoVisual} ${styles.blue}`}>
                <div className={styles.visualInner}>
                  <div className={`${styles.iconCircle} mb-0`} style={{ width: '48px', height: '48px' }}></div>
                  <div className={`${styles.flexGroup} ${styles.vertical}`} style={{ gap: '0.5rem' }}>
                    <div className={`${styles.skeletonLine} ${styles.long}`}></div>
                    <div className={`${styles.skeletonLine} ${styles.short}`}></div>
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
              <div className={`${styles.flexGroup} ${styles.center} mt-8`}>
                <div className={`${styles.iconCircle} ${styles.pink}`} style={{ width: '100px', height: '100px', opacity: 0.1, marginBottom: 0 }}>
                  <Shield size={64} />
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
                <div className={styles.innerGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)', width: '80%', margin: '0 auto' }}>
                  <div className={`${styles.skeletonLine} w-full`} style={{ height: '48px', background: 'rgba(16, 185, 129, 0.1)' }}></div>
                  <div className={`${styles.skeletonLine} w-full`} style={{ height: '48px', background: 'rgba(16, 185, 129, 0.05)' }}></div>
                  <div className={`${styles.skeletonLine} w-full`} style={{ height: '48px', background: 'rgba(16, 185, 129, 0.05)' }}></div>
                </div>
              </div>
            </div>

            {/* Small Grid Items */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.amber}`}><Smartphone size={24} /></div>
              <h4 className={styles.bentoTitle} style={{ fontSize: '1.25rem' }}>Mobile Native</h4>
              <p className={styles.bentoDesc}>Android & iOS dedicated apps.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.sky}`}><Users size={24} /></div>
              <h4 className={styles.bentoTitle} style={{ fontSize: '1.25rem' }}>Parent Portal</h4>
              <p className={styles.bentoDesc}>Real-time student progress tracking.</p>
            </div>
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div className={`${styles.iconCircle} ${styles.red}`}><BarChart3 size={24} /></div>
              <h4 className={styles.bentoTitle} style={{ fontSize: '1.25rem' }}>Analytics</h4>
              <p className={styles.bentoDesc}>Data-driven school insights.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
