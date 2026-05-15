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
  Megaphone,
  Languages
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { language, setLanguage, dict } = useLanguage();

  const navItems = [
    { icon: <LayoutDashboard size={24} />, href: '/admin', label: dict.admin.dashboard },
    { icon: <Palette size={24} />, href: '/admin/branding', label: dict.admin.branding },
    { icon: <Users size={24} />, href: '/admin/users', label: dict.admin.users },
    { icon: <BookOpen size={24} />, href: '/admin/academic', label: dict.admin.academic },
    { icon: <FileText size={24} />, href: '/admin/cms', label: dict.admin.cms },
    { icon: <Calendar size={24} />, href: '/admin/calendar', label: dict.admin.calendar },
    { icon: <Megaphone size={24} />, href: '/admin/announcements', label: dict.admin.announcements },
    { icon: <Settings size={24} />, href: '/admin/settings', label: dict.admin.settings },
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
        
        <button 
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} 
          className={styles.navIcon} 
          style={{ background: 'none', border: 'none', marginBottom: '10px' }}
          title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <div style={{ fontSize: '10px', fontWeight: 'bold', position: 'absolute', top: '5px', right: '5px' }}>
            {language.toUpperCase()}
          </div>
          <Languages size={24} />
        </button>

        <button onClick={() => logout()} className={styles.navIcon} style={{ background: 'none', border: 'none' }} title={dict.admin.logout}>
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
