"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { ActivityLogWithActor } from '@/types'
import { formatActivityAction, formatRelativeTime } from '@/features/activity/utils'

interface ActivityFeedProps {
  logs: ActivityLogWithActor[]
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  if (logs.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    )
  }

  return (
    <div className="divide-y">
      {logs.map((log) => (
        <ActivityItem key={log.id} log={log} />
      ))}
    </div>
  )
}

function ActivityItem({ log }: { log: ActivityLogWithActor }) {
  const { actor } = log
  const name = actor.full_name ?? 'Unknown'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const action = formatActivityAction(log.action, log.meta as Record<string, unknown> | null)

  return (
    <div className="flex items-start gap-3 py-4">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={actor.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-medium">{name}</span>{' '}
          <span className="text-muted-foreground">{action}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatRelativeTime(log.created_at)}
        </p>
      </div>
    </div>
  )
}
