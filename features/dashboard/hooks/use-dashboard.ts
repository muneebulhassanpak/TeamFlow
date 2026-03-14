import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, taskKeys } from '@/lib/query-keys'
import type { ActivityLogWithActor } from '@/types'

export interface DashboardStats {
  activeProjects: number
  openTasks: number
  memberCount: number
  completedThisWeek: number
}

export interface TaskWithProject {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'in_review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  created_at: string
  project_id: string
  org_id: string
  project: {
    id: string
    name: string
    color: string
  } | null
}

export interface MyTasksParams extends Record<string, unknown> {
  priority?: string
  status?: string
  search?: string
}

export function useDashboardStats(orgId: string) {
  return useQuery({
    queryKey: dashboardKeys.stats(orgId),
    queryFn: async (): Promise<DashboardStats> => {
      const res = await fetch(`/api/dashboard/stats?orgId=${orgId}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch stats')
      }
      return res.json()
    },
    enabled: !!orgId,
  })
}

export function useDashboardActivity(orgId: string) {
  return useQuery({
    queryKey: ['dashboard', 'activity', orgId],
    queryFn: async (): Promise<ActivityLogWithActor[]> => {
      const res = await fetch(`/api/activity?orgId=${orgId}&page=1&pageSize=8`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch activity')
      }
      const json = await res.json()
      return json.data
    },
    enabled: !!orgId,
  })
}

export function useMyTasks(orgId: string, userId: string, params: MyTasksParams = {}) {
  return useQuery({
    queryKey: taskKeys.myTasks(userId, { orgId, ...params }),
    queryFn: async (): Promise<TaskWithProject[]> => {
      const url = new URL('/api/my-tasks', window.location.origin)
      url.searchParams.set('orgId', orgId)
      if (params.priority) url.searchParams.set('priority', params.priority)
      if (params.status) url.searchParams.set('status', params.status)
      if (params.search) url.searchParams.set('search', params.search)

      const res = await fetch(url.toString())
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch tasks')
      }
      const json = await res.json()
      return json.data
    },
    enabled: !!orgId && !!userId,
  })
}
