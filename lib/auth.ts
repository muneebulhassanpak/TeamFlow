/**
 * Server-side auth helpers used in Route Handlers.
 *
 * Pattern for every API route:
 *   const { user, error } = await getAuthUser()
 *   if (error) return NextResponse.json({ error }, { status: 401 })
 *
 *   const { member, error: memberError } = await requireOrgMember(user.id, orgId)
 *   if (memberError) return NextResponse.json({ error: memberError }, { status: 403 })
 */

import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { OrgRole, SessionUser } from '@/types'

// ─── Get the authenticated user from the current session ─────────────────────

export async function getAuthUser(): Promise<
  { user: SessionUser; error: null } | { user: null; error: string }
> {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, error: 'Unauthorized' }
  }

  return { user: { id: user.id, email: user.email! }, error: null }
}

// ─── Verify user is a member of the org and return their role ────────────────

export async function requireOrgMember(
  userId: string,
  orgId: string,
): Promise<
  { member: { role: OrgRole; org_id: string }; error: null } | { member: null; error: string }
> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('org_members')
    .select('role, org_id')
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .single()

  if (error || !data) {
    return { member: null, error: 'Forbidden: not a member of this organization' }
  }

  return { member: data, error: null }
}

// ─── Role permission checks ───────────────────────────────────────────────────

export function isOwner(role: OrgRole): boolean {
  return role === 'owner'
}

export function isAdminOrOwner(role: OrgRole): boolean {
  return role === 'owner' || role === 'admin'
}

// ─── Get org by slug ─────────────────────────────────────────────────────────

export async function getOrgBySlug(slug: string) {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return { org: null, error: 'Organization not found' }
  return { org: data, error: null }
}
