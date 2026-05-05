'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, dict } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo}>
          Visi<span className={styles.accent}>Sekolah</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/features" className={styles.navLink}>{dict.navbar.features}</Link>
          <Link href="/pricing" className={styles.navLink}>{dict.navbar.pricing}</Link>
          <Link href="/about" className={styles.navLink}>{dict.navbar.about}</Link>
          <Link href="/contact" className={styles.navLink}>{dict.navbar.contact}</Link>
          
          <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
          
          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className={`${styles.navLink} flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10`}
            style={{ fontSize: '0.75rem', fontWeight: 800 }}
          >
            <Globe size={14} /> {language === 'id' ? 'ID' : 'EN'}
          </button>

          <Link href="/login" className={styles.navLink}>{dict.navbar.login}</Link>
          <Link href="/register" className={styles.btnPrimary}>{dict.navbar.register}</Link>
        </div>
      </div>
    </nav>
  );
}
