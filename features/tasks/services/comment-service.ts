import { createServiceClient } from '@/lib/supabase/server'
import type { TaskCommentWithAuthor } from '@/types'

export async function getComments(taskId: string): Promise<{ data: TaskCommentWithAuthor[] | null; error: unknown }> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('task_comments')
    .select(`
      *,
      author:profiles!task_comments_author_id_fkey(id, full_name, avatar_url)
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  return { data: data as TaskCommentWithAuthor[] | null, error }
}

export async function createComment(
  taskId: string,
  orgId: string,
  authorId: string,
  body: string,
) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('task_comments')
    .insert({ task_id: taskId, org_id: orgId, author_id: authorId, body })
    .select(`*, author:profiles!task_comments_author_id_fkey(id, full_name, avatar_url)`)
    .single()
  return { data, error }
}

export async function updateComment(commentId: string, authorId: string, body: string) {
  const supabase = createServiceClient()

  // Verify ownership before updating
  const { data: existing } = await supabase
    .from('task_comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  if (!existing || existing.author_id !== authorId) {
    return { data: null, error: 'Forbidden' }
  }

  const { data, error } = await supabase
    .from('task_comments')
    .update({ body, edited_at: new Date().toISOString() })
    .eq('id', commentId)
    .select(`*, author:profiles!task_comments_author_id_fkey(id, full_name, avatar_url)`)
    .single()
  return { data, error }
}

export async function deleteComment(commentId: string, userId: string, userRole: string) {
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('task_comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  if (!existing) return { error: 'Not found' }

  // Only author or org admin can delete
  if (existing.author_id !== userId && userRole !== 'admin') {
    return { error: 'Forbidden' }
  }

  const { error } = await supabase.from('task_comments').delete().eq('id', commentId)
  return { error }
}
