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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Error: {result.error}</p>
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Guru</h1>
        <p className="text-sm sm:text-base text-gray-600">{formattedDate}</p>
      </div>

      {searchParams.success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-sm sm:text-base">Jurnal berhasil disimpan!</p>
          </div>
        </div>
      )}

      <Card variant="bordered" className="animate-in fade-in duration-300">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Jadwal Mengajar Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          {jadwalList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm sm:text-base">Tidak ada jadwal mengajar hari ini</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {jadwalList.map((jadwal, index) => (
                <div 
                  key={jadwal.id}
                  className="animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <JadwalCard jadwal={jadwal} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
