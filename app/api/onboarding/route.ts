import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { OnboardingSchema } from '@/features/onboarding/validations/onboarding'
import type { Database } from '@/types/database.types'

type OrgInsert = Database['public']['Tables']['organizations']['Insert']
type OrgMemberInsert = Database['public']['Tables']['org_members']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = OnboardingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { fullName, orgName, orgSlug } = parsed.data
  const supabase = await createServiceClient()

  // Slug uniqueness check
  const { data: existing } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', orgSlug)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'This URL slug is already taken. Please choose another.' },
      { status: 409 },
    )
  }

  // Create org
  const orgInsert: OrgInsert = { name: orgName, slug: orgSlug, created_by: user.id }
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert(orgInsert)
    .select('id, slug')
    .single()

  if (orgError || !org) {
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }

  // Add as admin
  const memberInsert: OrgMemberInsert = { org_id: org.id, user_id: user.id, role: 'admin' }
  const { error: memberError } = await supabase.from('org_members').insert(memberInsert)

  if (memberError) {
    return NextResponse.json({ error: 'Failed to add org member' }, { status: 500 })
  }

  // Complete profile
  const profileUpdate: ProfileUpdate = {
    full_name: fullName,
    onboarding_completed: true,
    default_org_slug: org.slug,
  }
  const { error: profileError } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', user.id)

  if (profileError) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ slug: org.slug })
}
