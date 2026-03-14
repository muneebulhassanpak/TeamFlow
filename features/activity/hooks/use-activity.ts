import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { activityKeys } from '@/lib/query-keys'
import type { ActivityLogWithActor } from '@/types'

export interface ActivityFilterParams extends Record<string, unknown> {
  actorId?: string
  dateFrom?: string
  dateTo?: string
}

export interface ActivityPage {
  data: ActivityLogWithActor[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export function useOrgActivity(orgId: string, filters: ActivityFilterParams = {}) {
  return useInfiniteQuery({
    queryKey: activityKeys.org(orgId, filters),
    queryFn: async ({ pageParam }): Promise<ActivityPage> => {
      const url = new URL('/api/activity', window.location.origin)
      url.searchParams.set('orgId', orgId)
      url.searchParams.set('page', String(pageParam))
      url.searchParams.set('pageSize', '20')
      if (filters.actorId) url.searchParams.set('actorId', filters.actorId)
      if (filters.dateFrom) url.searchParams.set('from', filters.dateFrom)
      if (filters.dateTo) url.searchParams.set('to', filters.dateTo)

      const res = await fetch(url.toString())
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch activity')
      }
      return res.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: !!orgId,
  })
}

export function useProjectActivity(projectId: string) {
  return useQuery({
    queryKey: activityKeys.project(projectId),
    queryFn: async (): Promise<ActivityLogWithActor[]> => {
      const res = await fetch(`/api/projects/${projectId}/activity?pageSize=10`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch activity')
      }
      const json = await res.json()
      return json.data
    },
    enabled: !!projectId,
  })
}
