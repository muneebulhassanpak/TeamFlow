'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

interface AppShellProps {
  children: React.ReactNode
  userEmail: string
  userFullName: string | null
  userAvatarUrl: string | null
}

export function AppShell({ children, userEmail, userFullName, userAvatarUrl }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex h-svh overflow-hidden">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <div className="hidden md:flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          userEmail={userEmail}
          userFullName={userFullName}
          userAvatarUrl={userAvatarUrl}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
