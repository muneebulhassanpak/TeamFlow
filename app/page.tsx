import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function Page() {
  const { user } = await getAuthUser()

  if (user) {
    // Redirect logged-in users to their dashboard
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

  // Show marketing page for non-logged-in users
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
