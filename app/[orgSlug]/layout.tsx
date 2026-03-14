import { redirect } from "next/navigation"
import { getAuthUser, getOrgBySlug, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { OrgProvider } from "@/features/app-shell/context/org-context"
import { AppShell } from "@/features/app-shell/components/app-shell"
import type { Profile } from "@/types"

interface OrgLayoutProps {
  children: React.ReactNode
  params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { orgSlug } = await params

  // 1. Auth guard
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) redirect("/login")

  // 2. Onboarding guard
  const supabase = createServiceClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()
  if (!profile?.onboarding_completed) redirect("/onboarding")

  // 3. Resolve org by slug
  const { org, error: orgError } = await getOrgBySlug(orgSlug)
  if (orgError || !org) redirect("/login")

  // 4. Membership guard
  const { member, error: memberError } = await requireOrgMember(user.id, org.id)
  if (memberError || !member) redirect("/login")

  // 5. Fetch profile for navbar
  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  const typedProfile = profileData as Pick<
    Profile,
    "full_name" | "avatar_url"
  > | null

  return (
    <OrgProvider org={org} role={member.role}>
      <AppShell
        userEmail={user.email}
        userFullName={typedProfile?.full_name ?? null}
        userAvatarUrl={typedProfile?.avatar_url ?? null}
      >
        {children}
      </AppShell>
    </OrgProvider>
  )
}
