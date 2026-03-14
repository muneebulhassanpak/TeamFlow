"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useDashboardStats, useDashboardActivity } from '@/features/dashboard/hooks/use-dashboard'
import { StatCards } from './stat-cards'
import { StatCardsSkeleton } from './stat-cards-skeleton'
import { DashboardProjects } from './dashboard-projects'
import { ActivityFeed } from '@/features/activity/components/activity-feed'
import { ActivityFeedSkeleton } from '@/features/activity/components/activity-feed-skeleton'

export function DashboardView() {
  const { org } = useOrg()
  const { data: stats, isLoading: statsLoading } = useDashboardStats(org.id)
  const { data: activity, isLoading: activityLoading } = useDashboardActivity(org.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening in {org.name}.
        </p>
      </div>

      {statsLoading || !stats ? <StatCardsSkeleton /> : <StatCards stats={stats} />}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link
              href={`/${org.slug}/activity`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <ActivityFeedSkeleton rows={5} />
            ) : (
              <ActivityFeed logs={activity ?? []} />
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <DashboardProjects />
      </div>
    </div>
  )
}
