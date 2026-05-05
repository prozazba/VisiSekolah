import Navbar from '@/components/Navbar';
import styles from '../landing.module.scss';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <section className={styles.pageSection}>
        <div className="container">
          <div className="max-w-3xl mb-16">
            <span className={styles.pageTag}>Connect with us</span>
            <h1 className={styles.pageTitle}>Hubungi Tim Ahli Kami.</h1>
            <p className={styles.pageSubtitle}>
              Siap untuk memulai transformasi digital sekolah Anda? Kami di sini untuk menjawab setiap pertanyaan Anda.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Contact Form - Large Tile */}
            <div className={`${styles.bentoItem} ${styles['span-8']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.blue} mb-6`}><MessageSquare size={24} /></div>
                <h3 className={styles.bentoTitle}>Kirim Pesan</h3>
                <p className={styles.bentoDesc}>Beritahu kami kebutuhan sekolah Anda.</p>
                
                <form className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nama Lengkap</label>
                    <input type="text" className={styles.formInput} placeholder="John Doe" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nama Sekolah</label>
                    <input type="text" className={styles.formInput} placeholder="SMA VisiSekolah" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Email Kerja</label>
                    <input type="email" className={styles.formInput} placeholder="admin@sekolah.sch.id" />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Pesan</label>
                    <textarea className={styles.formTextarea} placeholder="Tuliskan pesan Anda..."></textarea>
                  </div>
                  <div className={styles.fullWidth}>
                    <button type="submit" className={styles.btnBentoPrimary + " flex items-center justify-center gap-3 w-full"}>
                      <Send size={18} /> Kirim Pesan Sekarang
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="grid grid-cols-1 gap-6 md:col-span-4">
              <div className={styles.bentoItem}>
                <div>
                  <div className={`${styles.iconCircle} ${styles.emerald} mb-4`}><Phone size={24} /></div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">WhatsApp</h4>
                  <p className="text-xl font-black text-slate-800">+62 812 3456 7890</p>
                </div>
              </div>

              <div className={styles.bentoItem}>
                <div>
                  <div className={`${styles.iconCircle} ${styles.purple} mb-4`}><Mail size={24} /></div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-xl font-black text-slate-800">info@visisekolah.id</p>
                </div>
              </div>

              <div className={styles.bentoItem}>
                <div>
                  <div className={`${styles.iconCircle} ${styles.amber} mb-4`}><MapPin size={24} /></div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">Kantor</h4>
                  <p className="text-lg font-black text-slate-800 leading-tight">Digital Hub BSD, Tangerang</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
