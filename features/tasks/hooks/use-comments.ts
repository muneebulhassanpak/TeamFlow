'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentKeys } from '@/lib/query-keys'
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) }),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) }),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) }),
  })
}
