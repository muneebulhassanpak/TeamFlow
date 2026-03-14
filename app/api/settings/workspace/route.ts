import { NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember, isAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { UpdateWorkspaceSchema } from '@/features/settings/validations/settings'

export async function PATCH(req: Request) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })
  if (!isAdmin(member.role)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const body = await req.json()
  const parsed = UpdateWorkspaceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error: updateError } = await supabase
    .from('organizations')
    .update({ name: parsed.data.name, updated_at: new Date().toISOString() })
    .eq('id', orgId)
    .select()
    .single()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ data })
}

export async function DELETE(req: Request) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })
  if (!isAdmin(member.role)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  const supabase = createServiceClient()

  // Delete org — cascades all projects, tasks, members, activity, notifications, invitations
  const { error: deleteError } = await supabase.from('organizations').delete().eq('id', orgId)
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  // Reset profile so the user lands on onboarding after deletion
  await supabase
    .from('profiles')
    .update({ default_org_slug: null, onboarding_completed: false })
    .eq('id', user.id)

  return NextResponse.json({ data: { success: true } })
}
