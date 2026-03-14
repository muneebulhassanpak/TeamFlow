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
  ChevronLeft,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { useOrg } from '@/features/app-shell/context/org-context'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

function useNavItems(orgSlug: string): NavItem[] {
  return [
    { label: 'Dashboard', href: `/${orgSlug}/dashboard`, icon: LayoutDashboard },
    { label: 'Projects', href: `/${orgSlug}/projects`, icon: FolderKanban },
    { label: 'My Tasks', href: `/${orgSlug}/my-tasks`, icon: CheckSquare },
    { label: 'Members', href: `/${orgSlug}/members`, icon: Users },
    { label: 'Activity', href: `/${orgSlug}/activity`, icon: Activity },
    { label: 'Settings', href: `/${orgSlug}/settings`, icon: Settings },
  ]
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { org } = useOrg()
  const pathname = usePathname()
  const navItems = useNavItems(org.slug)

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'bg-sidebar border-sidebar-border relative flex h-full flex-col border-r transition-[width] duration-200',
          collapsed ? 'w-14' : 'w-56',
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'border-sidebar-border flex h-14 shrink-0 items-center border-b px-3',
            collapsed ? 'justify-center' : 'gap-2',
          )}
        >
          {!collapsed && (
            <span className="text-sidebar-foreground min-w-0 truncate font-semibold">
              {org.name}
            </span>
          )}
          {collapsed && (
            <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold uppercase">
              {org.name.slice(0, 2)}
            </span>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-0.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex size-9 items-center justify-center rounded-md transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-sidebar-foreground/70',
                        )}
                      >
                        <Icon className="size-4" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/70',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Collapse toggle */}
        <div className="border-sidebar-border flex h-12 shrink-0 items-center border-t px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground size-8"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={cn('size-4 transition-transform duration-200', collapsed && 'rotate-180')}
            />
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
