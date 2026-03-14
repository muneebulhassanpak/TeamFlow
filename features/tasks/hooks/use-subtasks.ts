'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subtaskKeys } from '@/lib/query-keys'
import type { Subtask } from '@/types'
import type { CreateSubtaskInput, UpdateSubtaskInput } from '../validations/subtasks'

export function useSubtasks(taskId: string) {
  return useQuery({
    queryKey: subtaskKeys.byTask(taskId),
    queryFn: async (): Promise<Subtask[]> => {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to fetch subtasks')
      return json.data
    },
    enabled: !!taskId,
  })
}

export function useCreateSubtask(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateSubtaskInput) => {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to create subtask')
      return json.data as Subtask
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) }),
  })
}

export function useUpdateSubtask(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ subtaskId, ...input }: UpdateSubtaskInput & { subtaskId: string }) => {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to update subtask')
      return json.data as Subtask
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) }),
  })
}

export function useDeleteSubtask(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete subtask')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) }),
  })
}
