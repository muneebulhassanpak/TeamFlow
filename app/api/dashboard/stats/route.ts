import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/dashboard/stats?orgId=xxx
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const supabase = createServiceClient()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: activeProjects },
    { count: openTasks },
    { count: memberCount },
    { count: completedThisWeek },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('archived', false),
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .neq('status', 'done'),
    supabase
      .from('org_members')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId),
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'done')
      .gte('updated_at', weekAgo),
  ])

  return NextResponse.json({
    activeProjects: activeProjects ?? 0,
    openTasks: openTasks ?? 0,
    memberCount: memberCount ?? 0,
    completedThisWeek: completedThisWeek ?? 0,
  })
}
