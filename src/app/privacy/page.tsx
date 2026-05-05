import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className={styles.pageBg}>
      <Navbar />
      <section className={`${styles.pageSection} ${styles.fullScreen}`}>
        <div className={styles.container}>
          <div className={`${styles.pageHeader} ${styles.left}`}>
            <span className={styles.pageTag}>Legal</span>
            <h1 className={styles.pageTitle}>Privacy Policy</h1>
            <p className={styles.pageSubtitle}>
              Last updated: May 2026
            </p>
          </div>
          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoItem} ${styles['span-12']}`}>
              <p className={styles.planDesc} style={{ color: 'white' }}>
                At VisiSekolah, we take the privacy of student and school data very seriously. Our complete privacy policy detailing GDPR and local compliance measures is currently being documented.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
