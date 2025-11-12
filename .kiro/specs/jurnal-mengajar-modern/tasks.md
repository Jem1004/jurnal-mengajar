# Implementation Plan - Aplikasi Jurnal Mengajar Modern

## Overview
Task list ini berisi langkah-langkah implementasi untuk membangun Aplikasi Jurnal Mengajar Modern. Setiap task dirancang untuk dapat dikerjakan secara incremental dan terintegrasi dengan task sebelumnya.

---

- [x] 1. Setup project dan konfigurasi dasar
  - Inisialisasi Next.js project dengan App Router dan TypeScript
  - Install dependencies: Prisma, NextAuth, Tailwind CSS, Zod, dan library pendukung lainnya
  - Konfigurasi Tailwind CSS dengan custom theme (colors, spacing)
  - Setup environment variables (.env.example dan .env.local)
  - Konfigurasi TypeScript (tsconfig.json) untuk path aliases
  - _Requirements: Semua requirements memerlukan setup project_

- [-] 2. Setup PostgreSQL dengan Docker untuk development
  - Buat file `docker-compose.yml` di root project untuk PostgreSQL container
  - Konfigurasi PostgreSQL dengan environment variables (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
  - Expose port 5432 untuk akses dari host
  - Tambahkan volume untuk persist data
  - Tambahkan script di package.json untuk start/stop database: `npm run db:up`, `npm run db:down`
  - Update .env.local dengan DATABASE_URL yang mengarah ke Docker container
  - _Requirements: Semua requirements memerlukan database_

- [ ] 3. Setup Prisma ORM dan database schema
  - [ ] 3.1 Buat Prisma schema dengan semua models
    - Definisikan model User, Guru, Kelas, MataPelajaran, Siswa, Jadwal, Jurnal, Absensi, TagSiswaRecord
    - Definisikan enums: Role, StatusAbsensi, TagSiswa
    - Tambahkan relations, indexes, dan unique constraints sesuai design
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 3.2 Generate Prisma Client dan jalankan migrasi
    - Generate Prisma Client dengan command `npx prisma generate`
    - Buat initial migration dengan `npx prisma migrate dev --name init`
    - Verifikasi database schema di PostgreSQL dengan `npx prisma studio`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 3.3 Buat Prisma client singleton
    - Buat file `/lib/prisma.ts` dengan singleton pattern untuk Prisma Client
    - Implementasi connection pooling dan error handling
    - _Requirements: Semua requirements yang mengakses database_

- [ ] 4. Implementasi authentication dengan NextAuth
  - [ ] 4.1 Konfigurasi NextAuth dengan Credentials Provider
    - Buat file `/lib/auth.ts` dengan authOptions
    - Implementasi CredentialsProvider untuk login username/password
    - Konfigurasi callbacks (jwt, session) untuk menambahkan role dan userId
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ] 4.2 Buat API route handler untuk NextAuth
    - Buat file `/app/api/auth/[...nextauth]/route.ts`
    - Export GET dan POST handlers dengan authOptions
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 4.3 Implementasi middleware untuk route protection
    - Buat file `/middleware.ts` untuk protect routes berdasarkan role
    - Redirect unauthorized users ke login page
    - Redirect guru ke dashboard guru, admin ke dashboard admin
    - _Requirements: 1.4, 1.5_
  
  - [ ] 4.4 Buat halaman login
    - Buat file `/app/(auth)/login/page.tsx` dengan form login
    - Implementasi client component dengan form handling
    - Tampilkan error message jika login gagal
    - Redirect ke dashboard setelah login sukses
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 5. Buat reusable UI components dengan Tailwind
  - Buat komponen dasar di `/components/ui/`: Button, Input, Textarea, Select, Card, Badge, Modal, Table
  - Implementasi styling dengan Tailwind CSS dan variants
  - Buat komponen responsive dan accessible
  - _Requirements: Semua requirements memerlukan UI components_

- [ ] 6. Implementasi service layer untuk business logic
  - [ ] 6.1 Buat Master Data Service
    - Buat file `/lib/services/master.service.ts`
    - Implementasi CRUD methods untuk Guru, Kelas, MataPelajaran, Siswa, Jadwal
    - Tambahkan error handling dan validation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 6.2 Buat Jurnal Service
    - Buat file `/lib/services/jurnal.service.ts`
    - Implementasi methods: createJurnal, getJurnalByJadwal, getJurnalByGuru, updateJurnal
    - Implementasi logic untuk menyimpan absensi dan tag siswa bersamaan dengan jurnal
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5, 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 6.3 Buat Analytics Service
    - Buat file `/lib/services/analytics.service.ts`
    - Implementasi methods untuk: getKeterlaksanaanTP, getAbsensiAnalytics, getTindakLanjutStats
    - Implementasi aggregation queries dengan Prisma
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 6.4 Buat Admin Service untuk reports
    - Buat file `/lib/services/admin.service.ts`
    - Implementasi methods: getKeterisisanJurnal, getAggregateAbsensi
    - Implementasi filtering dan aggregation untuk laporan admin
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 7. Implementasi Server Actions untuk data operations
  - [ ] 7.1 Buat Server Actions untuk Jurnal
    - Buat file `/app/actions/jurnal.ts` dengan directive 'use server'
    - Implementasi actions: createJurnal, getJadwalHariIni, getJurnalById, updateJurnal
    - Tambahkan validation dengan Zod schema
    - Integrate dengan JurnalService
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 7.2 Buat Server Actions untuk Master Data
    - Buat file `/app/actions/master.ts` dengan directive 'use server'
    - Implementasi CRUD actions untuk semua master entities
    - Tambahkan authorization check (hanya admin)
    - Integrate dengan MasterService
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 7.3 Buat Server Actions untuk Analytics
    - Buat file `/app/actions/analytics.ts` dengan directive 'use server'
    - Implementasi actions untuk fetch analytics data
    - Integrate dengan AnalyticsService dan AdminService
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 8. Implementasi Dashboard Guru
  - [ ] 8.1 Buat halaman Dashboard Guru
    - Buat file `/app/(guru)/dashboard/page.tsx` sebagai Server Component
    - Fetch jadwal hari ini menggunakan Server Action getJadwalHariIni
    - Tampilkan list jadwal dengan informasi waktu, kelas, mata pelajaran
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 8.2 Buat komponen Jadwal Card
    - Buat file `/components/dashboard/jadwal-card.tsx`
    - Tampilkan button "Isi Jurnal" jika belum terisi, atau badge "Terisi" jika sudah
    - Implementasi link ke halaman form jurnal
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 9. Implementasi Form Jurnal Mengajar
  - [ ] 9.1 Buat halaman Form Jurnal
    - Buat file `/app/(guru)/jurnal/[jadwalId]/page.tsx` sebagai Client Component
    - Fetch data jadwal dan siswa di server, pass sebagai props
    - Implementasi form dengan sections: Info Sesi, Detail Pembelajaran, Absensi, Catatan
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 9.2 Implementasi Bagian Info Sesi (pre-filled)
    - Tampilkan field read-only untuk Waktu/Jam, Kelas, Mata Pelajaran
    - Ambil data dari jadwal yang dipilih
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 9.3 Implementasi Bagian Detail Pembelajaran
    - Buat textarea untuk Tujuan Pembelajaran (required)
    - Buat textarea untuk Kegiatan Pembelajaran (required)
    - Buat textarea untuk Asesmen/Penilaian (optional)
    - Tambahkan client-side validation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 9.4 Implementasi Smart Checklist Absensi
    - Buat komponen `/components/forms/absensi-checklist.tsx`
    - Tampilkan daftar siswa dengan status default "Hadir"
    - Implementasi toggle untuk mengubah status (Sakit, Izin, Alpa)
    - Hitung dan tampilkan rekap otomatis (Hadir, Sakit, Izin, Alpa)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 9.5 Implementasi Bagian Catatan & Tindak Lanjut
    - Buat textarea untuk Catatan Khusus (optional)
    - Buat input field untuk Link Bukti Pembelajaran (optional) dengan URL validation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 9.6 Implementasi Modal Tag Siswa
    - Buat komponen `/components/forms/tag-siswa-modal.tsx`
    - Tampilkan button "Tandai Siswa" yang membuka modal
    - Di modal, tampilkan dropdown siswa dan radio buttons untuk tag
    - Implementasi logic untuk menyimpan multiple tags
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 9.7 Implementasi submit form dan save jurnal
    - Buat handler untuk submit form yang memanggil Server Action createJurnal
    - Kirim semua data: detail pembelajaran, absensi, catatan, link bukti, tag siswa
    - Tampilkan loading state saat menyimpan
    - Redirect ke dashboard dengan success notification setelah berhasil
    - Tampilkan error message jika gagal
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 10. Implementasi Halaman Analitik Personal Guru
  - [ ] 10.1 Buat halaman Analitik Personal
    - Buat file `/app/(guru)/analitik/page.tsx` sebagai Server Component
    - Fetch analytics data menggunakan Server Actions
    - Tampilkan layout dengan cards untuk setiap jenis analitik
    - _Requirements: 10.1, 11.1, 12.1_
  
  - [ ] 10.2 Implementasi Card Keterlaksanaan TP
    - Buat komponen untuk menampilkan progress TP
    - Tampilkan format: "Anda sudah mengajar X dari Y TP semester ini"
    - Tambahkan progress bar atau chart visual
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 10.3 Implementasi Card Analitik Absensi Siswa
    - Buat komponen untuk menampilkan siswa dengan absensi tertinggi
    - Tampilkan format: "Dalam 30 hari terakhir, siswa [Nama] paling sering absen (Xx)"
    - Tampilkan breakdown per jenis ketidakhadiran
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 10.4 Implementasi Card Analitik Tindak Lanjut
    - Buat komponen untuk menampilkan siswa yang perlu ditindaklanjuti
    - Tampilkan format: "Anda memiliki X siswa yang ditandai [Tag] yang belum ditindaklanjuti"
    - Implementasi link ke detail jurnal saat nama siswa diklik
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 11. Implementasi Dashboard Admin
  - [ ] 11.1 Buat halaman Dashboard Admin
    - Buat file `/app/(admin)/dashboard/page.tsx` sebagai Server Component
    - Tampilkan overview metrics dan links ke management pages
    - Fetch summary data untuk keterisian jurnal dan absensi
    - _Requirements: 13.1, 14.1_
  
  - [ ] 11.2 Buat halaman Laporan Keterisian Jurnal
    - Buat file `/app/(admin)/laporan/keterisian/page.tsx`
    - Fetch data keterisian jurnal per guru menggunakan Server Action
    - Tampilkan table dengan kolom: Nama Guru, Total Jadwal, Jurnal Terisi, Persentase
    - Implementasi filter periode (hari ini, minggu ini, bulan ini, semester)
    - Tambahkan color coding (hijau untuk rutin, merah untuk tidak rutin)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 11.3 Buat halaman Laporan Agregat Absensi
    - Buat file `/app/(admin)/laporan/absensi/page.tsx`
    - Fetch data agregat absensi menggunakan Server Action
    - Tampilkan total Hadir, Sakit, Izin, Alpa per hari/minggu
    - Implementasi filter: kelas, periode waktu, jenis ketidakhadiran
    - Tambahkan chart untuk visualisasi trend absensi
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 12. Implementasi CRUD Master Data untuk Admin
  - [ ] 12.1 Buat halaman Management Guru
    - Buat file `/app/(admin)/master/guru/page.tsx`
    - Tampilkan table list guru dengan kolom: Nama, NIP, Username, Email
    - Implementasi button Add, Edit, Delete
    - Buat modal/drawer untuk form add/edit guru
    - Integrate dengan Server Actions untuk CRUD operations
    - _Requirements: 2.1, 2.2_
  
  - [ ] 12.2 Buat halaman Management Kelas
    - Buat file `/app/(admin)/master/kelas/page.tsx`
    - Tampilkan table list kelas dengan kolom: Nama, Tingkat, Jurusan
    - Implementasi CRUD operations dengan modal form
    - _Requirements: 2.1, 2.3_
  
  - [ ] 12.3 Buat halaman Management Mata Pelajaran
    - Buat file `/app/(admin)/master/mata-pelajaran/page.tsx`
    - Tampilkan table list mata pelajaran dengan kolom: Nama, Kode
    - Implementasi CRUD operations dengan modal form
    - _Requirements: 2.1, 2.4_
  
  - [ ] 12.4 Buat halaman Management Siswa
    - Buat file `/app/(admin)/master/siswa/page.tsx`
    - Tampilkan table list siswa dengan kolom: NISN, Nama, Kelas, Jenis Kelamin
    - Implementasi filter berdasarkan kelas
    - Implementasi CRUD operations dengan modal form
    - _Requirements: 2.1, 2.5_
  
  - [ ] 12.5 Buat halaman Management Jadwal
    - Buat file `/app/(admin)/master/jadwal/page.tsx`
    - Tampilkan table jadwal dengan kolom: Guru, Hari, Jam, Kelas, Mata Pelajaran
    - Implementasi filter berdasarkan guru, kelas, atau hari
    - Implementasi CRUD operations dengan form yang memilih dari master data
    - Validasi untuk mencegah jadwal bentrok
    - _Requirements: 2.1, 2.6_

- [ ] 13. Implementasi seeding data untuk development
  - Buat file `/prisma/seed.ts` untuk seed initial data
  - Seed data: 1 admin user, 3 guru users, 3 kelas, 5 mata pelajaran, 30 siswa per kelas, jadwal sample
  - Jalankan seed dengan command `npx prisma db seed`
  - _Requirements: Semua requirements memerlukan test data_

- [ ] 14. Implementasi error handling dan validation
  - [ ] 14.1 Buat custom error classes
    - Buat file `/lib/errors.ts` dengan AppError, ValidationError, NotFoundError, UnauthorizedError
    - _Requirements: Semua requirements memerlukan error handling_
  
  - [ ] 14.2 Buat Zod schemas untuk validation
    - Buat file `/lib/validations/jurnal.schema.ts` untuk validate jurnal input
    - Buat file `/lib/validations/master.schema.ts` untuk validate master data input
    - _Requirements: 5.4, 5.5, 7.3, 9.5_
  
  - [ ] 14.3 Implementasi error boundary
    - Buat file `/app/error.tsx` untuk global error boundary
    - Buat file `/app/(guru)/error.tsx` untuk guru section error boundary
    - Buat file `/app/(admin)/error.tsx` untuk admin section error boundary
    - _Requirements: Semua requirements memerlukan error handling_

- [ ] 15. Polish UI/UX dan responsive design
  - Review semua pages untuk memastikan responsive di mobile, tablet, desktop
  - Implementasi loading states (skeleton, spinner) untuk async operations
  - Implementasi toast notifications untuk success/error messages
  - Tambahkan transitions dan animations untuk better UX
  - _Requirements: Semua requirements memerlukan good UX_

- [ ]* 16. Testing dan quality assurance
  - [ ]* 16.1 Setup testing framework
    - Install dan konfigurasi Vitest atau Jest
    - Setup test database dan Prisma mock
  
  - [ ]* 16.2 Write unit tests untuk services
    - Test MasterService methods
    - Test JurnalService methods
    - Test AnalyticsService methods
    - Test AdminService methods
  
  - [ ]* 16.3 Write integration tests untuk Server Actions
    - Test authentication flow
    - Test jurnal creation flow
    - Test master data CRUD operations
  
  - [ ]* 16.4 Write E2E tests untuk critical flows
    - Test login dan redirect
    - Test guru mengisi jurnal lengkap
    - Test admin mengelola data master

- [ ] 17. Documentation dan deployment preparation
  - Buat README.md dengan setup instructions, tech stack, dan features
  - Buat .env.example dengan semua required environment variables
  - Dokumentasi API endpoints dan Server Actions (jika diperlukan)
  - Setup production database di hosting provider (Railway, Supabase, atau Neon)
  - Deploy aplikasi ke Vercel atau platform lain
  - _Requirements: Semua requirements memerlukan deployment_
