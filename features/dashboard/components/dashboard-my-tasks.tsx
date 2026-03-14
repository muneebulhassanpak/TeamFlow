"use client"

import Link from 'next/link'
import { ArrowRight, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useMyTasks, type TaskWithProject } from '@/features/dashboard/hooks/use-dashboard'
import { STATUS_LABELS } from '@/features/dashboard/utils'
import { formatRelativeTime } from '@/features/activity/utils'

const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
const PRIORITY_DOT: Record<string, string> = {
  urgent: 'bg-red-500',
  high:   'bg-orange-500',
  medium: 'bg-yellow-500',
  low:    'bg-blue-400',
}
const PRIORITY_LABEL: Record<string, string> = {
  urgent: 'Urgent',
  high:   'High',
  medium: 'Medium',
  low:    'Low',
}

interface DashboardMyTasksProps {
  userId: string
}

export function DashboardMyTasks({ userId }: DashboardMyTasksProps) {
  const { org } = useOrg()
  const { data: tasks, isLoading } = useMyTasks(org.id, userId)

  const openTasks = (tasks ?? [])
    .filter((t) => t.status !== 'done')
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9))
    .slice(0, 5)

  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">My Open Tasks</CardTitle>
        <Link
          href={`/${org.slug}/my-tasks`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DashboardMyTasksSkeleton />
        ) : openTasks.length === 0 ? (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyMedia variant="icon"><CheckSquare /></EmptyMedia>
              <EmptyTitle>All caught up!</EmptyTitle>
              <EmptyDescription>No open tasks assigned to you.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="divide-y">
            {openTasks.map((task) => (
              <TaskRow key={task.id} task={task} orgSlug={org.slug} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TaskRow({ task, orgSlug }: { task: TaskWithProject; orgSlug: string }) {
  const isOverdue = task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date()

  return (
    <Link
      href={`/${orgSlug}/projects/${task.project_id}`}
      className="hover:bg-muted/40 flex items-center gap-3 rounded-sm px-1 py-3 transition-colors"
    >
      {/* Priority dot */}
      <span
        className={`size-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority] ?? 'bg-muted-foreground'}`}
        title={PRIORITY_LABEL[task.priority]}
      />

      {/* Task info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.title}</p>
        {task.project && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: task.project.color }}
            />
            {task.project.name}
          </p>
        )}
      </div>

      {/* Status + due date */}
      <div className="flex shrink-0 items-center gap-2">
        {task.due_date && (
          <span className={`text-xs ${isOverdue ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
            {isOverdue ? 'Overdue' : formatRelativeTime(task.due_date)}
          </span>
        )}
        <Badge variant="secondary" className="text-xs">
          {STATUS_LABELS[task.status]}
        </Badge>
      </div>
    </Link>
  )
}

function DashboardMyTasksSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-1 py-3">
          <Skeleton className="size-2 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}
