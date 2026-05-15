# VisiSekolah System Settings Guide

Halaman **System Settings** adalah pusat kendali global untuk portal sekolah Anda. Di sini, Administrator dapat mengonfigurasi parameter identitas, keamanan, dan integrasi teknis yang akan berdampak pada seluruh ekosistem digital sekolah.

---

## 📋 Struktur Modul Pengaturan

### 1. General Info (Informasi Umum)
Bagian ini menangani identitas dasar sekolah yang akan muncul di publik dan portal internal.
- **Official School Name**: Nama resmi instansi yang akan ditampilkan di Header, Footer, dan Judul Halaman.
- **Portal URL**: Alamat domain resmi Anda (Read-only untuk keamanan).
- **Academic Year**: Menentukan tahun ajaran aktif untuk filter data akademik.
- **System Language**: Mengatur bahasa default antarmuka sistem (ID/EN).
- **Contact Number**: Nomor telepon resmi sekolah untuk integrasi tombol "Hubungi Kami".

### 2. Security & Auth (Keamanan & Autentikasi)
Konfigurasi perlindungan akses akun pengguna.
- **Password Policy**: Mengatur tingkat kerumitan kata sandi (Standard atau Strong).
- **Two-Factor Authentication (2FA)**: Mewajibkan verifikasi ganda untuk seluruh akun Administrator guna mencegah akses yang tidak sah.
- **Master Root Password**: Fitur pembaruan kata sandi tingkat tinggi untuk kontrol penuh sistem.

### 3. Email Service (SMTP)
Integrasi layanan pengiriman email otomatis (pendaftaran siswa, reset password, notifikasi).
- **SMTP Host**: Alamat server pengirim email (contoh: `smtp.resend.com`).
- **SMTP Port**: Port pengiriman (biasanya `587` untuk TLS).
- **Test Email**: Tombol untuk memverifikasi apakah konfigurasi email sudah berjalan dengan benar.

---

## 🚀 Tutorial: Langkah Awal Konfigurasi

Ikuti panduan ini saat pertama kali mengaktifkan portal sekolah Anda:

### Langkah 1: Memperbarui Nama Sekolah
1. Buka menu **System Settings** di Dashboard Admin.
2. Pastikan tab **General Info** terpilih.
3. Ubah kolom `Official School Name` menjadi nama sekolah Anda (misal: *Akademi VisiSekolah*).
4. Klik tombol **Save Changes** di pojok kanan atas.
   > [!NOTE]
   > Perubahan ini akan segera tersinkronisasi ke Landing Page dan Portal Siswa/Guru.

### Langkah 2: Mengatur Tahun Ajaran Aktif
1. Pada tab yang sama (General Info), cari dropdown **Current Academic Year**.
2. Pilih tahun ajaran yang sedang berjalan (misal: *2026/2027*).
3. Klik **Save Changes**. Hal ini memastikan laporan absensi dan nilai masuk ke periode yang benar.

### Langkah 3: Verifikasi Pengaturan Email
1. Klik tab **Email (SMTP)** pada navigasi sidebar.
2. Masukkan kredensial SMTP yang Anda dapatkan dari provider email (misal: Resend atau Gmail).
3. Klik **Save Changes**.
4. Klik tombol **Send Test Email**. Jika Anda menerima email di inbox Admin, maka sistem pendaftaran otomatis telah aktif.

---

## ⚠️ Peringatan Penting
- **Perubahan Identitas**: Mengubah Nama Sekolah secara drastis dapat mempengaruhi indeks SEO pencarian sekolah Anda.
- **Keamanan SMTP**: Pastikan port dan host benar. Kesalahan pada SMTP akan menyebabkan fitur "Lupa Password" dan "Pendaftaran Online" tidak berfungsi.
- **2FA**: Jika 2FA diaktifkan, pastikan seluruh Administrator memiliki akses ke perangkat verifikasi mereka sebelum logout.

---

> [!TIP]
> Gunakan fitur **Data & Backups** (Coming Soon) secara rutin setiap akhir semester untuk mengamankan data akademik siswa dalam format terkompresi.
