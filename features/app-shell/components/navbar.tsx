'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, User } from 'lucide-react'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
import { useOrg } from '@/features/app-shell/context/org-context'

interface NavbarProps {
  userEmail: string
  userFullName: string | null
  userAvatarUrl: string | null
  onToggleSidebar?: () => void
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function Navbar({ userEmail, userFullName, userAvatarUrl, onToggleSidebar }: NavbarProps) {
  const router = useRouter()
  const { org } = useOrg()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

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
    <header className="bg-background border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
      {/* Mobile sidebar toggle */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 p-0">
          <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar toggle */}
      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden size-8 md:flex"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="size-4" />
        </Button>
      )}

      {/* Breadcrumb / org name */}
      <span className="text-muted-foreground text-sm font-medium">{org.name}</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
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
