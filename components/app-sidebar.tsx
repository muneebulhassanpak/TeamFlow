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
  ChevronsUpDown,
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useSignout } from '@/features/auth/hooks/use-auth'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, segment: 'dashboard' },
  { label: 'Projects', icon: FolderKanban, segment: 'projects' },
  { label: 'My Tasks', icon: CheckSquare, segment: 'my-tasks' },
  { label: 'Members', icon: Users, segment: 'members' },
  { label: 'Activity', icon: Activity, segment: 'activity' },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userEmail: string
  userFullName: string | null
  userAvatarUrl: string | null
}

function getUserInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function AppSidebar({ userEmail, userFullName, userAvatarUrl, ...props }: AppSidebarProps) {
  const { org } = useOrg()
  const pathname = usePathname()
  const signout = useSignout()
  const base = `/${org.slug}`

  function isActive(segment: string) {
    const href = `${base}/${segment}`
    return pathname === href || pathname.startsWith(href + '/')
  }

  const orgInitials = org.name.slice(0, 2).toUpperCase()
  const userInitials = getUserInitials(userFullName, userEmail)

  return (
    <Sidebar variant="floating" {...props}>
      {/* Org header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`${base}/dashboard`}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-bold">
                  {orgInitials}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{org.name}</span>
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

      {/* Footer: Profile */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <Avatar className="size-8 rounded-lg">
                    {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userFullName ?? userEmail} />}
                    <AvatarFallback className="rounded-lg text-xs">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                    {userFullName && <span className="truncate text-sm font-semibold">{userFullName}</span>}
                    <span className="text-muted-foreground truncate text-xs">{userEmail}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    {userFullName && <p className="text-sm font-medium">{userFullName}</p>}
                    <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`${base}/settings`}>
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signout.mutate()}
                  disabled={signout.isPending}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
