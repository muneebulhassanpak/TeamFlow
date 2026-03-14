"use client"

import { parseAsString, useQueryState } from 'nuqs'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useMembers } from '@/features/members/hooks/use-members'
import { useOrgActivity } from '@/features/activity/hooks/use-activity'
import { ActivityFeed } from './activity-feed'
import { ActivityFilters } from './activity-filters'
import { ActivityFeedSkeleton } from './activity-feed-skeleton'
import type { ActivityLogWithActor } from '@/types'

export function ActivityView() {
  const { org } = useOrg()

  const [actorId, setActorId] = useQueryState('actorId', parseAsString.withDefault(''))
  const [dateFrom, setDateFrom] = useQueryState('from', parseAsString.withDefault(''))
  const [dateTo, setDateTo] = useQueryState('to', parseAsString.withDefault(''))

  const filters = {
    ...(actorId ? { actorId } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
  }

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useOrgActivity(org.id, filters)

  const { data: membersData } = useMembers(org.id, {})

  const allLogs: ActivityLogWithActor[] = data?.pages.flatMap((p) => p.data) ?? []
  const members = (membersData?.data ?? []).map((m) => ({
    user_id: m.user_id,
    full_name: m.full_name,
    email: m.email,
  }))

  function handleClear() {
    setActorId('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Activity</h1>
        <p className="text-sm text-muted-foreground">
          Recent activity across your workspace.
        </p>
      </div>

      <ActivityFilters
        members={members}
        actorId={actorId}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onActorChange={setActorId}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onClear={handleClear}
      />

      {error ? (
        <p className="py-12 text-center text-sm text-destructive">
          Failed to load activity: {(error as Error).message}
        </p>
      ) : isLoading ? (
        <ActivityFeedSkeleton rows={8} />
      ) : (
        <>
          <ActivityFeed logs={allLogs} />

          {hasNextPage && (
            <div className="flex justify-center pb-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Loader2 className="mr-2 size-4 animate-spin" />}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
