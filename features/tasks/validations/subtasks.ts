import { z } from 'zod'

export const CreateSubtaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
})

export const UpdateSubtaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
})

export type CreateSubtaskInput = z.infer<typeof CreateSubtaskSchema>
export type UpdateSubtaskInput = z.infer<typeof UpdateSubtaskSchema>
