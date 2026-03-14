'use client'

import { Separator } from '@/components/ui/separator'
import { ProfileSettingsForm } from './profile-settings-form'
import { WorkspaceSettingsForm } from './workspace-settings-form'
import { DangerZone } from './danger-zone'

interface SettingsViewProps {
  fullName: string | null
  email: string
}

export function SettingsView({ fullName, email }: SettingsViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and workspace.</p>
      </div>

      <div className="max-w-2xl space-y-8">
        <ProfileSettingsForm fullName={fullName} email={email} />

        <Separator />

        <WorkspaceSettingsForm />

        <Separator />

        <DangerZone />
      </div>
    </div>
  )
}
