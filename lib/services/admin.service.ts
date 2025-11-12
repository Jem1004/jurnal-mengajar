import { prisma } from '@/lib/prisma'
import { StatusAbsensi } from '@prisma/client'

// Admin Report DTOs
export interface KeterisisanJurnalFilter {
  startDate?: Date
  endDate?: Date
  periode?: 'today' | 'week' | 'month' | 'semester'
}

export interface GuruKeterisisanReport {
  guruId: string
  guruName: string
  totalJadwal: number
  jurnalTerisi: number
  persentase: number
  isRutin: boolean
}

export interface KeterisisanJurnalReport {
  guruReports: GuruKeterisisanReport[]
  periode: string
  startDate: Date
  endDate: Date
}

export interface AbsensiFilter {
  startDate?: Date
  endDate?: Date
  kelasId?: string
  periode?: 'today' | 'week' | 'month' | 'semester'
  statusFilter?: StatusAbsensi[]
}

export interface AbsensiAggregate {
  tanggal: Date
  hadir: number
  sakit: number
  izin: number
  alpa: number
  total: number
}

export interface AbsensiByKelas {
  kelasId: string
  kelasName: string
  hadir: number
  sakit: number
  izin: number
  alpa: number
  total: number
}

export interface AggregateAbsensiReport {
  dailyStats: AbsensiAggregate[]
  byKelas: AbsensiByKelas[]
  totalStats: {
    hadir: number
    sakit: number
    izin: number
    alpa: number
    total: number
  }
  periode: string
  startDate: Date
  endDate: Date
}

export class AdminService {
  // ==================== HELPER: GET DATE RANGE ====================
  
  private getDateRange(periode?: 'today' | 'week' | 'month' | 'semester', startDate?: Date, endDate?: Date) {
    let start: Date
    let end: Date = new Date()
    end.setHours(23, 59, 59, 999)

    if (startDate && endDate) {
      return { start: startDate, end: endDate }
    }

    switch (periode) {
      case 'today':
        start = new Date()
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start = new Date()
        start.setDate(start.getDate() - 7)
        start.setHours(0, 0, 0, 0)
        break
      case 'month':
        start = new Date()
        start.setMonth(start.getMonth() - 1)
        start.setHours(0, 0, 0, 0)
        break
      case 'semester':
        start = new Date()
        // Assume semester starts in July or January
        const currentMonth = start.getMonth()
        if (currentMonth >= 6) {
          // Semester 1: July - December
          start = new Date(start.getFullYear(), 6, 1)
        } else {
          // Semester 2: January - June
          start = new Date(start.getFullYear(), 0, 1)
        }
        start.setHours(0, 0, 0, 0)
        break
      default:
        // Default to last 30 days
        start = new Date()
        start.setDate(start.getDate() - 30)
        start.setHours(0, 0, 0, 0)
    }

    return { start, end }
  }

  // ==================== KETERISIAN JURNAL REPORT ====================
  
  async getKeterisisanJurnal(filters?: KeterisisanJurnalFilter): Promise<KeterisisanJurnalReport> {
    try {
      const { start, end } = this.getDateRange(filters?.periode, filters?.startDate, filters?.endDate)

      // Get all guru
      const allGuru = await prisma.guru.findMany({
        include: {
          user: {
            select: {
              nama: true
            }
          }
        }
      })

      const guruReports: GuruKeterisisanReport[] = []

      // For each guru, calculate their keterisian
      for (const guru of allGuru) {
        // Count total jadwal sessions in the date range
        // We need to count how many times each jadwal should have occurred
        const jadwalList = await prisma.jadwal.findMany({
          where: {
            guruId: guru.id
          }
        })

        let totalJadwal = 0
        const currentDate = new Date(start)
        
        while (currentDate <= end) {
          const dayOfWeek = currentDate.getDay()
          const jadwalForDay = jadwalList.filter(j => j.hari === dayOfWeek)
          totalJadwal += jadwalForDay.length
          currentDate.setDate(currentDate.getDate() + 1)
        }

        // Count filled jurnal in the date range
        const jurnalTerisi = await prisma.jurnal.count({
          where: {
            guruId: guru.id,
            tanggal: {
              gte: start,
              lte: end
            }
          }
        })

        const persentase = totalJadwal > 0 ? Math.round((jurnalTerisi / totalJadwal) * 100) : 0
        const isRutin = persentase >= 80 // Consider "rutin" if >= 80%

        guruReports.push({
          guruId: guru.id,
          guruName: guru.user.nama,
          totalJadwal,
          jurnalTerisi,
          persentase,
          isRutin
        })
      }

      // Sort by persentase descending
      guruReports.sort((a, b) => b.persentase - a.persentase)

      return {
        guruReports,
        periode: filters?.periode || 'custom',
        startDate: start,
        endDate: end
      }
    } catch (error) {
      throw new Error(`Failed to get keterisian jurnal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== AGGREGATE ABSENSI REPORT ====================
  
  async getAggregateAbsensi(filters?: AbsensiFilter): Promise<AggregateAbsensiReport> {
    try {
      const { start, end } = this.getDateRange(filters?.periode, filters?.startDate, filters?.endDate)

      const where: any = {
        jurnal: {
          tanggal: {
            gte: start,
            lte: end
          }
        }
      }

      if (filters?.kelasId) {
        where.jurnal.jadwal = {
          kelasId: filters.kelasId
        }
      }

      if (filters?.statusFilter && filters.statusFilter.length > 0) {
        where.status = {
          in: filters.statusFilter
        }
      }

      // Get all absensi records in the period
      const absensiRecords = await prisma.absensi.findMany({
        where,
        include: {
          jurnal: {
            include: {
              jadwal: {
                include: {
                  kelas: true
                }
              }
            }
          }
        }
      })

      // Calculate daily stats
      const dailyStatsMap = new Map<string, AbsensiAggregate>()
      
      absensiRecords.forEach(record => {
        const dateKey = record.jurnal.tanggal.toISOString().split('T')[0]
        const existing = dailyStatsMap.get(dateKey)

        if (existing) {
          existing.total++
          if (record.status === StatusAbsensi.HADIR) existing.hadir++
          if (record.status === StatusAbsensi.SAKIT) existing.sakit++
          if (record.status === StatusAbsensi.IZIN) existing.izin++
          if (record.status === StatusAbsensi.ALPA) existing.alpa++
        } else {
          dailyStatsMap.set(dateKey, {
            tanggal: record.jurnal.tanggal,
            hadir: record.status === StatusAbsensi.HADIR ? 1 : 0,
            sakit: record.status === StatusAbsensi.SAKIT ? 1 : 0,
            izin: record.status === StatusAbsensi.IZIN ? 1 : 0,
            alpa: record.status === StatusAbsensi.ALPA ? 1 : 0,
            total: 1
          })
        }
      })

      const dailyStats = Array.from(dailyStatsMap.values())
        .sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime())

      // Calculate stats by kelas
      const byKelasMap = new Map<string, AbsensiByKelas>()

      absensiRecords.forEach(record => {
        const kelasId = record.jurnal.jadwal.kelasId
        const kelasName = record.jurnal.jadwal.kelas.nama
        const existing = byKelasMap.get(kelasId)

        if (existing) {
          existing.total++
          if (record.status === StatusAbsensi.HADIR) existing.hadir++
          if (record.status === StatusAbsensi.SAKIT) existing.sakit++
          if (record.status === StatusAbsensi.IZIN) existing.izin++
          if (record.status === StatusAbsensi.ALPA) existing.alpa++
        } else {
          byKelasMap.set(kelasId, {
            kelasId,
            kelasName,
            hadir: record.status === StatusAbsensi.HADIR ? 1 : 0,
            sakit: record.status === StatusAbsensi.SAKIT ? 1 : 0,
            izin: record.status === StatusAbsensi.IZIN ? 1 : 0,
            alpa: record.status === StatusAbsensi.ALPA ? 1 : 0,
            total: 1
          })
        }
      })

      const byKelas = Array.from(byKelasMap.values())
        .sort((a, b) => a.kelasName.localeCompare(b.kelasName))

      // Calculate total stats
      const totalStats = {
        hadir: absensiRecords.filter(r => r.status === StatusAbsensi.HADIR).length,
        sakit: absensiRecords.filter(r => r.status === StatusAbsensi.SAKIT).length,
        izin: absensiRecords.filter(r => r.status === StatusAbsensi.IZIN).length,
        alpa: absensiRecords.filter(r => r.status === StatusAbsensi.ALPA).length,
        total: absensiRecords.length
      }

      return {
        dailyStats,
        byKelas,
        totalStats,
        periode: filters?.periode || 'custom',
        startDate: start,
        endDate: end
      }
    } catch (error) {
      throw new Error(`Failed to get aggregate absensi: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== DASHBOARD OVERVIEW ====================
  
  async getDashboardOverview() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Count total entities
      const totalGuru = await prisma.guru.count()
      const totalKelas = await prisma.kelas.count()
      const totalSiswa = await prisma.siswa.count()
      const totalMataPelajaran = await prisma.mataPelajaran.count()

      // Count jurnal today
      const jurnalToday = await prisma.jurnal.count({
        where: {
          tanggal: today
        }
      })

      // Count expected jadwal today
      const dayOfWeek = today.getDay()
      const jadwalToday = await prisma.jadwal.count({
        where: {
          hari: dayOfWeek
        }
      })

      const keterisisanToday = jadwalToday > 0 
        ? Math.round((jurnalToday / jadwalToday) * 100) 
        : 0

      // Get recent activity
      const recentJurnal = await prisma.jurnal.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
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
          jadwal: {
            include: {
              kelas: true,
              mataPelajaran: true
            }
          }
        }
      })

      return {
        counts: {
          totalGuru,
          totalKelas,
          totalSiswa,
          totalMataPelajaran
        },
        today: {
          jurnalToday,
          jadwalToday,
          keterisisanToday
        },
        recentJurnal
      }
    } catch (error) {
      throw new Error(`Failed to get dashboard overview: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ==================== GET GURU PERFORMANCE ====================
  
  async getGuruPerformance(guruId: string, periode?: 'week' | 'month' | 'semester') {
    try {
      const { start, end } = this.getDateRange(periode)

      // Count total expected jadwal
      const jadwalList = await prisma.jadwal.findMany({
        where: { guruId }
      })

      let totalJadwal = 0
      const currentDate = new Date(start)
      
      while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay()
        const jadwalForDay = jadwalList.filter(j => j.hari === dayOfWeek)
        totalJadwal += jadwalForDay.length
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Count filled jurnal
      const jurnalTerisi = await prisma.jurnal.count({
        where: {
          guruId,
          tanggal: {
            gte: start,
            lte: end
          }
        }
      })

      const persentase = totalJadwal > 0 ? Math.round((jurnalTerisi / totalJadwal) * 100) : 0

      return {
        totalJadwal,
        jurnalTerisi,
        persentase,
        periode: periode || 'custom',
        startDate: start,
        endDate: end
      }
    } catch (error) {
      throw new Error(`Failed to get guru performance: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const adminService = new AdminService()
