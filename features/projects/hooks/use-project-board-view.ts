"use client"

import { useEffect, useState } from "react"
import { parseAsString, useQueryState } from "nuqs"
import { TaskRow, useCreateTask, useReorderTasks, useTaskRealtime, useTasks } from "@/features/tasks/hooks/use-tasks"
import { useSetNavTitle } from "@/features/app-shell/context/nav-title-context"

interface UseProjectBoardViewOptions {
  projectId: string
  projectName: string
}

export function useProjectBoardView({ projectId, projectName }: UseProjectBoardViewOptions) {
  const setNavTitle = useSetNavTitle()

  useEffect(() => {
    setNavTitle(projectName)
    return () => setNavTitle(null)
  }, [projectName, setNavTitle])

  useTaskRealtime(projectId)

  const [search] = useQueryState("search", parseAsString.withDefault(""))
  const [priority] = useQueryState("priority", parseAsString.withDefault(""))
  const [assigneeId] = useQueryState("assigneeId", parseAsString.withDefault(""))

  const { data: tasks = [], isLoading, error } = useTasks(projectId, { search, priority, assigneeId })
  const { mutate: reorderTasks } = useReorderTasks(projectId)
  const { mutateAsync: createTask } = useCreateTask(projectId)

  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null)
  const [isNewTask, setIsNewTask] = useState(false)
  const [pendingCreateStatus, setPendingCreateStatus] = useState<TaskRow["status"] | null>(null)

  // Always reflect latest cache data in the open dialog
  const freshSelectedTask = selectedTask
    ? (tasks.find((t) => t.id === selectedTask.id) ?? selectedTask)
    : null

  // Step 1: open the title prompt
  function handleCreateTask(status: TaskRow["status"]) {
    setPendingCreateStatus(status)
  }

  // Step 2: user confirmed a title — create then open full dialog
  async function handleQuickSubmit(title: string) {
    if (!pendingCreateStatus) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await createTask({ title, status: pendingCreateStatus, priority: "medium" })
    const created: TaskRow = {
      ...result.data,
      completed_subtask_count: result.data.completed_subtask_count ?? 0,
      comment_count: result.data.comment_count ?? 0,
    }
    setPendingCreateStatus(null)
    setSelectedTask(created)
    setIsNewTask(true)
  }

  function handleQuickCancel() {
    setPendingCreateStatus(null)
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
    pendingCreateStatus,
    handleCreateTask,
    handleQuickSubmit,
    handleQuickCancel,
    handleCloseDialog,
  }
}
