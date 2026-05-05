import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, MessageCircle, Info, Share2 } from 'lucide-react';
import styles from '../styles/Footer.module.scss';
import packageJson from '../../package.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

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
              Mendigitalisasi Pendidikan Indonesia melalui platform white-label terpadu untuk sekolah masa depan.
            </p>
          </div>

          {/* Navigation Hub */}
          <div className={styles.navCol}>
            <h4>Platform</h4>
            <ul>
              <li><Link href="/features">Fitur Utama</Link></li>
              <li><Link href="/pricing">Paket Harga</Link></li>
              <li><Link href="/demo">Demo Platform</Link></li>
              <li><Link href="/register">Pendaftaran</Link></li>
            </ul>
          </div>

          <div className={styles.navCol}>
            <h4>Perusahaan</h4>
            <ul>
              <li><Link href="/about">Tentang Kami</Link></li>
              <li><Link href="/contact">Hubungi Kami</Link></li>
              <li><Link href="/privacy">Privasi</Link></li>
              <li><Link href="/terms">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.contactCol}>
            <h4>Hubungi Kami</h4>
            <ul>
              <li>
                <Phone size={18} className={styles.icon} />
                <span>+62 812 3456 7890</span>
              </li>
              <li>
                <Mail size={18} className={styles.icon} />
                <span>info@visisekolah.id</span>
              </li>
              <li>
                <MapPin size={18} className={styles.icon} />
                <span>Digital Hub BSD, Tangerang, Banten</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>© {currentYear} VisiSekolah. Semua Hak Dilindungi.</span>
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
