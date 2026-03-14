/**
 * Server-side auth helpers used in Route Handlers.
 *
 * Role model:
 *   - platform_owner: Muneeb — can manage all orgs across the platform (is_platform_owner = true on profiles)
 *   - admin:  user who signed up — org is auto-created for them, they are the org admin
 *   - member: user invited into an org by an admin
 *
 * Pattern for every API route:
 *   const { user, error } = await getAuthUser()
 *   if (error) return NextResponse.json({ error }, { status: 401 })
 *
 *   const { member, error: memberError } = await requireOrgMember(user.id, orgId)
 *   if (memberError) return NextResponse.json({ error: memberError }, { status: 403 })
 */

import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import type { OrgRole, Profile, SessionUser } from '@/types'

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
  const supabase = createServiceClient()

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

// ─── Role permission checks (org-level) ──────────────────────────────────────

/** Only org admins can manage members, projects, and org settings */
export function isAdmin(role: OrgRole): boolean {
  return role === 'admin'
}

// ─── Platform owner check ────────────────────────────────────────────────────

/** Returns true if the user is the platform owner (Muneeb) */
export async function isPlatformOwner(userId: string): Promise<boolean> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return (data as Profile | null)?.is_platform_owner === true
}

// ─── Get org by slug ─────────────────────────────────────────────────────────

export async function getOrgBySlug(slug: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return { org: null, error: 'Organization not found' }
  return { org: data, error: null }
}
