'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, MessageCircle, Info, Share2 } from 'lucide-react';
import styles from '../styles/Footer.module.scss';
import packageJson from '../../package.json';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;
  const { dict } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              Visi<span>Sekolah</span>
            </div>
            <p className={styles.slogan}>
              {dict.footer.slogan}
            </p>
          </div>

          {/* Navigation Hub */}
          <div className={styles.navCol}>
            <h4>{dict.footer.platform}</h4>
            <ul>
              <li><Link href="/features">{dict.footer.links.features}</Link></li>
              <li><Link href="/pricing">{dict.footer.links.pricing}</Link></li>
              <li><Link href="/demo">{dict.footer.links.demo}</Link></li>
              <li><Link href="/register">{dict.footer.links.register}</Link></li>
            </ul>
          </div>

          <div className={styles.navCol}>
            <h4>{dict.footer.company}</h4>
            <ul>
              <li><Link href="/about">{dict.footer.links.about}</Link></li>
              <li><Link href="/contact">{dict.footer.links.contact}</Link></li>
              <li><Link href="/privacy">{dict.footer.links.privacy}</Link></li>
              <li><Link href="/terms">{dict.footer.links.terms}</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.contactCol}>
            <h4>{dict.footer.contact_us}</h4>
            <ul>
              <li>
                <Phone size={18} className={styles.icon} />
                <span>{dict.footer.contact_info.phone}</span>
              </li>
              <li>
                <Mail size={18} className={styles.icon} />
                <span>{dict.footer.contact_info.email}</span>
              </li>
              <li>
                <MapPin size={18} className={styles.icon} />
                <span>{dict.footer.contact_info.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>© {currentYear} VisiSekolah. {dict.footer.copyright}</span>
            <span className={styles.versionTag}>v{version}</span>
          </div>
          <div className={styles.socialLinks}>
            <Link href="#"><Globe size={20} /></Link>
            <Link href="#"><MessageCircle size={20} /></Link>
            <Link href="#"><Info size={20} /></Link>
            <Link href="#"><Share2 size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
