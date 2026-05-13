'use client';

import styles from '@/styles/dashboard-v2.module.scss';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  LogOut,
  Palette,
  BookOpen,
  Calendar,
  Megaphone
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { icon: <LayoutDashboard size={24} />, href: '/admin', label: 'Dashboard' },
    { icon: <Palette size={24} />, href: '/admin/branding', label: 'Branding' },
    { icon: <Users size={24} />, href: '/admin/users', label: 'Users' },
    { icon: <BookOpen size={24} />, href: '/admin/academic', label: 'Academic' },
    { icon: <FileText size={24} />, href: '/admin/cms', label: 'CMS Content' },
    { icon: <Calendar size={24} />, href: '/admin/calendar', label: 'Calendar' },
    { icon: <Megaphone size={24} />, href: '/admin/announcements', label: 'Announcements' },
    { icon: <Settings size={24} />, href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      {/* Shared Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>V</Link>
        
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`${styles.navIcon} ${pathname === item.href ? styles.active : ''}`}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
        
        <div style={{ flex: 1 }}></div>
        
        <button onClick={() => logout()} className={styles.navIcon} style={{ background: 'none', border: 'none' }}>
          <LogOut size={24} />
        </button>
      </aside>

      {/* Main Page Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
