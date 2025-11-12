# Jurnal Mengajar Modern

Aplikasi digital standalone untuk menggantikan jurnal mengajar fisik. Sistem ini dirancang untuk administrasi pengajaran dan sebagai alat refleksi pedagogis guru.

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod

## Features

- ✅ Autentikasi berbasis role (Guru & Admin)
- 📝 Pengisian jurnal mengajar digital
- 📊 Smart checklist absensi siswa
- 🏷️ Tag siswa untuk tindak lanjut
- 📈 Analitik personal untuk guru
- 👨‍💼 Dashboard admin untuk monitoring
- 📋 Manajemen data master

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Docker (untuk PostgreSQL)

### Installation

1. Clone repository dan install dependencies:

```bash
npm install
```

2. Setup environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi yang sesuai.

3. Start PostgreSQL database:

```bash
npm run db:up
```

4. Setup database dengan Prisma:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) dengan browser.

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:up` - Start PostgreSQL container
- `npm run db:down` - Stop PostgreSQL container

## License

Private - For internal use only
