import { createServiceClient } from '@/lib/supabase/server'
import type { ActivityLogWithActor } from '@/types'

export interface ActivityQueryFilters {
  actorId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export async function getOrgActivity(orgId: string, filters: ActivityQueryFilters = {}) {
  const supabase = createServiceClient()
  const { page = 1, pageSize = 20, actorId, dateFrom, dateTo } = filters

  let query = supabase
    .from('activity_logs')
    .select(
      `*, actor:profiles!activity_logs_actor_id_fkey(id, full_name, avatar_url)`,
      { count: 'exact' },
    )
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (actorId) query = query.eq('actor_id', actorId)
  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo)

  const rangeFrom = (page - 1) * pageSize
  const rangeTo = rangeFrom + pageSize - 1
  query = query.range(rangeFrom, rangeTo)

  const { data, error, count } = await query

  if (error) return { data: null, error: error.message, total: 0, page, pageSize, hasMore: false }

  return {
    data: data as unknown as ActivityLogWithActor[],
    error: null,
    total: count ?? 0,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  }
}

export async function getProjectActivity(projectId: string, filters: ActivityQueryFilters = {}) {
  const supabase = createServiceClient()
  const { page = 1, pageSize = 10 } = filters

  let query = supabase
    .from('activity_logs')
    .select(
      `*, actor:profiles!activity_logs_actor_id_fkey(id, full_name, avatar_url)`,
      { count: 'exact' },
    )
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const rangeFrom = (page - 1) * pageSize
  const rangeTo = rangeFrom + pageSize - 1
  query = query.range(rangeFrom, rangeTo)

  const { data, error, count } = await query

  if (error) return { data: null, error: error.message, total: 0, page, pageSize, hasMore: false }

  return {
    data: data as unknown as ActivityLogWithActor[],
    error: null,
    total: count ?? 0,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  }
}
