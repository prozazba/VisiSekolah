'use client';

import styles from '../../styles/admin.module.scss';
import { LayoutDashboard, Users, BookOpen, CreditCard, Settings, Bell } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { dict } = useLanguage();

  return (
    <div className={styles.mainContent}>
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>Dashboard Admin Sekolah</h2>
          <p className={styles.pageSubtitle}>Selamat datang di pusat manajemen sekolah Anda.</p>
        </div>
        <div className={styles.flexGroup} style={{ gap: '1rem' }}>
          <button className={styles.iconBtn}><Bell size={20} /></button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #3b82f6' }}>
          <p className={styles.statLabel}>Total Siswa</p>
          <h3 className={styles.statValue}>1,284</h3>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #10b981' }}>
          <p className={styles.statLabel}>Guru & Staf</p>
          <h3 className={styles.statValue}>86</h3>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
          <p className={styles.statLabel}>Kelas Aktif</p>
          <h3 className={styles.statValue}>42</h3>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #8b5cf6' }}>
          <p className={styles.statLabel}>Kehadiran Hari Ini</p>
          <h3 className={styles.statValue}>98.2%</h3>
        </div>
      </div>

      <div className={styles.dashboardGrid} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className={styles.schoolList}>
          <div className={styles.sectionHeader} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 800 }}>Aktivitas Terbaru</h3>
          </div>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.th}>Waktu</th>
                <th className={styles.th}>Aktivitas</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.td}>10:45</td>
                <td className={styles.td}>Input Nilai Matematika Kelas X-A</td>
                <td className={styles.td}><span style={{ color: '#10b981', fontWeight: 700 }}>Selesai</span></td>
              </tr>
              <tr>
                <td className={styles.td}>09:12</td>
                <td className={styles.td}>Absensi Guru Mata Pelajaran</td>
                <td className={styles.td}><span style={{ color: '#10b981', fontWeight: 700 }}>Selesai</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.schoolList}>
          <div className={styles.sectionHeader} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 800 }}>Pintasan</h3>
          </div>
          <div className={styles.flexGroup} style={{ flexDirection: 'column', gap: '10px' }}>
            <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'flex-start' }}><Users size={18} /> Kelola Siswa</button>
            <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'flex-start' }}><BookOpen size={18} /> Kurikulum</button>
            <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'flex-start' }}><CreditCard size={18} /> SPP & Keuangan</button>
            <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'flex-start' }}><Settings size={18} /> Pengaturan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
