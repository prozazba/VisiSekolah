'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard-v2.module.scss';
import { 
  Shield, GraduationCap, Users, BookOpen, ArrowRight, CheckCircle, 
  HelpCircle, Compass, Award, FileText, ClipboardList, LogIn,
  Settings, UserPlus, UploadCloud, Edit3, Printer, ChevronDown, ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function GuidePage() {
  const { dict } = useLanguage();
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher' | 'student'>('admin');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Academic steps definitions
  const steps = [
    {
      no: '1',
      title: 'Tahun Ajaran & Kurikulum',
      actor: 'ADMIN',
      desc: 'Admin mendefinisikan tahun ajaran (Academic Term), mata pelajaran, serta bobot nilai UTS/UAS.',
      icon: <Compass size={20} color="#6366f1" />,
      color: '#e0e7ff',
      textColor: '#4338ca'
    },
    {
      no: '2',
      title: 'Registrasi Guru & Siswa',
      actor: 'ADMIN',
      desc: 'Admin mendaftarkan akun guru, siswa, dan orang tua. Profil otomatis dibentuk saat akun terdaftar.',
      icon: <Users size={20} color="#0ea5e9" />,
      color: '#e0f2fe',
      textColor: '#0369a1'
    },
    {
      no: '3',
      title: 'Penugasan & Kelas',
      actor: 'ADMIN',
      desc: 'Admin menetapkan guru pengampu mata pelajaran, wali kelas, serta memasukkan siswa ke kelas binaan.',
      icon: <Award size={20} color="#10b981" />,
      color: '#d1fae5',
      textColor: '#047857'
    },
    {
      no: '4',
      title: 'Modul Ajar & RPP',
      actor: 'GURU',
      desc: 'Guru mengunggah perencanaan modul ajar (Lesson Plan) secara digital yang terpetakan ke mata pelajaran.',
      icon: <FileText size={20} color="#f59e0b" />,
      color: '#fef3c7',
      textColor: '#b45309'
    },
    {
      no: '5',
      title: 'Jurnal Mengajar Kelas',
      actor: 'GURU',
      desc: 'Guru mencatat jurnal kegiatan harian (Teaching Log) termasuk tanggal, topik bahasan, dan catatan kelas.',
      icon: <ClipboardList size={20} color="#ec4899" />,
      color: '#fce7f3',
      textColor: '#be185d'
    },
    {
      no: '6',
      title: 'Penilaian (Grades)',
      actor: 'GURU',
      desc: 'Guru menginput nilai harian, UTS, UAS, tugas, dan kuis secara online langsung pada kartu semester siswa.',
      icon: <BookOpen size={20} color="#8b5cf6" />,
      color: '#f5f3ff',
      textColor: '#6d28d9'
    },
    {
      no: '7',
      title: 'Kalkulasi Otomatis',
      actor: 'SYSTEM',
      desc: 'Sistem secara otomatis mengagregasi nilai rata-rata kelas, peringkat semester, serta riwayat kenaikan kelas.',
      icon: <CheckCircle size={20} color="#10b981" />,
      color: '#d1fae5',
      textColor: '#047857'
    }
  ];

  // Interactive Walkthrough steps
  const tutorialSteps = [
    {
      id: 1,
      title: 'Langkah 1: Autentikasi & Login (Masuk Sistem)',
      desc: 'Langkah pertama untuk mengakses seluruh fungsi VisiSekolah berdasarkan kewenangan peran masing-masing.',
      icon: <LogIn size={24} color="#6366f1" />,
      actor: 'SEMUA USER',
      badgeColor: '#e0e7ff',
      badgeTextColor: '#4338ca',
      inputs: [
        { label: 'Portal Kredensial', val: 'Masuk melalui halaman /login utama.' },
        { label: 'Email Pengguna', val: 'Gunakan alamat email resmi terdaftar (contoh: admin@visisekolah.sch.id).' },
        { label: 'Kata Sandi', val: 'Masukkan sandi rahasia Anda secara presisi.' }
      ],
      submission: 'Tekan tombol "Masuk Sekarang". Sistem melakukan autentikasi sesi JWT terenkripsi secara aman.',
      review: 'Anda dialihkan otomatis ke dashboard khusus. Kategori menu sebelah kiri akan menyesuaikan dengan peran Anda (Kepala Sekolah, Admin, Guru, atau Siswa).'
    },
    {
      id: 2,
      title: 'Langkah 2: Setup Kurikulum & Tahun Ajaran (Admin)',
      desc: 'Membangun fondasi akademik dasar sebelum aktivitas pembelajaran semester dimulai.',
      icon: <Settings size={24} color="#0ea5e9" />,
      actor: 'ADMINISTRATOR',
      badgeColor: '#e0f2fe',
      badgeTextColor: '#0369a1',
      inputs: [
        { label: 'Menu Akses', val: 'Akses menu "Data Akademik" di panel sebelah kiri.' },
        { label: 'Form Tahun Ajaran', val: 'Isi Tahun Pelajaran (misal: 2026/2027), Nama Semester (Ganjil/Genap), serta tanggal tenggat.' },
        { label: 'Komponen Mapel', val: 'Klik sub-tab "Mata Pelajaran" untuk mendaftarkan nama dan kode pelajaran baru.' }
      ],
      submission: 'Klik tombol "Simpan Tahun Ajaran" atau "Tambah Mapel" pada form.',
      review: 'Status tahun ajaran akan berganti menjadi "AKTIF". Seluruh data ini menjadi basis pengisian jadwal dan penilaian oleh guru pengampu.'
    },
    {
      id: 3,
      title: 'Langkah 3: Registrasi Pengguna & Pembagian Kelas (Admin)',
      desc: 'Mendaftarkan akun guru, siswa, dan orang tua serta menghubungkan relasi antar data.',
      icon: <UserPlus size={24} color="#10b981" />,
      actor: 'ADMINISTRATOR',
      badgeColor: '#d1fae5',
      badgeTextColor: '#047857',
      inputs: [
        { label: 'Pembuatan Akun', val: 'Akses "Manajemen User" > Klik "Tambah User Baru". Pilih peran (GURU/SISWA/ORANG TUA).' },
        { label: 'Melengkapi Detail Guru', val: 'Edit profil Guru. Isi NIP, Jabatan, Bidang Studi yang diajarkan, dan status Wali Kelas binaan.' },
        { label: 'Melengkapi Detail Siswa', val: 'Edit profil Siswa. Isi NIS, NISN, pilih Kelas Binaan, dan tautkan ke akun Orang Tua pendamping.' }
      ],
      submission: 'Tekan tombol "Simpan Perubahan" di bagian atas halaman detail profil.',
      review: 'Hubungan relasional otomatis terjalin. Wali Kelas dapat memantau siswanya, Orang Tua dapat memantau rapor anaknya, dan Guru dapat mengajar mata pelajaran terdaftar.'
    },
    {
      id: 4,
      title: 'Langkah 4: Upload RPP & Log Mengajar Kelas (Guru)',
      desc: 'Dokumentasi pembelajaran digital harian dan pelaporan perencanaan mengajar.',
      icon: <UploadCloud size={24} color="#f59e0b" />,
      actor: 'GURU PENGEPU',
      badgeColor: '#fef3c7',
      badgeTextColor: '#b45309',
      inputs: [
        { label: 'Form Modul Ajar (RPP)', val: 'Pilih mata pelajaran pengampu, isi judul modul ajar, deskripsi bahasan, dan tautkan file PDF perencanaan.' },
        { label: 'Form Jurnal Harian (Logs)', val: 'Pilih kelas, masukkan tanggal mengajar harian, ketik topik pembahasan (bab pelajaran), serta catatan khusus perilaku belajar di kelas.' }
      ],
      submission: 'Tekan tombol "Upload RPP" atau "Submit Jurnal".',
      review: 'Dokumentasi mengajar tersimpan di database. Kepala Sekolah dapat meninjau log keaktifan mengajar secara transparan langsung dari dashboard utama.'
    },
    {
      id: 5,
      title: 'Langkah 5: Input Nilai Siswa & Evaluasi Rapor (Guru / Wali Kelas)',
      desc: 'Pengisian evaluasi performa akademik siswa secara berkala sepanjang semester.',
      icon: <Edit3 size={24} color="#8b5cf6" />,
      actor: 'GURU & WALI KELAS',
      badgeColor: '#f5f3ff',
      badgeTextColor: '#6d28d9',
      inputs: [
        { label: 'Form Nilai Harian', val: 'Klik "Buka Form Nilai". Pilih jenis nilai (UTS, UAS, Tugas, Kuis), pilih mata pelajaran, dan isi skor angka (0 - 100).' },
        { label: 'Form Evaluasi Rapor', val: 'Wali Kelas mengisi Form Catatan Wali Kelas (rekomendasi kepribadian, kelakuan, kerajinan) serta status kenaikan kelas.' }
      ],
      submission: 'Klik tombol "Simpan Nilai" atau "Kirim Evaluasi Rapor".',
      review: 'Sistem memverifikasi integritas input nilai. Seluruh nilai langsung terakumulasi pada kartu rekaman akademik siswa tersebut secara terpadu.'
    },
    {
      id: 6,
      title: 'Langkah 6: Meninjau Hasil Akhir & Cetak Buku Rapor (Siswa / Orang Tua)',
      desc: 'Tahap akhir evaluasi hasil belajar yang transparan dan digital.',
      icon: <Printer size={24} color="#ec4899" />,
      actor: 'SISWA, ORANG TUA, SYSTEM',
      badgeColor: '#fce7f3',
      badgeTextColor: '#be185d',
      inputs: [
        { label: 'Proses Otomatis Sistem', val: 'Sistem secara otomatis menghitung nilai rata-rata kelas, merangkum rata-rata terbobot mata pelajaran, serta menentukan ranking semester.' },
        { label: 'Akses Portal Siswa/Wali', val: 'Siswa atau Orang Tua masuk ke portal mereka masing-masing dan memilih tab "Buku Rapor".' }
      ],
      submission: 'Aksi: Klik tombol "Cetak Rapor PDF" untuk menyimpan salinan digital resmi.',
      review: 'Buku Rapor Digital terbit lengkap dengan detail nilai per mata pelajaran, nilai rata-rata, ranking, kehadiran siswa (Sakit, Izin, Alfa), catatan wali kelas, dan validasi Kepala Sekolah.'
    }
  ];

  return (
    <div style={{ padding: '0.5rem' }}>
      <header className={styles.pageHeader} style={{ marginBottom: '2rem' }}>
        <div className={styles.greeting}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
            <HelpCircle size={32} color="#6366f1" /> Panduan Penggunaan Sistem
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            Tinjauan siklus akademik terintegrasi VisiSekolah untuk Admin, Guru, dan Siswa/Orang Tua.
          </p>
        </div>
      </header>

      {/* Visual Timeline Card */}
      <div className={styles.card} style={{ marginBottom: '2rem', background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="#6366f1" /> Siklus & Alur Akademik Terpadu
        </h3>
        
        {/* Horizontal Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', position: 'relative' }}>
          {steps.map((step, idx) => (
            <div key={step.no} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: step.color, color: step.textColor, fontWeight: 700, fontSize: '0.875rem' }}>
                  {step.no}
                </span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: step.textColor, padding: '2px 8px', borderRadius: '12px', background: step.color }}>
                  {step.actor}
                </span>
              </div>

              <h4 style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
                {step.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('admin')} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', background: activeTab === 'admin' ? '#e0e7ff' : 'none', color: activeTab === 'admin' ? '#4338ca' : '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}
        >
          <Shield size={18} /> Panduan Staf Administrator
        </button>
        <button 
          onClick={() => setActiveTab('teacher')} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', background: activeTab === 'teacher' ? '#e0e7ff' : 'none', color: activeTab === 'teacher' ? '#4338ca' : '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}
        >
          <GraduationCap size={18} /> Panduan Penggunaan Guru
        </button>
        <button 
          onClick={() => setActiveTab('student')} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', background: activeTab === 'student' ? '#e0e7ff' : 'none', color: activeTab === 'student' ? '#4338ca' : '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}
        >
          <Users size={18} /> Panduan Siswa & Wali Murid
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ marginBottom: '2.5rem' }}>
        {activeTab === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.card}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#4338ca" /> Inisialisasi & Setup Institusi
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Manajemen Tahun Ajaran:</strong> Akses menu <strong>Data Akademik</strong> untuk mendefinisikan kurikulum serta semester aktif saat ini.
                </li>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Registrasi Multi-Akun:</strong> Menu <strong>Manajemen User</strong> mendukung pembuatan akun terpadu untuk Kepala Sekolah, Guru, Staf Admin, Siswa, dan Wali Murid.
                </li>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Penggabungan Relasional Wali Murid:</strong> Saat mengedit detail akun Siswa atau Orang Tua, Anda dapat melakukan tautan (Link) anak-orang tua untuk mempublikasikan laporan performa rapor digital secara terpadu.
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="#0ea5e9" /> Penugasan & Kenaikan Kelas
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Penugasan Mengajar Guru:</strong> Klik nama guru pada menu user detail untuk menambahkan Bidang Studi yang mereka ajar serta menetapkan kelas di mana mereka bertindak sebagai Wali Kelas.
                </li>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Evaluasi Riwayat Kelas:</strong> Lakukan pemantauan status kelulusan dan kenaikan kelas siswa secara berkala melalui Rekam Riwayat Akademik.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'teacher' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.card}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#f59e0b" /> RPP & Jurnal Mengajar Harian
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Modul Ajar Digital (RPP):</strong> Guru pengampu dapat mengunggah RPP / Silabus digital ke dalam pangkalan data terintegrasi yang terikat langsung dengan kode pelajaran.
                </li>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Jurnal Mengajar Kelas (Teaching Logs):</strong> Setelah kegiatan belajar mengajar selesai, Guru wajib mengisi catatan harian yang berisi bahasan materi, bab pelajaran, serta catatan perilaku siswa di kelas.
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={20} color="#8b5cf6" /> Manajemen Nilai & Evaluasi Rapor
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Input Nilai UTS & UAS:</strong> Pengisian bobot nilai evaluasi harian, UTS, UAS, tugas, dan kuis dapat dilakukan dengan cepat di panel akademik siswa binaan Anda.
                </li>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Catatan Wali Kelas:</strong> Wali kelas memberikan evaluasi komprehensif berupa catatan kepribadian dan rekomendasi perkembangan siswa untuk dicetak langsung pada Buku Rapor.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'student' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.card}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#0ea5e9" /> Portal Perkembangan Anak
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Laporan Belajar Realtime:</strong> Orang Tua dapat memantau kehadiran harian siswa, jurnal mengajar guru, serta nilai mata pelajaran anak secara langsung dari portal masing-masing.
                </li>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Transparansi Penilaian:</strong> Seluruh komponen nilai (Tugas, Kuis, UTS, UAS) ditampilkan secara transparan bersama dengan catatan wali kelas.
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#10b981" /> Publikasi Buku Rapor
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0f172a' }}>Buku Rapor Digital:</strong> Siswa dan Wali Murid dapat melihat rekapitulasi nilai akhir semester lengkap dengan grafik rata-rata kelas dan status kenaikan kelas di akhir tahun ajaran.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Step-by-Step Walkthrough Section */}
      <div className={styles.card} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ClipboardList size={24} color="#6366f1" /> Tutorial Langkah demi Langkah (End-to-End Walkthrough)
        </h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>
          Ikuti tutorial interaktif di bawah ini untuk melihat bagaimana data mengalir dari tahap pertama hingga penyelesaian Buku Rapor akhir tahun secara mandiri.
        </p>

        {/* Step-by-Step Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tutorialSteps.map((step) => (
            <div 
              key={step.id} 
              style={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                background: activeStep === step.id ? '#f8fafc' : '#ffffff',
                transition: 'all 0.2s'
              }}
            >
              {/* Step Header */}
              <button
                onClick={() => setActiveStep(activeStep === step.id ? 0 : step.id)}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: step.badgeColor 
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                      {step.title}
                    </h4>
                    <span style={{ 
                      fontSize: '0.6875rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      color: step.badgeTextColor,
                      background: step.badgeColor,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      marginTop: '4px',
                      display: 'inline-block'
                    }}>
                      Aktor: {step.actor}
                    </span>
                  </div>
                </div>
                {activeStep === step.id ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
              </button>

              {/* Step Details Body */}
              {activeStep === step.id && (
                <div style={{ 
                  padding: '0 1.25rem 1.25rem 1.25rem', 
                  borderTop: '1px solid #e2e8f0', 
                  background: '#ffffff',
                  fontSize: '0.875rem',
                  color: '#475569'
                }}>
                  <p style={{ marginTop: '1rem', marginBottom: '1.25rem', fontStyle: 'italic', color: '#64748b' }}>
                    {step.desc}
                  </p>

                  {/* Form & Components Section */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Mengisi & Melengkapi Form / Komponen:
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                      {step.inputs.map((inp, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '10px' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>• {inp.label}</span>
                          <span>: {inp.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Flow */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h5 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Aksi Submit:
                    </h5>
                    <p style={{ margin: 0, paddingLeft: '8px', borderLeft: '3px solid #6366f1', color: '#334155', fontWeight: 500 }}>
                      {step.submission}
                    </p>
                  </div>

                  {/* Process Result Review */}
                  <div>
                    <h5 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, color: '#10b981', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Meninjau Hasil Proses:
                    </h5>
                    <p style={{ margin: 0, padding: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#064e3b', fontWeight: 500 }}>
                      {step.review}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
