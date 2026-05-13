'use client';

import Navbar from '@/components/Navbar';
import styles from '../../styles/landing.module.scss';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { dict } = useLanguage();

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={`${styles.pageHeader} ${styles.left}`}>
            <span className={styles.pageTag}>{dict.contact_page.tag}</span>
            <h1 className={styles.pageTitle}>{dict.contact_page.title}</h1>
            <p className={styles.pageSubtitle}>
              {dict.contact_page.subtitle}
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Contact Form - Large Tile */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.blue} mb-6`}><MessageSquare size={24} /></div>
                <h3 className={styles.bentoTitle}>{dict.contact_page.form.title}</h3>
                <p className={styles.bentoDesc}>{dict.contact_page.form.desc}</p>
                
                <form className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{dict.contact_page.form.name}</label>
                    <input type="text" className={styles.formInput} placeholder={dict.contact_page.form.placeholder_name} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{dict.contact_page.form.school}</label>
                    <input type="text" className={styles.formInput} placeholder={dict.contact_page.form.placeholder_school} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>{dict.contact_page.form.email}</label>
                    <input type="email" className={styles.formInput} placeholder="info@sma-visisekolah.sch.id" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>{dict.contact_page.form.message}</label>
                    <textarea className={styles.formTextarea} placeholder={dict.contact_page.form.placeholder_message}></textarea>
                  </div>
                  <div className={styles.fullWidth}>
                    <button type="submit" className={styles.btnBentoPrimary + " flex items-center justify-center gap-3 w-full"}>
                      <Send size={18} /> {dict.contact_page.form.submit}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className={styles.bentoSidebar}>
              <div className={styles.bentoItem}>
                <div>
                  <div className={`${styles.iconCircle} ${styles.emerald} mb-4`}><Phone size={24} /></div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Telepon</h4>
                  <p className="text-xl font-black text-slate-800">{dict.footer.contact_info.phone}</p>
                </div>
              </div>

              <div className={styles.bentoItem}>
                <div>
                  <div className={`${styles.iconCircle} ${styles.purple} mb-4`}><Mail size={24} /></div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-xl font-black text-slate-800">{dict.footer.contact_info.email}</p>
                </div>
              </div>

              <div className={styles.bentoItem}>
                <div>
                  <div className={`${styles.iconCircle} ${styles.amber} mb-4`}><MapPin size={24} /></div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">{dict.contact_page.sidebar.office}</h4>
                  <p className="text-lg font-black text-slate-800 leading-tight">{dict.contact_page.sidebar.location}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
