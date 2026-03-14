import { z } from "zod"

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long").nullable().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional().default("medium"),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).optional().default("todo"),
  assignee_id: z.string().uuid("Invalid assignee ID").nullable().optional(),
  due_date: z.string().nullable().optional(),
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").optional(),
  description: z.string().max(2000, "Description is too long").nullable().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).optional(),
  assignee_id: z.string().uuid("Invalid assignee ID").nullable().optional(),
  due_date: z.string().nullable().optional(),
  position: z.number().optional(),
})

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>

export const ReorderTasksSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["todo", "in_progress", "in_review", "done"]),
      position: z.number(),
    })
  ).min(1).max(100),
})

export type ReorderTasksInput = z.infer<typeof ReorderTasksSchema>
