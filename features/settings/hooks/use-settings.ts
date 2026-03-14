'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { UpdateProfileInput, UpdateWorkspaceInput } from '../validations/settings'

export function useUpdateProfile() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to update profile')
      return json.data
    },
    onSuccess: () => {
      toast.success('Profile updated')
      router.refresh()
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUpdateWorkspace(orgId: string) {
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: UpdateWorkspaceInput) => {
      const res = await fetch(`/api/settings/workspace?orgId=${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to update workspace')
      return json.data
    },
    onSuccess: () => {
      toast.success('Workspace updated')
      router.refresh()
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useDeleteWorkspace(orgId: string) {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/settings/workspace?orgId=${orgId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete workspace')
      return json.data
    },
    onSuccess: () => {
      router.push('/onboarding')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
