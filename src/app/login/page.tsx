import Link from 'next/link';
import styles from '../../styles/landing.module.scss';
import { LogIn, School, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className={styles.hero} style={{ backgroundAttachment: 'scroll' }}>
      <div className={`${styles.container} ${styles.flexGroup} ${styles.center}`} style={{ minHeight: '100vh' }}>
        <div className={styles.bentoItem} style={{ maxWidth: '450px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(40px)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
          <div className={`${styles.flexGroup} ${styles.vertical} ${styles.center}`}>
            <div className={`${styles.iconCircle} ${styles.blue}`} style={{ width: '80px', height: '80px', marginBottom: '2rem' }}>
              <School size={40} className="text-white" />
            </div>
            
            <h1 className={styles.pageTitle} style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>Portal VisiSekolah</h1>
            <p className="text-blue-200/60 mb-10 text-center font-medium">Masuk untuk mengelola ekosistem digital sekolah Anda.</p>
            
            <form className={`${styles.formGrid} w-full`}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel} style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Identitas Sekolah / Email</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}
                  placeholder="sekolah.id atau admin@email.com"
                />
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel} style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Kata Sandi</label>
                <input 
                  type="password" 
                  className={styles.formInput} 
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}
                  placeholder="••••••••"
                />
              </div>

              <div className={`${styles.flexGroup} ${styles.between} ${styles.fullWidth} py-2`}>
                <label className="flex items-center gap-2 text-sm text-blue-200/60 cursor-pointer">
                  <input type="checkbox" className="accent-blue-500" /> Ingat Saya
                </label>
                <Link href="#" className="text-sm text-blue-400 font-bold hover:text-blue-300">Lupa Sandi?</Link>
              </div>

              <div className={styles.fullWidth}>
                <button type="submit" className={`${styles.btnBentoPrimary} w-full`} style={{ padding: '1.25rem' }}>
                  <LogIn size={20} /> Masuk Sekarang
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 w-full text-center">
              <p className="text-blue-200/40 text-sm">Belum terdaftar? <Link href="/contact" className="text-blue-400 font-bold hover:text-blue-300">Hubungi Sales</Link></p>
            </div>

            <div className={`${styles.flexGroup} mt-8 text-[10px] font-black text-blue-200/20 uppercase tracking-widest`}>
              <ShieldCheck size={12} /> Secure Multi-Tenant Environment
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
