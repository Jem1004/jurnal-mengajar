import Skeleton from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { StatCardSkeleton } from '@/components/ui/loading-states'

export default function AdminDashboardLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Today's Summary */}
      <Card variant="elevated" className="mb-6 sm:mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card variant="bordered" className="p-6">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-full" />
        </Card>
        <Card variant="bordered" className="p-6">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-full" />
        </Card>
        <Card variant="bordered" className="p-6">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="elevated">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 pb-4 border-b border-gray-100 last:border-0">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-56" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
