"use client"

import Link from 'next/link'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useOrg } from '@/features/app-shell/context/org-context'
import {
  useNotificationBell,
  useMarkNotificationRead,
  useMarkAllRead,
  useNotificationsRealtime,
} from '@/features/notifications/hooks/use-notifications'
import { formatRelativeTime } from '@/features/activity/utils'
import type { Notification } from '@/types'

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const { org } = useOrg()
  const { data } = useNotificationBell(org.id, userId)
  const markRead = useMarkNotificationRead(userId)
  const markAll = useMarkAllRead(org.id, userId)

  useNotificationsRealtime(userId)

  const notifications = data?.data ?? []
  const unreadCount = data?.unreadCount ?? 0

  function handleItemClick(n: Notification) {
    if (!n.read) markRead.mutate(n.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-8">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal text-muted-foreground hover:text-foreground"
              onClick={() => markAll.mutate()}
            >
              <CheckCheck className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <Empty className="border-0 py-4 md:py-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>No notifications</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex cursor-pointer items-start gap-3 px-4 py-3 focus:bg-accent"
              onClick={() => handleItemClick(n)}
              asChild={!!n.link}
            >
              {n.link ? (
                <Link href={n.link} className="flex items-start gap-3">
                  <NotificationDot unread={!n.read} />
                  <NotificationContent notification={n} />
                </Link>
              ) : (
                <>
                  <NotificationDot unread={!n.read} />
                  <NotificationContent notification={n} />
                </>
              )}
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/${org.slug}/notifications`}
            className="w-full cursor-pointer text-center text-sm text-muted-foreground"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationDot({ unread }: { unread: boolean }) {
  return (
    <span
      className={`mt-1.5 size-2 shrink-0 rounded-full ${unread ? 'bg-primary' : 'bg-transparent'}`}
    />
  )
}

function NotificationContent({ notification }: { notification: Notification }) {
  return (
    <div className="min-w-0 flex-1">
      <p className={`text-sm leading-snug ${!notification.read ? 'font-medium' : ''}`}>
        {notification.title}
      </p>
      {notification.body && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{notification.body}</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        {formatRelativeTime(notification.created_at)}
      </p>
    </div>
  )
}
