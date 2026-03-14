import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { SettingsView } from '@/features/settings/components/settings-view'
import type { Profile } from '@/types'

export default async function SettingsPage() {
  const { user, error } = await getAuthUser()
  if (error || !user) redirect('/login')

  const supabase = createServiceClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <SettingsView
      fullName={(profile as Pick<Profile, 'full_name'> | null)?.full_name ?? null}
      email={user.email}
    />
  )
}
