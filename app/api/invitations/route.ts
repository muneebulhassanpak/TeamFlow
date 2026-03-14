import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { InviteMemberSchema } from '@/features/members/validations/members'

// GET /api/invitations?orgId=xxx  — list pending invitations (admin only)
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })
  if (!isAdmin(member.role)) {
    return NextResponse.json({ error: 'Only admins can view invitations' }, { status: 403 })
  }

  const supabase = createServiceClient()
  const { data, error: dbError } = await supabase
    .from('invitations')
    .select('id, email, role, created_at, expires_at')
    .eq('org_id', orgId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data: data ?? [] })
}

// POST /api/invitations  — send invite (admin only)
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = InviteMemberSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 })
  }

  const { orgId, email, role } = parsed.data

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })
  if (!isAdmin(member.role)) {
    return NextResponse.json({ error: 'Only admins can invite members' }, { status: 403 })
  }

  const supabase = createServiceClient()

  // Check if invited email already belongs to an existing member
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const existingUser = authUsers?.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  )
  if (existingUser) {
    const { data: existingMember } = await supabase
      .from('org_members')
      .select('id')
      .eq('org_id', orgId)
      .eq('user_id', existingUser.id)
      .maybeSingle()
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this workspace' }, { status: 409 })
    }
  }

  // Upsert invitation (overwrite any expired previous invite for same email)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: invite, error: dbError } = await supabase
    .from('invitations')
    .upsert(
      {
        org_id: orgId,
        email: email.toLowerCase(),
        role,
        invited_by: user.id,
        expires_at: expiresAt,
        accepted_at: null,
      },
      { onConflict: 'org_id,email', ignoreDuplicates: false },
    )
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  // Notify the invited user if they already have an account
  if (existingUser) {
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single()

    await supabase.from('notifications').insert({
      user_id: existingUser.id,
      org_id: orgId,
      type: 'invite.received',
      title: `You've been invited to join ${org?.name ?? 'a workspace'}`,
      body: 'Accept the invitation to collaborate with the team.',
      link: null,
    })
  }

  // TODO: send invite email via Resend (Module: Email)
  return NextResponse.json({ data: invite }, { status: 201 })
}
