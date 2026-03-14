"use client"

import Link from 'next/link'
import { ArrowRight, FolderOpen, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useProjects } from '@/features/projects/hooks/use-projects'

export function DashboardProjects() {
  const { org } = useOrg()
  const { data, isLoading } = useProjects(org.id, {
    page: 1,
    pageSize: 6,
    sortBy: 'created_at',
    sortDir: 'desc',
  })
  const projects = data?.data ?? []

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Active Projects</CardTitle>
        <Link
          href={`/${org.slug}/projects`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Empty className="rounded-xl border py-4 md:py-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>No active projects</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => {
              const taskCount = (p as unknown as { task_count?: number }).task_count ?? 0
              const memberCount = (p as unknown as { member_count?: number }).member_count ?? 0
              return (
                <li key={p.id}>
                  <Link
                    href={`/${org.slug}/projects/${p.id}`}
                    className="hover:bg-muted/50 group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
                  >
                    {/* Coloured project dot */}
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />

                    {/* Name */}
                    <span className="group-hover:text-foreground text-muted-foreground flex-1 truncate text-sm font-medium transition-colors">
                      {p.name}
                    </span>

                    {/* Meta */}
                    <div className="flex shrink-0 items-center gap-2">
                      {memberCount > 0 && (
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Users className="size-3" />
                          {memberCount}
                        </span>
                      )}
                      <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                      </Badge>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
