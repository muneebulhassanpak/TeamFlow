"use client"

import { Activity } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import type { ActivityLogWithActor } from '@/types'
import { formatActivityAction, formatRelativeTime } from '@/features/activity/utils'

interface ActivityFeedProps {
  logs: ActivityLogWithActor[]
}

const ACTION_DOT: Record<string, string> = {
  'task.created':   'bg-green-500',
  'task.updated':   'bg-blue-500',
  'task.deleted':   'bg-red-500',
  'project.created':'bg-violet-500',
  'project.updated':'bg-violet-400',
  'project.archived':'bg-orange-500',
  'project.deleted':'bg-red-500',
  'member.removed': 'bg-orange-500',
}

function getDotColor(action: string) {
  return ACTION_DOT[action] ?? 'bg-muted-foreground'
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  if (logs.length === 0) {
    return (
      <Empty className="border rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Activity />
          </EmptyMedia>
          <EmptyTitle>No activity yet</EmptyTitle>
          <EmptyDescription>Activity will appear here as your team works.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="relative space-y-1">
      {/* Vertical timeline line */}
      <div className="absolute top-4 bottom-4 left-3.5 w-px bg-border" />

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
  const dotColor = getDotColor(log.action)

  return (
    <div className="relative flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40">
      {/* Timeline dot + avatar */}
      <div className="relative shrink-0">
        <Avatar className="size-7">
          <AvatarImage src={actor.avatar_url ?? undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        {/* Coloured action dot */}
        <span className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background ${dotColor}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm leading-snug">
          <span className="font-medium">{name}</span>{' '}
          <span className="text-muted-foreground">{action}</span>
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {formatRelativeTime(log.created_at)}
        </p>
      </div>
    </div>
  )
}
