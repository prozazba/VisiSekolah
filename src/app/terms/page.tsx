import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className={styles.pageBg}>
      <Navbar />
      <section className={`${styles.pageSection} ${styles.fullScreen}`}>
        <div className={styles.container}>
          <div className={`${styles.pageHeader} ${styles.left}`}>
            <span className={styles.pageTag}>Legal</span>
            <h1 className={styles.pageTitle}>Terms & Conditions</h1>
            <p className={styles.pageSubtitle}>
              Last updated: May 2026
            </p>
          </div>
          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoItem} ${styles['span-12']}`}>
              <p className={styles.planDesc} style={{ color: 'white' }}>
                Our full Terms and Conditions are currently being updated. Please contact support for any specific inquiries regarding platform usage rights and school tenant obligations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
