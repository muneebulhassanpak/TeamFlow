import { NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { UpdateCommentSchema } from '@/features/tasks/validations/comments'
import { updateComment, deleteComment } from '@/features/tasks/services/comment-service'

async function getOrgIdForTask(taskId: string) {
  const supabase = createServiceClient()
  const { data } = await supabase.from('tasks').select('org_id').eq('id', taskId).single()
  return data?.org_id ?? null
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string; commentId: string }> },
) {
  const { taskId, commentId } = await params

  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = await getOrgIdForTask(taskId)
  if (!orgId) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const body = await req.json()
  const parsed = UpdateCommentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error: updateError } = await updateComment(commentId, user.id, parsed.data.body)
  if (updateError) return NextResponse.json({ error: updateError }, { status: updateError === 'Forbidden' ? 403 : 500 })

  return NextResponse.json({ data })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ taskId: string; commentId: string }> },
) {
  const { taskId, commentId } = await params

  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = await getOrgIdForTask(taskId)
  if (!orgId) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const { error: deleteError } = await deleteComment(commentId, user.id, member.role)
  if (deleteError) return NextResponse.json({ error: deleteError }, { status: deleteError === 'Forbidden' ? 403 : 500 })

  return NextResponse.json({ data: { success: true } })
}
