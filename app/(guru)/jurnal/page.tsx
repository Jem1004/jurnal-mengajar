import { auth } from '@/lib/auth'
import { masterService } from '@/lib/services/master.service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Helper function to convert day number to day name
function getDayName(dayIndex: number): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[dayIndex] || 'Hari tidak diketahui'
}

// Helper function to get current day status
function getDayStatus(dayIndex: number): 'today' | 'past' | 'future' {
  const today = new Date().getDay()
  if (dayIndex === today) return 'today'
  if (dayIndex < today) return 'past'
  return 'future'
}

export default async function JurnalListPage() {
  // Get authenticated user
  const session = await auth()

  if (!session || !session.user || session.user.role !== 'GURU' || !session.user.guruId) {
    redirect('/login')
  }

  try {
    // Fetch jadwal for this guru
    const jadwalList = await masterService.getJadwalByGuru(session.user.guruId)

    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Jurnal Mengajar
                </h1>
                <p className="text-lg text-slate-600 mt-2">
                  Kelola jurnal pembelajaran Anda dengan mudah
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>{jadwalList.length} jadwal aktif</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Jadwal</p>
                    <p className="text-2xl font-bold text-slate-900">{jadwalList.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Mata Pelajaran</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {new Set(jadwalList.map(j => j.mataPelajaran?.nama).filter(Boolean)).size}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Kelas</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {new Set(jadwalList.map(j => j.kelas?.nama).filter(Boolean)).size}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jurnal List */}
          {jadwalList.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <CardContent className="py-16 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Jadwal</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Anda belum memiliki jadwal mengajar. Hubungi administrator untuk mengatur jadwal Anda.
                </p>
              </CardContent>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jadwalList.map((jadwal) => {
                const dayStatus = getDayStatus(jadwal.hari)
                const dayName = getDayName(jadwal.hari)

                return (
                  <Card key={jadwal.id} className="group hover:shadow-2xl transition-all duration-300 border border-slate-200 bg-white hover:-translate-y-1 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          dayStatus === 'today'
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : dayStatus === 'past'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                          dayStatus === 'today'
                            ? 'bg-emerald-500 text-white'
                            : dayStatus === 'past'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {dayStatus === 'today' ? 'Hari Ini' : dayName}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
                        {jadwal.mataPelajaran?.nama || 'Mata Pelajaran'}
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Kelas {jadwal.kelas?.nama || '-'}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{jadwal.jamMulai} - {jadwal.jamSelesai}</p>
                            <p className="text-xs text-slate-500">Jam Mengajar</p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Semester {jadwal.semester || '-'}</p>
                            <p className="text-xs text-slate-500">Tahun Ajaran {jadwal.tahunAjaran || '-'}</p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/jurnal/${jadwal.id}`}
                        className={`block w-full text-center font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
                          dayStatus === 'today'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {dayStatus === 'today' ? 'Isi Jurnal Sekarang' : 'Isi Jurnal'}
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading jadwal list:', error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h1>
          <p className="text-slate-600 mb-6">Gagal memuat jadwal. Silakan coba lagi.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-xl transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }
}