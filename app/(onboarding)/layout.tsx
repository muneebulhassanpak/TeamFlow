import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get started — TeamFlow",
}

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getAuthUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = createServiceClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, default_org_slug")
    .eq("id", user.id)
    .single()

  if (profile?.onboarding_completed) {
    const slug = profile.default_org_slug ?? ""
    redirect(`/${slug}/dashboard`)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
