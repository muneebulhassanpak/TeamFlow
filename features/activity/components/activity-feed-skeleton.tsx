import { Skeleton } from '@/components/ui/skeleton'

export function ActivityFeedSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-0 divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 py-4">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
