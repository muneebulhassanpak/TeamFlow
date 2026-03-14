import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationKeys } from '@/lib/query-keys'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types'

export interface NotificationPage {
  data: Notification[]
  total: number
  unreadCount: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Bell: latest 10 + unread count, refetches every 60s
export function useNotificationBell(orgId: string, userId: string) {
  return useQuery({
    queryKey: notificationKeys.all(userId, { orgId, pageSize: 10 }),
    queryFn: async (): Promise<NotificationPage> => {
      const res = await fetch(
        `/api/notifications?orgId=${orgId}&page=1&pageSize=10`,
      )
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch notifications')
      }
      return res.json()
    },
    enabled: !!orgId && !!userId,
    refetchInterval: 60_000,
  })
}

// Full page: paginated
export function useNotifications(orgId: string, userId: string, page: number, pageSize = 20) {
  return useQuery({
    queryKey: notificationKeys.all(userId, { orgId, page, pageSize }),
    queryFn: async (): Promise<NotificationPage> => {
      const res = await fetch(
        `/api/notifications?orgId=${orgId}&page=${page}&pageSize=${pageSize}`,
      )
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to fetch notifications')
      }
      return res.json()
    },
    enabled: !!orgId && !!userId,
  })
}

export function useMarkNotificationRead(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications/${notificationId}`, { method: 'PATCH' })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to mark as read')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) })
    },
  })
}

export function useMarkAllRead(orgId: string, userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to mark all as read')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) })
    },
  })
}

// Realtime subscription — invalidates on any insert/update for this user
export function useNotificationsRealtime(userId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient])
}
