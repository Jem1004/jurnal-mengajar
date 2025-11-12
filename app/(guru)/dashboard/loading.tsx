import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton'
import { JadwalCardSkeleton } from '@/components/ui/loading-states'

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <Card variant="bordered">
        <CardHeader>
          <Skeleton className="h-7 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <JadwalCardSkeleton />
            <JadwalCardSkeleton />
            <JadwalCardSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
