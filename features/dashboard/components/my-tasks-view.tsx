"use client"

import Link from 'next/link'
import { parseAsString, useQueryState } from 'nuqs'
import { ListTodo, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useMyTasks, type TaskWithProject } from '@/features/dashboard/hooks/use-dashboard'
import { groupTasksByProject, PRIORITY_COLORS, STATUS_LABELS } from '@/features/dashboard/utils'
import { formatRelativeTime } from '@/features/activity/utils'

interface MyTasksViewProps {
  userId: string
}

export function MyTasksView({ userId }: MyTasksViewProps) {
  const { org } = useOrg()

  const [priority, setPriority] = useQueryState('priority', parseAsString.withDefault(''))
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''))
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))

  const { data: tasks, isLoading } = useMyTasks(org.id, userId, {
    ...(priority ? { priority } : {}),
    ...(status ? { status } : {}),
    ...(search ? { search } : {}),
  })

  const groups = groupTasksByProject(tasks ?? [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <p className="text-sm text-muted-foreground">Tasks assigned to you across all projects.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority || 'all'} onValueChange={(v) => setPriority(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <MyTasksSkeleton />
      ) : groups.length === 0 ? (
        <Empty className="border rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodo />
            </EmptyMedia>
            <EmptyTitle>
              {priority || status || search ? 'No matching tasks' : 'No tasks yet'}
            </EmptyTitle>
            <EmptyDescription>
              {priority || status || search
                ? 'Try adjusting your filters.'
                : 'Tasks assigned to you will appear here.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.projectId}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: group.projectColor }}
                />
                <Link
                  href={`/${org.slug}/projects/${group.projectId}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {group.projectName}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <div className="rounded-lg border divide-y overflow-hidden">
                {group.tasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TaskRow({ task }: { task: TaskWithProject }) {
  const isOverdue =
    task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date()

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
      <span className={`shrink-0 text-xs font-semibold uppercase ${PRIORITY_COLORS[task.priority]}`}>
        {task.priority}
      </span>
      <p className="flex-1 truncate text-sm">{task.title}</p>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {STATUS_LABELS[task.status]}
        </Badge>
        {task.due_date && (
          <span className={`text-xs ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {isOverdue ? 'Overdue · ' : ''}{formatRelativeTime(task.due_date)}
          </span>
        )}
      </div>
    </div>
  )
}

function MyTasksSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[3, 2].map((count, gi) => (
        <div key={gi}>
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="rounded-lg border divide-y overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
