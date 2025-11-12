import Skeleton from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { StatCardSkeleton } from '@/components/ui/loading-states'

export default function AnalitikLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <div className="lg:col-span-2">
          <Card variant="elevated" className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
