'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { OnboardingInput } from '@/features/onboarding/validations/onboarding'

export function useCompleteOnboarding() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: OnboardingInput) => {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong')
      return json as { slug: string }
    },
    onSuccess: ({ slug }) => {
      router.push(`/${slug}/dashboard`)
    },
  })
}
