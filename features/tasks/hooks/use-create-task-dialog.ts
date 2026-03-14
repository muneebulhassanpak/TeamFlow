"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { useCreateTask } from "./use-tasks"
import { useProjectMembers } from "@/features/projects/hooks/use-projects"
import { CreateTaskSchema } from "../validations/tasks"

type CreateTaskFormValues = z.input<typeof CreateTaskSchema>

interface UseCreateTaskDialogOptions {
  projectId: string
  defaultStatus?: "todo" | "in_progress" | "in_review" | "done"
}

export function useCreateTaskDialog({ projectId, defaultStatus }: UseCreateTaskDialogOptions) {
  const [open, setOpen] = useState(false)

  const { mutateAsync: createTask } = useCreateTask(projectId)
  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(projectId)

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: defaultStatus ?? "todo",
      assignee_id: undefined,
      due_date: undefined,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: CreateTaskFormValues) {
    const payload = {
      ...data,
      priority: data.priority ?? "medium",
      status: data.status ?? "todo",
      assignee_id: data.assignee_id === "unassigned" ? null : (data.assignee_id || null),
      due_date: data.due_date || null,
    }

    try {
      await createTask(payload)
      toast.success("Task created successfully")
      setOpen(false)
      form.reset()
    } catch (err: Error | unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create task")
    }
  }

  return {
    open,
    setOpen,
    form,
    members,
    isLoadingMembers,
    isSubmitting,
    onSubmit,
  }
}
