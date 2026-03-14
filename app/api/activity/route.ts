import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { getOrgActivity } from '@/features/activity/services/activity-service'

// GET /api/activity?orgId=xxx&page=1&pageSize=20&actorId=xxx&from=xxx&to=xxx
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const orgId = searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '20', 10)))
  const actorId = searchParams.get('actorId') ?? undefined
  const dateFrom = searchParams.get('from') ?? undefined
  const dateTo = searchParams.get('to') ?? undefined

  const result = await getOrgActivity(orgId, { page, pageSize, actorId, dateFrom, dateTo })

  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    hasMore: result.hasMore,
  })
}
