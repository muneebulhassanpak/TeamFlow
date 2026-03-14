import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Email confirmation handler.
 * Supabase sends the user here after they click the verification link in
 * their signup email. The URL contains a `token_hash` and `type` that we
 * use to verify the OTP and establish a session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (tokenHash && type) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

    if (!error) {
      // Middleware will redirect to /onboarding if needed
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=email_confirm_failed`)
}
