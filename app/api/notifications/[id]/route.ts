import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

// PATCH /api/notifications/[id] — mark single notification as read
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: error ?? 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const supabase = createServiceClient()

  // Verify the notification belongs to this user before updating
  const { data: notification, error: fetchError } = await supabase
    .from('notifications')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !notification) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (notification.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error: updateError } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
