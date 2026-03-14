import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createServerClient } from '@/lib/supabase/server'
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard'
import type { Profile } from '@/types'

export default async function OnboardingPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = data as Profile | null

  // Already completed — send to dashboard
  if (profile?.onboarding_completed && profile.default_org_slug) {
    redirect(`/${profile.default_org_slug}/dashboard`)
  }

  const prefillName =
    profile?.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    null

  return (
    <Card className="px-6 py-8 sm:p-10">
      <CardHeader className="p-0 pb-6 text-center">
        <div className="bg-primary mx-auto mb-3 flex size-10 items-center justify-center rounded-lg">
          <span className="text-primary-foreground text-lg font-bold">T</span>
        </div>
        <p className="text-muted-foreground text-sm">Let&apos;s get you set up</p>
      </CardHeader>
      <CardContent className="p-0">
        <OnboardingWizard prefillName={prefillName} />
      </CardContent>
    </Card>
  )
}
