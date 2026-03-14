import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-5">
          <Skeleton className="size-10 rounded-xl" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </Card>
      ))}
    </div>
  )
}
