import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-10" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
