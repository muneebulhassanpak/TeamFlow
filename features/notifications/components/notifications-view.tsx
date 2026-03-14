"use client"

import { useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { useOrg } from '@/features/app-shell/context/org-context'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllRead,
} from '@/features/notifications/hooks/use-notifications'
import { NotificationsSkeleton } from './notifications-skeleton'
import { formatRelativeTime } from '@/features/activity/utils'
import type { Notification } from '@/types'

interface NotificationsViewProps {
  userId: string
}

export function NotificationsView({ userId }: NotificationsViewProps) {
  const { org } = useOrg()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useNotifications(org.id, userId, page, pageSize)
  const markRead = useMarkNotificationRead(userId)
  const markAll = useMarkAllRead(org.id, userId)

  const notifications = data?.data ?? []
  const total = data?.total ?? 0
  const unreadCount = data?.unreadCount ?? 0
  const hasMore = data?.hasMore ?? false

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {total} notification{total !== 1 ? 's' : ''}
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            <CheckCheck className="mr-2 size-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <NotificationsSkeleton rows={8} />
      ) : notifications.length === 0 ? (
        <Empty className="border rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell />
            </EmptyMedia>
            <EmptyTitle>You&apos;re all caught up!</EmptyTitle>
            <EmptyDescription>No notifications to show right now.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border divide-y overflow-hidden">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onMarkRead={() => markRead.mutate(n.id)}
            />
          ))}
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: () => void
}) {
  return (
    <div
      className={`flex items-start gap-4 px-4 py-4 transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
    >
      <span
        className={`mt-2 size-2 shrink-0 rounded-full ${!notification.read ? 'bg-primary' : 'bg-transparent border border-border'}`}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${!notification.read ? 'font-medium' : ''}`}>
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-sm text-muted-foreground">{notification.body}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {notification.type}
        </Badge>
        {!notification.read && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkRead}>
            Mark read
          </Button>
        )}
      </div>
    </div>
  )
}
