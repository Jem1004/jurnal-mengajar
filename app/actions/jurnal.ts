'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { jurnalService } from '@/lib/services/jurnal.service'
import { masterService } from '@/lib/services/master.service'
import { StatusAbsensi, TagSiswa } from '@prisma/client'
import { auth } from '@/lib/auth'

// ==================== VALIDATION SCHEMAS ====================

const AbsensiInputSchema = z.object({
  siswaId: z.string().min(1, 'Siswa ID is required'),
  status: z.nativeEnum(StatusAbsensi)
})

const TagSiswaInputSchema = z.object({
  siswaId: z.string().min(1, 'Siswa ID is required'),
  tag: z.nativeEnum(TagSiswa),
  keterangan: z.string().optional()
})

const CreateJurnalSchema = z.object({
  jadwalId: z.string().min(1, 'Jadwal ID is required'),
  tanggal: z.string().min(1, 'Tanggal is required'),
  tujuanPembelajaran: z.string().min(1, 'Tujuan Pembelajaran is required'),
  kegiatanPembelajaran: z.string().min(1, 'Kegiatan Pembelajaran is required'),
  asesmen: z.string().optional(),
  catatanKhusus: z.string().optional(),
  linkBukti: z.string().url('Invalid URL format').optional().or(z.literal('')),
  absensi: z.array(AbsensiInputSchema),
  tagSiswa: z.array(TagSiswaInputSchema).optional()
})

const UpdateJurnalSchema = z.object({
  tujuanPembelajaran: z.string().min(1, 'Tujuan Pembelajaran is required').optional(),
  kegiatanPembelajaran: z.string().min(1, 'Kegiatan Pembelajaran is required').optional(),
  asesmen: z.string().optional(),
  catatanKhusus: z.string().optional(),
  linkBukti: z.string().url('Invalid URL format').optional().or(z.literal('')),
  absensi: z.array(AbsensiInputSchema).optional(),
  tagSiswa: z.array(TagSiswaInputSchema).optional()
})

// ==================== HELPER: GET AUTHENTICATED USER ====================

async function getAuthenticatedUser() {
  const session = await auth()
  
  if (!session || !session.user) {
    throw new Error('Unauthorized: Please login')
  }
  
  return session.user
}

// ==================== SERVER ACTIONS ====================

/**
 * Get jadwal for today for the authenticated guru
 */
export async function getJadwalHariIni() {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access jadwal')
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const jadwalList = await masterService.getJadwalByGuruAndDate(user.guruId, today)

    return {
      success: true,
      data: jadwalList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jadwal'
    }
  }
}

/**
 * Create a new jurnal
 */
export async function createJurnal(formData: FormData) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can create jurnal')
    }

    // Parse form data
    const rawData = {
      jadwalId: formData.get('jadwalId') as string,
      tanggal: formData.get('tanggal') as string,
      tujuanPembelajaran: formData.get('tujuanPembelajaran') as string,
      kegiatanPembelajaran: formData.get('kegiatanPembelajaran') as string,
      asesmen: formData.get('asesmen') as string || undefined,
      catatanKhusus: formData.get('catatanKhusus') as string || undefined,
      linkBukti: formData.get('linkBukti') as string || undefined,
      absensi: JSON.parse(formData.get('absensi') as string || '[]'),
      tagSiswa: JSON.parse(formData.get('tagSiswa') as string || '[]')
    }

    // Validate input
    const validatedData = CreateJurnalSchema.parse(rawData)

    // Convert tanggal string to Date
    const tanggalDate = new Date(validatedData.tanggal)

    // Create jurnal
    const jurnal = await jurnalService.createJurnal({
      jadwalId: validatedData.jadwalId,
      guruId: user.guruId,
      tanggal: tanggalDate,
      tujuanPembelajaran: validatedData.tujuanPembelajaran,
      kegiatanPembelajaran: validatedData.kegiatanPembelajaran,
      asesmen: validatedData.asesmen,
      catatanKhusus: validatedData.catatanKhusus,
      linkBukti: validatedData.linkBukti || undefined,
      absensi: validatedData.absensi,
      tagSiswa: validatedData.tagSiswa
    })

    // Revalidate dashboard page
    revalidatePath('/(guru)/dashboard')

    return {
      success: true,
      data: jurnal
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create jurnal'
    }
  }
}

/**
 * Get jurnal by ID
 */
export async function getJurnalById(id: string) {
  try {
    const user = await getAuthenticatedUser()
    
    const jurnal = await jurnalService.getJurnalById(id)

    // Check authorization: guru can only see their own jurnal, admin can see all
    if (user.role === 'GURU' && jurnal.guruId !== user.guruId) {
      throw new Error('Unauthorized: You can only view your own jurnal')
    }

    return {
      success: true,
      data: jurnal
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jurnal'
    }
  }
}

/**
 * Update an existing jurnal
 */
export async function updateJurnal(id: string, formData: FormData) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can update jurnal')
    }

    // Check if jurnal belongs to this guru
    const existingJurnal = await jurnalService.getJurnalById(id)
    if (existingJurnal.guruId !== user.guruId) {
      throw new Error('Unauthorized: You can only update your own jurnal')
    }

    // Parse form data
    const rawData = {
      tujuanPembelajaran: formData.get('tujuanPembelajaran') as string || undefined,
      kegiatanPembelajaran: formData.get('kegiatanPembelajaran') as string || undefined,
      asesmen: formData.get('asesmen') as string || undefined,
      catatanKhusus: formData.get('catatanKhusus') as string || undefined,
      linkBukti: formData.get('linkBukti') as string || undefined,
      absensi: formData.get('absensi') ? JSON.parse(formData.get('absensi') as string) : undefined,
      tagSiswa: formData.get('tagSiswa') ? JSON.parse(formData.get('tagSiswa') as string) : undefined
    }

    // Validate input
    const validatedData = UpdateJurnalSchema.parse(rawData)

    // Update jurnal
    const updatedJurnal = await jurnalService.updateJurnal(id, validatedData)

    // Revalidate relevant pages
    revalidatePath('/(guru)/dashboard')
    revalidatePath(`/(guru)/jurnal/${id}`)

    return {
      success: true,
      data: updatedJurnal
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        details: error.errors
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update jurnal'
    }
  }
}

/**
 * Get jurnal by jadwal and date
 */
export async function getJurnalByJadwal(jadwalId: string, tanggal: string) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access jurnal')
    }

    const tanggalDate = new Date(tanggal)
    const jurnal = await jurnalService.getJurnalByJadwal(jadwalId, tanggalDate)

    // Check authorization
    if (jurnal && jurnal.guruId !== user.guruId) {
      throw new Error('Unauthorized: You can only view your own jurnal')
    }

    return {
      success: true,
      data: jurnal
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jurnal'
    }
  }
}

/**
 * Get all jurnal for authenticated guru with optional filters
 */
export async function getJurnalByGuru(filters?: {
  startDate?: string
  endDate?: string
  kelasId?: string
  mataPelajaranId?: string
}) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU' || !user.guruId) {
      throw new Error('Only guru can access jurnal')
    }

    const filterDTO = {
      startDate: filters?.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate) : undefined,
      kelasId: filters?.kelasId,
      mataPelajaranId: filters?.mataPelajaranId
    }

    const jurnalList = await jurnalService.getJurnalByGuru(user.guruId, filterDTO)

    return {
      success: true,
      data: jurnalList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jurnal'
    }
  }
}

/**
 * Check if jurnal exists for a jadwal and date
 */
export async function checkJurnalExists(jadwalId: string, tanggal: string) {
  try {
    const user = await getAuthenticatedUser()
    
    if (user.role !== 'GURU') {
      throw new Error('Only guru can check jurnal')
    }

    const tanggalDate = new Date(tanggal)
    const exists = await jurnalService.checkJurnalExists(jadwalId, tanggalDate)

    return {
      success: true,
      data: { exists }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check jurnal'
    }
  }
}

/**
 * Get absensi summary for a jurnal
 */
export async function getAbsensiSummary(jurnalId: string) {
  try {
    const user = await getAuthenticatedUser()
    
    const summary = await jurnalService.getAbsensiSummary(jurnalId)

    return {
      success: true,
      data: summary
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get absensi summary'
    }
  }
}
