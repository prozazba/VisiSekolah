import styles from '../../styles/admin.module.scss';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { LogOut, LayoutDashboard, School as SchoolIcon, CreditCard, Settings } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await verifySession();

  // Security Guard: Only SUPER_ADMIN can access this page
  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/login');
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandGroup}>
            <div className={styles.logoBadge}>V</div>
            <h1>VisiSekolah <span style={{ fontWeight: 'normal', fontSize: '1rem', opacity: 0.5 }}>Super Admin</span></h1>
          </div>

          <nav className={styles.nav}>
            <button className={`${styles.navItem} ${styles.active}`}><LayoutDashboard size={18} /> Dashboard</button>
            <button className={styles.navItem}><SchoolIcon size={18} /> Sekolah</button>
            <button className={styles.navItem}><CreditCard size={18} /> Billing</button>
            <button className={styles.navItem}><Settings size={18} /> Pengaturan</button>

            <form action={logout} className={styles.logoutForm}>
              <button type="submit" className={styles.logoutBtn}>
                <LogOut size={18} /> Keluar
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.pageHead}>
          <div>
            <h2 className={styles.pageTitle}>Manajemen Sekolah</h2>
            <p className={styles.pageSubtitle}>Kelola seluruh tenant dan ekosistem VisiSekolah.</p>
          </div>
          <button className={styles.btnPrimary}>+ Tambah Sekolah Baru</button>
        </div>

        <div className={styles.statsGrid}>
          <StatCard title="Total Sekolah" value="128" color="#3b82f6" />
          <StatCard title="Sekolah Aktif" value="112" color="#10b981" />
          <StatCard title="Menunggu Approval" value="12" color="#f59e0b" />
          <StatCard title="Suspended" value="4" color="#ef4444" />
        </div>

        <div className={styles.schoolList}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.th}>Nama Sekolah</th>
                <th className={styles.th}>Slug</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Tgl Terdaftar</th>
                <th className={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <SchoolRow name="SMP Negeri 1 Jakarta" slug="smp1" status="ACTIVE" date="12 Apr 2024" />
              <SchoolRow name="SMA Negeri 5 Bandung" slug="sma5" status="ACTIVE" date="15 Apr 2024" />
              <SchoolRow name="SD Al-Azhar 1" slug="sd-alazhar1" status="PENDING" date="20 Apr 2024" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className={styles.statCard} style={{ borderLeft: `4px solid ${color}` }}>
      <p className={styles.statLabel}>{title}</p>
      <h3 className={styles.statValue}>{value}</h3>
    </div>
  );
}

function SchoolRow({ name, slug, status, date }: { name: string; slug: string; status: string; date: string }) {
  const badgeClass = status === 'ACTIVE'
    ? `${styles.badge} ${styles.active}`
    : `${styles.badge} ${styles.pending}`;

  return (
    <tr>
      <td className={styles.td}>
        <span className={styles.schoolName}>{name}</span>
      </td>
      <td className={styles.td}><code>{slug}.visisekolah.id</code></td>
      <td className={styles.td}>
        <span className={badgeClass}>{status}</span>
      </td>
      <td className={styles.td}>{date}</td>
      <td className={styles.td}>
        <button className={styles.actionBtn}>Kelola</button>
      </td>
    </tr>
  );
}
