import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// DTOs for Master Data
export interface CreateGuruDTO {
  username: string
  password: string
  nama: string
  email?: string
  nip?: string
}

export interface UpdateGuruDTO {
  nama?: string
  email?: string
  nip?: string
}

export interface CreateKelasDTO {
  nama: string
  tingkat: number
  jurusan?: string
}

export interface UpdateKelasDTO {
  nama?: string
  tingkat?: number
  jurusan?: string
}

export interface CreateMataPelajaranDTO {
  nama: string
  kode?: string
}

export interface UpdateMataPelajaranDTO {
  nama?: string
  kode?: string
}

export interface CreateSiswaDTO {
  nisn: string
  nama: string
  kelasId: string
  jenisKelamin?: string
}

export interface UpdateSiswaDTO {
  nisn?: string
  nama?: string
  kelasId?: string
  jenisKelamin?: string
}

export interface CreateJadwalDTO {
  guruId: string
  kelasId: string
  mataPelajaranId: string
  hari: number
  jamMulai: string
  jamSelesai: string
  semester: number
  tahunAjaran: string
}

export interface UpdateJadwalDTO {
  guruId?: string
  kelasId?: string
  mataPelajaranId?: string
  hari?: number
  jamMulai?: string
  jamSelesai?: string
  semester?: number
  tahunAjaran?: string
}

// Pagination interfaces
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class MasterService {
  // ==================== GURU METHODS ====================
  
  async getGuru() {
    try {
      return await prisma.guru.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nama: true,
              email: true,
              role: true,
            }
          }
        },
        orderBy: {
          user: {
            nama: 'asc'
          }
        }
      })
    } catch (error) {
      throw new Error(`Failed to fetch guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getGuruById(id: string) {
    try {
      const guru = await prisma.guru.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nama: true,
              email: true,
              role: true,
            }
          }
        }
      })
      
      if (!guru) {
        throw new Error('Guru not found')
      }
      
      return guru
    } catch (error) {
      throw new Error(`Failed to fetch guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createGuru(data: CreateGuruDTO) {
    try {
      // Hash password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(data.password, 10)
      
      return await prisma.guru.create({
        data: {
          nip: data.nip,
          user: {
            create: {
              username: data.username,
              password: hashedPassword,
              nama: data.nama,
              email: data.email,
              role: 'GURU'
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nama: true,
              email: true,
              role: true,
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Username or NIP already exists')
        }
      }
      throw new Error(`Failed to create guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateGuru(id: string, data: UpdateGuruDTO) {
    try {
      return await prisma.guru.update({
        where: { id },
        data: {
          nip: data.nip,
          user: {
            update: {
              nama: data.nama,
              email: data.email,
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nama: true,
              email: true,
              role: true,
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Guru not found')
        }
        if (error.code === 'P2002') {
          throw new Error('NIP already exists')
        }
      }
      throw new Error(`Failed to update guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteGuru(id: string) {
    try {
      return await prisma.guru.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Guru not found')
        }
      }
      throw new Error(`Failed to delete guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== KELAS METHODS ====================
  
  async getKelas() {
    try {
      return await prisma.kelas.findMany({
        orderBy: [
          { tingkat: 'asc' },
          { nama: 'asc' }
        ]
      })
    } catch (error) {
      throw new Error(`Failed to fetch kelas: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getKelasById(id: string) {
    try {
      const kelas = await prisma.kelas.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              siswa: true
            }
          }
        }
      })
      
      if (!kelas) {
        throw new Error('Kelas not found')
      }
      
      return kelas
    } catch (error) {
      throw new Error(`Failed to fetch kelas: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createKelas(data: CreateKelasDTO) {
    try {
      return await prisma.kelas.create({
        data
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Kelas name already exists')
        }
      }
      throw new Error(`Failed to create kelas: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateKelas(id: string, data: UpdateKelasDTO) {
    try {
      return await prisma.kelas.update({
        where: { id },
        data
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Kelas not found')
        }
        if (error.code === 'P2002') {
          throw new Error('Kelas name already exists')
        }
      }
      throw new Error(`Failed to update kelas: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteKelas(id: string) {
    try {
      return await prisma.kelas.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Kelas not found')
        }
      }
      throw new Error(`Failed to delete kelas: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== MATA PELAJARAN METHODS ====================

  async getMataPelajaran() {
    try {
      return await prisma.mataPelajaran.findMany({
        orderBy: {
          nama: 'asc'
        }
      })
    } catch (error) {
      throw new Error(`Failed to fetch mata pelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getMataPelajaranPaginated(params: PaginationParams = {}) {
    try {
      const { page = 1, limit = 10, search } = params
      const skip = (page - 1) * limit

      const where = search ? {
        OR: [
          { nama: { contains: search, mode: 'insensitive' as const } },
          { kode: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {}

      const [data, total] = await Promise.all([
        prisma.mataPelajaran.findMany({
          where,
          orderBy: {
            nama: 'asc'
          },
          skip,
          take: limit
        }),
        prisma.mataPelajaran.count({ where })
      ])

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Failed to fetch mata pelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getMataPelajaranById(id: string) {
    try {
      const mataPelajaran = await prisma.mataPelajaran.findUnique({
        where: { id }
      })
      
      if (!mataPelajaran) {
        throw new Error('Mata pelajaran not found')
      }
      
      return mataPelajaran
    } catch (error) {
      throw new Error(`Failed to fetch mata pelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createMataPelajaran(data: CreateMataPelajaranDTO) {
    try {
      return await prisma.mataPelajaran.create({
        data
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Mata pelajaran name or code already exists')
        }
      }
      throw new Error(`Failed to create mata pelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateMataPelajaran(id: string, data: UpdateMataPelajaranDTO) {
    try {
      return await prisma.mataPelajaran.update({
        where: { id },
        data
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Mata pelajaran not found')
        }
        if (error.code === 'P2002') {
          throw new Error('Mata pelajaran name or code already exists')
        }
      }
      throw new Error(`Failed to update mata pelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteMataPelajaran(id: string) {
    try {
      return await prisma.mataPelajaran.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Mata pelajaran not found')
        }
      }
      throw new Error(`Failed to delete mata pelajaran: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== SISWA METHODS ====================

  async getSiswa() {
    try {
      return await prisma.siswa.findMany({
        include: {
          kelas: true
        },
        orderBy: {
          nama: 'asc'
        }
      })
    } catch (error) {
      throw new Error(`Failed to fetch siswa: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getSiswaPaginated(params: PaginationParams = {}) {
    try {
      const { page = 1, limit = 10, search } = params
      const skip = (page - 1) * limit

      const where = search ? {
        OR: [
          { nama: { contains: search, mode: 'insensitive' as const } },
          { nisn: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {}

      const [data, total] = await Promise.all([
        prisma.siswa.findMany({
          where,
          include: {
            kelas: true
          },
          orderBy: {
            nama: 'asc'
          },
          skip,
          take: limit
        }),
        prisma.siswa.count({ where })
      ])

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Failed to fetch siswa: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getSiswaById(id: string) {
    try {
      const siswa = await prisma.siswa.findUnique({
        where: { id },
        include: {
          kelas: true
        }
      })
      
      if (!siswa) {
        throw new Error('Siswa not found')
      }
      
      return siswa
    } catch (error) {
      throw new Error(`Failed to fetch siswa: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getSiswaByKelas(kelasId: string) {
    try {
      return await prisma.siswa.findMany({
        where: { kelasId },
        include: {
          kelas: true
        },
        orderBy: {
          nama: 'asc'
        }
      })
    } catch (error) {
      throw new Error(`Failed to fetch siswa by kelas: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createSiswa(data: CreateSiswaDTO) {
    try {
      return await prisma.siswa.create({
        data,
        include: {
          kelas: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('NISN already exists')
        }
        if (error.code === 'P2003') {
          throw new Error('Kelas not found')
        }
      }
      throw new Error(`Failed to create siswa: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateSiswa(id: string, data: UpdateSiswaDTO) {
    try {
      return await prisma.siswa.update({
        where: { id },
        data,
        include: {
          kelas: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Siswa not found')
        }
        if (error.code === 'P2002') {
          throw new Error('NISN already exists')
        }
        if (error.code === 'P2003') {
          throw new Error('Kelas not found')
        }
      }
      throw new Error(`Failed to update siswa: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteSiswa(id: string) {
    try {
      return await prisma.siswa.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Siswa not found')
        }
      }
      throw new Error(`Failed to delete siswa: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== JADWAL METHODS ====================

  async getJadwal() {
    try {
      return await prisma.jadwal.findMany({
        include: {
          guru: {
            include: {
              user: {
                select: {
                  nama: true
                }
              }
            }
          },
          kelas: true,
          mataPelajaran: true
        },
        orderBy: [
          { hari: 'asc' },
          { jamMulai: 'asc' }
        ]
      })
    } catch (error) {
      throw new Error(`Failed to fetch jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getJadwalPaginated(params: PaginationParams = {}) {
    try {
      const { page = 1, limit = 10, search } = params
      const skip = (page - 1) * limit

      const where = search ? {
        OR: [
          { mataPelajaran: { nama: { contains: search, mode: 'insensitive' as const } } },
          { kelas: { nama: { contains: search, mode: 'insensitive' as const } } },
          { guru: { user: { nama: { contains: search, mode: 'insensitive' as const } } } },
          { ruang: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {}

      const [data, total] = await Promise.all([
        prisma.jadwal.findMany({
          where,
          include: {
            guru: {
              include: {
                user: {
                  select: {
                    nama: true
                  }
                }
              }
            },
            kelas: true,
            mataPelajaran: true
          },
          orderBy: [
            { hari: 'asc' },
            { jamMulai: 'asc' }
          ],
          skip,
          take: limit
        }),
        prisma.jadwal.count({ where })
      ])

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Failed to fetch jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getJadwalById(id: string) {
    try {
      const jadwal = await prisma.jadwal.findUnique({
        where: { id },
        include: {
          guru: {
            include: {
              user: {
                select: {
                  nama: true
                }
              }
            }
          },
          kelas: true,
          mataPelajaran: true
        }
      })
      
      if (!jadwal) {
        throw new Error('Jadwal not found')
      }
      
      return jadwal
    } catch (error) {
      throw new Error(`Failed to fetch jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getJadwalByGuruAndDate(guruId: string, date: Date) {
    try {
      const dayOfWeek = date.getDay()

      return await prisma.jadwal.findMany({
        where: {
          guruId,
          hari: dayOfWeek
        },
        include: {
          kelas: true,
          mataPelajaran: true,
          jurnal: {
            where: {
              tanggal: date
            }
          }
        },
        orderBy: {
          jamMulai: 'asc'
        }
      })
    } catch (error) {
      throw new Error(`Failed to fetch jadwal by guru and date: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getJadwalByGuru(guruId: string) {
    try {
      return await prisma.jadwal.findMany({
        where: {
          guruId
        },
        include: {
          kelas: true,
          mataPelajaran: true,
          guru: {
            include: {
              user: {
                select: {
                  nama: true
                }
              }
            }
          }
        },
        orderBy: [
          { hari: 'asc' },
          { jamMulai: 'asc' }
        ]
      })
    } catch (error) {
      throw new Error(`Failed to fetch jadwal by guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createJadwal(data: CreateJadwalDTO) {
    try {
      return await prisma.jadwal.create({
        data,
        include: {
          guru: {
            include: {
              user: {
                select: {
                  nama: true
                }
              }
            }
          },
          kelas: true,
          mataPelajaran: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Jadwal with same guru, kelas, mata pelajaran, hari, and jam already exists')
        }
        if (error.code === 'P2003') {
          throw new Error('Guru, Kelas, or Mata Pelajaran not found')
        }
      }
      throw new Error(`Failed to create jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateJadwal(id: string, data: UpdateJadwalDTO) {
    try {
      return await prisma.jadwal.update({
        where: { id },
        data,
        include: {
          guru: {
            include: {
              user: {
                select: {
                  nama: true
                }
              }
            }
          },
          kelas: true,
          mataPelajaran: true
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Jadwal not found')
        }
        if (error.code === 'P2002') {
          throw new Error('Jadwal with same guru, kelas, mata pelajaran, hari, and jam already exists')
        }
        if (error.code === 'P2003') {
          throw new Error('Guru, Kelas, or Mata Pelajaran not found')
        }
      }
      throw new Error(`Failed to update jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteJadwal(id: string) {
    try {
      return await prisma.jadwal.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Jadwal not found')
        }
      }
      throw new Error(`Failed to delete jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const masterService = new MasterService()
