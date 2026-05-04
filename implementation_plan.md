# VisiSekolah - White Label School Application Platform

VisiSekolah adalah platform *white label* multi-tenant yang dirancang untuk sekolah-sekolah di Indonesia (SD, SMP, SMA). Platform ini memungkinkan setiap sekolah memiliki identitas digital sendiri dengan fitur manajemen pendidikan yang lengkap.

## 1. System Architecture

### Multi-Tenancy Strategy: Subdomain/Domain Routing
Kami akan menggunakan pendekatan **Shared Database, Isolated Schema (Logical Separation)**.
- **Routing**: Menggunakan Next.js Middleware untuk mendeteksi `hostname`.
  - `admin.visisekolah.id` -> Super Admin Dashboard.
  - `[school-slug].visisekolah.id` atau `customdomain.com` -> School App (Siswa, Guru, Orang Tua, Admin Sekolah).
- **Data Isolation**: Setiap tabel utama akan memiliki kolom `tenantId` (ID Sekolah). Row-Level Security (RLS) di PostgreSQL atau filter global di Prisma middleware akan digunakan untuk memastikan isolasi data.
- **Branding Architecture**: Konfigurasi branding (warna, logo, font) disimpan di database dan diinjeksi ke frontend melalui CSS Custom Properties (Variables) di root layout.

### Infrastructure Map
- **Frontend/Backend**: Next.js 15 (App Router) di Vercel.
- **Database**: PostgreSQL (Neon DB) untuk skalabilitas serverless.
- **File Storage**: Vercel Blob atau AWS S3 (untuk logo, materi, tugas).
- **Authentication**: Auth.js (NextAuth) atau Clerk dengan dukungan multi-tenant.
- **Payments**: Integrasi Midtrans (lebih populer di Indonesia).

## 2. Tech Stack

| Layer | Technology | Reason |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 15 (App Router) | SEO friendly, React Server Components, Fast Refresh. |
| **Styling** | Sass/SCSS | Fleksibilitas tinggi untuk white-label (theming) tanpa batasan utility classes. |
| **Database** | Neon DB (PostgreSQL) | Serverless, branching feature, auto-scaling. |
| **ORM** | Prisma | Type-safety, mudah dimigrasi, query builder yang intuitif. |
| **Authentication** | NextAuth.js | Custom provider support, session management yang fleksibel. |
| **State Management**| TanStack Query (Zustand jika perlu) | Cache management yang kuat untuk dashboard kompleks. |
| **Forms** | React Hook Form + Zod | Validasi data yang ketat dan efisien. |
| **Payment Gateway** | Midtrans | Support pembayaran lokal Indonesia (E-wallet, Virtual Account, QRIS). |

## 3. Database Schema (Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Tenancy
model School {
  id            String   @id @default(cuid())
  slug          String   @unique // Subdomain: smp1.visisekolah.id
  customDomain  String?  @unique
  name          String
  address       String?
  phone         String?
  email         String?
  status        String   @default("ACTIVE") // ACTIVE, SUSPENDED, PENDING

  // Branding
  logoUrl       String?
  faviconUrl    String?
  primaryColor  String   @default("#0070f3")
  secondaryColor String  @default("#1c1c1c")
  accentColor   String   @default("#ff4081")
  fontFamily    String   @default("Inter")
  
  // Relations
  users         User[]
  classes       Class[]
  settings      SchoolSettings?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// User Management
enum Role {
  SUPER_ADMIN
  SCHOOL_ADMIN
  GURU
  SISWA
  ORANG_TUA
}

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  password      String
  name          String
  role          Role
  schoolId      String?   // Null for Super Admin
  school        School?   @relation(fields: [schoolId], references: [id])
  
  // Specific Data
  guruProfile   GuruProfile?
  siswaProfile  SiswaProfile?
  parentProfile ParentProfile?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Modules
model Class {
  id        String   @id @default(cuid())
  name      String
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id])
  students  SiswaProfile[]
  // ... more relations
}

// ... Additional models for Attendance, Grades, etc.
```

## 4. Roadmap & Fitur Lengkap

### Phase 1: MVP (Core Tenancy & Admin)
- [ ] Core: Multi-tenant middleware & routing.
- [ ] Super Admin: Sekolah management (CRUD, Status).
- [ ] School Admin: Branding customization (Color picker, Logo upload).
- [ ] User Auth: Login/Logout berdasarkan role & school context.
- [ ] Core Modules: Data Guru, Siswa, Kelas.
- [ ] Basic Attendance (Absensi manual).

### Phase 2: Learning & Communication
- [ ] E-Learning: Materi & Tugas (Upload/Download).
- [ ] Digital Gradebook (Nilai harian & Rapor).
- [ ] Advanced Attendance: QR Code & Geofencing.
- [ ] Communication: Pengumuman (Push Notification) & Forum Kelas.
- [ ] School Calendar.

### Phase 3: Premium & Integrations
- [ ] Payment Gateway: SPP & Tagihan (Midtrans).
- [ ] E-Library & Digital Library.
- [ ] Quiz & Assessment Online.
- [ ] Mobile App (Progressive Web App - PWA).
- [ ] Global Analytics for Super Admin.

## 5. Flow User

1. **Super Admin**: Login ke `admin.visisekolah.id` -> Pantau sekolah baru -> Approve pendaftaran -> Kelola langganan.
2. **School Admin**: Login ke domain sekolah -> Set up branding -> Input data guru & siswa -> Set up jadwal.
3. **Guru**: Login -> Lihat jadwal -> Absensi siswa -> Input nilai -> Upload materi.
4. **Siswa**: Login -> Lihat tugas -> Kumpulkan PR -> Lihat nilai & rapor -> Bayar SPP.
5. **Orang Tua**: Login -> Monitor absensi anak -> Lihat progres nilai -> Bayar tagihan sekolah.

## 6. Implementation Detail: White Label Branding

Branding diimplementasikan menggunakan CSS Variables yang di-*inject* secara dinamis:

```scss
// styles/_variables.scss
:root {
  --primary-color: #{$default-primary};
  --secondary-color: #{$default-secondary};
  // ...
}

// Di Layout Server Component:
const school = await getSchoolConfig(hostname);
return (
  <html style={{ 
    '--primary-color': school.primaryColor,
    '--secondary-color': school.secondaryColor 
  }}>
    ...
  </html>
)
```

## 7. Development Timeline (MVP)

| Minggu | Fokus |
| :--- | :--- |
| **Minggu 1** | Setup environment, Database architecture, Auth, & Multi-tenant Routing. |
| **Minggu 2** | Super Admin Dashboard & School Admin Branding. |
| **Minggu 3** | User Management (Guru, Siswa) & Basic Class Management. |
| **Minggu 4** | Core Attendance & Final Polish for MVP. |

**Total Estimasi MVP: 1 Bulan (4 Minggu).**
