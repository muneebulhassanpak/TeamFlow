"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProjectActivity } from '@/features/activity/hooks/use-activity'
import { ActivityFeed } from './activity-feed'
import { ActivityFeedSkeleton } from './activity-feed-skeleton'

interface ProjectActivitySectionProps {
  projectId: string
}

export function ProjectActivitySection({ projectId }: ProjectActivitySectionProps) {
  const { data, isLoading } = useProjectActivity(projectId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in this project</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ActivityFeedSkeleton rows={5} />
        ) : (
          <ActivityFeed logs={data ?? []} />
        )}
      </CardContent>
    </Card>
  )
}
