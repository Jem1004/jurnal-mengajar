# Jurnal Mengajar Modern

Aplikasi digital standalone untuk menggantikan jurnal mengajar fisik. Sistem ini dirancang untuk memenuhi dua kebutuhan utama:
1. **Administrasi** - Mencatat aktivitas pengajaran dan absensi siswa secara akurat untuk pelaporan
2. **Pedagogis** - Menjadi alat refleksi guru, dokumentasi bukti pembelajaran, dan penyedia data untuk intervensi siswa

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5+
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Features

### Untuk Guru
- ✅ **Autentikasi Aman** - Login dengan username dan password
- 📅 **Dashboard Jadwal** - Lihat jadwal mengajar hari ini dengan status pengisian jurnal
- 📝 **Form Jurnal Lengkap** - Isi jurnal dengan informasi sesi otomatis dari jadwal
- 📚 **Detail Pembelajaran** - Catat tujuan pembelajaran, kegiatan, dan asesmen
- 📊 **Smart Checklist Absensi** - Semua siswa default hadir, tandai yang tidak hadir saja
- 🏷️ **Tag Siswa** - Tandai siswa untuk remedial, pengayaan, masalah perilaku, atau rujuk BK
- 📎 **Link Bukti Pembelajaran** - Lampirkan link dokumentasi (Google Drive, dll)
- 💬 **Catatan Khusus** - Tambahkan catatan hambatan atau keberhasilan pembelajaran
- 📈 **Analitik Personal** - Lihat keterlaksanaan TP, analitik absensi, dan tindak lanjut siswa

### Untuk Admin
- 👨‍💼 **Dashboard Admin** - Overview metrics dan monitoring sekolah
- 📋 **Manajemen Data Master** - CRUD untuk guru, kelas, mata pelajaran, siswa, dan jadwal
- 📊 **Laporan Keterisian Jurnal** - Monitor kedisiplinan pengisian jurnal per guru
- 📈 **Laporan Agregat Absensi** - Lihat trend absensi seluruh siswa dengan filter dan visualisasi

## Getting Started

### Prerequisites

- **Node.js** 18+ dan npm/yarn
- **Docker** dan Docker Compose (untuk PostgreSQL development)
- **Git** untuk version control

### Installation

#### 1. Clone repository dan install dependencies

```bash
git clone <repository-url>
cd jurnal-mengajar-modern
npm install
```

#### 2. Setup environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi yang sesuai:
- `DATABASE_URL`: Connection string PostgreSQL
- `NEXTAUTH_URL`: URL aplikasi (http://localhost:3000 untuk development)
- `NEXTAUTH_SECRET`: Secret key untuk NextAuth (generate dengan `openssl rand -base64 32`)

#### 3. Start PostgreSQL database (Development)

```bash
npm run db:up
```

Database akan berjalan di `localhost:5432` dengan credentials:
- Username: `postgres`
- Password: `password`
- Database: `jurnal_mengajar`

#### 4. Setup database dengan Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial data (1 admin, 3 guru, sample data)
npx prisma db seed
```

#### 5. Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Default Login Credentials (After Seeding)

**Admin:**
- Username: `admin`
- Password: `admin123`

**Guru:**
- Username: `guru1` / `guru2` / `guru3`
- Password: `guru123`

⚠️ **PENTING**: Ganti password default setelah login pertama kali di production!

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (guru)/            # Guru dashboard & features
│   ├── (admin)/           # Admin dashboard & features
│   ├── api/               # API routes
│   └── actions/           # Server Actions
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions & services
│   ├── services/         # Business logic services
│   ├── validations/      # Zod schemas
│   └── auth.ts           # NextAuth configuration
├── prisma/               # Prisma schema & migrations
└── public/               # Static assets
```

## Available Scripts

### Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run lint` - Run ESLint untuk check code quality

### Database
- `npm run db:up` - Start PostgreSQL container dengan Docker Compose
- `npm run db:down` - Stop dan remove PostgreSQL container
- `npm run db:seed` - Seed database dengan initial data
- `npx prisma studio` - Open Prisma Studio untuk database GUI
- `npx prisma migrate dev` - Create dan apply migration
- `npx prisma generate` - Generate Prisma Client

### Production
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Start production server

## Database Schema

Aplikasi menggunakan PostgreSQL dengan schema berikut:

### Core Tables
- **users** - User accounts (guru dan admin)
- **guru** - Guru profile data
- **kelas** - Rombongan belajar (10-A, 11-IPA-1, dll)
- **mata_pelajaran** - Mata pelajaran
- **siswa** - Data siswa per kelas
- **jadwal** - Jadwal mengajar (guru, kelas, mapel, hari, jam)

### Jurnal Tables
- **jurnal** - Jurnal mengajar (tujuan, kegiatan, asesmen, catatan)
- **absensi** - Absensi siswa per jurnal
- **tag_siswa_record** - Tag siswa untuk tindak lanjut

Lihat `prisma/schema.prisma` untuk detail lengkap schema dan relationships.

## API Documentation

### Server Actions

Aplikasi menggunakan Next.js Server Actions untuk data operations:

#### Jurnal Actions (`/app/actions/jurnal.ts`)
- `createJurnal(data)` - Create jurnal baru dengan absensi dan tag siswa
- `getJadwalHariIni(guruId)` - Get jadwal guru untuk hari ini
- `getJurnalById(id)` - Get detail jurnal by ID
- `updateJurnal(id, data)` - Update jurnal existing

#### Master Data Actions (`/app/actions/master.ts`)
- `getKelas()` - Get all kelas
- `createKelas(data)` - Create kelas baru
- `updateKelas(id, data)` - Update kelas
- `deleteKelas(id)` - Delete kelas
- Similar CRUD operations untuk: Guru, MataPelajaran, Siswa, Jadwal

#### Analytics Actions (`/app/actions/analytics.ts`)
- `getAnalyticsGuru(guruId)` - Get analytics data untuk guru
- `getKeterisisanJurnal(filters)` - Get laporan keterisian jurnal (admin)
- `getAggregateAbsensi(filters)` - Get laporan agregat absensi (admin)

### Authentication

NextAuth.js handles authentication dengan Credentials Provider:
- **Login**: POST `/api/auth/signin`
- **Logout**: POST `/api/auth/signout`
- **Session**: GET `/api/auth/session`

## Deployment

### Production Database Setup

Pilih salah satu provider untuk PostgreSQL production:

#### Option 1: Railway
1. Create account di [Railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy connection string ke `DATABASE_URL` di environment variables

#### Option 2: Supabase
1. Create account di [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database > Connection string
4. Copy connection string (mode: Session) ke `DATABASE_URL`

#### Option 3: Neon
1. Create account di [Neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string ke `DATABASE_URL`

### Deploy to Vercel

1. Push code ke GitHub repository

2. Import project di [Vercel](https://vercel.com):
   - Connect GitHub repository
   - Framework Preset: Next.js
   - Root Directory: `./`

3. Configure Environment Variables di Vercel:
   ```
   DATABASE_URL=<your-production-database-url>
   NEXTAUTH_URL=<your-vercel-url>
   NEXTAUTH_SECRET=<generate-new-secret>
   NODE_ENV=production
   ```

4. Deploy! Vercel akan automatically:
   - Install dependencies
   - Run `npm run build`
   - Deploy aplikasi

5. Run database migrations di production:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Run migration
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

6. Seed initial data (optional):
   ```bash
   npx prisma db seed
   ```

### Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test login dengan admin account
- [ ] Ganti password default admin
- [ ] Create guru accounts
- [ ] Setup data master (kelas, mata pelajaran, siswa, jadwal)
- [ ] Test jurnal creation flow
- [ ] Verify analytics dan reports
- [ ] Setup monitoring (Vercel Analytics, Sentry, dll)
- [ ] Configure custom domain (optional)

## Environment Variables

Lihat `.env.example` untuk daftar lengkap environment variables yang diperlukan.

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret key untuk session encryption

### Optional Variables
- `NODE_ENV` - Environment mode (development/production)

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL running (`npm run db:up` untuk development)
- Verify `DATABASE_URL` di `.env.local`
- Check firewall/network settings

### Migration Error
- Reset database: `npx prisma migrate reset`
- Generate client: `npx prisma generate`
- Run migrations: `npx prisma migrate dev`

### Build Error
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

### Authentication Error
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## Contributing

1. Create feature branch: `git checkout -b feature/nama-fitur`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/nama-fitur`
4. Submit pull request

## Documentation

Dokumentasi lengkap tersedia di:

- **[Quick Start Guide](./QUICK_START.md)** - Panduan cepat setup dan deployment (5-10 menit)
- **[API Documentation](./API_DOCUMENTATION.md)** - Dokumentasi lengkap Server Actions dan API
- **[Deployment Guide](./DEPLOYMENT.md)** - Panduan detail deployment ke production
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Checklist lengkap untuk deployment
- **[Maintenance Guide](./MAINTENANCE.md)** - Panduan maintenance dan troubleshooting
- **[Contributing Guide](./CONTRIBUTING.md)** - Panduan untuk kontributor dan developer

## Support

Untuk pertanyaan atau issues:
- Check dokumentasi di atas
- Buat issue di repository
- Hubungi tim development

## License

Private - For internal use only

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
