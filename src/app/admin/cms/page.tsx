'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Save, 
  RefreshCcw, 
  Languages, 
  Plus, 
  Trash2, 
  Layout, 
  MapPin, 
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getDictionary, saveDictionary, autoTranslateDictionary } from '@/app/actions/cms';

type Dictionary = any;

export default function CMSPage() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'contact' | 'faq'>('content');

  useEffect(() => {
    fetchDict();
  }, [lang]);

  const fetchDict = async () => {
    setLoading(true);
    const data = await getDictionary(lang);
    setDict(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!dict) return;
    setIsSaving(true);
    const result = await saveDictionary(lang, dict);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert('Gagal menyimpan: ' + result.error);
    }
    setIsSaving(false);
  };

  const handleAutoTranslate = async () => {
    if (!dict) return;
    if (!confirm('Ini akan menerjemahkan SELURUH konten ke bahasa lain menggunakan AI. Lanjutkan?')) return;
    
    setIsTranslating(true);
    const result = await autoTranslateDictionary(lang, dict);
    if (result.success) {
      alert(`Berhasil menerjemahkan ke bahasa ${result.targetLang === 'id' ? 'Indonesia' : 'Inggris'}!`);
      // Re-fetch to see changes
      fetchDict();
    } else {
      alert('Gagal menerjemahkan: ' + result.error);
    }
    setIsTranslating(false);
  };

  const updateField = (path: string[], value: string) => {
    if (!dict) return;
    const newDict = JSON.parse(JSON.stringify(dict)); // Deep clone
    let current = newDict;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setDict(newDict);
  };

  const updateFAQ = (index: number, field: 'q' | 'a', value: string) => {
    if (!dict) return;
    const newDict = JSON.parse(JSON.stringify(dict));
    newDict.faq[index][field] = value;
    setDict(newDict);
  };

  const addFAQ = () => {
    if (!dict) return;
    const newDict = JSON.parse(JSON.stringify(dict));
    if (!newDict.faq) newDict.faq = [];
    newDict.faq.unshift({ q: '', a: '' }); // Add to top
    setDict(newDict);
  };

  const removeFAQ = (index: number) => {
    if (!dict) return;
    const newDict = JSON.parse(JSON.stringify(dict));
    newDict.faq.splice(index, 1);
    setDict(newDict);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <RefreshCcw size={40} className={styles.spin} color="#6366f1" />
        <p style={{ fontWeight: 700, color: '#64748b' }}>Synchronizing Content...</p>
      </div>
    );
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layout size={32} color="#6366f1" /> Content Management
          </h1>
          <p>Easily update your website text, contact info, and FAQs.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {showSuccess && (
            <div className={`${styles.badge} ${styles.success}`} style={{ padding: '0.75rem 1.25rem' }}>
              <CheckCircle2 size={18} /> Published!
            </div>
          )}
          <button 
            className={styles.btnPrimary} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCcw size={18} className={styles.spin} /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabItem} ${activeTab === 'content' ? styles.active : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={18} /> Public Pages
            </div>
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'contact' ? styles.active : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} /> Contact & Location
            </div>
          </button>
          <button 
            className={`${styles.tabItem} ${activeTab === 'faq' ? styles.active : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} /> FAQ Registry
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '4px' }}>
            <button 
              onClick={() => setLang('id')}
              style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: lang === 'id' ? '#f1f0ff' : 'transparent', color: lang === 'id' ? '#6366f1' : '#94a3b8', fontWeight: 700, cursor: 'pointer' }}
            >ID</button>
            <button 
              onClick={() => setLang('en')}
              style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: lang === 'en' ? '#f1f0ff' : 'transparent', color: lang === 'en' ? '#6366f1' : '#94a3b8', fontWeight: 700, cursor: 'pointer' }}
            >EN</button>
          </div>
          <button 
            className={styles.btnOutline} 
            onClick={handleAutoTranslate}
            disabled={isTranslating}
            style={{ padding: '0.75rem 1.25rem' }}
          >
            {isTranslating ? <RefreshCcw size={16} className={styles.spin} /> : <Sparkles size={16} color="#6366f1" />}
            {isTranslating ? 'AI Translating...' : 'AI Sync All'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px' }}>
        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <EditorSection 
              title="Landing Hero Section" 
              fields={[
                { label: 'Hero Title', path: ['hero', 'title'], value: dict.hero.title },
                { label: 'Hero Subtitle', path: ['hero', 'subtitle'], value: dict.hero.subtitle, type: 'textarea' },
                { label: 'Main CTA Button', path: ['hero', 'cta_start'], value: dict.hero.cta_start },
              ]}
              onUpdate={updateField}
            />
            <EditorSection 
              title="Featured Pillars" 
              fields={[
                { label: 'Section Header', path: ['home_features', 'title'], value: dict.home_features.title },
                { label: 'Section Sub-header', path: ['home_features', 'subtitle'], value: dict.home_features.subtitle },
              ]}
              onUpdate={updateField}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <EditorSection 
              title="Global Contact Info" 
              fields={[
                { label: 'Support Email', path: ['footer', 'contact_info', 'email'], value: dict.footer.contact_info.email },
                { label: 'Contact Phone', path: ['footer', 'contact_info', 'phone'], value: dict.footer.contact_info.phone },
                { label: 'Brief Address (Footer)', path: ['footer', 'contact_info', 'address'], value: dict.footer.contact_info.address },
              ]}
              onUpdate={updateField}
            />
          </div>
        )}

        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button className={styles.btnOutline} onClick={addFAQ} style={{ alignSelf: 'flex-start', borderStyle: 'dashed' }}>
              <Plus size={18} /> Add New FAQ Entry
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dict.faq?.map((item: any, index: number) => (
                <div key={index} className={styles.card} style={{ padding: '2rem', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className={styles.badge} style={{ background: '#f1f5f9', color: '#64748b' }}>ENTRY #{dict.faq.length - index}</span>
                    <button onClick={() => removeFAQ(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Question</label>
                    <input 
                      className={styles.inputControl}
                      type="text" 
                      value={item.q} 
                      onChange={(e) => updateFAQ(index, 'q', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label>Answer Content</label>
                    <textarea 
                      className={styles.inputControl}
                      rows={4}
                      value={item.a} 
                      onChange={(e) => updateFAQ(index, 'a', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e2e8f0' }}>
        <AlertCircle size={20} color="#6366f1" />
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>
          Tip: Use the AI Sync All feature to automatically translate your updates to other languages.
        </p>
      </div>
    </div>
  );
}

function EditorSection({ title, fields, onUpdate }: { title: string, fields: any[], onUpdate: any }) {
  return (
    <section className={styles.card} style={{ padding: '2.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {fields.map((field, idx) => (
          <div key={idx} className={styles.formGroup}>
            <label>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea 
                className={styles.inputControl}
                rows={4}
                value={field.value} 
                onChange={(e) => onUpdate(field.path, e.target.value)}
              />
            ) : (
              <input 
                className={styles.inputControl}
                type="text" 
                value={field.value} 
                onChange={(e) => onUpdate(field.path, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
