"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { useUpdateTask, TaskRow } from "./use-tasks"
import { useProjectMembers } from "@/features/projects/hooks/use-projects"
import { UpdateTaskSchema } from "../validations/tasks"

type UpdateTaskFormValues = z.input<typeof UpdateTaskSchema>

interface UseEditTaskDialogOptions {
  task: TaskRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function useEditTaskDialog({ task, open, onOpenChange }: UseEditTaskDialogOptions) {
  const { mutateAsync: updateTask } = useUpdateTask(task.project_id)
  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(task.project_id)

  const form = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      assignee_id: task.assignee_id || undefined,
      due_date: task.due_date ? task.due_date.split("T")[0] : undefined,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        assignee_id: task.assignee_id || undefined,
        due_date: task.due_date ? task.due_date.split("T")[0] : undefined,
      })
    }
  }, [task, open, form])

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: UpdateTaskFormValues) {
    const payload = {
      ...data,
      taskId: task.id,
      assignee_id: data.assignee_id === "unassigned" ? null : (data.assignee_id || null),
      due_date: data.due_date || null,
    }

    try {
      await updateTask(payload)
      toast.success("Task updated successfully")
      onOpenChange(false)
    } catch (err: Error | unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update task")
    }
  }

  return {
    form,
    members,
    isLoadingMembers,
    isSubmitting,
    onSubmit,
  }
}
