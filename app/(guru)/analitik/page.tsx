import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getGuruAnalyticsDashboard } from '@/app/actions/analytics'
import { Card } from '@/components/ui/card'
import { KeterlaksanaanTPCard } from '@/components/analytics/keterlaksanaan-tp-card'
import { AbsensiAnalyticsCard } from '@/components/analytics/absensi-analytics-card'
import { TindakLanjutCard } from '@/components/analytics/tindak-lanjut-card'

export default async function AnalitikPage() {
  const session = await auth()

  if (!session || !session.user || session.user.role !== 'GURU') {
    redirect('/login')
  }

  // Fetch analytics data
  const result = await getGuruAnalyticsDashboard()

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Analitik Personal</h1>
        <Card className="p-6">
          <p className="text-red-600">
            {result.error || 'Gagal memuat data analitik'}
          </p>
        </Card>
      </div>
    )
  }

  const { keterlaksanaanTP, absensiAnalytics, tindakLanjutStats } = result.data

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analitik Personal</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Pantau progress pengajaran dan identifikasi siswa yang memerlukan perhatian khusus
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Keterlaksanaan TP Card */}
        <div className="animate-in fade-in duration-300">
          <KeterlaksanaanTPCard data={keterlaksanaanTP} />
        </div>

        {/* Absensi Analytics Card */}
        <div className="animate-in fade-in duration-300" style={{ animationDelay: '100ms' }}>
          <AbsensiAnalyticsCard data={absensiAnalytics} />
        </div>

        {/* Tindak Lanjut Card - Full width */}
        <div className="lg:col-span-2 animate-in fade-in duration-300" style={{ animationDelay: '200ms' }}>
          <TindakLanjutCard data={tindakLanjutStats} />
        </div>
      </div>
    </div>
  )
}
