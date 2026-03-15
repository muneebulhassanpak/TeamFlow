import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { taskKeys } from "@/lib/query-keys"
import { createClient } from "@/lib/supabase/client"
import {
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTasksInput,
} from "../validations/tasks"

export interface TaskRow {
  id: string
  title: string
  description: string | null
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "in_review" | "done"
  assignee_id: string | null
  due_date: string | null
  position: number
  project_id: string
  org_id: string
  created_at: string
  updated_at: string
  created_by: string
  assignee?: {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string
  }
  subtask_count: number
  completed_subtask_count: number
  comment_count: number
}

export interface TasksQueryParams extends Record<string, unknown> {
  priority?: string
  assigneeId?: string
  status?: string
  search?: string
}

export function useTasks(projectId: string, params: TasksQueryParams = {}) {
  return useQuery({
    queryKey: taskKeys.all(projectId, params),
    queryFn: async () => {
      const url = new URL(
        `/api/projects/${projectId}/tasks`,
        window.location.origin
      )
      if (params.priority) url.searchParams.set("priority", params.priority)
      if (params.assigneeId)
        url.searchParams.set("assigneeId", params.assigneeId)
      if (params.status) url.searchParams.set("status", params.status)
      if (params.search) url.searchParams.set("search", params.search)

      const res = await fetch(url.toString())
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to fetch tasks")
      }
      const json = await res.json()
      return json.data as TaskRow[]
    },
    enabled: !!projectId,
  })
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to create task")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) })
    },
  })
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      taskId,
      ...input
    }: UpdateTaskInput & { taskId: string }) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to update task")
      }
      return res.json()
    },
    onMutate: async ({ taskId, ...input }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] })
      const previousEntries = queryClient.getQueriesData<TaskRow[]>({
        queryKey: ["tasks", projectId],
      })
      queryClient.setQueriesData<TaskRow[]>(
        { queryKey: ["tasks", projectId] },
        (old) =>
          old?.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  ...input,
                  assignee_id:
                    input.assignee_id === "unassigned"
                      ? null
                      : (input.assignee_id ?? t.assignee_id),
                }
              : t
          ) ?? old
      )
      return { previousEntries }
    },
    onError: (_err, _vars, context) => {
      context?.previousEntries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] })
    },
  })
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to delete task")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) })
    },
  })
}

export function useReorderTasks(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ReorderTasksInput) => {
      const res = await fetch("/api/tasks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to reorder tasks")
      }
      return res.json()
    },
    onSuccess: () => {
      // Invalidate the base key for tasks so all filtered views update
      queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) })
    },
  })
}

export function useTaskRealtime(projectId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!projectId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`tasks-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          // Invalidate tasks query to trigger a refetch on any change
          queryClient.invalidateQueries({ queryKey: taskKeys.all(projectId) })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, queryClient])
}
