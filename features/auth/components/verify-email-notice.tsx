'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function VerifyEmailNotice() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend() {
    setResending(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      setError('Could not find your email address. Please sign up again.')
      setResending(false)
      return
    }

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (resendError) {
      setError(resendError.message)
    } else {
      setResent(true)
    }

    setResending(false)
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-muted-foreground text-sm">
        Click the link in your email to verify your account and get started.
        Check your spam folder if you don&apos;t see it.
      </p>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {resent ? (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          Verification email resent!
        </p>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? 'Resending…' : 'Resend verification email'}
        </Button>
      )}
    </div>
  )
}
