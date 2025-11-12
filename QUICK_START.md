# Quick Start Guide - Jurnal Mengajar Modern

Panduan cepat untuk memulai development atau deployment aplikasi.

## 🚀 Quick Setup (5 Minutes)

### For Developers

```bash
# 1. Clone & Install
git clone <repository-url>
cd jurnal-mengajar-modern
npm install

# 2. Setup Environment
cp .env.example .env.local

# 3. Start Database
npm run db:up

# 4. Setup Database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 5. Run App
npm run dev
```

**Open**: http://localhost:3000

**Login**:
- Admin: `admin` / `admin123`
- Guru: `guru1` / `guru123`

---

## 📦 Quick Deploy (10 Minutes)

### Deploy to Vercel + Railway

1. **Setup Database (Railway)**
   - Go to [railway.app](https://railway.app)
   - Create PostgreSQL database
   - Copy connection string

2. **Deploy App (Vercel)**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Add environment variables:
     ```
     DATABASE_URL=<railway-connection-string>
     NEXTAUTH_URL=<will-get-after-deploy>
     NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
     ```
   - Deploy!

3. **Run Migrations**
   ```bash
   vercel env pull .env.production
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma db seed
   ```

4. **Update NEXTAUTH_URL**
   - Copy Vercel URL
   - Update environment variable
   - Redeploy

**Done!** 🎉

---

## 🔧 Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
```

### Database
```bash
npm run db:up        # Start PostgreSQL
npm run db:down      # Stop PostgreSQL
npm run db:seed      # Seed data
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Create migration
npx prisma generate  # Generate Prisma Client
```

### Git
```bash
git checkout -b feature/nama-fitur  # New feature branch
git add .                           # Stage changes
git commit -m "feat: description"   # Commit
git push origin feature/nama-fitur  # Push branch
```

---

## 📁 Project Structure

```
app/
├── (auth)/login/          # Login page
├── (guru)/
│   ├── dashboard/         # Guru dashboard
│   ├── jurnal/[id]/       # Jurnal form
│   └── analitik/          # Analytics
├── (admin)/
│   ├── dashboard/         # Admin dashboard
│   ├── master/            # Master data CRUD
│   └── laporan/           # Reports
└── actions/               # Server Actions

components/
├── ui/                    # Reusable components
├── forms/                 # Form components
├── dashboard/             # Dashboard components
└── analytics/             # Analytics components

lib/
├── services/              # Business logic
├── validations/           # Zod schemas
├── auth.ts                # NextAuth config
└── prisma.ts              # Prisma client

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Migration files
└── seed.ts                # Seed data
```

---

## 🎯 Quick Tasks

### Add New Page

1. Create file in `app/` directory
2. Export default component
3. Add to navigation if needed

```typescript
// app/(guru)/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

### Add New Server Action

1. Create function in `app/actions/`
2. Add 'use server' directive
3. Implement logic with error handling

```typescript
// app/actions/example.ts
'use server'

export async function exampleAction(data: FormData) {
  try {
    // logic here
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Error message' };
  }
}
```

### Add New Component

1. Create file in `components/`
2. Define props interface
3. Export component

```typescript
// components/example.tsx
interface ExampleProps {
  title: string;
}

export function Example({ title }: ExampleProps) {
  return <div>{title}</div>;
}
```

### Add Database Model

1. Update `prisma/schema.prisma`
2. Create migration
3. Update types if needed

```prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name add_new_model
```

---

## 🐛 Quick Fixes

### Database Issues
```bash
npm run db:down && npm run db:up
npx prisma migrate reset
npx prisma generate
```

### Build Issues
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Issues
```bash
lsof -ti:3000 | xargs kill -9
```

### Prisma Issues
```bash
npx prisma generate
npx prisma migrate dev
```

---

## 📚 Quick Links

- **Full Documentation**: [README.md](./README.md)
- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🆘 Need Help?

1. Check documentation files
2. Search existing issues
3. Ask in team chat
4. Create new issue

---

## ✅ Checklist

### Development Setup
- [ ] Node.js 18+ installed
- [ ] Docker installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database running
- [ ] Migrations applied
- [ ] Seed data loaded
- [ ] Dev server running
- [ ] Can login successfully

### Before Deployment
- [ ] All features tested
- [ ] No console errors
- [ ] Build succeeds
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] Code committed to Git
- [ ] Repository pushed to GitHub

### After Deployment
- [ ] Database created
- [ ] App deployed
- [ ] Migrations applied
- [ ] Seed data loaded
- [ ] Can access app
- [ ] Can login
- [ ] Core features work
- [ ] Default passwords changed

---

**Happy Coding! 🚀**
