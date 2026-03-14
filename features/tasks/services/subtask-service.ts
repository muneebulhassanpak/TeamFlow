import { createServiceClient } from '@/lib/supabase/server'
import type { UpdateSubtaskInput } from '../validations/subtasks'

export async function getSubtasks(taskId: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('position', { ascending: true })
  return { data, error }
}

export async function createSubtask(
  taskId: string,
  orgId: string,
  userId: string,
  title: string,
) {
  const supabase = createServiceClient()

  // Get current max position
  const { data: existing } = await supabase
    .from('subtasks')
    .select('position')
    .eq('task_id', taskId)
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0

  const { data, error } = await supabase
    .from('subtasks')
    .insert({ task_id: taskId, org_id: orgId, title, position: nextPosition, created_by: userId })
    .select()
    .single()

  return { data, error }
}

export async function updateSubtask(subtaskId: string, input: UpdateSubtaskInput) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('subtasks')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', subtaskId)
    .select()
    .single()
  return { data, error }
}

export async function deleteSubtask(subtaskId: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('subtasks').delete().eq('id', subtaskId)
  return { error }
}
