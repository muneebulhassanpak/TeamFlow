import { z } from 'zod'

export const InviteMemberSchema = z.object({
  orgId: z.string().uuid(),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member']).default('member'),
})

export type InviteMemberInput = z.infer<typeof InviteMemberSchema>
