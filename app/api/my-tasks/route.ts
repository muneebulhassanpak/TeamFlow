import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/my-tasks?orgId=xxx&priority=xxx&status=xxx&search=xxx
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const orgId = searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const priority = searchParams.get('priority')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const supabase = createServiceClient()

  let query = supabase
    .from('tasks')
    .select(`
      id, title, description, status, priority, due_date, created_at, project_id, org_id,
      project:projects!tasks_project_id_fkey(id, name, color)
    `)
    .eq('org_id', orgId)
    .eq('assignee_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (priority) query = query.eq('priority', priority as 'low' | 'medium' | 'high' | 'urgent')
  if (status) query = query.eq('status', status as 'todo' | 'in_progress' | 'in_review' | 'done')
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error: dbError } = await query

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data: data ?? [] })
}
