import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <main className={styles.pageBg}>
      <Navbar />
      <section className={`${styles.pageSection} ${styles.fullScreen} ${styles.flexGroup} ${styles.center}`}>
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h1 className={styles.pageTitle}>Interactive Demo</h1>
          <p className={styles.pageSubtitle} style={{ margin: '0 auto 2rem' }}>
            Schedule a guided walkthrough of our Super Admin and School Management dashboards.
          </p>
          <Link href="/contact" className={styles.btnBentoPrimary}>
            Request Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
