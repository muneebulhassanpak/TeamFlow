import { z } from 'zod'

export const CreateCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(2000),
})

export const UpdateCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(2000),
})

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>
