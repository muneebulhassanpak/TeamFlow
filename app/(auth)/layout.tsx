import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TeamFlow",
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getAuthUser()

  if (user) {
    // Redirect logged-in users away from auth pages
    const supabase = createServiceClient()
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, default_org_slug")
      .eq("id", user.id)
      .single()

    if (!profile?.onboarding_completed) {
      redirect("/onboarding")
    }

    const slug = profile.default_org_slug ?? ""
    redirect(`/${slug}/dashboard`)
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-foreground p-4 dark:bg-background">
      {/* Decorative circles — top-right corner, desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        {/* Outer large circle */}
        <div className="absolute top-0 right-0 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Inner smaller circle */}
        <div className="absolute top-0 right-0 h-40 w-40 translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground dark:bg-background" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
