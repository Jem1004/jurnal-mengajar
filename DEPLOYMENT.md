# Deployment Guide - Jurnal Mengajar Modern

Panduan lengkap untuk deploy aplikasi Jurnal Mengajar Modern ke production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup](#database-setup)
3. [Deploy to Vercel](#deploy-to-vercel)
4. [Post-Deployment Setup](#post-deployment-setup)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Sebelum deploy, pastikan:

- [ ] Semua fitur sudah tested dan working di development
- [ ] Database schema sudah final (migrations ready)
- [ ] Environment variables sudah documented
- [ ] Default passwords sudah diganti di seed data (atau akan diganti setelah deploy)
- [ ] Error handling sudah implemented
- [ ] Code sudah di-commit ke Git repository
- [ ] Repository sudah di-push ke GitHub/GitLab

---

## Database Setup

### Option 1: Railway (Recommended)

Railway menyediakan PostgreSQL gratis dengan setup mudah.

#### Steps:

1. **Create Account**
   - Kunjungi [railway.app](https://railway.app)
   - Sign up dengan GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Railway akan automatically create database

3. **Get Connection String**
   - Click pada PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"
   - Format: `postgresql://postgres:xxx@containers-us-west-xxx.railway.app:5432/railway`

4. **Configure Database**
   - Database sudah ready to use
   - No additional configuration needed

**Pricing**: Free tier includes 500 hours/month (cukup untuk small-medium usage)

---

### Option 2: Supabase

Supabase menyediakan PostgreSQL dengan dashboard yang powerful.

#### Steps:

1. **Create Account**
   - Kunjungi [supabase.com](https://supabase.com)
   - Sign up dengan GitHub account

2. **Create New Project**
   - Click "New Project"
   - Pilih organization
   - Set project name dan database password
   - Pilih region (Singapore untuk Indonesia)
   - Click "Create new project"

3. **Get Connection String**
   - Go to Settings > Database
   - Scroll ke "Connection string"
   - Select "Session" mode (bukan Transaction)
   - Copy connection string
   - Replace `[YOUR-PASSWORD]` dengan password yang Anda set
   - Format: `postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres`

4. **Configure Connection Pooling (Optional)**
   - Untuk production, gunakan connection pooler
   - Go to Settings > Database > Connection pooling
   - Copy "Connection string" dengan mode "Session"

**Pricing**: Free tier includes 500MB database, 2GB bandwidth/month

---

### Option 3: Neon

Neon adalah serverless PostgreSQL dengan auto-scaling.

#### Steps:

1. **Create Account**
   - Kunjungi [neon.tech](https://neon.tech)
   - Sign up dengan GitHub/Google account

2. **Create New Project**
   - Click "Create a project"
   - Set project name
   - Pilih region (AWS us-east-2 atau yang terdekat)
   - Click "Create project"

3. **Get Connection String**
   - Dashboard akan show connection string
   - Copy "Connection string"
   - Format: `postgresql://user:xxx@ep-xxx.us-east-2.aws.neon.tech/neondb`

4. **Configure Database**
   - Database sudah ready to use
   - Neon automatically handles connection pooling

**Pricing**: Free tier includes 0.5GB storage, 3GB data transfer/month

---

## Deploy to Vercel

Vercel adalah platform terbaik untuk Next.js applications.

### Step 1: Prepare Repository

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify repository**
   - Pastikan semua files ter-commit
   - Check `.gitignore` sudah exclude `.env.local`, `node_modules`, dll

### Step 2: Import Project to Vercel

1. **Create Vercel Account**
   - Kunjungi [vercel.com](https://vercel.com)
   - Sign up dengan GitHub account

2. **Import Repository**
   - Click "Add New..." > "Project"
   - Select repository "jurnal-mengajar-modern"
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### Step 3: Configure Environment Variables

Di Vercel project settings, tambahkan environment variables:

1. **Click "Environment Variables" tab**

2. **Add variables satu per satu:**

   ```
   DATABASE_URL
   Value: <paste your production database URL>
   Environment: Production, Preview, Development
   ```

   ```
   NEXTAUTH_URL
   Value: https://your-app.vercel.app (akan dapat setelah deploy)
   Environment: Production
   ```

   ```
   NEXTAUTH_SECRET
   Value: <generate new secret dengan: openssl rand -base64 32>
   Environment: Production, Preview, Development
   ```

   ```
   NODE_ENV
   Value: production
   Environment: Production
   ```

3. **Save variables**

### Step 4: Deploy

1. **Click "Deploy"**
   - Vercel akan automatically:
     - Install dependencies
     - Run build
     - Deploy aplikasi

2. **Wait for deployment**
   - Biasanya 2-5 menit
   - Monitor build logs untuk errors

3. **Get deployment URL**
   - Setelah success, Anda akan dapat URL
   - Format: `https://jurnal-mengajar-modern.vercel.app`

4. **Update NEXTAUTH_URL**
   - Go back to Environment Variables
   - Update `NEXTAUTH_URL` dengan deployment URL
   - Redeploy (Vercel akan auto-redeploy)

---

## Post-Deployment Setup

### Step 1: Run Database Migrations

Setelah deploy, Anda perlu run migrations di production database.

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link project**
   ```bash
   vercel link
   ```

4. **Pull environment variables**
   ```bash
   vercel env pull .env.production
   ```

5. **Run migrations**
   ```bash
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy
   ```

#### Option B: Using Database Provider's Console

Beberapa providers (Railway, Supabase) memiliki SQL console:

1. Open SQL console di provider dashboard
2. Copy SQL dari migration files di `prisma/migrations/`
3. Execute SQL manually

### Step 2: Seed Initial Data

Seed database dengan admin account dan sample data:

```bash
# Using Vercel CLI
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma db seed
```

Atau connect ke production database dan run seed script.

### Step 3: Verify Deployment

1. **Test Application**
   - Buka deployment URL
   - Verify homepage loads
   - Test login dengan default credentials:
     - Admin: `admin` / `admin123`
     - Guru: `guru1` / `guru123`

2. **Test Core Features**
   - [ ] Login sebagai admin
   - [ ] Access admin dashboard
   - [ ] Create data master (kelas, mata pelajaran, siswa)
   - [ ] Create jadwal
   - [ ] Login sebagai guru
   - [ ] View jadwal hari ini
   - [ ] Create jurnal
   - [ ] View analytics

3. **Check Database**
   - Verify data tersimpan di production database
   - Check migrations applied correctly

### Step 4: Security Setup

1. **Change Default Passwords**
   - Login sebagai admin
   - Ganti password admin default
   - Ganti password guru default (atau delete sample guru accounts)

2. **Create Real Accounts**
   - Create guru accounts dengan data real
   - Set strong passwords

3. **Setup Data Master**
   - Input kelas sesuai sekolah
   - Input mata pelajaran
   - Input data siswa
   - Setup jadwal mengajar

### Step 5: Configure Custom Domain (Optional)

1. **Add Domain di Vercel**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update NEXTAUTH_URL**
   - Update environment variable dengan custom domain
   - Redeploy

---

## Monitoring & Maintenance

### Vercel Analytics

Enable Vercel Analytics untuk monitoring:

1. Go to Project Settings > Analytics
2. Enable Analytics
3. View metrics: page views, performance, etc.

### Error Tracking

Consider integrating error tracking:

- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay dan error tracking

### Database Monitoring

Monitor database usage:

- **Railway**: Dashboard shows CPU, memory, disk usage
- **Supabase**: Database > Reports shows queries, connections
- **Neon**: Dashboard shows storage, compute usage

### Backup Strategy

Setup regular backups:

1. **Automated Backups**
   - Railway: Automatic daily backups (paid plan)
   - Supabase: Point-in-time recovery (paid plan)
   - Neon: Automatic backups included

2. **Manual Backups**
   ```bash
   # Export database
   pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
   
   # Restore database
   psql $DATABASE_URL < backup-20241112.sql
   ```

### Performance Optimization

1. **Enable Caching**
   - Next.js automatically caches static pages
   - Configure revalidation for dynamic data

2. **Database Optimization**
   - Monitor slow queries
   - Add indexes if needed
   - Use connection pooling

3. **CDN Configuration**
   - Vercel automatically uses CDN
   - Static assets cached globally

---

## Troubleshooting

### Build Errors

**Error: "Module not found"**
- Solution: Check `package.json` dependencies
- Run `npm install` locally to verify

**Error: "Type error in build"**
- Solution: Fix TypeScript errors
- Run `npm run build` locally first

### Database Connection Errors

**Error: "Can't reach database server"**
- Solution: Verify `DATABASE_URL` is correct
- Check database is running
- Verify IP whitelist (if applicable)

**Error: "SSL connection required"**
- Solution: Add `?sslmode=require` to DATABASE_URL
- Example: `postgresql://user:pass@host:5432/db?sslmode=require`

### Authentication Errors

**Error: "Invalid session"**
- Solution: Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches deployment URL
- Clear browser cookies

**Error: "Callback URL mismatch"**
- Solution: Update `NEXTAUTH_URL` to match actual domain
- Redeploy after updating

### Migration Errors

**Error: "Migration failed"**
- Solution: Check migration files
- Verify database schema
- Try `npx prisma migrate reset` (⚠️ deletes data!)

### Performance Issues

**Slow page loads**
- Check database query performance
- Enable Vercel Analytics to identify bottlenecks
- Consider adding database indexes

**High database usage**
- Optimize queries (use `select` to limit fields)
- Implement pagination
- Add caching layer

---

## Rollback Strategy

Jika deployment bermasalah:

1. **Rollback di Vercel**
   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." > "Promote to Production"

2. **Rollback Database Migration**
   ```bash
   # Revert last migration
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

3. **Restore Database Backup**
   ```bash
   psql $DATABASE_URL < backup-previous.sql
   ```

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth Documentation**: https://next-auth.js.org

---

## Deployment Checklist Summary

- [ ] Setup production database (Railway/Supabase/Neon)
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Test core features
- [ ] Change default passwords
- [ ] Setup data master
- [ ] Configure monitoring
- [ ] Setup backups
- [ ] Document deployment for team

**Congratulations! Your application is now live! 🎉**
