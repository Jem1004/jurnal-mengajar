/**
 * Zod Validation Schemas for Master Data
 * Validates master data input (Guru, Kelas, Mata Pelajaran, Siswa, Jadwal)
 */

import { z } from 'zod';

/**
 * Role enum validation
 */
export const roleSchema = z.enum(['GURU', 'ADMIN'], {
  errorMap: () => ({ message: 'Role tidak valid' }),
});

/**
 * User/Guru validation schema
 * Requirements: 2.1, 2.2
 */
export const createGuruSchema = z.object({
  username: z.string({
    required_error: 'Username wajib diisi',
  })
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore')
    .trim(),
  
  password: z.string({
    required_error: 'Password wajib diisi',
  })
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
  
  nama: z.string({
    required_error: 'Nama wajib diisi',
  })
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),
  
  email: z.string()
    .email('Format email tidak valid')
    .max(100, 'Email maksimal 100 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  nip: z.string()
    .min(5, 'NIP minimal 5 karakter')
    .max(50, 'NIP maksimal 50 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  role: roleSchema.default('GURU'),
});

/**
 * Update Guru validation schema
 */
export const updateGuruSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore')
    .trim()
    .optional(),
  
  password: z.string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .optional(),
  
  nama: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim()
    .optional(),
  
  email: z.string()
    .email('Format email tidak valid')
    .max(100, 'Email maksimal 100 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  nip: z.string()
    .min(5, 'NIP minimal 5 karakter')
    .max(50, 'NIP maksimal 50 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
});

/**
 * Kelas validation schema
 * Requirements: 2.1, 2.3
 */
export const createKelasSchema = z.object({
  nama: z.string({
    required_error: 'Nama kelas wajib diisi',
  })
    .min(2, 'Nama kelas minimal 2 karakter')
    .max(20, 'Nama kelas maksimal 20 karakter')
    .regex(/^[0-9]{1,2}-[A-Z0-9-]+$/i, 'Format nama kelas tidak valid (contoh: 10-A, 11-IPA-1)')
    .trim(),
  
  tingkat: z.number({
    required_error: 'Tingkat wajib diisi',
    invalid_type_error: 'Tingkat harus berupa angka',
  })
    .int('Tingkat harus berupa bilangan bulat')
    .min(10, 'Tingkat minimal 10')
    .max(12, 'Tingkat maksimal 12'),
  
  jurusan: z.string()
    .max(50, 'Jurusan maksimal 50 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
});

/**
 * Update Kelas validation schema
 */
export const updateKelasSchema = createKelasSchema.partial();

/**
 * Mata Pelajaran validation schema
 * Requirements: 2.1, 2.4
 */
export const createMataPelajaranSchema = z.object({
  nama: z.string({
    required_error: 'Nama mata pelajaran wajib diisi',
  })
    .min(3, 'Nama mata pelajaran minimal 3 karakter')
    .max(100, 'Nama mata pelajaran maksimal 100 karakter')
    .trim(),
  
  kode: z.string()
    .min(2, 'Kode mata pelajaran minimal 2 karakter')
    .max(20, 'Kode mata pelajaran maksimal 20 karakter')
    .regex(/^[A-Z0-9-]+$/i, 'Kode hanya boleh mengandung huruf, angka, dan dash')
    .trim()
    .optional()
    .or(z.literal('')),
});

/**
 * Update Mata Pelajaran validation schema
 */
export const updateMataPelajaranSchema = createMataPelajaranSchema.partial();

/**
 * Siswa validation schema
 * Requirements: 2.1, 2.5
 */
export const createSiswaSchema = z.object({
  nisn: z.string({
    required_error: 'NISN wajib diisi',
  })
    .length(10, 'NISN harus 10 digit')
    .regex(/^\d{10}$/, 'NISN harus berupa 10 digit angka')
    .trim(),
  
  nama: z.string({
    required_error: 'Nama siswa wajib diisi',
  })
    .min(3, 'Nama siswa minimal 3 karakter')
    .max(100, 'Nama siswa maksimal 100 karakter')
    .trim(),
  
  kelasId: z.string({
    required_error: 'Kelas wajib dipilih',
  }).cuid('ID kelas tidak valid'),
  
  jenisKelamin: z.enum(['L', 'P'], {
    errorMap: () => ({ message: 'Jenis kelamin harus L atau P' }),
  }).optional(),
});

/**
 * Update Siswa validation schema
 */
export const updateSiswaSchema = z.object({
  nisn: z.string()
    .length(10, 'NISN harus 10 digit')
    .regex(/^\d{10}$/, 'NISN harus berupa 10 digit angka')
    .trim()
    .optional(),
  
  nama: z.string()
    .min(3, 'Nama siswa minimal 3 karakter')
    .max(100, 'Nama siswa maksimal 100 karakter')
    .trim()
    .optional(),
  
  kelasId: z.string()
    .cuid('ID kelas tidak valid')
    .optional(),
  
  jenisKelamin: z.enum(['L', 'P'], {
    errorMap: () => ({ message: 'Jenis kelamin harus L atau P' }),
  }).optional(),
});

/**
 * Jadwal validation schema
 * Requirements: 2.1, 2.6
 */
export const createJadwalSchema = z.object({
  guruId: z.string({
    required_error: 'Guru wajib dipilih',
  }).cuid('ID guru tidak valid'),
  
  kelasId: z.string({
    required_error: 'Kelas wajib dipilih',
  }).cuid('ID kelas tidak valid'),
  
  mataPelajaranId: z.string({
    required_error: 'Mata pelajaran wajib dipilih',
  }).cuid('ID mata pelajaran tidak valid'),
  
  hari: z.number({
    required_error: 'Hari wajib dipilih',
    invalid_type_error: 'Hari harus berupa angka',
  })
    .int('Hari harus berupa bilangan bulat')
    .min(0, 'Hari tidak valid (0=Minggu, 1=Senin, ..., 6=Sabtu)')
    .max(6, 'Hari tidak valid (0=Minggu, 1=Senin, ..., 6=Sabtu)'),
  
  jamMulai: z.string({
    required_error: 'Jam mulai wajib diisi',
  })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (contoh: 07:30)'),
  
  jamSelesai: z.string({
    required_error: 'Jam selesai wajib diisi',
  })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (contoh: 09:00)'),
  
  semester: z.number({
    required_error: 'Semester wajib dipilih',
    invalid_type_error: 'Semester harus berupa angka',
  })
    .int('Semester harus berupa bilangan bulat')
    .min(1, 'Semester harus 1 atau 2')
    .max(2, 'Semester harus 1 atau 2'),
  
  tahunAjaran: z.string({
    required_error: 'Tahun ajaran wajib diisi',
  })
    .regex(/^\d{4}\/\d{4}$/, 'Format tahun ajaran tidak valid (contoh: 2024/2025)'),
}).refine(
  (data) => {
    // Validate that jamSelesai is after jamMulai
    const [startHour, startMinute] = data.jamMulai.split(':').map(Number);
    const [endHour, endMinute] = data.jamSelesai.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    return endTime > startTime;
  },
  {
    message: 'Jam selesai harus lebih besar dari jam mulai',
    path: ['jamSelesai'],
  }
);

/**
 * Update Jadwal validation schema
 */
export const updateJadwalSchema = z.object({
  guruId: z.string().cuid('ID guru tidak valid').optional(),
  kelasId: z.string().cuid('ID kelas tidak valid').optional(),
  mataPelajaranId: z.string().cuid('ID mata pelajaran tidak valid').optional(),
  hari: z.number()
    .int('Hari harus berupa bilangan bulat')
    .min(0, 'Hari tidak valid (0=Minggu, 1=Senin, ..., 6=Sabtu)')
    .max(6, 'Hari tidak valid (0=Minggu, 1=Senin, ..., 6=Sabtu)')
    .optional(),
  jamMulai: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (contoh: 07:30)')
    .optional(),
  jamSelesai: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (contoh: 09:00)')
    .optional(),
  semester: z.number()
    .int('Semester harus berupa bilangan bulat')
    .min(1, 'Semester harus 1 atau 2')
    .max(2, 'Semester harus 1 atau 2')
    .optional(),
  tahunAjaran: z.string()
    .regex(/^\d{4}\/\d{4}$/, 'Format tahun ajaran tidak valid (contoh: 2024/2025)')
    .optional(),
});

/**
 * Type exports for TypeScript
 */
export type CreateGuruInput = z.infer<typeof createGuruSchema>;
export type UpdateGuruInput = z.infer<typeof updateGuruSchema>;
export type CreateKelasInput = z.infer<typeof createKelasSchema>;
export type UpdateKelasInput = z.infer<typeof updateKelasSchema>;
export type CreateMataPelajaranInput = z.infer<typeof createMataPelajaranSchema>;
export type UpdateMataPelajaranInput = z.infer<typeof updateMataPelajaranSchema>;
export type CreateSiswaInput = z.infer<typeof createSiswaSchema>;
export type UpdateSiswaInput = z.infer<typeof updateSiswaSchema>;
export type CreateJadwalInput = z.infer<typeof createJadwalSchema>;
export type UpdateJadwalInput = z.infer<typeof updateJadwalSchema>;
