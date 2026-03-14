'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { OnboardingInput } from '@/features/onboarding/validations/onboarding'

interface ConfirmStepProps {
  data: OnboardingInput
  onSubmit: () => void
  onBack: () => void
  isPending: boolean
  error: string | null
}

export function ConfirmStep({ data, onSubmit, onBack, isPending, error }: ConfirmStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Looks good?</h2>
        <p className="text-muted-foreground text-sm">
          Review your details before we set everything up.
        </p>
      </div>

      <div className="bg-muted/50 divide-border divide-y rounded-lg border">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-muted-foreground text-sm">Your name</span>
          <span className="text-sm font-medium">{data.fullName}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-muted-foreground text-sm">Organization</span>
          <span className="text-sm font-medium">{data.orgName}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-muted-foreground text-sm">Workspace URL</span>
          <span className="text-sm font-medium">
            teamflow.app/
            <span className="text-primary">{data.orgSlug}</span>
          </span>
        </div>
      </div>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Create workspace
        </Button>
      </div>
    </div>
  )
}
