import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { getProjectActivity } from '@/features/activity/services/activity-service'

// GET /api/projects/[id]/activity?page=1&pageSize=10
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const { id: projectId } = await params

  const supabase = createServiceClient()
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('org_id')
    .eq('id', projectId)
    .single()

  if (projectError || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, project.org_id)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10)))

  const result = await getProjectActivity(projectId, { page, pageSize })

  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    hasMore: result.hasMore,
  })
}
