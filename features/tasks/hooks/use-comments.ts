'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentKeys } from '@/lib/query-keys'
import { createClient } from '@/lib/supabase/client'
import type { TaskCommentWithAuthor } from '@/types'
import type { CreateCommentInput, UpdateCommentInput } from '../validations/comments'

export function useComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.byTask(taskId),
    queryFn: async (): Promise<TaskCommentWithAuthor[]> => {
      const res = await fetch(`/api/tasks/${taskId}/comments`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to fetch comments')
      return json.data
    },
    enabled: !!taskId,
  })
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to post comment')
      return json.data as TaskCommentWithAuthor
    },
    onMutate: async (input) => {
      // Get session from cache — essentially instant, already in memory
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user.id ?? ''
      const meta = session?.user.user_metadata ?? {}

      await queryClient.cancelQueries({ queryKey: commentKeys.byTask(taskId) })
      const previous = queryClient.getQueryData<TaskCommentWithAuthor[]>(commentKeys.byTask(taskId))

      const tempComment: TaskCommentWithAuthor = {
        id: `temp-${Date.now()}`,
        task_id: taskId,
        org_id: '',
        author_id: userId,
        body: input.body,
        edited_at: null,
        created_at: new Date().toISOString(),
        author: {
          id: userId,
          full_name: (meta.full_name as string | null) ?? null,
          avatar_url: (meta.avatar_url as string | null) ?? null,
        },
      }

      queryClient.setQueryData<TaskCommentWithAuthor[]>(commentKeys.byTask(taskId), (old) => [
        ...(old ?? []),
        tempComment,
      ])

      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(commentKeys.byTask(taskId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) })
    },
  })
}

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ commentId, ...input }: UpdateCommentInput & { commentId: string }) => {
      const res = await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to update comment')
      return json.data as TaskCommentWithAuthor
    },
    onMutate: async ({ commentId, body }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.byTask(taskId) })
      const previous = queryClient.getQueryData<TaskCommentWithAuthor[]>(commentKeys.byTask(taskId))
      queryClient.setQueryData<TaskCommentWithAuthor[]>(commentKeys.byTask(taskId), (old) =>
        old?.map((c) =>
          c.id === commentId ? { ...c, body, edited_at: new Date().toISOString() } : c
        )
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(commentKeys.byTask(taskId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) })
    },
  })
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/comments/${commentId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete comment')
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.byTask(taskId) })
      const previous = queryClient.getQueryData<TaskCommentWithAuthor[]>(commentKeys.byTask(taskId))
      queryClient.setQueryData<TaskCommentWithAuthor[]>(commentKeys.byTask(taskId), (old) =>
        old?.filter((c) => c.id !== commentId)
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(commentKeys.byTask(taskId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) })
    },
  })
}
