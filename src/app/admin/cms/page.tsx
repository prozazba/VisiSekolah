'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.scss';
import { 
  Save, 
  RefreshCcw, 
  Languages, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layout, 
  MessageSquare, 
  MapPin, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { getDictionary, saveDictionary, autoTranslateDictionary } from '@/app/actions/cms';

type Dictionary = any;

export default function CMSPage() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
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
      alert('Konten berhasil disimpan!');
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
    } else {
      alert('Gagal menerjemahkan: ' + result.error);
    }
    setIsTranslating(false);
  };

  const updateField = (path: string[], value: string) => {
    if (!dict) return;
    const newDict = { ...dict };
    let current = newDict;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setDict(newDict);
  };

  const updateFAQ = (index: number, field: 'q' | 'a', value: string) => {
    if (!dict) return;
    const newDict = { ...dict };
    newDict.faq[index][field] = value;
    setDict(newDict);
  };

  const addFAQ = () => {
    if (!dict) return;
    const newDict = { ...dict };
    if (!newDict.faq) newDict.faq = [];
    newDict.faq.push({ q: '', a: '' });
    setDict(newDict);
  };

  const removeFAQ = (index: number) => {
    if (!dict) return;
    const newDict = { ...dict };
    newDict.faq.splice(index, 1);
    setDict(newDict);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <RefreshCcw className={styles.spin} />
        <p>Memuat kamus...</p>
      </div>
    );
  }

  return (
    <div className={styles.cmsContainer}>
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>CMS Content Management</h2>
          <p className={styles.pageSubtitle}>Kelola konten statik, FAQ, dan informasi kontak.</p>
        </div>
        <div className={styles.actionGroup}>
          <div className={styles.langToggle}>
            <button 
              className={lang === 'id' ? styles.active : ''} 
              onClick={() => setLang('id')}
            >ID</button>
            <button 
              className={lang === 'en' ? styles.active : ''} 
              onClick={() => setLang('en')}
            >EN</button>
          </div>
          <button 
            className={styles.btnOutline} 
            onClick={handleAutoTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? <RefreshCcw size={16} className={styles.spin} /> : <Languages size={16} />}
            AI Translate All
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCcw size={16} className={styles.spin} /> : <Save size={16} />}
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className={styles.cmsTabs}>
        <button 
          className={activeTab === 'content' ? styles.active : ''} 
          onClick={() => setActiveTab('content')}
        >
          <Layout size={18} /> Halaman Publik
        </button>
        <button 
          className={activeTab === 'contact' ? styles.active : ''} 
          onClick={() => setActiveTab('contact')}
        >
          <MapPin size={18} /> Kontak & Lokasi
        </button>
        <button 
          className={activeTab === 'faq' ? styles.active : ''} 
          onClick={() => setActiveTab('faq')}
        >
          <HelpCircle size={18} /> Daftar FAQ
        </button>
      </div>

      <div className={styles.cmsEditor}>
        {activeTab === 'content' && (
          <div className={styles.sectionGrid}>
            <EditorSection 
              title="Hero Section (Beranda)" 
              fields={[
                { label: 'Title', path: ['hero', 'title'], value: dict.hero.title },
                { label: 'Subtitle', path: ['hero', 'subtitle'], value: dict.hero.subtitle, type: 'textarea' },
                { label: 'CTA Text', path: ['hero', 'cta_start'], value: dict.hero.cta_start },
              ]}
              onUpdate={updateField}
            />
            <EditorSection 
              title="Fitur Unggulan" 
              fields={[
                { label: 'Section Title', path: ['home_features', 'title'], value: dict.home_features.title },
                { label: 'Section Subtitle', path: ['home_features', 'subtitle'], value: dict.home_features.subtitle },
                { label: 'Feature 1 (Title)', path: ['home_features', 'white_label', 'title'], value: dict.home_features.white_label.title },
                { label: 'Feature 1 (Desc)', path: ['home_features', 'white_label', 'desc'], value: dict.home_features.white_label.desc, type: 'textarea' },
              ]}
              onUpdate={updateField}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={styles.sectionGrid}>
            <EditorSection 
              title="Informasi Kontak Utama" 
              fields={[
                { label: 'Email', path: ['footer', 'contact_info', 'email'], value: dict.footer.contact_info.email },
                { label: 'Telepon', path: ['footer', 'contact_info', 'phone'], value: dict.footer.contact_info.phone },
                { label: 'Alamat Singkat (Footer)', path: ['footer', 'contact_info', 'address'], value: dict.footer.contact_info.address },
              ]}
              onUpdate={updateField}
            />
            <EditorSection 
              title="Detail Lokasi (Halaman Kontak)" 
              fields={[
                { label: 'Label Lokasi', path: ['contact_page', 'sidebar', 'office'], value: dict.contact_page.sidebar.office },
                { label: 'Alamat Lengkap', path: ['contact_page', 'sidebar', 'location'], value: dict.contact_page.sidebar.location, type: 'textarea' },
              ]}
              onUpdate={updateField}
            />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className={styles.faqEditor}>
            <div className={styles.faqList}>
              {dict.faq?.map((item: any, index: number) => (
                <div key={index} className={styles.faqItem}>
                  <div className={styles.faqHeader}>
                    <span>Pertanyaan #{index + 1}</span>
                    <button onClick={() => removeFAQ(index)} className={styles.btnDelete}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={item.q} 
                    onChange={(e) => updateFAQ(index, 'q', e.target.value)}
                    placeholder="Tulis pertanyaan..."
                    className={styles.formInput}
                  />
                  <textarea 
                    value={item.a} 
                    onChange={(e) => updateFAQ(index, 'a', e.target.value)}
                    placeholder="Tulis jawaban..."
                    className={styles.formTextarea}
                  />
                </div>
              ))}
            </div>
            <button className={styles.btnAdd} onClick={addFAQ}>
              <Plus size={18} /> Tambah FAQ Baru
            </button>
          </div>
        )}
      </div>

      <div className={styles.cmsNotice}>
        <AlertCircle size={18} />
        <p>Perubahan yang disimpan akan langsung memperbarui file kamus dan tampilan website secara real-time.</p>
      </div>
    </div>
  );
}

function EditorSection({ title, fields, onUpdate }: { title: string, fields: any[], onUpdate: any }) {
  return (
    <section className={styles.editorCard}>
      <h4>{title}</h4>
      <div className={styles.fields}>
        {fields.map((field, idx) => (
          <div key={idx} className={styles.formGroup}>
            <label>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea 
                value={field.value} 
                onChange={(e) => onUpdate(field.path, e.target.value)}
                className={styles.formTextarea}
              />
            ) : (
              <input 
                type="text" 
                value={field.value} 
                onChange={(e) => onUpdate(field.path, e.target.value)}
                className={styles.formInput}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
