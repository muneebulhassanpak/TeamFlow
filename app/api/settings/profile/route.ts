import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { UpdateProfileSchema } from '@/features/settings/validations/settings'

export async function PATCH(req: Request) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = UpdateProfileSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const supabase = createServiceClient()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ full_name: parsed.data.fullName, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ data: { success: true } })
}
