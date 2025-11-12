# Maintenance Guide - Jurnal Mengajar Modern

Panduan untuk maintenance dan troubleshooting aplikasi di production.

## Table of Contents

1. [Regular Maintenance Tasks](#regular-maintenance-tasks)
2. [Monitoring](#monitoring)
3. [Backup & Recovery](#backup--recovery)
4. [Common Issues](#common-issues)
5. [Performance Optimization](#performance-optimization)
6. [Security Updates](#security-updates)
7. [Database Maintenance](#database-maintenance)

---

## Regular Maintenance Tasks

### Daily Tasks

**Check Application Health**
- [ ] Verify application is accessible
- [ ] Check for error spikes in Vercel dashboard
- [ ] Review database connection status
- [ ] Monitor response times

**Quick Health Check**
```bash
# Test application endpoint
curl -I https://your-app.vercel.app

# Should return: HTTP/2 200
```

### Weekly Tasks

**Review Logs**
- [ ] Check Vercel function logs for errors
- [ ] Review database slow query logs
- [ ] Check for authentication failures
- [ ] Review user activity patterns

**Database Check**
- [ ] Monitor database size
- [ ] Check connection pool usage
- [ ] Review query performance
- [ ] Verify backup completion

### Monthly Tasks

**Security Review**
- [ ] Review access logs for suspicious activity
- [ ] Check for outdated dependencies
- [ ] Verify SSL certificate status
- [ ] Review user permissions

**Performance Review**
- [ ] Analyze page load times
- [ ] Review database query performance
- [ ] Check for memory leaks
- [ ] Optimize slow queries

**Backup Verification**
- [ ] Test backup restoration
- [ ] Verify backup integrity
- [ ] Update backup documentation
- [ ] Review backup retention policy

### Quarterly Tasks

**Dependency Updates**
- [ ] Update Next.js to latest stable version
- [ ] Update Prisma to latest version
- [ ] Update other dependencies
- [ ] Test thoroughly after updates

**Security Audit**
- [ ] Review authentication implementation
- [ ] Check for security vulnerabilities
- [ ] Update security best practices
- [ ] Rotate secrets and credentials

---

## Monitoring

### Vercel Dashboard

**Key Metrics to Monitor**:
- **Invocations**: Number of function calls
- **Errors**: Error rate and types
- **Duration**: Function execution time
- **Bandwidth**: Data transfer usage

**Access Logs**:
1. Go to Vercel Dashboard
2. Select project
3. Go to "Logs" tab
4. Filter by time range and severity

### Database Monitoring

**Railway**:
- Dashboard shows CPU, memory, disk usage
- Set up alerts for high usage
- Monitor connection count

**Supabase**:
- Database > Reports shows query performance
- Monitor connection pool usage
- Check for slow queries

**Neon**:
- Dashboard shows storage and compute usage
- Monitor connection count
- Check for autoscaling events

### Setting Up Alerts

**Vercel Alerts** (Paid plan):
- Error rate threshold
- Function duration threshold
- Bandwidth usage threshold

**Database Alerts**:
- High CPU usage (>80%)
- High memory usage (>80%)
- Low disk space (<20%)
- Connection pool exhaustion

---

## Backup & Recovery

### Automated Backups

**Railway**:
- Automatic daily backups (paid plan)
- Retention: 7 days
- Point-in-time recovery available

**Supabase**:
- Automatic daily backups (paid plan)
- Point-in-time recovery (paid plan)
- Manual backups available

**Neon**:
- Automatic backups included
- Retention: 7 days
- Branch-based recovery

### Manual Backup

**Create Backup**:
```bash
# Set database URL
export DATABASE_URL="your-production-database-url"

# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Compress backup
gzip backup-*.sql
```

**Store Backup Securely**:
- Upload to cloud storage (S3, Google Drive)
- Keep multiple versions
- Document backup location
- Test restoration regularly

### Restore from Backup

**Restore Database**:
```bash
# Decompress backup
gunzip backup-20241112-120000.sql.gz

# Restore database
psql $DATABASE_URL < backup-20241112-120000.sql
```

**Verify Restoration**:
```bash
# Check data integrity
npx prisma studio

# Test application
curl https://your-app.vercel.app
```

---

## Common Issues

### Application Not Loading

**Symptoms**: Users cannot access application

**Diagnosis**:
1. Check Vercel status page
2. Check deployment status
3. Review error logs
4. Test database connection

**Solutions**:
```bash
# Redeploy application
vercel --prod

# Check deployment logs
vercel logs

# Verify environment variables
vercel env ls
```

### Database Connection Errors

**Symptoms**: "Can't reach database server" errors

**Diagnosis**:
1. Check database status in provider dashboard
2. Verify DATABASE_URL is correct
3. Check connection pool usage
4. Review database logs

**Solutions**:
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check Prisma connection
npx prisma db pull

# Restart database (if self-hosted)
# Or contact provider support
```

### Slow Performance

**Symptoms**: Pages loading slowly, timeouts

**Diagnosis**:
1. Check Vercel function duration
2. Review database query performance
3. Check for N+1 queries
4. Monitor database CPU usage

**Solutions**:
```sql
-- Find slow queries (PostgreSQL)
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Add missing indexes
CREATE INDEX idx_jurnal_guru_tanggal ON jurnal(guru_id, tanggal);
```

### Authentication Issues

**Symptoms**: Users cannot login, session errors

**Diagnosis**:
1. Verify NEXTAUTH_URL matches domain
2. Check NEXTAUTH_SECRET is set
3. Review authentication logs
4. Test with different browsers

**Solutions**:
```bash
# Verify environment variables
vercel env ls

# Update NEXTAUTH_URL if domain changed
vercel env add NEXTAUTH_URL

# Redeploy
vercel --prod
```

### High Database Usage

**Symptoms**: Database approaching storage limit

**Diagnosis**:
1. Check database size
2. Identify large tables
3. Review data retention policy
4. Check for orphaned records

**Solutions**:
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Archive old data
-- Delete old jurnal (older than 2 years)
DELETE FROM jurnal WHERE tanggal < NOW() - INTERVAL '2 years';

-- Vacuum database
VACUUM ANALYZE;
```

---

## Performance Optimization

### Database Optimization

**Add Indexes**:
```sql
-- Frequently queried fields
CREATE INDEX idx_jurnal_guru_id ON jurnal(guru_id);
CREATE INDEX idx_jurnal_tanggal ON jurnal(tanggal);
CREATE INDEX idx_absensi_siswa_id ON absensi(siswa_id);
CREATE INDEX idx_jadwal_guru_hari ON jadwal(guru_id, hari);

-- Composite indexes for common queries
CREATE INDEX idx_jurnal_guru_tanggal ON jurnal(guru_id, tanggal);
CREATE INDEX idx_absensi_status ON absensi(siswa_id, status);
```

**Optimize Queries**:
```typescript
// Use select to limit fields
const jurnal = await prisma.jurnal.findMany({
  select: {
    id: true,
    tanggal: true,
    tujuanPembelajaran: true,
    // Only select needed fields
  }
});

// Use pagination
const jurnal = await prisma.jurnal.findMany({
  take: 20,
  skip: page * 20,
});

// Use aggregation instead of fetching all records
const count = await prisma.jurnal.count({
  where: { guruId: guruId }
});
```

### Application Optimization

**Enable Caching**:
```typescript
// Cache static data
export const revalidate = 3600; // Revalidate every hour

// Cache Server Component
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

**Optimize Images**:
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/image.jpg" 
  width={500} 
  height={300}
  alt="Description"
/>
```

---

## Security Updates

### Update Dependencies

**Check for Vulnerabilities**:
```bash
# Check for security issues
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

**Update Dependencies**:
```bash
# Update all dependencies
npm update

# Update specific package
npm update next

# Update to latest (including major versions)
npm install next@latest
```

### Rotate Secrets

**Generate New Secret**:
```bash
# Generate new NEXTAUTH_SECRET
openssl rand -base64 32
```

**Update in Vercel**:
1. Go to Project Settings > Environment Variables
2. Edit NEXTAUTH_SECRET
3. Add new value
4. Redeploy application

### Security Best Practices

- [ ] Keep dependencies up to date
- [ ] Use strong passwords
- [ ] Enable 2FA for admin accounts
- [ ] Review access logs regularly
- [ ] Rotate secrets periodically
- [ ] Use HTTPS only
- [ ] Implement rate limiting (if needed)
- [ ] Monitor for suspicious activity

---

## Database Maintenance

### Vacuum Database

**PostgreSQL Vacuum**:
```sql
-- Analyze and vacuum all tables
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE jurnal;

-- Full vacuum (requires downtime)
VACUUM FULL;
```

### Reindex Database

**Rebuild Indexes**:
```sql
-- Reindex all tables
REINDEX DATABASE your_database;

-- Reindex specific table
REINDEX TABLE jurnal;

-- Reindex specific index
REINDEX INDEX idx_jurnal_guru_id;
```

### Clean Up Old Data

**Archive Strategy**:
```sql
-- Archive old jurnal (move to archive table)
CREATE TABLE jurnal_archive AS 
SELECT * FROM jurnal 
WHERE tanggal < NOW() - INTERVAL '2 years';

-- Delete archived data
DELETE FROM jurnal 
WHERE tanggal < NOW() - INTERVAL '2 years';

-- Or soft delete
UPDATE jurnal 
SET archived = true 
WHERE tanggal < NOW() - INTERVAL '2 years';
```

---

## Incident Response

### When Issues Occur

1. **Assess Severity**
   - Critical: Application down, data loss
   - High: Major features broken
   - Medium: Some features affected
   - Low: Minor issues, cosmetic bugs

2. **Immediate Actions**
   - Notify team
   - Check monitoring dashboards
   - Review recent changes
   - Check error logs

3. **Diagnosis**
   - Identify root cause
   - Check recent deployments
   - Review database logs
   - Test in staging (if available)

4. **Resolution**
   - Fix issue or rollback
   - Test fix thoroughly
   - Deploy fix
   - Verify resolution

5. **Post-Incident**
   - Document incident
   - Identify prevention measures
   - Update runbooks
   - Communicate to stakeholders

### Rollback Procedure

**Rollback Application**:
1. Go to Vercel Dashboard
2. Go to Deployments
3. Find last working deployment
4. Click "..." > "Promote to Production"

**Rollback Database**:
```bash
# Restore from backup
psql $DATABASE_URL < backup-last-good.sql

# Or rollback migration
npx prisma migrate resolve --rolled-back migration_name
```

---

## Contact Information

### Support Contacts

**Technical Team**:
- Lead Developer: [Name, Email, Phone]
- Database Admin: [Name, Email, Phone]
- DevOps: [Name, Email, Phone]

**Service Providers**:
- Vercel Support: support@vercel.com
- Railway Support: team@railway.app
- Supabase Support: support@supabase.io
- Neon Support: support@neon.tech

### Escalation Path

1. **Level 1**: Developer on call
2. **Level 2**: Technical Lead
3. **Level 3**: Service Provider Support

---

## Maintenance Log

Keep a log of maintenance activities:

| Date | Activity | Performed By | Notes |
|------|----------|--------------|-------|
| 2024-11-12 | Initial deployment | [Name] | Production launch |
| | | | |

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Last Updated**: November 12, 2024
