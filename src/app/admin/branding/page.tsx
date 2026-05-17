'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Palette, 
  Save, 
  Upload, 
  Type, 
  Layout, 
  Eye,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { getBranding, updateBranding } from '@/app/actions/branding';

export default function BrandingPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: 'SMA VisiSekolah',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    accentColor: '#10b981',
    fontFamily: 'Outfit',
    logoUrl: null as string | null,
    faviconUrl: null as string | null,
  });

  useEffect(() => {
    async function loadBranding() {
      const data = await getBranding();
      if (data) {
        setFormData({
          name: data.name || 'SMA VisiSekolah',
          primaryColor: data.primaryColor || '#6366f1',
          secondaryColor: data.secondaryColor || '#a855f7',
          accentColor: data.accentColor || '#10b981',
          fontFamily: data.fontFamily || 'Outfit',
          logoUrl: data.logoUrl || null,
          faviconUrl: data.faviconUrl || null,
        });
      }
      setIsLoading(false);
    }
    loadBranding();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, [field]: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateBranding(formData);
    setIsSaving(false);
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert('Error: ' + result.error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <RefreshCw size={40} className={styles.spin} color="#6366f1" />
        <p style={{ fontWeight: 700, color: '#64748b' }}>Loading branding settings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={32} color="#6366f1" /> Institutional Branding
          </h1>
          <p>Personalize the appearance and identity of your school's digital portal.</p>
        </div>
        
        {showSuccess && (
          <div className={`${styles.badge} ${styles.success}`} style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
            <CheckCircle2 size={18} /> Branding updated successfully!
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Platform Identity */}
          <section className={styles.card} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layout size={20} color="#6366f1" /> Platform Identity
            </h3>
            
            <div className={styles.formGroup}>
              <label>School / Institution Name</label>
              <input 
                className={styles.inputControl}
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className={styles.formGroup}>
                <label>Institutional Logo</label>
                <label style={{ border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', display: 'block', height: '120px', overflow: 'hidden' }}>
                  <input type="file" accept="image/png, image/svg+xml, image/jpeg" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Upload size={24} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Upload PNG/SVG</div>
                    </div>
                  )}
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>Browser Favicon</label>
                <label style={{ border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', display: 'block', height: '120px', overflow: 'hidden' }}>
                  <input type="file" accept="image/x-icon, image/png" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'faviconUrl')} />
                  {formData.faviconUrl ? (
                    <img src={formData.faviconUrl} alt="Favicon" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Upload size={24} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Upload ICO/PNG</div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </section>

          {/* Visual Palette */}
          <section className={styles.card} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Palette size={20} color="#6366f1" /> Visual Theme
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <ColorInput 
                label="Primary" 
                value={formData.primaryColor} 
                onChange={(v: string) => setFormData({...formData, primaryColor: v})} 
              />
              <ColorInput 
                label="Secondary" 
                value={formData.secondaryColor} 
                onChange={(v: string) => setFormData({...formData, secondaryColor: v})} 
              />
              <ColorInput 
                label="Accent" 
                value={formData.accentColor} 
                onChange={(v: string) => setFormData({...formData, accentColor: v})} 
              />
            </div>

            <div className={styles.formGroup} style={{ marginTop: '2rem' }}>
              <label><Type size={16} /> Typography Style</label>
              <select 
                className={styles.inputControl}
                value={formData.fontFamily}
                onChange={(e) => setFormData({...formData, fontFamily: e.target.value})}
              >
                <option value="Outfit">Outfit (Premium Rounded)</option>
                <option value="Inter">Inter (Modern Sans)</option>
                <option value="Roboto">Roboto (Classic Clean)</option>
                <option value="Poppins">Poppins (Friendly Geometric)</option>
              </select>
            </div>
          </section>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.btnPrimary} onClick={handleSave} disabled={isSaving} style={{ flex: 1 }}>
              <Save size={18} /> {isSaving ? 'Saving Changes...' : 'Save Branding'}
            </button>
            <button className={styles.btnOutline}>
              <RefreshCw size={18} /> Reset to Default
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <aside>
          <div className={styles.card} style={{ position: 'sticky', top: '2.5rem', background: '#1a1c1e', color: 'white', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} /> Live Preview
            </h4>
            
            <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', color: '#1a1c1e', transform: 'scale(0.95)', transformOrigin: 'top center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ width: '24px', height: '24px', background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`, borderRadius: '6px' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{formData.name}</div>
              </div>
              
              <div style={{ height: '80px', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '8px', background: formData.primaryColor, borderRadius: '4px' }}></div>
              </div>

              <div style={{ height: '32px', background: formData.primaryColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.625rem', fontWeight: 700 }}>
                Button Preview
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '1.5rem', lineHeight: 1.5 }}>
              Preview shows how your institutional identity will be applied across the portal components.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: any) {
  return (
    <div className={styles.formGroup}>
      <label>{label} Color</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '14px', background: 'white' }}>
        <input 
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '36px', height: '36px', border: 'none', background: 'none', padding: 0, cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}
        />
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1a1c1e', fontFamily: 'monospace' }}>{value.toUpperCase()}</span>
      </div>
    </div>
  );
}
