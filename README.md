# VisiSekolah - White Label School Platform

VisiSekolah adalah sistem manajemen sekolah multi-tenant yang memungkinkan setiap sekolah memiliki aplikasi dengan branding mereka sendiri.

## Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Sass/SCSS (No Tailwind)
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Prisma

## Fitur Utama
1. **Multi-Tenancy**: Otomatis mendeteksi sekolah berdasarkan subdomain (misal: `smp1.visisekolah.id`).
2. **White Labeling**: Sekolah dapat mengatur warna, logo, dan nama aplikasi mereka sendiri.
3. **Dashboards**:
   - Super Admin (Owner Platform)
   - School Admin
   - Guru
   - Siswa & Orang Tua
4. **Modul Akademik**: Absensi, Tugas, Nilai, Jadwal, Forum.
5. **Pembayaran**: Integrasi Midtrans untuk tagihan SPP.

## Cara Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/prozazba/VisiSekolah.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Salalin `.env.example` ke `.env` dan isi variabel yang dibutuhkan:
   - `DATABASE_URL`: Koneksi ke Neon DB.
   - `NEXTAUTH_SECRET`: Secret untuk autentikasi.

4. Setup Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run Development Server:
   ```bash
   npm run dev
   ```

## Struktur Multi-Tenant
Sistem ini menggunakan middleware untuk melakukan routing dinamis berdasarkan hostname:
- `admin.visisekolah.id` -> `src/app/admin`
- `[school].visisekolah.id` -> `src/app/_sites/[site]`
- `visisekolah.id` -> `src/app/page.tsx` (Landing Page)

## Testing Local dengan Subdomain
Untuk testing lokal, Anda dapat mengedit file `hosts` Anda:
```text
127.0.0.1 smp1.localhost
127.0.0.1 admin.localhost
```
Lalu akses `smp1.localhost:3000` di browser.
