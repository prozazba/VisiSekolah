'use client';

import { useState } from 'react';
import styles from '../../../styles/admin.module.scss';
import { Palette, Image as ImageIcon, Layout, Save, Check, RefreshCcw } from 'lucide-react';

export default function BrandingSetupPage() {
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [secondaryColor, setSecondaryColor] = useState('#334155');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>Konfigurasi & Branding Sekolah</h2>
          <p className={styles.pageSubtitle}>Sesuaikan identitas visual platform sekolah Anda.</p>
        </div>
      </div>

      <div className={styles.brandingWrapper}>
        <div className={styles.brandingForm}>
          {/* Colors Section */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircle}><Palette size={20} /></div>
              <h3>Warna Identitas</h3>
            </div>
            
            <div className={styles.colorGrid}>
              <div className={styles.formGroup}>
                <label>Warna Utama</label>
                <div className={styles.colorInputWrapper}>
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                  />
                  <code>{primaryColor}</code>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Warna Sekunder</label>
                <div className={styles.colorInputWrapper}>
                  <input 
                    type="color" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                  />
                  <code>{secondaryColor}</code>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Warna Aksen</label>
                <div className={styles.colorInputWrapper}>
                  <input 
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)} 
                  />
                  <code>{accentColor}</code>
                </div>
              </div>
            </div>
          </section>

          {/* Logo Section */}
          <section className={styles.formSection} style={{ marginTop: '3rem' }}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircle} style={{ background: '#ecfdf5', color: '#10b981' }}>
                <ImageIcon size={20} />
              </div>
              <h3>Logo & Aset Visual</h3>
            </div>

            <div className={styles.uploadGrid}>
              <div className={styles.uploadCard}>
                <div className={styles.uploadPlaceholder}>
                  <ImageIcon size={40} />
                  <span>Klik untuk Upload Logo</span>
                </div>
                <div className={styles.uploadLabel}>Logo Sekolah (PNG/SVG)</div>
              </div>
              <div className={styles.uploadCard}>
                <div className={styles.uploadPlaceholder}>
                  <Layout size={40} />
                  <span>Klik untuk Upload Favicon</span>
                </div>
                <div className={styles.uploadLabel}>Favicon (ICO/PNG)</div>
              </div>
            </div>
          </section>

          <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
            <button 
              className={styles.btnPrimary} 
              style={{ width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <RefreshCcw className={styles.spin} size={18} /> : isSaved ? <Check size={18} /> : <Save size={18} />}
              {isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className={styles.previewSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconCircle} style={{ background: '#fef3c7', color: '#f59e0b' }}>
              <Layout size={20} />
            </div>
            <h3>Live Preview</h3>
          </div>
          
          <div className={styles.previewCard}>
            <div className={styles.previewHeader} style={{ background: primaryColor }}>
              <div className={styles.previewLogo}>V</div>
              <div className={styles.previewNav}>
                <div className={styles.navDot} />
                <div className={styles.navDot} />
                <div className={styles.navDot} />
              </div>
            </div>
            <div className={styles.previewHero}>
              <h4 style={{ color: secondaryColor }}>Selamat Datang di Portal</h4>
              <h5>SMA VisiSekolah</h5>
              <button style={{ background: accentColor }}>Masuk Sekarang</button>
            </div>
            <div className={styles.previewContent}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} style={{ width: '80%' }} />
              <div className={styles.skeletonLine} style={{ width: '60%' }} />
            </div>
          </div>
          <p className={styles.previewNote}>* Ini adalah gambaran bagaimana branding akan terlihat di halaman login sekolah Anda.</p>
        </div>
      </div>

      {isSaved && (
        <div className={styles.successMsg} style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
          <Check size={18} /> Konfigurasi branding telah berhasil diperbarui!
        </div>
      )}
    </div>
  );
}
