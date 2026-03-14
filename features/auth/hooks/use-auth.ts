'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { LoginInput, SignupInput } from '@/features/auth/validations/auth'

// ─── Sign in with email + password ───────────────────────────────────────────

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      // Middleware will redirect to onboarding or dashboard based on profile state
      router.refresh()
    },
  })
}

// ─── Sign up with email + password ───────────────────────────────────────────

export function useSignup() {
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ fullName, email, password }: SignupInput) => {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        },
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      router.push('/signup?verify=1')
    },
  })
}

// ─── OAuth (Google / GitHub) ──────────────────────────────────────────────────

export function useOAuth() {
  return useMutation({
    mutationFn: async (provider: 'google' | 'github') => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      })
      if (error) throw new Error(error.message)
    },
  })
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export function useSignout() {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/signout', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to sign out')
    },
    onSuccess: () => {
      router.push('/login')
      router.refresh()
    },
  })
}
