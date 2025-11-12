'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { masterService } from '@/lib/services/master.service'
import { auth } from '@/lib/auth'

// ==================== VALIDATION SCHEMAS ====================

const CreateGuruSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  nama: z.string().min(1, 'Nama is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  nip: z.string().optional().or(z.literal(''))
})

const UpdateGuruSchema = z.object({
  nama: z.string().min(1, 'Nama is required').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  nip: z.string().optional().or(z.literal(''))
})

const CreateKelasSchema = z.object({
  nama: z.string().min(1, 'Nama kelas is required'),
  tingkat: z.number().int().min(10).max(12, 'Tingkat must be between 10-12'),
  jurusan: z.string().optional().or(z.literal(''))
})

const UpdateKelasSchema = z.object({
  nama: z.string().min(1, 'Nama kelas is required').optional(),
  tingkat: z.number().int().min(10).max(12, 'Tingkat must be between 10-12').optional(),
  jurusan: z.string().optional().or(z.literal(''))
})

const CreateMataPelajaranSchema = z.object({
  nama: z.string().min(1, 'Nama mata pelajaran is required'),
  kode: z.string().optional().or(z.literal(''))
})

const UpdateMataPelajaranSchema = z.object({
  nama: z.string().min(1, 'Nama mata pelajaran is required').optional(),
  kode: z.string().optional().or(z.literal(''))
})

const CreateSiswaSchema = z.object({
  nisn: z.string().min(1, 'NISN is required'),
  nama: z.string().min(1, 'Nama is required'),
  kelasId: z.string().min(1, 'Kelas is required'),
  jenisKelamin: z.enum(['L', 'P']).optional().or(z.literal(''))
})

const UpdateSiswaSchema = z.object({
  nisn: z.string().min(1, 'NISN is required').optional(),
  nama: z.string().min(1, 'Nama is required').optional(),
  kelasId: z.string().min(1, 'Kelas is required').optional(),
  jenisKelamin: z.enum(['L', 'P']).optional().or(z.literal(''))
})

const CreateJadwalSchema = z.object({
  guruId: z.string().min(1, 'Guru is required'),
  kelasId: z.string().min(1, 'Kelas is required'),
  mataPelajaranId: z.string().min(1, 'Mata pelajaran is required'),
  hari: z.number().int().min(0).max(6, 'Hari must be between 0-6'),
  jamMulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  jamSelesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  semester: z.number().int().min(1).max(2, 'Semester must be 1 or 2'),
  tahunAjaran: z.string().regex(/^\d{4}\/\d{4}$/, 'Invalid tahun ajaran format (YYYY/YYYY)')
})

const UpdateJadwalSchema = z.object({
  guruId: z.string().min(1, 'Guru is required').optional(),
  kelasId: z.string().min(1, 'Kelas is required').optional(),
  mataPelajaranId: z.string().min(1, 'Mata pelajaran is required').optional(),
  hari: z.number().int().min(0).max(6, 'Hari must be between 0-6').optional(),
  jamMulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  jamSelesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  semester: z.number().int().min(1).max(2, 'Semester must be 1 or 2').optional(),
  tahunAjaran: z.string().regex(/^\d{4}\/\d{4}$/, 'Invalid tahun ajaran format (YYYY/YYYY)').optional()
})

// ==================== HELPER: CHECK ADMIN AUTHORIZATION ====================

async function checkAdminAuthorization() {
  const session = await auth()
  
  if (!session || !session.user) {
    throw new Error('Unauthorized: Please login')
  }
  
  if (session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can perform this action')
  }
  
  return session.user
}

// ==================== GURU ACTIONS ====================

export async function getGuru() {
  try {
    await checkAdminAuthorization()
    
    const guruList = await masterService.getGuru()
    
    return {
      success: true,
      data: guruList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch guru'
    }
  }
}

export async function getGuruById(id: string) {
  try {
    await checkAdminAuthorization()
    
    const guru = await masterService.getGuruById(id)
    
    return {
      success: true,
      data: guru
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch guru'
    }
  }
}

export async function createGuru(formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      nama: formData.get('nama') as string,
      email: formData.get('email') as string || undefined,
      nip: formData.get('nip') as string || undefined
    }
    
    const validatedData = CreateGuruSchema.parse(rawData)
    
    const guru = await masterService.createGuru(validatedData)
    
    revalidatePath('/(admin)/master/guru')
    
    return {
      success: true,
      data: guru
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
      error: error instanceof Error ? error.message : 'Failed to create guru'
    }
  }
}

export async function updateGuru(id: string, formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nama: formData.get('nama') as string || undefined,
      email: formData.get('email') as string || undefined,
      nip: formData.get('nip') as string || undefined
    }
    
    const validatedData = UpdateGuruSchema.parse(rawData)
    
    const guru = await masterService.updateGuru(id, validatedData)
    
    revalidatePath('/(admin)/master/guru')
    
    return {
      success: true,
      data: guru
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
      error: error instanceof Error ? error.message : 'Failed to update guru'
    }
  }
}

export async function deleteGuru(id: string) {
  try {
    await checkAdminAuthorization()
    
    await masterService.deleteGuru(id)
    
    revalidatePath('/(admin)/master/guru')
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete guru'
    }
  }
}

// ==================== KELAS ACTIONS ====================

export async function getKelas() {
  try {
    // Kelas can be accessed by both admin and guru
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const kelasList = await masterService.getKelas()
    
    return {
      success: true,
      data: kelasList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch kelas'
    }
  }
}

export async function getKelasById(id: string) {
  try {
    await checkAdminAuthorization()
    
    const kelas = await masterService.getKelasById(id)
    
    return {
      success: true,
      data: kelas
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch kelas'
    }
  }
}

export async function createKelas(formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nama: formData.get('nama') as string,
      tingkat: parseInt(formData.get('tingkat') as string),
      jurusan: formData.get('jurusan') as string || undefined
    }
    
    const validatedData = CreateKelasSchema.parse(rawData)
    
    const kelas = await masterService.createKelas(validatedData)
    
    revalidatePath('/(admin)/master/kelas')
    
    return {
      success: true,
      data: kelas
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
      error: error instanceof Error ? error.message : 'Failed to create kelas'
    }
  }
}

export async function updateKelas(id: string, formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nama: formData.get('nama') as string || undefined,
      tingkat: formData.get('tingkat') ? parseInt(formData.get('tingkat') as string) : undefined,
      jurusan: formData.get('jurusan') as string || undefined
    }
    
    const validatedData = UpdateKelasSchema.parse(rawData)
    
    const kelas = await masterService.updateKelas(id, validatedData)
    
    revalidatePath('/(admin)/master/kelas')
    
    return {
      success: true,
      data: kelas
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
      error: error instanceof Error ? error.message : 'Failed to update kelas'
    }
  }
}

export async function deleteKelas(id: string) {
  try {
    await checkAdminAuthorization()
    
    await masterService.deleteKelas(id)
    
    revalidatePath('/(admin)/master/kelas')
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete kelas'
    }
  }
}

// ==================== MATA PELAJARAN ACTIONS ====================

export async function getMataPelajaran() {
  try {
    // Mata pelajaran can be accessed by both admin and guru
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const mataPelajaranList = await masterService.getMataPelajaran()
    
    return {
      success: true,
      data: mataPelajaranList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch mata pelajaran'
    }
  }
}

export async function getMataPelajaranById(id: string) {
  try {
    await checkAdminAuthorization()
    
    const mataPelajaran = await masterService.getMataPelajaranById(id)
    
    return {
      success: true,
      data: mataPelajaran
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch mata pelajaran'
    }
  }
}

export async function createMataPelajaran(formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nama: formData.get('nama') as string,
      kode: formData.get('kode') as string || undefined
    }
    
    const validatedData = CreateMataPelajaranSchema.parse(rawData)
    
    const mataPelajaran = await masterService.createMataPelajaran(validatedData)
    
    revalidatePath('/(admin)/master/mata-pelajaran')
    
    return {
      success: true,
      data: mataPelajaran
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
      error: error instanceof Error ? error.message : 'Failed to create mata pelajaran'
    }
  }
}

export async function updateMataPelajaran(id: string, formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nama: formData.get('nama') as string || undefined,
      kode: formData.get('kode') as string || undefined
    }
    
    const validatedData = UpdateMataPelajaranSchema.parse(rawData)
    
    const mataPelajaran = await masterService.updateMataPelajaran(id, validatedData)
    
    revalidatePath('/(admin)/master/mata-pelajaran')
    
    return {
      success: true,
      data: mataPelajaran
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
      error: error instanceof Error ? error.message : 'Failed to update mata pelajaran'
    }
  }
}

export async function deleteMataPelajaran(id: string) {
  try {
    await checkAdminAuthorization()
    
    await masterService.deleteMataPelajaran(id)
    
    revalidatePath('/(admin)/master/mata-pelajaran')
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete mata pelajaran'
    }
  }
}

// ==================== SISWA ACTIONS ====================

export async function getSiswa() {
  try {
    // Siswa can be accessed by both admin and guru
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const siswaList = await masterService.getSiswa()
    
    return {
      success: true,
      data: siswaList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch siswa'
    }
  }
}

export async function getSiswaById(id: string) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const siswa = await masterService.getSiswaById(id)
    
    return {
      success: true,
      data: siswa
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch siswa'
    }
  }
}

export async function getSiswaByKelas(kelasId: string) {
  try {
    // Siswa by kelas can be accessed by both admin and guru
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const siswaList = await masterService.getSiswaByKelas(kelasId)
    
    return {
      success: true,
      data: siswaList
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch siswa by kelas'
    }
  }
}

export async function createSiswa(formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nisn: formData.get('nisn') as string,
      nama: formData.get('nama') as string,
      kelasId: formData.get('kelasId') as string,
      jenisKelamin: formData.get('jenisKelamin') as string || undefined
    }
    
    const validatedData = CreateSiswaSchema.parse(rawData)
    
    const siswa = await masterService.createSiswa(validatedData)
    
    revalidatePath('/(admin)/master/siswa')
    
    return {
      success: true,
      data: siswa
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
      error: error instanceof Error ? error.message : 'Failed to create siswa'
    }
  }
}

export async function updateSiswa(id: string, formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      nisn: formData.get('nisn') as string || undefined,
      nama: formData.get('nama') as string || undefined,
      kelasId: formData.get('kelasId') as string || undefined,
      jenisKelamin: formData.get('jenisKelamin') as string || undefined
    }
    
    const validatedData = UpdateSiswaSchema.parse(rawData)
    
    const siswa = await masterService.updateSiswa(id, validatedData)
    
    revalidatePath('/(admin)/master/siswa')
    
    return {
      success: true,
      data: siswa
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
      error: error instanceof Error ? error.message : 'Failed to update siswa'
    }
  }
}

export async function deleteSiswa(id: string) {
  try {
    await checkAdminAuthorization()
    
    await masterService.deleteSiswa(id)
    
    revalidatePath('/(admin)/master/siswa')
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete siswa'
    }
  }
}

// ==================== JADWAL ACTIONS ====================

export async function getJadwal() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const jadwalList = await masterService.getJadwal()
    
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

export async function getJadwalById(id: string) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      throw new Error('Unauthorized: Please login')
    }
    
    const jadwal = await masterService.getJadwalById(id)
    
    return {
      success: true,
      data: jadwal
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jadwal'
    }
  }
}

export async function createJadwal(formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      guruId: formData.get('guruId') as string,
      kelasId: formData.get('kelasId') as string,
      mataPelajaranId: formData.get('mataPelajaranId') as string,
      hari: parseInt(formData.get('hari') as string),
      jamMulai: formData.get('jamMulai') as string,
      jamSelesai: formData.get('jamSelesai') as string,
      semester: parseInt(formData.get('semester') as string),
      tahunAjaran: formData.get('tahunAjaran') as string
    }
    
    const validatedData = CreateJadwalSchema.parse(rawData)
    
    const jadwal = await masterService.createJadwal(validatedData)
    
    revalidatePath('/(admin)/master/jadwal')
    
    return {
      success: true,
      data: jadwal
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
      error: error instanceof Error ? error.message : 'Failed to create jadwal'
    }
  }
}

export async function updateJadwal(id: string, formData: FormData) {
  try {
    await checkAdminAuthorization()
    
    const rawData = {
      guruId: formData.get('guruId') as string || undefined,
      kelasId: formData.get('kelasId') as string || undefined,
      mataPelajaranId: formData.get('mataPelajaranId') as string || undefined,
      hari: formData.get('hari') ? parseInt(formData.get('hari') as string) : undefined,
      jamMulai: formData.get('jamMulai') as string || undefined,
      jamSelesai: formData.get('jamSelesai') as string || undefined,
      semester: formData.get('semester') ? parseInt(formData.get('semester') as string) : undefined,
      tahunAjaran: formData.get('tahunAjaran') as string || undefined
    }
    
    const validatedData = UpdateJadwalSchema.parse(rawData)
    
    const jadwal = await masterService.updateJadwal(id, validatedData)
    
    revalidatePath('/(admin)/master/jadwal')
    
    return {
      success: true,
      data: jadwal
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
      error: error instanceof Error ? error.message : 'Failed to update jadwal'
    }
  }
}

export async function deleteJadwal(id: string) {
  try {
    await checkAdminAuthorization()
    
    await masterService.deleteJadwal(id)
    
    revalidatePath('/(admin)/master/jadwal')
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete jadwal'
    }
  }
}
