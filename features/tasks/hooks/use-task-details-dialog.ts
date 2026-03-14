"use client"

import { useState } from "react"
import { toast } from "sonner"
import { TaskRow, useDeleteTask } from "./use-tasks"

interface UseTaskDetailsDialogOptions {
  task: TaskRow | null
  onOpenChange: (open: boolean) => void
}

export function useTaskDetailsDialog({ task, onOpenChange }: UseTaskDetailsDialogOptions) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { mutateAsync: deleteTask } = useDeleteTask(task?.project_id || "")

  const initials = task?.assignee?.full_name
    ? task.assignee.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : task?.assignee?.email.charAt(0).toUpperCase() ?? "?"

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return
    }

    try {
      await deleteTask(task!.id)
      toast.success("Task deleted successfully")
      onOpenChange(false)
    } catch (_error) {
      toast.error("Failed to delete task")
    }
  }

  return {
    isExpanded,
    setIsExpanded,
    isEditDialogOpen,
    setIsEditDialogOpen,
    initials,
    handleDelete,
  }
}
