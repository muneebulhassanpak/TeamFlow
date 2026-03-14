import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { LandingPage } from "@/features/landing/components/landing-page"

export default async function Page() {
  const { user } = await getAuthUser()

  if (user) {
    const supabase = createServiceClient()
    const { data: profile } = await supabase
      .from("profiles")
      .select("default_org_slug, onboarding_completed")
      .eq("id", user.id)
      .single()

    if (!profile?.onboarding_completed) {
      redirect("/onboarding")
    }

    const slug = profile.default_org_slug ?? ""
    redirect(`/${slug}/dashboard`)
  }

  return <LandingPage />
}
