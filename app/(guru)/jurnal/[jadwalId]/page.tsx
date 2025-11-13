import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { masterService } from '@/lib/services/master.service'
import JurnalForm from '@/components/forms/jurnal-form'

interface PageProps {
  params: {
    jadwalId: string
  }
  searchParams: {
    tanggal?: string
  }
}

export default async function JurnalPage({ params, searchParams }: PageProps) {
  // Get authenticated user
  const session = await auth()
  
  if (!session || !session.user || session.user.role !== 'GURU' || !session.user.guruId) {
    redirect('/login')
  }

  // Get tanggal from query params or use today
  const tanggal = searchParams.tanggal || new Date().toISOString().split('T')[0]
  const tanggalDate = new Date(tanggal)

  try {
    // Fetch jadwal details
    const jadwal = await masterService.getJadwalById(params.jadwalId)

    // Verify this jadwal belongs to the authenticated guru
    if (jadwal.guruId !== session.user.guruId) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Akses Ditolak</h1>
            <p className="mt-2 text-gray-600">Anda tidak memiliki akses ke jadwal ini.</p>
          </div>
        </div>
      )
    }

    // Fetch siswa list for this kelas
    const siswaList = await masterService.getSiswaByKelas(jadwal.kelasId)

    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Isi Jurnal Mengajar
                </h1>
                <p className="text-lg text-slate-600 mt-2">
                  Lengkapi formulir jurnal untuk sesi pembelajaran Anda
                </p>
              </div>
            </div>

            {/* Session Info Bar */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Jam</p>
                    <p className="text-sm font-bold text-slate-900">{jadwal.jamMulai} - {jadwal.jamSelesai}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Tanggal</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Kelas</p>
                    <p className="text-sm font-bold text-slate-900">{jadwal.kelas.nama}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Mata Pelajaran</p>
                    <p className="text-sm font-bold text-slate-900">{jadwal.mataPelajaran.nama}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <JurnalForm
            jadwal={jadwal}
            siswaList={siswaList}
            tanggal={tanggal}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading jurnal form:', error)
    notFound()
  }
}
