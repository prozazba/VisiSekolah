# SMA VisiSekolah - Digital Portal & Management System

VisiSekolah telah bertransformasi dari platform SaaS multi-tenant menjadi portal digital eksklusif untuk **SMA VisiSekolah**. Fokus utama saat ini adalah mendukung **PPDB (Penerimaan Peserta Didik Baru)** dan manajemen internal sekolah.

## 1. Arsitektur Sistem (Single-School Architecture)

### Strategi Deployment
- **Domain**: `sma-visisekolah.sch.id` (Production)
- **Infrastructure**: Next.js 16 (App Router) di Vercel.
- **Database**: PostgreSQL (Neon DB) dengan satu skema utama (Default School ID).
- **Isolasi**: Tidak lagi menggunakan routing berbasis hostname/slug. Semua route bersifat flat dan melayani satu institusi.

## 2. Tech Stack

| Layer | Technology | Status |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Active |
| **Styling** | Sass/SCSS | Active (Professional & Modern) |
| **Database** | Neon DB (PostgreSQL) | Active |
| **ORM** | Prisma | Active |
| **AI** | Google Gemini | Active (Auto-Translate & Content) |
| **Email** | Resend / Nodemailer | Active |

## 3. Fitur Utama (Produksi)

### A. Portal Publik & PPDB
- **Landing Page**: Branding SMA VisiSekolah dengan fokus pada keunggulan akademik dan pendaftaran siswa baru.
- **PPDB Flow**: CTA "Daftar PPDB Online" yang mengarahkan ke form kontak/registrasi.
- **Multi-Bahasa**: Dukungan penuh Bahasa Indonesia dan Inggris dengan sinkronisasi AI.
- **FAQ & Informasi**: Daftar tanya-jawab seputar pendaftaran dan profil sekolah.

### B. Admin CMS & Dashboard
- **Content Management**: Dashboard untuk mengedit teks statik (Hero, Features, About) tanpa menyentuh kode.
- **AI Translation Sync**: Fitur satu klik untuk menerjemahkan seluruh konten website menggunakan Gemini AI.
- **Akademik**: Manajemen data Guru, Siswa, Kelas, dan Pengumuman.
- **Branding**: Kustomisasi warna tema dan identitas visual sekolah.

## 4. Persiapan Produksi (Checklist)

### Baut & Mur (Technical)
- [x] Penghapusan infrastruktur multi-tenant (Middleware, Slug routing).
- [x] Pembersihan build errors (School slug references).
- [x] Sinkronisasi Schema Prisma dengan kebutuhan single-school.
- [x] Setup `.env.example` untuk referensi deployment.
- [x] Build check (Next.js production build).

### Konten & Branding
- [x] Redaksi PPDB Tahun Ajaran 2026/2027.
- [x] Lokasi Sekretariat PPDB & Kontak Resmi.
- [x] Seeding database dengan profil default SMA VisiSekolah.

## 5. Timeline Operasional

- **Mei 2026**: Peluncuran Portal PPDB & Sistem Administrasi Dasar.
- **Juni 2026**: Aktivasi Modul Akademik (Jadwal & Absensi).
- **Juli 2026**: Onboarding Siswa Baru ke Portal Siswa.
