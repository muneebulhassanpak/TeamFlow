"use client"

import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useDashboardStats, useDashboardActivity } from '@/features/dashboard/hooks/use-dashboard'
import { StatCards } from './stat-cards'
import { StatCardsSkeleton } from './stat-cards-skeleton'
import { DashboardProjects } from './dashboard-projects'
import { ActivityFeed } from '@/features/activity/components/activity-feed'
import { ActivityFeedSkeleton } from '@/features/activity/components/activity-feed-skeleton'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function DashboardView() {
  const { org } = useOrg()
  const { data: stats, isLoading: statsLoading } = useDashboardStats(org.id)
  const { data: activity, isLoading: activityLoading } = useDashboardActivity(org.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{getGreeting()}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Here&apos;s what&apos;s happening in{' '}
            <span className="text-foreground font-medium">{org.name}</span> today.
          </p>
        </div>
        <div className="text-muted-foreground hidden items-center gap-1.5 text-sm sm:flex">
          <CalendarDays className="size-4" />
          {getFormattedDate()}
        </div>
      </div>

      {/* Stat cards */}
      {statsLoading || !stats ? <StatCardsSkeleton /> : <StatCards stats={stats} />}

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link
              href={`/${org.slug}/activity`}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <ActivityFeedSkeleton rows={6} />
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
