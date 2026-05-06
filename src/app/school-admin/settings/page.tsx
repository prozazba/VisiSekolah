import styles from '@/styles/admin.module.scss';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import BrandingForm from '@/components/BrandingForm';
import { Settings, Globe, ShieldCheck } from 'lucide-react';

export default async function SchoolSettingsPage() {
  const session = await verifySession();

  if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
    redirect('/login');
  }

  const school = await prisma.school.findUnique({
    where: { id: session.schoolId }
  });

  if (!school) {
    redirect('/login');
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandGroup}>
            <div className={styles.logoBadge} style={{ background: school.primaryColor }}>{school.name[0]}</div>
            <h1>{school.name} <span style={{ fontWeight: 'normal', fontSize: '1rem', opacity: 0.5 }}>School Admin</span></h1>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.pageHead}>
          <div>
            <h2 className={styles.pageTitle}>Pengaturan Sekolah</h2>
            <p className={styles.pageSubtitle}>Sesuaikan identitas dan branding sekolah Anda.</p>
          </div>
        </div>

        <div className={styles.brandingWrapper}>
          <BrandingForm 
            initialData={{
              name: school.name,
              primaryColor: school.primaryColor,
              secondaryColor: school.secondaryColor,
              accentColor: school.accentColor,
            }} 
          />
        </div>

        <div className={styles.settingsGrid} style={{ marginTop: '2.5rem' }}>
          <div className={styles.statCard}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className={styles.iconCircle}><Globe size={18} /></div>
              <div>
                <p className={styles.statLabel}>Domain Utama</p>
                <h3 className={styles.statValue} style={{ fontSize: '1.25rem' }}>{school.slug}.visisekolah.id</h3>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className={styles.iconCircle}><ShieldCheck size={18} /></div>
              <div>
                <p className={styles.statLabel}>Status Layanan</p>
                <h3 className={styles.statValue} style={{ fontSize: '1.25rem' }}>{school.status}</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
