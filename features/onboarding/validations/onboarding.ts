import { z } from 'zod'

export const ProfileStepSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be 60 characters or less'),
})

export const OrgStepSchema = z.object({
  orgName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(80, 'Organization name must be 80 characters or less'),
  orgSlug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be 50 characters or less')
    .regex(
      /^[a-z][a-z0-9-]*$/,
      'Slug must start with a letter and only contain lowercase letters, numbers, and hyphens',
    ),
})

export const OnboardingSchema = ProfileStepSchema.merge(OrgStepSchema)

export type ProfileStepInput = z.infer<typeof ProfileStepSchema>
export type OrgStepInput = z.infer<typeof OrgStepSchema>
export type OnboardingInput = z.infer<typeof OnboardingSchema>
