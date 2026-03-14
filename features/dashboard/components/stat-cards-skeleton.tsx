import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function StatCardsSkeleton() {
  return (
    <Card className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5 px-5 py-4">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-7 w-12" />
        </div>
      ))}
    </Card>
  )
}
