'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getKeterisisanJurnal } from '@/app/actions/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Badge from '@/components/ui/badge'

type PeriodeType = 'today' | 'week' | 'month' | 'semester'

interface GuruKeterisisanReport {
  guruId: string
  guruName: string
  totalJadwal: number
  jurnalTerisi: number
  persentase: number
  isRutin: boolean
}

export default function LaporanKeterisisanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [periode, setPeriode] = useState<PeriodeType>('week')
  const [guruReports, setGuruReports] = useState<GuruKeterisisanReport[]>([])
  const [reportInfo, setReportInfo] = useState<{
    startDate: Date
    endDate: Date
  } | null>(null)

  useEffect(() => {
    fetchData()
  }, [periode])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getKeterisisanJurnal({ periode })

      if (!result.success || !result.data) {
        setError(result.error || 'Gagal memuat data')
        return
      }

      setGuruReports(result.data.guruReports)
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

  const getPersentaseColor = (persentase: number) => {
    if (persentase >= 80) return 'text-green-600'
    if (persentase >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPersentaseBgColor = (persentase: number) => {
    if (persentase >= 80) return 'bg-green-50'
    if (persentase >= 50) return 'bg-yellow-50'
    return 'bg-red-50'
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
        <h1 className="text-3xl font-bold text-gray-900">Laporan Keterisian Jurnal</h1>
        <p className="text-gray-600 mt-2">
          Monitor kedisiplinan pengisian jurnal mengajar per guru
        </p>
      </div>

      {/* Filter */}
      <Card variant="elevated" className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>
              <select
                value={periode}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPeriode(e.target.value as PeriodeType)}
                className="w-full md:w-64 h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini (7 hari)</option>
                <option value="month">Bulan Ini (30 hari)</option>
                <option value="semester">Semester Ini</option>
              </select>
            </div>
            {reportInfo && (
              <div className="text-sm text-gray-600">
                <p>Periode: {formatDate(reportInfo.startDate)} - {formatDate(reportInfo.endDate)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Keterisian Jurnal per Guru</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : guruReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada data untuk periode ini</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead className="text-center">Total Jadwal</TableHead>
                  <TableHead className="text-center">Jurnal Terisi</TableHead>
                  <TableHead className="text-center">Persentase</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guruReports.map((report, index) => (
                  <TableRow key={report.guruId} className={getPersentaseBgColor(report.persentase)}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{report.guruName}</TableCell>
                    <TableCell className="text-center">{report.totalJadwal}</TableCell>
                    <TableCell className="text-center">{report.jurnalTerisi}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-bold ${getPersentaseColor(report.persentase)}`}>
                        {report.persentase}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={report.isRutin ? 'success' : 'danger'}
                        size="sm"
                      >
                        {report.isRutin ? 'Rutin' : 'Tidak Rutin'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {!loading && !error && guruReports.length > 0 && (
        <Card variant="elevated" className="mt-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Guru</p>
                <p className="text-2xl font-bold text-gray-900">{guruReports.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Guru Rutin (≥80%)</p>
                <p className="text-2xl font-bold text-green-600">
                  {guruReports.filter(r => r.isRutin).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Guru Tidak Rutin (&lt;80%)</p>
                <p className="text-2xl font-bold text-red-600">
                  {guruReports.filter(r => !r.isRutin).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
