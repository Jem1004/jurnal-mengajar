'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Get All Jurnal for Admin
 * With filters and statistics
 */
export async function getAllJurnal(filters: {
  guruId?: string;
  kelasId?: string;
  mataPelajaranId?: string;
  statusKetercapaianTP?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    // Build where clause
    const where: any = {};

    if (filters.guruId) {
      where.guruId = filters.guruId;
    }

    if (filters.statusKetercapaianTP) {
      where.statusKetercapaianTP = filters.statusKetercapaianTP;
    }

    if (filters.kelasId || filters.mataPelajaranId) {
      where.jadwal = {};
      if (filters.kelasId) {
        where.jadwal.kelasId = filters.kelasId;
      }
      if (filters.mataPelajaranId) {
        where.jadwal.mataPelajaranId = filters.mataPelajaranId;
      }
    }

    if (filters.startDate || filters.endDate) {
      where.tanggal = {};
      if (filters.startDate) {
        where.tanggal.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.tanggal.lte = new Date(filters.endDate);
      }
    }

    // Fetch jurnal
    const jurnal = await prisma.jurnal.findMany({
      where,
      include: {
        guru: {
          include: {
            user: true,
          },
        },
        jadwal: {
          include: {
            kelas: true,
            mataPelajaran: true,
          },
        },
        absensi: {
          include: {
            siswa: true,
          },
        },
        tagSiswa: {
          include: {
            siswa: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    // Fetch filter options
    const guruList = await prisma.guru.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: {
          nama: 'asc',
        },
      },
    });

    const kelasList = await prisma.kelas.findMany({
      orderBy: {
        nama: 'asc',
      },
    });

    const mapelList = await prisma.mataPelajaran.findMany({
      orderBy: {
        nama: 'asc',
      },
    });

    return {
      success: true,
      data: {
        jurnal,
        guruList,
        kelasList,
        mapelList,
      },
    };
  } catch (error) {
    console.error('Error fetching jurnal for admin:', error);
    return { success: false, error: 'Failed to fetch jurnal' };
  }
}

/**
 * Get Jurnal Detail for Admin
 */
export async function getJurnalDetail(jurnalId: string) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const jurnal = await prisma.jurnal.findUnique({
      where: { id: jurnalId },
      include: {
        guru: {
          include: {
            user: true,
          },
        },
        jadwal: {
          include: {
            kelas: true,
            mataPelajaran: true,
          },
        },
        absensi: {
          include: {
            siswa: true,
          },
        },
        tagSiswa: {
          include: {
            siswa: true,
          },
        },
      },
    });

    if (!jurnal) {
      return { success: false, error: 'Jurnal not found' };
    }

    return { success: true, data: jurnal };
  } catch (error) {
    console.error('Error fetching jurnal detail:', error);
    return { success: false, error: 'Failed to fetch jurnal detail' };
  }
}

/**
 * Get Laporan Tujuan Pembelajaran
 * Statistics per guru/mapel
 */
export async function getLaporanTP(filters: {
  guruId?: string;
  mataPelajaranId?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    // Build where clause
    const where: any = {};

    if (filters.guruId) {
      where.guruId = filters.guruId;
    }

    if (filters.mataPelajaranId) {
      where.jadwal = {
        mataPelajaranId: filters.mataPelajaranId,
      };
    }

    if (filters.startDate || filters.endDate) {
      where.tanggal = {};
      if (filters.startDate) {
        where.tanggal.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.tanggal.lte = new Date(filters.endDate);
      }
    }

    // Get statistics per guru
    const jurnalByGuru = await prisma.jurnal.groupBy({
      by: ['guruId', 'statusKetercapaianTP'],
      where,
      _count: true,
    });

    // Get guru details
    const guruIdsSet = new Set(jurnalByGuru.map((j) => j.guruId));
    const guruIds = Array.from(guruIdsSet);
    const guruList = await prisma.guru.findMany({
      where: {
        id: { in: guruIds },
      },
      include: {
        user: true,
      },
    });

    // Format data
    const guruMap = new Map(guruList.map((g) => [g.id, g]));
    const statsPerGuru = guruIds.map((guruId) => {
      const guru = guruMap.get(guruId);
      const guruJurnal = jurnalByGuru.filter((j) => j.guruId === guruId);

      const tercapai = guruJurnal.find((j) => j.statusKetercapaianTP === 'TERCAPAI')?._count || 0;
      const sebagian =
        guruJurnal.find((j) => j.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI')?._count || 0;
      const tidakTercapai =
        guruJurnal.find((j) => j.statusKetercapaianTP === 'TIDAK_TERCAPAI')?._count || 0;
      const total = tercapai + sebagian + tidakTercapai;

      return {
        guruId,
        guruNama: guru?.user.nama || 'Unknown',
        total,
        tercapai,
        sebagian,
        tidakTercapai,
        persentaseTercapai: total > 0 ? Math.round((tercapai / total) * 100) : 0,
      };
    });

    // Get statistics per mata pelajaran
    const jurnalByMapel = await prisma.jurnal.groupBy({
      by: ['statusKetercapaianTP'],
      where,
      _count: true,
    });

    // Get detailed stats by mapel
    const jurnal = await prisma.jurnal.findMany({
      where,
      include: {
        jadwal: {
          include: {
            mataPelajaran: true,
          },
        },
      },
    });

    const mapelStats = new Map<
      string,
      {
        nama: string;
        total: number;
        tercapai: number;
        sebagian: number;
        tidakTercapai: number;
      }
    >();

    jurnal.forEach((j) => {
      const mapelId = j.jadwal.mataPelajaranId;
      const mapelNama = j.jadwal.mataPelajaran.nama;

      if (!mapelStats.has(mapelId)) {
        mapelStats.set(mapelId, {
          nama: mapelNama,
          total: 0,
          tercapai: 0,
          sebagian: 0,
          tidakTercapai: 0,
        });
      }

      const stats = mapelStats.get(mapelId)!;
      stats.total++;

      if (j.statusKetercapaianTP === 'TERCAPAI') {
        stats.tercapai++;
      } else if (j.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI') {
        stats.sebagian++;
      } else if (j.statusKetercapaianTP === 'TIDAK_TERCAPAI') {
        stats.tidakTercapai++;
      }
    });

    const statsPerMapel = Array.from(mapelStats.entries()).map(([mapelId, stats]) => ({
      mapelId,
      mapelNama: stats.nama,
      total: stats.total,
      tercapai: stats.tercapai,
      sebagian: stats.sebagian,
      tidakTercapai: stats.tidakTercapai,
      persentaseTercapai: stats.total > 0 ? Math.round((stats.tercapai / stats.total) * 100) : 0,
    }));

    return {
      success: true,
      data: {
        statsPerGuru,
        statsPerMapel,
      },
    };
  } catch (error) {
    console.error('Error fetching laporan TP:', error);
    return { success: false, error: 'Failed to fetch laporan TP' };
  }
}
