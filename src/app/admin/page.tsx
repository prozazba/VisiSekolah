import styles from '../../styles/admin.module.scss';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { LogOut, LayoutDashboard, School as SchoolIcon, CreditCard, Settings, Inbox } from 'lucide-react';
import prisma from '@/lib/prisma';
import AddSchoolButton from '@/components/AddSchoolButton';
import BlastButton from '@/components/BlastButton';

export default async function AdminDashboard() {
  const session = await verifySession();

  // Security Guard: Only SUPER_ADMIN can access this page
  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/login');
  }

  // Fetch real data from NeonDB
  const schools = await prisma.school.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Fetch users who could be school admins (no school assigned yet)
  const users = await prisma.user.findMany({
    where: { 
      schoolId: null,
      role: { not: 'SUPER_ADMIN' }
    },
    select: { id: true, name: true, email: true }
  });

  // Fetch registration inquiries awaiting activation
  const inquiries = await prisma.registrationInquiry.findMany({
    where: { 
      status: { in: ['PENDING', 'ACCEPTED'] } 
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalSchools = schools.length;
  const activeSchools = schools.filter(s => s.status === 'ACTIVE').length;
  const pendingSchools = schools.filter(s => s.status === 'PENDING').length;
  const suspendedSchools = schools.filter(s => s.status === 'SUSPENDED').length;
  const pendingInquiries = inquiries.length;

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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <BlastButton />
            <AddSchoolButton 
              users={users} 
              inquiries={inquiries.map(i => ({ 
                id: i.id, 
                email: i.email, 
                schoolName: i.schoolName || 'N/A',
                plan: i.plan, 
                status: i.status,
                createdAt: i.createdAt.toISOString() 
              }))} 
            />
          </div>
        </div>

        <div className={styles.statsGrid}>
          <StatCard title="Total Sekolah" value={totalSchools.toString()} color="#3b82f6" />
          <StatCard title="Sekolah Aktif" value={activeSchools.toString()} color="#10b981" />
          <StatCard title="Menunggu Approval" value={pendingSchools.toString()} color="#f59e0b" />
          <StatCard title="Suspended" value={suspendedSchools.toString()} color="#ef4444" />
          <StatCard title="Permintaan Masuk" value={pendingInquiries.toString()} color="#8b5cf6" />
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
              {schools.map((school) => (
                <SchoolRow 
                  key={school.id}
                  name={school.name} 
                  slug={school.slug} 
                  status={school.status} 
                  date={new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(school.createdAt)} 
                />
              ))}
              {schools.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                    Belum ada sekolah terdaftar.
                  </td>
                </tr>
              )}
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
  const badgeClass = `${styles.badge} ${styles[status.toLowerCase()] || styles.pending}`;

  return (
    <tr>
      <td className={styles.td}>
        <span className={styles.schoolName}>{name}</span>
      </td>
      <td className={styles.td}><code>visi-sekolah.vercel.app/{slug}/</code></td>
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
