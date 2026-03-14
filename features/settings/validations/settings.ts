import { z } from 'zod'

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
})

export const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>
