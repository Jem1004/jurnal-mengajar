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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Isi Jurnal Mengajar</h1>
            <p className="mt-2 text-gray-600">
              Lengkapi formulir jurnal untuk sesi pembelajaran Anda
            </p>
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
