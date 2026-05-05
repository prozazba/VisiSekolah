import Link from 'next/link';
import styles from '../landing.module.scss';
import { LogIn, School, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className={styles.hero} style={{ backgroundAttachment: 'scroll' }}>
      <div className="container flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-10 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
            <School size={40} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2">Portal VisiSekolah</h1>
          <p className="text-blue-200/60 mb-10 text-center font-medium">Masuk untuk mengelola ekosistem digital sekolah Anda.</p>
          
          <form className="w-full space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-blue-200/40 uppercase tracking-widest ml-4">Identitas Sekolah / Email</label>
              <input 
                type="text" 
                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all" 
                placeholder="sekolah.id atau admin@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-blue-200/40 uppercase tracking-widest ml-4">Kata Sandi</label>
              <input 
                type="password" 
                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all" 
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-between items-center px-2 py-2">
              <label className="flex items-center gap-2 text-sm text-blue-200/60 cursor-pointer">
                <input type="checkbox" className="accent-blue-500" /> Ingat Saya
              </label>
              <Link href="#" className="text-sm text-blue-400 font-bold hover:text-blue-300">Lupa Sandi?</Link>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/30">
              <LogIn size={20} /> Masuk Sekarang
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 w-full text-center">
            <p className="text-blue-200/40 text-sm">Belum terdaftar? <Link href="/contact" className="text-blue-400 font-bold hover:text-blue-300">Hubungi Sales</Link></p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-200/20 uppercase tracking-widest">
            <ShieldCheck size={12} /> Secure Multi-Tenant Environment
          </div>
        </div>
      </div>
    </main>
  );
}
