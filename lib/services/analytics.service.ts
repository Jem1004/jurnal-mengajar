import { prisma } from '@/lib/prisma'
import { StatusAbsensi, TagSiswa } from '@prisma/client'

// Analytics DTOs
export interface KeterlaksanaanStats {
  totalTP: number
  terlaksana: number
  persentase: number
}

export interface SiswaAbsensiStats {
  siswaId: string
  siswaName: string
  totalAbsen: number
  sakit: number
  izin: number
  alpa: number
}

export interface AbsensiAnalytics {
  topAbsentStudents: SiswaAbsensiStats[]
  totalDays: number
}

export interface TindakLanjutItem {
  siswaId: string
  siswaName: string
  tag: TagSiswa
  jurnalId: string
  tanggal: Date
  keterangan?: string
}

export interface TindakLanjutStats {
  perluRemedial: number
  perluPengayaan: number
  masalahPerilaku: number
  rujukBK: number
  items: TindakLanjutItem[]
}

export class AnalyticsService {
  // ==================== KETERLAKSANAAN TP ====================
  
  async getKeterlaksanaanTP(guruId: string, semester?: number, tahunAjaran?: string): Promise<KeterlaksanaanStats> {
    try {
      // Get current semester and tahun ajaran if not provided
      const now = new Date()
      const currentSemester = semester || (now.getMonth() >= 6 ? 1 : 2)
      const currentYear = now.getFullYear()
      const currentTahunAjaran = tahunAjaran || `${currentYear}/${currentYear + 1}`

      // Get total jadwal (scheduled teaching sessions) for this guru in the semester
      const totalJadwal = await prisma.jadwal.count({
        where: {
          guruId,
          semester: currentSemester,
          tahunAjaran: currentTahunAjaran
        }
      })

      // Get unique tujuan pembelajaran that have been taught
      // We count distinct combinations of jadwal that have jurnal entries
      const jurnalWithTP = await prisma.jurnal.findMany({
        where: {
          guruId,
          jadwal: {
            semester: currentSemester,
            tahunAjaran: currentTahunAjaran
          }
        },
        select: {
          jadwalId: true,
          tujuanPembelajaran: true
        },
        distinct: ['jadwalId']
      })

      const terlaksana = jurnalWithTP.length
      const persentase = totalJadwal > 0 ? Math.round((terlaksana / totalJadwal) * 100) : 0

      return {
        totalTP: totalJadwal,
        terlaksana,
        persentase
      }
    } catch (error) {
      throw new Error(`Failed to get keterlaksanaan TP: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== ABSENSI ANALYTICS ====================
  
  async getAbsensiAnalytics(guruId: string, days: number = 30): Promise<AbsensiAnalytics> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get all absensi records for this guru's jurnal in the time period
      const absensiRecords = await prisma.absensi.findMany({
        where: {
          jurnal: {
            guruId,
            tanggal: {
              gte: startDate
            }
          },
          status: {
            not: StatusAbsensi.HADIR
          }
        },
        include: {
          siswa: true
        }
      })

      // Group by siswa and count absences
      const siswaAbsensiMap = new Map<string, SiswaAbsensiStats>()

      absensiRecords.forEach(record => {
        const existing = siswaAbsensiMap.get(record.siswaId)
        
        if (existing) {
          existing.totalAbsen++
          if (record.status === StatusAbsensi.SAKIT) existing.sakit++
          if (record.status === StatusAbsensi.IZIN) existing.izin++
          if (record.status === StatusAbsensi.ALPA) existing.alpa++
        } else {
          siswaAbsensiMap.set(record.siswaId, {
            siswaId: record.siswaId,
            siswaName: record.siswa.nama,
            totalAbsen: 1,
            sakit: record.status === StatusAbsensi.SAKIT ? 1 : 0,
            izin: record.status === StatusAbsensi.IZIN ? 1 : 0,
            alpa: record.status === StatusAbsensi.ALPA ? 1 : 0
          })
        }
      })

      // Sort by total absences and get top students
      const topAbsentStudents = Array.from(siswaAbsensiMap.values())
        .sort((a, b) => b.totalAbsen - a.totalAbsen)
        .slice(0, 10)

      return {
        topAbsentStudents,
        totalDays: days
      }
    } catch (error) {
      throw new Error(`Failed to get absensi analytics: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== TINDAK LANJUT STATS ====================
  
  async getTindakLanjutStats(guruId: string): Promise<TindakLanjutStats> {
    try {
      // Get all tag siswa records that haven't been followed up
      const tagRecords = await prisma.tagSiswaRecord.findMany({
        where: {
          jurnal: {
            guruId
          },
          ditindaklanjuti: false
        },
        include: {
          siswa: true,
          jurnal: {
            select: {
              id: true,
              tanggal: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Count by tag type
      const stats: TindakLanjutStats = {
        perluRemedial: 0,
        perluPengayaan: 0,
        masalahPerilaku: 0,
        rujukBK: 0,
        items: []
      }

      tagRecords.forEach(record => {
        switch (record.tag) {
          case TagSiswa.PERLU_REMEDIAL:
            stats.perluRemedial++
            break
          case TagSiswa.PERLU_PENGAYAAN:
            stats.perluPengayaan++
            break
          case TagSiswa.MASALAH_PERILAKU:
            stats.masalahPerilaku++
            break
          case TagSiswa.RUJUK_BK:
            stats.rujukBK++
            break
        }

        stats.items.push({
          siswaId: record.siswaId,
          siswaName: record.siswa.nama,
          tag: record.tag,
          jurnalId: record.jurnal.id,
          tanggal: record.jurnal.tanggal,
          keterangan: record.keterangan || undefined
        })
      })

      return stats
    } catch (error) {
      throw new Error(`Failed to get tindak lanjut stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== MARK TINDAK LANJUT AS DONE ====================
  
  async markTindakLanjutDone(tagSiswaRecordId: string) {
    try {
      return await prisma.tagSiswaRecord.update({
        where: { id: tagSiswaRecordId },
        data: {
          ditindaklanjuti: true
        }
      })
    } catch (error) {
      throw new Error(`Failed to mark tindak lanjut as done: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== GET SISWA DETAIL WITH HISTORY ====================
  
  async getSiswaAnalytics(siswaId: string, guruId?: string) {
    try {
      const where: any = {
        siswaId
      }

      if (guruId) {
        where.jurnal = {
          guruId
        }
      }

      // Get absensi history
      const absensiHistory = await prisma.absensi.findMany({
        where,
        include: {
          jurnal: {
            include: {
              jadwal: {
                include: {
                  mataPelajaran: true
                }
              }
            }
          }
        },
        orderBy: {
          jurnal: {
            tanggal: 'desc'
          }
        },
        take: 30
      })

      // Get tag history
      const tagHistory = await prisma.tagSiswaRecord.findMany({
        where: {
          siswaId,
          ...(guruId && {
            jurnal: {
              guruId
            }
          })
        },
        include: {
          jurnal: {
            include: {
              jadwal: {
                include: {
                  mataPelajaran: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Calculate absensi summary
      const absensiSummary = {
        hadir: absensiHistory.filter(a => a.status === StatusAbsensi.HADIR).length,
        sakit: absensiHistory.filter(a => a.status === StatusAbsensi.SAKIT).length,
        izin: absensiHistory.filter(a => a.status === StatusAbsensi.IZIN).length,
        alpa: absensiHistory.filter(a => a.status === StatusAbsensi.ALPA).length
      }

      return {
        absensiHistory,
        absensiSummary,
        tagHistory
      }
    } catch (error) {
      throw new Error(`Failed to get siswa analytics: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()
