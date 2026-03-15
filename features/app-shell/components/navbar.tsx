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
import { useNavTitle } from '@/features/app-shell/context/nav-title-context'
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

type BreadcrumbEntry = { label: string; href?: string }

function useBreadcrumbItems(orgSlug: string, navTitle: string | null): BreadcrumbEntry[] {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  // parts[0] = orgSlug, parts[1] = segment, parts[2] = id (optional)

  const segment = parts[1] ?? 'dashboard'
  const hasDetailPage = !!parts[2]

  if (segment === 'projects' && hasDetailPage) {
    return [
      { label: SEGMENT_LABELS.projects, href: `/${orgSlug}/projects` },
      { label: navTitle ?? 'Project' },
    ]
  }

  return [{ label: SEGMENT_LABELS[segment] ?? segment }]
}

export function Navbar({ userId }: NavbarProps) {
  const { org } = useOrg()
  const navTitle = useNavTitle()
  const breadcrumbItems = useBreadcrumbItems(org.slug, navTitle)
  const signout = useSignout()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {/* Org — always the root */}
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={`/${org.slug}/dashboard`}>{org.name}</BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.map((item, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator className={i === 0 ? 'hidden md:block' : undefined} />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

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
