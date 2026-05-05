import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className={styles.pageBg}>
      <Navbar />
      <section className={`${styles.pageSection} ${styles.fullScreen} ${styles.flexGroup} ${styles.center}`}>
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h1 className={styles.pageTitle}>Register</h1>
          <p className={styles.pageSubtitle} style={{ margin: '0 auto 2rem' }}>
            Registration for new schools is currently handled directly by our sales team.
          </p>
          <Link href="/contact" className={styles.btnBentoPrimary}>
            Contact Sales
          </Link>
        </div>
      </section>
    </main>
  );
}
