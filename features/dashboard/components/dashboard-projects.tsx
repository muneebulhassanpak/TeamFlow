"use client"

import Link from 'next/link'
import { ArrowRight, FolderOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useProjects } from '@/features/projects/hooks/use-projects'

export function DashboardProjects() {
  const { org } = useOrg()
  const { data, isLoading } = useProjects(org.id, { page: 1, pageSize: 5, sortBy: 'created_at', sortDir: 'desc' })
  const projects = data?.data ?? []

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Active Projects</CardTitle>
        <Link
          href={`/${org.slug}/projects`}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-2.5 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Empty className="border-0 py-4 md:py-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>No active projects</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/${org.slug}/projects/${p.id}`}
                  className="flex items-center gap-3 rounded-md px-1 py-1 hover:bg-muted/50 transition-colors"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {(p as unknown as { task_count?: number }).task_count ?? 0} tasks
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
