import { NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { UpdateSubtaskSchema } from '@/features/tasks/validations/subtasks'
import { updateSubtask, deleteSubtask } from '@/features/tasks/services/subtask-service'

async function getOrgIdForTask(taskId: string) {
  const supabase = createServiceClient()
  const { data } = await supabase.from('tasks').select('org_id').eq('id', taskId).single()
  return data?.org_id ?? null
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string; subtaskId: string }> },
) {
  const { taskId, subtaskId } = await params

  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = await getOrgIdForTask(taskId)
  if (!orgId) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const body = await req.json()
  const parsed = UpdateSubtaskSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error: updateError } = await updateSubtask(subtaskId, parsed.data)
  if (updateError) return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 })

  return NextResponse.json({ data })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ taskId: string; subtaskId: string }> },
) {
  const { taskId, subtaskId } = await params

  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = await getOrgIdForTask(taskId)
  if (!orgId) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const { error: deleteError } = await deleteSubtask(subtaskId)
  if (deleteError) return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 })

  return NextResponse.json({ data: { success: true } })
}
