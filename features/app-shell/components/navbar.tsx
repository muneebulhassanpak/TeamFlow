'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { LogOut, Loader2, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useOrg } from '@/features/app-shell/context/org-context'
import { NotificationBell } from '@/features/notifications/components/notification-bell'
import { useSignout } from '@/features/auth/hooks/use-auth'

interface NavbarProps {
  userId: string
}

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  'my-tasks': 'My Tasks',
  members: 'Members',
  activity: 'Activity',
  notifications: 'Notifications',
  settings: 'Settings',
}

function useBreadcrumb() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  const segment = parts[1] ?? 'dashboard'
  return SEGMENT_LABELS[segment] ?? segment
}

export function Navbar({ userId }: NavbarProps) {
  const { org } = useOrg()
  const currentPage = useBreadcrumb()
  const signout = useSignout()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={`/${org.slug}/dashboard`}>{org.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator orientation="vertical" className="mx-1 hidden data-[orientation=vertical]:h-4 sm:block" />
      <span className="text-foreground/70 hidden text-xs font-medium sm:block">
        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>

      <div className="flex-1" />

      <NotificationBell userId={userId} />

      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-destructive"
        onClick={() => signout.mutate()}
        disabled={signout.isPending || signout.isSuccess}
      >
        {signout.isPending || signout.isSuccess
          ? <Loader2 className="size-4 animate-spin" />
          : <LogOut className="size-4" />
        }
        Sign out
      </Button>
    </header>
  )
}
