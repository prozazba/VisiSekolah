'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authRole, setAuthRole] = useState<string | null>(null);
  const { language, setLanguage, dict, branding } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check auth status
    import('@/app/actions/auth').then(({ checkAuthStatus }) => {
      checkAuthStatus().then((session) => {
        if (session && session.isAuth) {
          setIsAuthenticated(true);
          setAuthRole(session.role);
        }
      });
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt="Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          )}
          {branding.name}
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/features" className={styles.navLink}>{dict.navbar.features}</Link>
          <Link href="/about" className={styles.navLink}>{dict.navbar.about}</Link>
          <Link href="/contact" className={styles.navLink}>{dict.navbar.contact}</Link>
          
          <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
          
          {/* Language Switcher Removed to enforce ID locale */}

          {isAuthenticated ? (
            <Link 
              href={authRole === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} 
              className={styles.btnPrimary}
            >
              {dict.admin?.dashboard || 'Dashboard'}
            </Link>
          ) : (
            <Link href="/login" className={styles.btnPrimary}>{dict.navbar.login}</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
