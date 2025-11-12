# API Documentation - Jurnal Mengajar Modern

Dokumentasi lengkap untuk Server Actions dan API endpoints yang tersedia di aplikasi.

## Table of Contents

1. [Authentication](#authentication)
2. [Jurnal Actions](#jurnal-actions)
3. [Master Data Actions](#master-data-actions)
4. [Analytics Actions](#analytics-actions)
5. [Data Types](#data-types)
6. [Error Handling](#error-handling)

---

## Authentication

Aplikasi menggunakan NextAuth.js untuk authentication dengan Credentials Provider.

### Login

**Endpoint**: `POST /api/auth/signin`

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "user": {
    "id": "clx...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Get Session

**Endpoint**: `GET /api/auth/session`

**Response**:
```json
{
  "user": {
    "id": "clx...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  "expires": "2024-12-12T00:00:00.000Z"
}
```

### Logout

**Endpoint**: `POST /api/auth/signout`

**Response**: Redirects to login page

---

## Jurnal Actions

Server Actions untuk operasi jurnal mengajar.

### Create Jurnal

**Function**: `createJurnal(formData: FormData)`

**Location**: `/app/actions/jurnal.ts`

**Parameters**:
```typescript
{
  jadwalId: string;
  tanggal: string; // ISO date format
  tujuanPembelajaran: string;
  kegiatanPembelajaran: string;
  asesmen?: string;
  catatanKhusus?: string;
  linkBukti?: string;
  absensi: Array<{
    siswaId: string;
    status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA';
  }>;
  tagSiswa?: Array<{
    siswaId: string;
    tag: 'PERLU_REMEDIAL' | 'PERLU_PENGAYAAN' | 'MASALAH_PERILAKU' | 'RUJUK_BK';
    keterangan?: string;
  }>;
}
```

**Returns**:
```typescript
{
  success: boolean;
  data?: {
    id: string;
    jadwalId: string;
    tanggal: Date;
    // ... other jurnal fields
  };
  error?: string;
}
```

**Example Usage**:
```typescript
const formData = new FormData();
formData.append('jadwalId', 'clx...');
formData.append('tanggal', '2024-11-12');
formData.append('tujuanPembelajaran', 'Siswa dapat memahami...');
formData.append('kegiatanPembelajaran', 'Diskusi kelompok...');
formData.append('absensi', JSON.stringify([
  { siswaId: 'clx1...', status: 'HADIR' },
  { siswaId: 'clx2...', status: 'SAKIT' }
]));

const result = await createJurnal(formData);
```

### Get Jadwal Hari Ini

**Function**: `getJadwalHariIni(guruId: string)`

**Location**: `/app/actions/jurnal.ts`

**Parameters**:
- `guruId`: ID guru yang login

**Returns**:
```typescript
{
  success: boolean;
  data?: Array<{
    id: string;
    hari: number;
    jamMulai: string;
    jamSelesai: string;
    kelas: {
      id: string;
      nama: string;
    };
    mataPelajaran: {
      id: string;
      nama: string;
    };
    jurnal: Array<{
      id: string;
      tanggal: Date;
    }>;
  }>;
  error?: string;
}
```

**Example Usage**:
```typescript
const result = await getJadwalHariIni('clx...');
if (result.success) {
  const jadwalList = result.data;
  // Display jadwal with status
}
```

### Get Jurnal By ID

**Function**: `getJurnalById(id: string)`

**Location**: `/app/actions/jurnal.ts`

**Parameters**:
- `id`: Jurnal ID

**Returns**:
```typescript
{
  success: boolean;
  data?: {
    id: string;
    tanggal: Date;
    tujuanPembelajaran: string;
    kegiatanPembelajaran: string;
    asesmen?: string;
    catatanKhusus?: string;
    linkBukti?: string;
    jadwal: {
      kelas: { nama: string };
      mataPelajaran: { nama: string };
    };
    absensi: Array<{
      siswa: { nama: string };
      status: string;
    }>;
    tagSiswa: Array<{
      siswa: { nama: string };
      tag: string;
      keterangan?: string;
    }>;
  };
  error?: string;
}
```

### Update Jurnal

**Function**: `updateJurnal(id: string, formData: FormData)`

**Location**: `/app/actions/jurnal.ts`

**Parameters**: Same as `createJurnal` but with `id` parameter

**Returns**: Same as `createJurnal`

---

## Master Data Actions

Server Actions untuk CRUD operasi data master.

### Kelas Actions

#### Get All Kelas

**Function**: `getKelas()`

**Location**: `/app/actions/master.ts`

**Returns**:
```typescript
{
  success: boolean;
  data?: Array<{
    id: string;
    nama: string;
    tingkat: number;
    jurusan?: string;
    _count: {
      siswa: number;
    };
  }>;
  error?: string;
}
```

#### Create Kelas

**Function**: `createKelas(formData: FormData)`

**Parameters**:
```typescript
{
  nama: string; // e.g., "10-A"
  tingkat: number; // 10, 11, or 12
  jurusan?: string; // e.g., "IPA", "IPS"
}
```

**Returns**:
```typescript
{
  success: boolean;
  data?: {
    id: string;
    nama: string;
    tingkat: number;
    jurusan?: string;
  };
  error?: string;
}
```

#### Update Kelas

**Function**: `updateKelas(id: string, formData: FormData)`

**Parameters**: Same as `createKelas` with `id`

#### Delete Kelas

**Function**: `deleteKelas(id: string)`

**Returns**:
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### Guru Actions

Similar CRUD operations:
- `getGuru()`
- `createGuru(formData)` - Creates User and Guru profile
- `updateGuru(id, formData)`
- `deleteGuru(id)`

**Guru Data Structure**:
```typescript
{
  id: string;
  nip?: string;
  user: {
    id: string;
    username: string;
    nama: string;
    email?: string;
  };
}
```

### Mata Pelajaran Actions

- `getMataPelajaran()`
- `createMataPelajaran(formData)`
- `updateMataPelajaran(id, formData)`
- `deleteMataPelajaran(id)`

**Data Structure**:
```typescript
{
  id: string;
  nama: string;
  kode?: string;
}
```

### Siswa Actions

- `getSiswa(kelasId?: string)` - Optional filter by kelas
- `createSiswa(formData)`
- `updateSiswa(id, formData)`
- `deleteSiswa(id)`

**Data Structure**:
```typescript
{
  id: string;
  nisn: string;
  nama: string;
  kelasId: string;
  jenisKelamin?: string;
  kelas: {
    nama: string;
  };
}
```

### Jadwal Actions

- `getJadwal(filters?: { guruId?, kelasId?, hari? })`
- `createJadwal(formData)`
- `updateJadwal(id, formData)`
- `deleteJadwal(id)`

**Data Structure**:
```typescript
{
  id: string;
  guruId: string;
  kelasId: string;
  mataPelajaranId: string;
  hari: number; // 0=Minggu, 1=Senin, ..., 6=Sabtu
  jamMulai: string; // "07:30"
  jamSelesai: string; // "09:00"
  semester: number; // 1 or 2
  tahunAjaran: string; // "2024/2025"
  guru: { user: { nama: string } };
  kelas: { nama: string };
  mataPelajaran: { nama: string };
}
```

---

## Analytics Actions

Server Actions untuk analytics dan reporting.

### Get Analytics Guru

**Function**: `getAnalyticsGuru(guruId: string)`

**Location**: `/app/actions/analytics.ts`

**Returns**:
```typescript
{
  success: boolean;
  data?: {
    keterlaksanaanTP: {
      totalTP: number;
      tpTerlaksana: number;
      persentase: number;
    };
    absensiAnalytics: {
      siswa: {
        nama: string;
        totalAbsen: number;
        breakdown: {
          sakit: number;
          izin: number;
          alpa: number;
        };
      };
      periode: string; // "30 hari terakhir"
    };
    tindakLanjut: {
      perluRemedial: number;
      perluPengayaan: number;
      masalahPerilaku: number;
      rujukBK: number;
      siswaList: Array<{
        nama: string;
        tag: string;
        tanggal: Date;
        jurnalId: string;
      }>;
    };
  };
  error?: string;
}
```

### Get Keterisian Jurnal (Admin)

**Function**: `getKeterisisanJurnal(filters: FilterDTO)`

**Location**: `/app/actions/analytics.ts`

**Parameters**:
```typescript
{
  periode?: 'hari_ini' | 'minggu_ini' | 'bulan_ini' | 'semester_ini';
  startDate?: string; // ISO date
  endDate?: string; // ISO date
}
```

**Returns**:
```typescript
{
  success: boolean;
  data?: Array<{
    guru: {
      id: string;
      user: { nama: string };
    };
    totalJadwal: number;
    jurnalTerisi: number;
    persentase: number;
    status: 'rutin' | 'tidak_rutin'; // >= 80% = rutin
  }>;
  error?: string;
}
```

### Get Aggregate Absensi (Admin)

**Function**: `getAggregateAbsensi(filters: FilterDTO)`

**Location**: `/app/actions/analytics.ts`

**Parameters**:
```typescript
{
  kelasId?: string;
  startDate?: string;
  endDate?: string;
  jenisKetidakhadiran?: 'SAKIT' | 'IZIN' | 'ALPA';
}
```

**Returns**:
```typescript
{
  success: boolean;
  data?: {
    summary: {
      totalHadir: number;
      totalSakit: number;
      totalIzin: number;
      totalAlpa: number;
    };
    byDate: Array<{
      tanggal: Date;
      hadir: number;
      sakit: number;
      izin: number;
      alpa: number;
    }>;
    byKelas?: Array<{
      kelas: { nama: string };
      hadir: number;
      sakit: number;
      izin: number;
      alpa: number;
    }>;
  };
  error?: string;
}
```

---

## Data Types

### Enums

```typescript
enum Role {
  GURU = 'GURU',
  ADMIN = 'ADMIN'
}

enum StatusAbsensi {
  HADIR = 'HADIR',
  SAKIT = 'SAKIT',
  IZIN = 'IZIN',
  ALPA = 'ALPA'
}

enum TagSiswa {
  PERLU_REMEDIAL = 'PERLU_REMEDIAL',
  PERLU_PENGAYAAN = 'PERLU_PENGAYAAN',
  MASALAH_PERILAKU = 'MASALAH_PERILAKU',
  RUJUK_BK = 'RUJUK_BK'
}
```

### Common Response Format

All Server Actions return a consistent response format:

```typescript
type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## Error Handling

### Error Types

```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

class ValidationError extends AppError {
  statusCode: 400;
}

class NotFoundError extends AppError {
  statusCode: 404;
}

class UnauthorizedError extends AppError {
  statusCode: 401;
}
```

### Error Response Format

```typescript
{
  success: false,
  error: "Error message here"
}
```

### Common Error Messages

- `"Unauthorized"` - User not authenticated
- `"Forbidden"` - User doesn't have permission
- `"Not found"` - Resource doesn't exist
- `"Validation error"` - Invalid input data
- `"Database error"` - Database operation failed

### Handling Errors in Client

```typescript
const result = await createJurnal(formData);

if (!result.success) {
  // Show error to user
  toast.error(result.error || 'Terjadi kesalahan');
  return;
}

// Success - proceed with result.data
toast.success('Jurnal berhasil disimpan');
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider adding:

- Rate limiting middleware for API routes
- Throttling for expensive operations (analytics, reports)
- CAPTCHA for login attempts

---

## Authentication & Authorization

### Protected Routes

All routes except `/login` require authentication:

- `/dashboard` - Guru only
- `/jurnal/*` - Guru only
- `/analitik` - Guru only
- `/admin/*` - Admin only
- `/master/*` - Admin only

### Middleware Protection

Middleware (`/middleware.ts`) handles:
- Session validation
- Role-based access control
- Automatic redirects

### Server Action Authorization

Each Server Action checks:
1. User is authenticated
2. User has required role
3. User has permission for the resource

Example:
```typescript
const session = await auth();
if (!session?.user) {
  return { success: false, error: 'Unauthorized' };
}

if (session.user.role !== 'ADMIN') {
  return { success: false, error: 'Forbidden' };
}
```

---

## Best Practices

### Client-Side Usage

1. **Always handle errors**:
```typescript
const result = await createJurnal(formData);
if (!result.success) {
  handleError(result.error);
  return;
}
```

2. **Show loading states**:
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    const result = await createJurnal(formData);
    // handle result
  } finally {
    setLoading(false);
  }
};
```

3. **Validate before submitting**:
```typescript
const schema = z.object({
  tujuanPembelajaran: z.string().min(10),
  kegiatanPembelajaran: z.string().min(10),
});

const validated = schema.safeParse(data);
if (!validated.success) {
  // Show validation errors
  return;
}
```

### Server-Side Best Practices

1. **Use transactions for related operations**:
```typescript
await prisma.$transaction(async (tx) => {
  const jurnal = await tx.jurnal.create({ data });
  await tx.absensi.createMany({ data: absensiData });
});
```

2. **Validate input with Zod**:
```typescript
const schema = jurnalSchema.safeParse(data);
if (!schema.success) {
  return { success: false, error: 'Invalid data' };
}
```

3. **Handle database errors gracefully**:
```typescript
try {
  const result = await prisma.jurnal.create({ data });
  return { success: true, data: result };
} catch (error) {
  console.error('Database error:', error);
  return { success: false, error: 'Failed to create jurnal' };
}
```

---

## Testing

### Testing Server Actions

```typescript
import { createJurnal } from '@/app/actions/jurnal';

describe('createJurnal', () => {
  it('should create jurnal with valid data', async () => {
    const formData = new FormData();
    // ... add data
    
    const result = await createJurnal(formData);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
  
  it('should return error with invalid data', async () => {
    const formData = new FormData();
    // ... add invalid data
    
    const result = await createJurnal(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

---

## Changelog

### Version 1.0.0 (2024-11-12)
- Initial API documentation
- All core Server Actions documented
- Authentication flow documented
- Error handling patterns established

---

## Support

For questions or issues with the API:
- Check error messages in response
- Review validation schemas in `/lib/validations/`
- Check Prisma schema for data structure
- Contact development team

---

**Last Updated**: November 12, 2024
