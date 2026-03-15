"use client"

import { useState } from "react"
import { toast } from "sonner"
import { parseAsString, useQueryState } from "nuqs"
import { TaskRow, useCreateTask, useReorderTasks, useTaskRealtime, useTasks } from "@/features/tasks/hooks/use-tasks"

interface UseProjectBoardViewOptions {
  projectId: string
}

export function useProjectBoardView({ projectId }: UseProjectBoardViewOptions) {
  useTaskRealtime(projectId)

  const [search] = useQueryState("search", parseAsString.withDefault(""))
  const [priority] = useQueryState("priority", parseAsString.withDefault(""))
  const [assigneeId] = useQueryState("assigneeId", parseAsString.withDefault(""))

  const { data: tasks = [], isLoading, error } = useTasks(projectId, { search, priority, assigneeId })
  const { mutate: reorderTasks } = useReorderTasks(projectId)
  const { mutateAsync: createTask } = useCreateTask(projectId)

  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null)
  const [isNewTask, setIsNewTask] = useState(false)

  // Always reflect latest cache data in the open dialog
  const freshSelectedTask = selectedTask
    ? (tasks.find((t) => t.id === selectedTask.id) ?? selectedTask)
    : null

  async function handleCreateTask(status: TaskRow["status"]) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await createTask({ title: "Untitled", status, priority: "medium" })
      const created: TaskRow = {
        ...result.data,
        completed_subtask_count: result.data.completed_subtask_count ?? 0,
        comment_count: result.data.comment_count ?? 0,
      }
      setSelectedTask(created)
      setIsNewTask(true)
    } catch {
      toast.error("Failed to create task")
    }
  }

  function handleCloseDialog() {
    setSelectedTask(null)
    setIsNewTask(false)
  }

  return {
    tasks,
    isLoading,
    error,
    reorderTasks,
    freshSelectedTask,
    setSelectedTask,
    isNewTask,
    handleCreateTask,
    handleCloseDialog,
  }
}
