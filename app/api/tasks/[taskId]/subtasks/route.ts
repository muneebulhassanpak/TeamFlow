import { NextResponse } from 'next/server'
import { getAuthUser, requireOrgMember } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { CreateSubtaskSchema } from '@/features/tasks/validations/subtasks'
import { getSubtasks, createSubtask } from '@/features/tasks/services/subtask-service'

async function getOrgIdForTask(taskId: string) {
  const supabase = createServiceClient()
  const { data } = await supabase.from('tasks').select('org_id').eq('id', taskId).single()
  return data?.org_id ?? null
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params

  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = await getOrgIdForTask(taskId)
  if (!orgId) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const { data, error: fetchError } = await getSubtasks(taskId)
  if (fetchError) return NextResponse.json({ error: 'Failed to fetch subtasks' }, { status: 500 })

  return NextResponse.json({ data })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params

  const { user, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = await getOrgIdForTask(taskId)
  if (!orgId) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member) return NextResponse.json({ error: memberError }, { status: 403 })

  const body = await req.json()
  const parsed = CreateSubtaskSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error: createError } = await createSubtask(taskId, orgId, user.id, parsed.data.title)
  if (createError) return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
