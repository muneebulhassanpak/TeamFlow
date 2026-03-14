import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Email confirmation handler.
 * Handles signup confirmations and invitation acceptances.
 * The URL contains a `token_hash` and `type` from Supabase.
 * For invite type, also accepts the pending invitation into org_members.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const inviteId = searchParams.get('invite_id')

  if (tokenHash && type) {
    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

    if (!error) {
      // Accept the organisation invitation if this was an invite link
      if (type === 'invite' && inviteId && data.user) {
        const service = createServiceClient()
        const { data: invitation } = await service
          .from('invitations')
          .select('id, org_id, role, email, expires_at')
          .eq('id', inviteId)
          .is('accepted_at', null)
          .gt('expires_at', new Date().toISOString())
          .maybeSingle()

        if (invitation && invitation.email === data.user.email) {
          await service
            .from('org_members')
            .upsert(
              { org_id: invitation.org_id, user_id: data.user.id, role: invitation.role },
              { onConflict: 'org_id,user_id' },
            )
          await service
            .from('invitations')
            .update({ accepted_at: new Date().toISOString() })
            .eq('id', inviteId)
        }
      }

      // Middleware will redirect to /onboarding if profile incomplete, else dashboard
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=email_confirm_failed`)
}
