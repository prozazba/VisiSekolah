import Navbar from '@/components/Navbar';
import styles from '../landing.module.scss';
import { Heart, Target, Lightbulb, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Refined Header */}
      <section className={styles.pageSection}>
        <div className="container">
          <div className="max-w-3xl mb-16">
            <span className={styles.pageTag}>Our Mission</span>
            <h1 className={styles.pageTitle}>Mendigitalisasi Pendidikan Indonesia.</h1>
            <p className={styles.pageSubtitle}>
              Kami percaya bahwa setiap sekolah berhak memiliki teknologi terbaik untuk mencerdaskan generasi bangsa.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Vision - Primary Tile */}
            <div className={`${styles.bentoItem} ${styles['span-12']}`}>
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className={styles.iconCircle}><Target size={28} /></div>
                  <h3 className={styles.bentoTitle}>Visi Kami</h3>
                  <p className="text-2xl text-slate-600 leading-relaxed italic font-medium">
                    "Menjadi katalisator utama transformasi digital sekolah di Indonesia melalui platform yang inklusif, terjangkau, dan berfokus pada kemandirian branding sekolah."
                  </p>
                </div>
                <div className="flex-1 w-full aspect-video bg-blue-50 rounded-3xl flex items-center justify-center">
                   <Target size={120} className="text-blue-200" />
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.red}`}><Heart size={28} /></div>
                <h3 className={styles.bentoTitle}>Empati</h3>
                <p className={styles.bentoDesc}>Kami membangun fitur berdasarkan kebutuhan nyata guru dan orang tua di lapangan.</p>
              </div>
            </div>

            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.purple}`}><Target size={28} /></div>
                <h3 className={styles.bentoTitle}>Inovasi</h3>
                <p className={styles.bentoDesc}>Selalu mengadopsi teknologi terbaru untuk efisiensi administrasi sekolah.</p>
              </div>
            </div>

            <div className={`${styles.bentoItem} ${styles['span-4']}`}>
              <div>
                <div className={`${styles.iconCircle} ${styles.amber}`}><Lightbulb size={28} /></div>
                <h3 className={styles.bentoTitle}>Inspirasi</h3>
                <p className={styles.bentoDesc}>Mendorong sekolah untuk bangga dengan identitas digital mereka sendiri.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24 bg-white text-center">
        <div className="container">
          <h2 className="text-4xl font-black mb-8 text-slate-900">Mari bertumbuh bersama.</h2>
          <Link href="/contact" className={styles.btnBentoPrimary} style={{ maxWidth: '300px', margin: '0 auto' }}>
             Gabung Sebagai Mitra
          </Link>
        </div>
      </section>
    </main>
  );
}
