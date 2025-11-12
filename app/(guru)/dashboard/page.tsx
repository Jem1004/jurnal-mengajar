import { getJadwalHariIni } from '@/app/actions/jurnal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import JadwalCard from '@/components/dashboard/jadwal-card'

interface PageProps {
  searchParams: {
    success?: string
  }
}

export default async function DashboardGuruPage({ searchParams }: PageProps) {
  const result = await getJadwalHariIni()

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Guru</h1>
          <p className="text-gray-600">Selamat datang kembali</p>
        </div>
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-800">Gagal memuat jadwal</p>
                <p className="text-red-600 text-sm">{result.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const jadwalList = result.data || []
  const today = new Date()
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Guru</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
            Guru Panel
          </div>
        </div>
      </div>

      {/* Success Message */}
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800">Jurnal berhasil disimpan!</p>
              <p className="text-green-600 text-sm">Data jurnal Anda telah tersimpan dengan aman</p>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Overview Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Jadwal Mengajar Hari Ini
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${jadwalList.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>{jadwalList.length} jadwal</span>
          </div>
        </CardHeader>
        <CardContent>
          {jadwalList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada jadwal mengajar</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Anda tidak memiliki jadwal mengajar untuk hari ini. Nikmati waktu luang Anda!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jadwalList.map((jadwal, index) => (
                <div
                  key={jadwal.id}
                  className="animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <JadwalCard jadwal={jadwal} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {jadwalList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-custom-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jam Mengajar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jadwalList.reduce((total, j) => {
                    const start = new Date(`2000-01-01 ${j.jamMulai}`)
                    const end = new Date(`2000-01-01 ${j.jamSelesai}`)
                    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                  }, 0).toFixed(1)} jam
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-custom-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kelas Diajar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(jadwalList.map(j => j.kelas.nama)).size} kelas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-custom-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mata Pelajaran</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(jadwalList.map(j => j.mataPelajaran.nama)).size} mapel
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
