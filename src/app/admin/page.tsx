import styles from '../../styles/admin.module.scss';

export default function AdminDashboard() {
  return (
    <div className={styles.adminDashboard}>
      <header className={styles.header}>
        <div className="container flex justify-between items-center">
          <h1>VisiSekolah <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>Super Admin</span></h1>
          <nav className="flex gap-4">
            <button>Dashboard</button>
            <button>Sekolah</button>
            <button>Billing</button>
            <button>Pengaturan</button>
          </nav>
        </div>
      </header>
      
      <main className="container py-10">
        <h2 className="mb-6">Manajemen Sekolah</h2>
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

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: `4px solid ${color}`, boxShadow: 'var(--shadow-sm)' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{value}</h3>
    </div>
  );
}

function SchoolRow({ name, slug, status, date }: { name: string, slug: string, status: string, date: string }) {
  return (
    <tr>
      <td className={styles.td}>{name}</td>
      <td className={styles.td}><code>{slug}</code></td>
      <td className={styles.td}>
        <span style={{ 
          padding: '0.25rem 0.5rem', 
          borderRadius: '9999px', 
          fontSize: '0.75rem', 
          fontWeight: 'bold',
          backgroundColor: status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
          color: status === 'ACTIVE' ? '#166534' : '#92400e'
        }}>
          {status}
        </span>
      </td>
      <td className={styles.td}>{date}</td>
      <td className={styles.td}>
        <button style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Edit</button>
      </td>
    </tr>
  );
}
