'use client'

import * as React from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Navbar } from './navbar'
import { NavTitleProvider } from '@/features/app-shell/context/nav-title-context'

interface AppShellProps {
  children: React.ReactNode
  userId: string
  userEmail: string
  userFullName: string | null
  userAvatarUrl: string | null
}

export function AppShell({ children, userId, userEmail, userFullName, userAvatarUrl }: AppShellProps) {
  return (
    <NavTitleProvider>
      <SidebarProvider>
        <AppSidebar
          userEmail={userEmail}
          userFullName={userFullName}
          userAvatarUrl={userAvatarUrl}
        />
        <SidebarInset>
          <Navbar userId={userId} />
          <div className="flex flex-1 flex-col rounded-xl bg-muted/40 px-6 py-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </NavTitleProvider>
  )
}
