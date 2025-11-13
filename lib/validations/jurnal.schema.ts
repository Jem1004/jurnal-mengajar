/**
 * Zod Validation Schemas for Jurnal Mengajar
 * Validates jurnal input data according to requirements
 */

import { z } from 'zod';

/**
 * Status Absensi enum validation
 */
export const statusAbsensiSchema = z.enum(['HADIR', 'SAKIT', 'IZIN', 'ALPA'], {
  errorMap: () => ({ message: 'Status absensi tidak valid' }),
});

/**
 * Tag Siswa enum validation
 */
export const tagSiswaSchema = z.enum([
  'PERLU_REMEDIAL',
  'PERLU_PENGAYAAN',
  'MASALAH_PERILAKU',
  'RUJUK_BK',
], {
  errorMap: () => ({ message: 'Tag siswa tidak valid' }),
});

/**
 * Status Ketercapaian TP enum validation
 */
export const statusKetercapaianTPSchema = z.enum([
  'TERCAPAI',
  'SEBAGIAN_TERCAPAI',
  'TIDAK_TERCAPAI',
], {
  errorMap: () => ({ message: 'Status ketercapaian TP tidak valid' }),
});

/**
 * Absensi record validation
 * Validates individual student attendance record
 */
export const absensiRecordSchema = z.object({
  siswaId: z.string({
    required_error: 'ID siswa wajib diisi',
  }).cuid('ID siswa tidak valid'),
  status: statusAbsensiSchema,
});

/**
 * Tag Siswa record validation
 * Validates student tagging for follow-up actions
 */
export const tagSiswaRecordSchema = z.object({
  siswaId: z.string({
    required_error: 'ID siswa wajib diisi',
  }).cuid('ID siswa tidak valid'),
  tag: tagSiswaSchema,
  keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional(),
});

/**
 * URL validation helper
 * Validates URL format for bukti pembelajaran
 */
const urlSchema = z.string().url('Format URL tidak valid').optional().or(z.literal(''));

/**
 * Create Jurnal validation schema
 * Validates all required fields for creating a new jurnal entry
 * Requirements: 5.4, 5.5, 7.3, 9.5
 */
export const createJurnalSchema = z.object({
  jadwalId: z.string({
    required_error: 'ID jadwal wajib diisi',
  }).cuid('ID jadwal tidak valid'),
  
  tanggal: z.coerce.date({
    required_error: 'Tanggal wajib diisi',
    invalid_type_error: 'Format tanggal tidak valid',
  }),
  
  // Detail Pembelajaran - Requirements 5.1, 5.2, 5.3
  tujuanPembelajaran: z.string({
    required_error: 'Tujuan Pembelajaran wajib diisi',
  })
    .min(10, 'Tujuan Pembelajaran minimal 10 karakter')
    .max(2000, 'Tujuan Pembelajaran maksimal 2000 karakter')
    .trim(),
  
  kegiatanPembelajaran: z.string({
    required_error: 'Kegiatan Pembelajaran wajib diisi',
  })
    .min(10, 'Kegiatan Pembelajaran minimal 10 karakter')
    .max(2000, 'Kegiatan Pembelajaran maksimal 2000 karakter')
    .trim(),
  
  asesmen: z.string()
    .max(2000, 'Asesmen maksimal 2000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  // Status Ketercapaian & Refleksi
  statusKetercapaianTP: statusKetercapaianTPSchema.optional().default('TERCAPAI'),
  
  catatanRefleksi: z.string()
    .max(2000, 'Catatan Refleksi maksimal 2000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  hambatan: z.string()
    .max(1000, 'Hambatan maksimal 1000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  solusi: z.string()
    .max(1000, 'Solusi maksimal 1000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  // Absensi - Requirements 6.1-6.5
  absensi: z.array(absensiRecordSchema)
    .min(1, 'Minimal harus ada 1 data absensi')
    .refine(
      (data) => {
        const siswaIds = data.map(a => a.siswaId);
        return siswaIds.length === new Set(siswaIds).size;
      },
      { message: 'Tidak boleh ada siswa yang duplikat dalam absensi' }
    ),
  
  // Catatan & Tindak Lanjut - Requirements 7.1-7.5, 15.1-15.5
  catatanKhusus: z.string()
    .max(1000, 'Catatan Khusus maksimal 1000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  linkBukti: urlSchema,
  
  // Tag Siswa - Requirements 8.1-8.5
  tagSiswa: z.array(tagSiswaRecordSchema)
    .optional()
    .default([]),
});

/**
 * Update Jurnal validation schema
 * Similar to create but all fields are optional for partial updates
 */
export const updateJurnalSchema = z.object({
  tujuanPembelajaran: z.string()
    .min(10, 'Tujuan Pembelajaran minimal 10 karakter')
    .max(2000, 'Tujuan Pembelajaran maksimal 2000 karakter')
    .trim()
    .optional(),
  
  kegiatanPembelajaran: z.string()
    .min(10, 'Kegiatan Pembelajaran minimal 10 karakter')
    .max(2000, 'Kegiatan Pembelajaran maksimal 2000 karakter')
    .trim()
    .optional(),
  
  asesmen: z.string()
    .max(2000, 'Asesmen maksimal 2000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  statusKetercapaianTP: statusKetercapaianTPSchema.optional(),
  
  catatanRefleksi: z.string()
    .max(2000, 'Catatan Refleksi maksimal 2000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  hambatan: z.string()
    .max(1000, 'Hambatan maksimal 1000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  solusi: z.string()
    .max(1000, 'Solusi maksimal 1000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  absensi: z.array(absensiRecordSchema)
    .min(1, 'Minimal harus ada 1 data absensi')
    .optional(),
  
  catatanKhusus: z.string()
    .max(1000, 'Catatan Khusus maksimal 1000 karakter')
    .trim()
    .optional()
    .or(z.literal('')),
  
  linkBukti: urlSchema,
  
  tagSiswa: z.array(tagSiswaRecordSchema)
    .optional(),
});

/**
 * Query filters for jurnal
 */
export const jurnalFilterSchema = z.object({
  guruId: z.string().cuid().optional(),
  kelasId: z.string().cuid().optional(),
  mataPelajaranId: z.string().cuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  semester: z.number().int().min(1).max(2).optional(),
  tahunAjaran: z.string().regex(/^\d{4}\/\d{4}$/, 'Format tahun ajaran tidak valid (contoh: 2024/2025)').optional(),
});

/**
 * Type exports for TypeScript
 */
export type CreateJurnalInput = z.infer<typeof createJurnalSchema>;
export type UpdateJurnalInput = z.infer<typeof updateJurnalSchema>;
export type JurnalFilterInput = z.infer<typeof jurnalFilterSchema>;
export type AbsensiRecord = z.infer<typeof absensiRecordSchema>;
export type TagSiswaRecord = z.infer<typeof tagSiswaRecordSchema>;
