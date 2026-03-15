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
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: subtaskKeys.byTask(taskId) })
      const previous = queryClient.getQueryData<Subtask[]>(subtaskKeys.byTask(taskId))
      const tempSubtask: Subtask = {
        id: `temp-${Date.now()}`,
        task_id: taskId,
        org_id: '',
        created_by: '',
        title: input.title,
        completed: false,
        position: (previous?.length ?? 0) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      queryClient.setQueryData<Subtask[]>(subtaskKeys.byTask(taskId), (old) => [
        ...(old ?? []),
        tempSubtask,
      ])
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(subtaskKeys.byTask(taskId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) })
    },
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
    onMutate: async ({ subtaskId, ...input }) => {
      await queryClient.cancelQueries({ queryKey: subtaskKeys.byTask(taskId) })
      const previous = queryClient.getQueryData<Subtask[]>(subtaskKeys.byTask(taskId))
      queryClient.setQueryData<Subtask[]>(subtaskKeys.byTask(taskId), (old) =>
        old?.map((s) => (s.id === subtaskId ? { ...s, ...input } : s))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(subtaskKeys.byTask(taskId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) })
    },
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
    onMutate: async (subtaskId) => {
      await queryClient.cancelQueries({ queryKey: subtaskKeys.byTask(taskId) })
      const previous = queryClient.getQueryData<Subtask[]>(subtaskKeys.byTask(taskId))
      queryClient.setQueryData<Subtask[]>(subtaskKeys.byTask(taskId), (old) =>
        old?.filter((s) => s.id !== subtaskId)
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(subtaskKeys.byTask(taskId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.byTask(taskId) })
    },
  })
}
