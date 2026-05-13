# SMA VisiSekolah - Official Portal

Portal digital resmi **SMA VisiSekolah** yang dirancang untuk memudahkan proses Penerimaan Peserta Didik Baru (PPDB) dan manajemen akademik internal sekolah secara modern dan terintegrasi.

## ✨ Fitur Utama
- **PPDB Online 2026/2027**: Sistem informasi pendaftaran siswa baru yang mudah diakses.
- **CMS Konten Sekolah**: Pengelolaan informasi statik, pengumuman, dan FAQ langsung dari dashboard admin.
- **AI-Powered Translation**: Dukungan konten Bahasa Indonesia & Inggris yang disinkronkan secara otomatis menggunakan AI.
- **Portal Akademik**: Manajemen data siswa, guru, kelas, dan jadwal pelajaran dalam satu dashboard terpadu.
- **Professional Dashboard**: Antarmuka khusus untuk Kepala Sekolah (Principal) dan Staff Administrasi.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma
- **Styling**: Vanilla CSS with SCSS
- **AI**: Google Gemini Pro (Translation Engine)
- **Email**: Resend & SMTP

## 🚀 Cara Instalasi (Lokal)

1. **Clone & Install**:
   ```bash
   git clone https://github.com/prozazba/VisiSekolah.git
   cd VisiSekolah
   npm install
   ```

2. **Environment Variables**:
   Salin `.env.example` menjadi `.env` dan lengkapi variabel berikut:
   - `DATABASE_URL`: URL koneksi database PostgreSQL.
   - `SESSION_SECRET`: Kode rahasia untuk sesi autentikasi.
   - `GEMINI_API_KEY`: Key untuk fitur auto-translate AI.

3. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Server**:
   ```bash
   npm run dev
   ```

## 📄 Lisensi
SMA VisiSekolah & Komite. Seluruh hak cipta dilindungi.
