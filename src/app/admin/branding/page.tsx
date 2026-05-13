'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { Palette, Save, Upload, Type, Layout } from 'lucide-react';

export default function BrandingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'VisiSekolah Institution',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    accentColor: '#10b981',
    fontFamily: 'Outfit',
  });

  const handleSave = async () => {
    setLoading(true);
    // TODO: Implement server action to save branding
    setTimeout(() => {
      setLoading(false);
      alert('Branding settings saved successfully!');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <header className={styles.greeting} style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Palette size={32} color="#6366f1" /> Custom Branding
        </h1>
        <p>Personalize the appearance and identity of your school platform.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Identity */}
        <section className={styles.card}>
          <header>
            <h3><Layout size={20} style={{ marginRight: '8px' }} /> Platform Identity</h3>
          </header>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>School / App Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', outline: 'none' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>School Logo</label>
                <div style={{ border: '2px dashed #eee', borderRadius: '16px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={24} color="#8c8e91" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#8c8e91' }}>Click to upload logo</p>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Favicon</label>
                <div style={{ border: '2px dashed #eee', borderRadius: '16px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={24} color="#8c8e91" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#8c8e91' }}>Click to upload icon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Theme */}
        <section className={styles.card}>
          <header>
            <h3><Palette size={20} style={{ marginRight: '8px' }} /> Theme & Aesthetics</h3>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Primary Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#8c8e91', fontFamily: 'monospace' }}>{formData.primaryColor}</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Secondary Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#8c8e91', fontFamily: 'monospace' }}>{formData.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Accent Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={formData.accentColor}
                  onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#8c8e91', fontFamily: 'monospace' }}>{formData.accentColor}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>
              <Type size={16} style={{ marginRight: '6px' }} /> Typography
            </label>
            <select 
              value={formData.fontFamily}
              onChange={(e) => setFormData({...formData, fontFamily: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Outfit">Outfit (Premium Rounded)</option>
              <option value="Inter">Inter (Modern Swiss)</option>
              <option value="Roboto">Roboto (Clean Sans)</option>
              <option value="Poppins">Poppins (Friendly Geometric)</option>
            </select>
          </div>
        </section>

        <button 
          onClick={handleSave}
          disabled={loading}
          style={{ 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Saving...' : <><Save size={20} /> Save Branding Settings</>}
        </button>
      </div>
    </div>
  );
}
