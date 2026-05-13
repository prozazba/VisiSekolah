'use client';

import { useState } from 'react';
import styles from '../styles/admin.module.scss';
import { updateBranding } from '@/app/actions/branding';
import { Palette, Globe, Check } from 'lucide-react';

interface BrandingFormProps {
  initialData: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
}

export default function BrandingForm({ initialData }: BrandingFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const result = await updateBranding({
      name: formData.name,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      accentColor: formData.accentColor,
      fontFamily: formData.fontFamily,
    });

    if (result?.success) {
      setMessage({ type: 'success', text: 'Branding berhasil diperbarui!' });
    } else {
      setMessage({ type: 'error', text: result?.error || 'Gagal menyimpan perubahan' });
    }
    setIsPending(false);
  };

  return (
    <div className={styles.brandingWrapper}>
      <form onSubmit={handleSubmit} className={styles.brandingForm}>
        <div className={styles.sectionHeader}>
          <div className={styles.iconCircle}><Palette size={20} /></div>
          <h3>Identitas Visual</h3>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nama Sekolah Display</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.colorGrid}>
            <div className={styles.formGroup}>
              <label>Warna Utama</label>
              <div className={styles.colorInputWrapper}>
                <input 
                  type="color" 
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                />
                <code>{formData.primaryColor}</code>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Warna Sekunder</label>
              <div className={styles.colorInputWrapper}>
                <input 
                  type="color" 
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                />
                <code>{formData.secondaryColor}</code>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Warna Aksen</label>
              <div className={styles.colorInputWrapper}>
                <input 
                  type="color" 
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                />
                <code>{formData.accentColor}</code>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tipografi (Font)</label>
            <select 
              value={formData.fontFamily}
              onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="Outfit">Outfit</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </div>

        {message && (
          <div className={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
            {message.type === 'success' && <Check size={16} />} {message.text}
          </div>
        )}

        <button type="submit" className={styles.btnPrimary} disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan Branding'}
        </button>
      </form>

      <div className={styles.previewSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.iconCircle}><Globe size={20} /></div>
          <h3>Live Preview</h3>
        </div>
        
        <div className={styles.previewCard} style={{ '--primary': formData.primaryColor, '--accent': formData.accentColor } as any}>
          <div className={styles.previewHeader}>
            <div className={styles.previewLogo}>V</div>
            <div className={styles.previewNav}>
              <div className={styles.navDot}></div>
              <div className={styles.navDot}></div>
            </div>
          </div>
          <div className={styles.previewHero}>
            <h4>Selamat Datang di</h4>
            <h5>{formData.name}</h5>
            <button>Masuk Ke Portal</button>
          </div>
        </div>
      </div>
    </div>
  );
}
