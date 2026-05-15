'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Settings, 
  Shield, 
  Mail, 
  Globe, 
  Bell, 
  Database,
  Save,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

type SettingTab = 'GENERAL' | 'SECURITY' | 'EMAIL' | 'NOTIFICATIONS' | 'DATA';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [schoolName, setSchoolName] = useState('SMA VisiSekolah');
  useEffect(() => {
    async function load() {
      const { getBranding } = await import('@/app/actions/branding');
      const data = await getBranding();
      if (data) setSchoolName(data.name);
    }
    load();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings size={32} color="#6366f1" /> System Settings
          </h1>
          <p>Configure your school portal's global parameters and security preferences.</p>
        </div>
        
        {showSuccess && (
          <div className={`${styles.badge} ${styles.success}`} style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
            <CheckCircle2 size={18} /> Settings saved successfully!
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem' }}>
        {/* Navigation Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SettingNavItem 
            icon={<Globe size={20} />} 
            label="General Info" 
            active={activeTab === 'GENERAL'} 
            onClick={() => setActiveTab('GENERAL')} 
          />
          <SettingNavItem 
            icon={<Shield size={20} />} 
            label="Security & Auth" 
            active={activeTab === 'SECURITY'} 
            onClick={() => setActiveTab('SECURITY')} 
          />
          <SettingNavItem 
            icon={<Mail size={20} />} 
            label="Email (SMTP)" 
            active={activeTab === 'EMAIL'} 
            onClick={() => setActiveTab('EMAIL')} 
          />
          <SettingNavItem 
            icon={<Bell size={20} />} 
            label="Notifications" 
            active={activeTab === 'NOTIFICATIONS'} 
            onClick={() => setActiveTab('NOTIFICATIONS')} 
          />
          <SettingNavItem 
            icon={<Database size={20} />} 
            label="Data & Backups" 
            active={activeTab === 'DATA'} 
            onClick={() => setActiveTab('DATA')} 
          />
        </aside>

        {/* Settings Form Card */}
        <div className={styles.card} style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              {activeTab === 'GENERAL' && 'General Configuration'}
              {activeTab === 'SECURITY' && 'Security & Access Control'}
              {activeTab === 'EMAIL' && 'Email Service (SMTP)'}
              {activeTab === 'NOTIFICATIONS' && 'Push & System Notifications'}
              {activeTab === 'DATA' && 'Database & Backup Management'}
            </h3>
            <button 
              className={styles.btnPrimary} 
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div style={{ maxWidth: '640px' }}>
            {activeTab === 'GENERAL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className={styles.formGroup}>
                  <label>Official School Name</label>
                  <input 
                    className={styles.inputControl} 
                    type="text" 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)} 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Portal URL (Read-only)</label>
                  <input className={styles.inputControl} type="text" defaultValue="sma-visisekolah.sch.id" disabled />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className={styles.formGroup}>
                    <label>Current Academic Year</label>
                    <select className={styles.inputControl}>
                      <option>2026/2027</option>
                      <option>2027/2028</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>System Language</label>
                    <select className={styles.inputControl}>
                      <option>Indonesian (Default)</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Contact Phone Number</label>
                  <input className={styles.inputControl} type="text" defaultValue="+62 21 555 0123" />
                </div>
              </div>
            )}

            {activeTab === 'SECURITY' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className={styles.formGroup}>
                  <label>Password Policy</label>
                  <select className={styles.inputControl}>
                    <option>Standard (Min 8 characters)</option>
                    <option>Strong (Complex requirements)</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '14px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Require 2FA for all administrator accounts</div>
                  </div>
                  <div style={{ width: '44px', height: '24px', background: '#6366f1', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', right: '4px', top: '4px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }}></div>
                  </div>
                </div>

                <button className={styles.btnOutline} style={{ justifyContent: 'flex-start' }}>
                  <Lock size={18} /> Update Master Root Password
                </button>
              </div>
            )}

            {activeTab === 'EMAIL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className={styles.formGroup}>
                  <label>SMTP Host</label>
                  <input className={styles.inputControl} type="text" defaultValue="smtp.resend.com" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div className={styles.formGroup}>
                    <label>SMTP User</label>
                    <input className={styles.inputControl} type="text" defaultValue="resend" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>SMTP Port</label>
                    <input className={styles.inputControl} type="number" defaultValue="587" />
                  </div>
                </div>
                <button className={styles.btnOutline}>Send Test Email</button>
              </div>
            )}
            
            {/* Other tabs can be added similarly */}
            {(activeTab === 'NOTIFICATIONS' || activeTab === 'DATA') && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                <h4 style={{ fontWeight: 800 }}>Advanced Feature Coming Soon</h4>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>This configuration module is being optimized for the next update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingNavItem({ icon, label, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '14px 20px', 
        borderRadius: '16px', 
        background: active ? '#6366f1' : 'transparent',
        color: active ? 'white' : '#64748b',
        fontWeight: 700,
        fontSize: '0.9375rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: active ? '0 8px 20px -5px rgba(99, 102, 241, 0.4)' : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon} {label}
      </div>
      {active && <ChevronRight size={16} />}
    </div>
  );
}
