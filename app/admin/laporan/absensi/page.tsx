'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAggregateAbsensi } from '@/app/actions/analytics'
import { getKelas } from '@/app/actions/master'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AbsensiChart } from '@/components/admin/absensi-chart'

type PeriodeType = 'today' | 'week' | 'month' | 'semester'

interface AbsensiAggregate {
  tanggal: Date
  hadir: number
  sakit: number
  izin: number
  alpa: number
  total: number
}

interface AbsensiByKelas {
  kelasId: string
  kelasName: string
  hadir: number
  sakit: number
  izin: number
  alpa: number
  total: number
}

interface Kelas {
  id: string
  nama: string
}

export default function LaporanAbsensiPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [periode, setPeriode] = useState<PeriodeType>('week')
  const [selectedKelas, setSelectedKelas] = useState<string>('')
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  
  const [dailyStats, setDailyStats] = useState<AbsensiAggregate[]>([])
  const [byKelas, setByKelas] = useState<AbsensiByKelas[]>([])
  const [totalStats, setTotalStats] = useState({
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpa: 0,
    total: 0
  })
  const [reportInfo, setReportInfo] = useState<{
    startDate: Date
    endDate: Date
  } | null>(null)

  useEffect(() => {
    fetchKelasList()
  }, [])

  useEffect(() => {
    fetchData()
  }, [periode, selectedKelas])

  const fetchKelasList = async () => {
    try {
      const result = await getKelas()
      if (result.success && result.data) {
        setKelasList(result.data)
      }
    } catch (err) {
      console.error('Failed to fetch kelas list:', err)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAggregateAbsensi({
        periode,
        kelasId: selectedKelas || undefined
      })

      if (!result.success || !result.data) {
        setError(result.error || 'Gagal memuat data')
        return
      }

      setDailyStats(result.data.dailyStats.map(stat => ({
        ...stat,
        tanggal: new Date(stat.tanggal)
      })))
      setByKelas(result.data.byKelas)
      setTotalStats(result.data.totalStats)
      setReportInfo({
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate)
      })
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Kembali
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Laporan Agregat Absensi</h1>
        <p className="text-gray-600 mt-2">
          Statistik kehadiran siswa secara keseluruhan
        </p>
      </div>

      {/* Filters */}
      <Card variant="elevated" className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>
              <select
                value={periode}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPeriode(e.target.value as PeriodeType)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini (7 hari)</option>
                <option value="month">Bulan Ini (30 hari)</option>
                <option value="semester">Semester Ini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedKelas(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kelas</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {reportInfo && (
            <div className="text-sm text-gray-600 mt-4">
              <p>Periode: {formatDate(reportInfo.startDate)} - {formatDate(reportInfo.endDate)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {/* Total Statistics */}
          <Card variant="elevated" className="mb-6">
            <CardHeader>
              <CardTitle>Ringkasan Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Absensi</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStats.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Hadir</p>
                  <p className="text-3xl font-bold text-green-600">{totalStats.hadir}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculatePercentage(totalStats.hadir, totalStats.total)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Sakit</p>
                  <p className="text-3xl font-bold text-yellow-600">{totalStats.sakit}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculatePercentage(totalStats.sakit, totalStats.total)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Izin</p>
                  <p className="text-3xl font-bold text-blue-600">{totalStats.izin}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculatePercentage(totalStats.izin, totalStats.total)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Alpa</p>
                  <p className="text-3xl font-bold text-red-600">{totalStats.alpa}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculatePercentage(totalStats.alpa, totalStats.total)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card variant="elevated" className="mb-6">
            <CardHeader>
              <CardTitle>Trend Absensi Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <AbsensiChart data={dailyStats} />
            </CardContent>
          </Card>

          {/* By Kelas Table */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Absensi per Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              {byKelas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data untuk periode ini</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kelas</TableHead>
                      <TableHead className="text-center">Hadir</TableHead>
                      <TableHead className="text-center">Sakit</TableHead>
                      <TableHead className="text-center">Izin</TableHead>
                      <TableHead className="text-center">Alpa</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">% Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byKelas.map((kelas) => (
                      <TableRow key={kelas.kelasId}>
                        <TableCell className="font-medium">{kelas.kelasName}</TableCell>
                        <TableCell className="text-center text-green-600 font-semibold">
                          {kelas.hadir}
                        </TableCell>
                        <TableCell className="text-center text-yellow-600">
                          {kelas.sakit}
                        </TableCell>
                        <TableCell className="text-center text-blue-600">
                          {kelas.izin}
                        </TableCell>
                        <TableCell className="text-center text-red-600">
                          {kelas.alpa}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {kelas.total}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold ${
                            calculatePercentage(kelas.hadir, kelas.total) >= 80
                              ? 'text-green-600'
                              : calculatePercentage(kelas.hadir, kelas.total) >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {calculatePercentage(kelas.hadir, kelas.total)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
