'use client'

import { useState } from 'react'
import { StepIndicator } from './step-indicator'
import { ProfileStep } from './profile-step'
import { OrgStep } from './org-step'
import { ConfirmStep } from './confirm-step'
import { useCompleteOnboarding } from '@/features/onboarding/hooks/use-onboarding'
import type { ProfileStepInput, OrgStepInput } from '@/features/onboarding/validations/onboarding'

const STEPS = ['Profile', 'Organization', 'Confirm']

interface OnboardingWizardProps {
  prefillName?: string | null
}

export function OnboardingWizard({ prefillName }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileStepInput>({
    fullName: prefillName ?? '',
  })
  const [orgData, setOrgData] = useState<OrgStepInput>({
    orgName: '',
    orgSlug: '',
  })

  const complete = useCompleteOnboarding()

  function handleProfileNext(data: ProfileStepInput) {
    setProfileData(data)
    setStep(2)
  }

  function handleOrgNext(data: OrgStepInput) {
    setOrgData(data)
    setStep(3)
  }

  function handleSubmit() {
    complete.mutate({ ...profileData, ...orgData })
  }

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={step} steps={STEPS} />

      <div>
        {step === 1 && (
          <ProfileStep defaultValues={profileData} onNext={handleProfileNext} />
        )}
        {step === 2 && (
          <OrgStep
            defaultValues={orgData}
            onNext={handleOrgNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <ConfirmStep
            data={{ ...profileData, ...orgData }}
            onSubmit={handleSubmit}
            onBack={() => setStep(2)}
            isPending={complete.isPending}
            error={complete.error?.message ?? null}
          />
        )}
      </div>
    </div>
  )
}
