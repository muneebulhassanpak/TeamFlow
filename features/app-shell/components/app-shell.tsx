'use client'

import * as React from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Navbar } from './navbar'

interface AppShellProps {
  children: React.ReactNode
  userEmail: string
  userFullName: string | null
  userAvatarUrl: string | null
}

export function AppShell({ children, userEmail, userFullName, userAvatarUrl }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar
          userEmail={userEmail}
          userFullName={userFullName}
          userAvatarUrl={userAvatarUrl}
        />
        <div className="flex flex-1 flex-col gap-4 px-6 py-3">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
