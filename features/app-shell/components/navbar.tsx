'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface NavbarProps {
  userEmail: string
  userFullName: string | null
  userAvatarUrl: string | null
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  'my-tasks': 'My Tasks',
  members: 'Members',
  activity: 'Activity',
  settings: 'Settings',
}

function useBreadcrumb() {
  const pathname = usePathname()
  // pathname = /orgSlug/segment/...
  const parts = pathname.split('/').filter(Boolean) // [orgSlug, segment, ...]
  const segment = parts[1] ?? 'dashboard'
  return SEGMENT_LABELS[segment] ?? segment
}

export function Navbar({ userEmail, userFullName, userAvatarUrl }: NavbarProps) {
  const router = useRouter()
  const { org } = useOrg()
  const currentPage = useBreadcrumb()
  const initials = getInitials(userFullName, userEmail)

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
            <Avatar className="size-8">
              {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userFullName ?? userEmail} />}
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              {userFullName && <p className="text-sm font-medium">{userFullName}</p>}
              <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={`/${org.slug}/settings`}>
              <User className="size-4" />
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
