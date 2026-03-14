'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useOrg } from '@/features/app-shell/context/org-context'
import { ProfileSettingsForm } from './profile-settings-form'
import { WorkspaceSettingsForm } from './workspace-settings-form'
import { DangerZone } from './danger-zone'

type Section = 'profile' | 'workspace' | 'danger'

interface NavItem {
  id: Section
  label: string
  adminOnly?: boolean
  destructive?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'workspace', label: 'Workspace', adminOnly: true },
  { id: 'danger', label: 'Danger Zone', adminOnly: true, destructive: true },
]

interface SettingsViewProps {
  fullName: string | null
  email: string
}

export function SettingsView({ fullName, email }: SettingsViewProps) {
  const { role } = useOrg()
  const isAdmin = role === 'admin'
  const [active, setActive] = React.useState<Section>('profile')

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and workspace.</p>
      </div>

      <div className="flex gap-8">
        {/* Left nav */}
        <nav className="w-44 shrink-0 space-y-1">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                active === item.id
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                item.destructive && active !== item.id && 'hover:text-destructive',
                item.destructive && active === item.id && 'text-destructive',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1 max-w-lg">
          {active === 'profile' && <ProfileSettingsForm fullName={fullName} email={email} />}
          {active === 'workspace' && <WorkspaceSettingsForm />}
          {active === 'danger' && <DangerZone />}
        </div>
      </div>
    </div>
  )
}
