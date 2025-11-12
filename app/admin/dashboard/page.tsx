import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminDashboardOverview } from '@/app/actions/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Badge from '@/components/ui/badge'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Fetch dashboard overview data
  const result = await getAdminDashboardOverview()

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
        <Card variant="elevated" className="p-6">
          <p className="text-red-600">
            {result.error || 'Gagal memuat data dashboard'}
          </p>
        </Card>
      </div>
    )
  }

  const { counts, today, recentJurnal } = result.data

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Selamat datang, {session.user.nama}
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card variant="elevated" className="animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Guru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.totalGuru}</div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-in fade-in duration-300" style={{ animationDelay: '50ms' }}>
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.totalKelas}</div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-in fade-in duration-300" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.totalSiswa}</div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-in fade-in duration-300" style={{ animationDelay: '150ms' }}>
          <CardHeader>
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Mata Pelajaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{counts.totalMataPelajaran}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card variant="elevated" className="mb-6 sm:mb-8 animate-in fade-in duration-300" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Ringkasan Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Jadwal Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{today.jadwalToday}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Jurnal Terisi</p>
              <p className="text-2xl font-bold text-gray-900">{today.jurnalToday}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Keterisian</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{today.keterisisanToday}%</p>
                <Badge 
                  variant={today.keterisisanToday >= 80 ? 'success' : today.keterisisanToday >= 50 ? 'warning' : 'danger'}
                  size="sm"
                >
                  {today.keterisisanToday >= 80 ? 'Baik' : today.keterisisanToday >= 50 ? 'Cukup' : 'Kurang'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Link href="/admin/laporan/keterisian" className="animate-in fade-in duration-300" style={{ animationDelay: '250ms' }}>
          <Card variant="bordered" className="hover:shadow-md transition-all duration-200 hover:border-primary-300 cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">📊 Laporan Keterisian Jurnal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600">
                Monitor kedisiplinan pengisian jurnal semua guru
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/laporan/absensi" className="animate-in fade-in duration-300" style={{ animationDelay: '300ms' }}>
          <Card variant="bordered" className="hover:shadow-md transition-all duration-200 hover:border-primary-300 cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">📈 Laporan Agregat Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600">
                Lihat statistik kehadiran siswa secara keseluruhan
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/master/guru" className="animate-in fade-in duration-300" style={{ animationDelay: '350ms' }}>
          <Card variant="bordered" className="hover:shadow-md transition-all duration-200 hover:border-primary-300 cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">👥 Kelola Data Master</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600">
                Manajemen guru, kelas, siswa, dan jadwal
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card variant="elevated" className="animate-in fade-in duration-300" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentJurnal.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-sm">Belum ada jurnal yang diisi</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJurnal.map((jurnal, index) => (
                <div 
                  key={jurnal.id} 
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {jurnal.guru.user.nama}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {jurnal.jadwal.mataPelajaran.nama} • {jurnal.jadwal.kelas.nama}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(jurnal.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge variant="success" size="sm" className="flex-shrink-0 self-start">
                    Terisi
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
