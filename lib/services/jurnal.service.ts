import { prisma } from '@/lib/prisma'
import { Prisma, StatusAbsensi, TagSiswa } from '@prisma/client'

// DTOs for Jurnal
export interface AbsensiInput {
  siswaId: string
  status: StatusAbsensi
}

export interface TagSiswaInput {
  siswaId: string
  tag: TagSiswa
  keterangan?: string
}

export interface CreateJurnalDTO {
  jadwalId: string
  guruId: string
  tanggal: Date
  tujuanPembelajaran: string
  kegiatanPembelajaran: string
  asesmen?: string
  catatanKhusus?: string
  linkBukti?: string
  absensi: AbsensiInput[]
  tagSiswa?: TagSiswaInput[]
}

export interface UpdateJurnalDTO {
  tujuanPembelajaran?: string
  kegiatanPembelajaran?: string
  asesmen?: string
  catatanKhusus?: string
  linkBukti?: string
  absensi?: AbsensiInput[]
  tagSiswa?: TagSiswaInput[]
}

export interface JurnalFilterDTO {
  startDate?: Date
  endDate?: Date
  kelasId?: string
  mataPelajaranId?: string
}

export class JurnalService {
  // ==================== CREATE JURNAL ====================
  
  async createJurnal(data: CreateJurnalDTO) {
    try {
      // Validate jadwal exists
      const jadwal = await prisma.jadwal.findUnique({
        where: { id: data.jadwalId },
        include: {
          kelas: true,
          mataPelajaran: true
        }
      })

      if (!jadwal) {
        throw new Error('Jadwal not found')
      }

      // Check if jurnal already exists for this jadwal and date
      const existingJurnal = await prisma.jurnal.findUnique({
        where: {
          jadwalId_tanggal: {
            jadwalId: data.jadwalId,
            tanggal: data.tanggal
          }
        }
      })

      if (existingJurnal) {
        throw new Error('Jurnal for this jadwal and date already exists')
      }

      // Validate URL format if linkBukti is provided
      if (data.linkBukti) {
        try {
          new URL(data.linkBukti)
        } catch {
          throw new Error('Invalid URL format for link bukti')
        }
      }

      // Create jurnal with absensi and tag siswa in a transaction
      const jurnal = await prisma.$transaction(async (tx) => {
        // Create jurnal
        const newJurnal = await tx.jurnal.create({
          data: {
            jadwalId: data.jadwalId,
            guruId: data.guruId,
            tanggal: data.tanggal,
            tujuanPembelajaran: data.tujuanPembelajaran,
            kegiatanPembelajaran: data.kegiatanPembelajaran,
            asesmen: data.asesmen,
            catatanKhusus: data.catatanKhusus,
            linkBukti: data.linkBukti
          }
        })

        // Create absensi records
        if (data.absensi && data.absensi.length > 0) {
          await tx.absensi.createMany({
            data: data.absensi.map(abs => ({
              jurnalId: newJurnal.id,
              siswaId: abs.siswaId,
              status: abs.status
            }))
          })
        }

        // Create tag siswa records
        if (data.tagSiswa && data.tagSiswa.length > 0) {
          await tx.tagSiswaRecord.createMany({
            data: data.tagSiswa.map(tag => ({
              jurnalId: newJurnal.id,
              siswaId: tag.siswaId,
              tag: tag.tag,
              keterangan: tag.keterangan
            }))
          })
        }

        return newJurnal
      })

      // Fetch complete jurnal with relations
      return await this.getJurnalById(jurnal.id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('Invalid jadwal, guru, or siswa reference')
        }
      }
      throw new Error(`Failed to create jurnal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== GET JURNAL ====================
  
  async getJurnalById(id: string) {
    try {
      const jurnal = await prisma.jurnal.findUnique({
        where: { id },
        include: {
          jadwal: {
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
            }
          },
          guru: {
            include: {
              user: {
                select: {
                  nama: true
                }
              }
            }
          },
          absensi: {
            include: {
              siswa: true
            },
            orderBy: {
              siswa: {
                nama: 'asc'
              }
            }
          },
          tagSiswa: {
            include: {
              siswa: true
            }
          }
        }
      })

      if (!jurnal) {
        throw new Error('Jurnal not found')
      }

      return jurnal
    } catch (error) {
      throw new Error(`Failed to fetch jurnal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getJurnalByJadwal(jadwalId: string, tanggal: Date) {
    try {
      const jurnal = await prisma.jurnal.findUnique({
        where: {
          jadwalId_tanggal: {
            jadwalId,
            tanggal
          }
        },
        include: {
          jadwal: {
            include: {
              kelas: true,
              mataPelajaran: true
            }
          },
          absensi: {
            include: {
              siswa: true
            },
            orderBy: {
              siswa: {
                nama: 'asc'
              }
            }
          },
          tagSiswa: {
            include: {
              siswa: true
            }
          }
        }
      })

      return jurnal
    } catch (error) {
      throw new Error(`Failed to fetch jurnal by jadwal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getJurnalByGuru(guruId: string, filters?: JurnalFilterDTO) {
    try {
      const where: Prisma.JurnalWhereInput = {
        guruId
      }

      if (filters?.startDate || filters?.endDate) {
        where.tanggal = {}
        if (filters.startDate) {
          where.tanggal.gte = filters.startDate
        }
        if (filters.endDate) {
          where.tanggal.lte = filters.endDate
        }
      }

      if (filters?.kelasId || filters?.mataPelajaranId) {
        where.jadwal = {}
        if (filters.kelasId) {
          where.jadwal.kelasId = filters.kelasId
        }
        if (filters.mataPelajaranId) {
          where.jadwal.mataPelajaranId = filters.mataPelajaranId
        }
      }

      return await prisma.jurnal.findMany({
        where,
        include: {
          jadwal: {
            include: {
              kelas: true,
              mataPelajaran: true
            }
          },
          absensi: {
            include: {
              siswa: true
            }
          },
          tagSiswa: {
            include: {
              siswa: true
            }
          }
        },
        orderBy: {
          tanggal: 'desc'
        }
      })
    } catch (error) {
      throw new Error(`Failed to fetch jurnal by guru: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== UPDATE JURNAL ====================
  
  async updateJurnal(id: string, data: UpdateJurnalDTO) {
    try {
      // Validate jurnal exists
      const existingJurnal = await prisma.jurnal.findUnique({
        where: { id }
      })

      if (!existingJurnal) {
        throw new Error('Jurnal not found')
      }

      // Validate URL format if linkBukti is provided
      if (data.linkBukti) {
        try {
          new URL(data.linkBukti)
        } catch {
          throw new Error('Invalid URL format for link bukti')
        }
      }

      // Update jurnal with absensi and tag siswa in a transaction
      await prisma.$transaction(async (tx) => {
        // Update jurnal basic fields
        await tx.jurnal.update({
          where: { id },
          data: {
            tujuanPembelajaran: data.tujuanPembelajaran,
            kegiatanPembelajaran: data.kegiatanPembelajaran,
            asesmen: data.asesmen,
            catatanKhusus: data.catatanKhusus,
            linkBukti: data.linkBukti
          }
        })

        // Update absensi if provided
        if (data.absensi) {
          // Delete existing absensi
          await tx.absensi.deleteMany({
            where: { jurnalId: id }
          })

          // Create new absensi records
          if (data.absensi.length > 0) {
            await tx.absensi.createMany({
              data: data.absensi.map(abs => ({
                jurnalId: id,
                siswaId: abs.siswaId,
                status: abs.status
              }))
            })
          }
        }

        // Update tag siswa if provided
        if (data.tagSiswa) {
          // Delete existing tag siswa
          await tx.tagSiswaRecord.deleteMany({
            where: { jurnalId: id }
          })

          // Create new tag siswa records
          if (data.tagSiswa.length > 0) {
            await tx.tagSiswaRecord.createMany({
              data: data.tagSiswa.map(tag => ({
                jurnalId: id,
                siswaId: tag.siswaId,
                tag: tag.tag,
                keterangan: tag.keterangan
              }))
            })
          }
        }
      })

      // Fetch updated jurnal with relations
      return await this.getJurnalById(id)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Jurnal not found')
        }
        if (error.code === 'P2003') {
          throw new Error('Invalid siswa reference')
        }
      }
      throw new Error(`Failed to update jurnal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== DELETE JURNAL ====================
  
  async deleteJurnal(id: string) {
    try {
      return await prisma.jurnal.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Jurnal not found')
        }
      }
      throw new Error(`Failed to delete jurnal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== HELPER METHODS ====================
  
  async getAbsensiSummary(jurnalId: string) {
    try {
      const summary = await prisma.absensi.groupBy({
        by: ['status'],
        where: { jurnalId },
        _count: {
          status: true
        }
      })

      return {
        hadir: summary.find(s => s.status === 'HADIR')?._count.status || 0,
        sakit: summary.find(s => s.status === 'SAKIT')?._count.status || 0,
        izin: summary.find(s => s.status === 'IZIN')?._count.status || 0,
        alpa: summary.find(s => s.status === 'ALPA')?._count.status || 0
      }
    } catch (error) {
      throw new Error(`Failed to get absensi summary: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async checkJurnalExists(jadwalId: string, tanggal: Date): Promise<boolean> {
    try {
      const jurnal = await prisma.jurnal.findUnique({
        where: {
          jadwalId_tanggal: {
            jadwalId,
            tanggal
          }
        }
      })

      return !!jurnal
    } catch (error) {
      throw new Error(`Failed to check jurnal existence: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const jurnalService = new JurnalService()
