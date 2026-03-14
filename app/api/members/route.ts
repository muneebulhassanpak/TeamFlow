import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'

const DEFAULT_PAGE_SIZE = 10

// GET /api/members?orgId=xxx&search=xxx&page=1&pageSize=10&sortBy=joined_at&sortDir=asc
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const search = req.nextUrl.searchParams.get('search') ?? ''
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(req.nextUrl.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10)),
  )
  const sortBy = req.nextUrl.searchParams.get('sortBy') === 'role' ? 'role' : 'joined_at'
  const sortDir = req.nextUrl.searchParams.get('sortDir') === 'desc' ? 'desc' : 'asc'

  const supabase = createServiceClient()
  const { data, error: dbError } = await supabase
    .from('org_members')
    .select('id, role, joined_at, user_id, profiles(id, full_name, avatar_url)')
    .eq('org_id', orgId)
    .order('joined_at', { ascending: true })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  // Fetch emails from auth.users via service role
  const userIds = (data ?? []).map((m) => m.user_id)
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(
    (authUsers?.users ?? []).filter((u) => userIds.includes(u.id)).map((u) => [u.id, u.email]),
  )

  let members = (data ?? []).map((m) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    joined_at: m.joined_at,
    email: emailMap[m.user_id] ?? '',
    full_name: m.profiles?.full_name ?? null,
    avatar_url: m.profiles?.avatar_url ?? null,
  }))

  // Server-side search
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    members = members.filter(
      (m) =>
        m.email.toLowerCase().includes(q) || (m.full_name?.toLowerCase().includes(q) ?? false),
    )
  }

  // Server-side sort
  members.sort((a, b) => {
    if (sortBy === 'role') {
      return sortDir === 'asc' ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role)
    }
    const diff =
      new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
    return sortDir === 'asc' ? diff : -diff
  })

  // Server-side pagination
  const total = members.length
  const start = (page - 1) * pageSize
  const paginatedMembers = members.slice(start, start + pageSize)

  return NextResponse.json({ data: paginatedMembers, total, page, pageSize })
}

// DELETE /api/members?orgId=xxx&userId=xxx  — remove a member (admin only)
export async function DELETE(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get('orgId')
  const targetUserId = req.nextUrl.searchParams.get('userId')
  if (!orgId || !targetUserId) {
    return NextResponse.json({ error: 'orgId and userId required' }, { status: 400 })
  }

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })
  if (!isAdmin(member.role)) {
    return NextResponse.json({ error: 'Only admins can remove members' }, { status: 403 })
  }
  if (targetUserId === user.id) {
    return NextResponse.json({ error: 'You cannot remove yourself' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error: dbError } = await supabase
    .from('org_members')
    .delete()
    .eq('org_id', orgId)
    .eq('user_id', targetUserId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data: null })
}
