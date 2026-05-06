import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import RegistrationForm from '@/components/RegistrationForm';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <main className={styles.pageBg}>
      <Navbar />
      <section className={`${styles.pageSection} ${styles.container}`}>
        <Suspense fallback={<div>Loading form...</div>}>
          <RegistrationForm />
        </Suspense>
      </section>
    </main>
  );
}
