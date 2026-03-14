'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Activity,
  Settings,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useOrg } from '@/features/app-shell/context/org-context'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, segment: 'dashboard' },
  { label: 'Projects', icon: FolderKanban, segment: 'projects' },
  { label: 'My Tasks', icon: CheckSquare, segment: 'my-tasks' },
  { label: 'Members', icon: Users, segment: 'members' },
  { label: 'Activity', icon: Activity, segment: 'activity' },
]

const BOTTOM_ITEMS = [{ label: 'Settings', icon: Settings, segment: 'settings' }]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { org } = useOrg()
  const pathname = usePathname()
  const base = `/${org.slug}`

  function isActive(segment: string) {
    const href = `${base}/${segment}`
    return pathname === href || pathname.startsWith(href + '/')
  }

  const initials = org.name.slice(0, 2).toUpperCase()

  return (
    <Sidebar variant="inset" {...props}>
      {/* Org header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`${base}/dashboard`}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-bold">
                  {initials}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{org.name}</span>
                  <span className="text-muted-foreground text-xs">{org.slug}.teamflow.app</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, icon: Icon, segment }) => (
                <SidebarMenuItem key={segment}>
                  <SidebarMenuButton asChild isActive={isActive(segment)}>
                    <Link href={`${base}/${segment}`}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom: Settings */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          {BOTTOM_ITEMS.map(({ label, icon: Icon, segment }) => (
            <SidebarMenuItem key={segment}>
              <SidebarMenuButton asChild isActive={isActive(segment)}>
                <Link href={`${base}/${segment}`}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
