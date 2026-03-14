import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'

// DELETE /api/invitations/[id]?orgId=xxx  — revoke a pending invitation (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })
  if (!isAdmin(member.role)) {
    return NextResponse.json({ error: 'Only admins can revoke invitations' }, { status: 403 })
  }

  const supabase = createServiceClient()
  const { error: dbError } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data: null })
}
