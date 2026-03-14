'use client'

import * as React from 'react'
import { Loader2, Pencil, Trash2, X, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUpdateComment, useDeleteComment } from '../hooks/use-comments'
import type { TaskCommentWithAuthor } from '@/types'

interface CommentItemProps {
  comment: TaskCommentWithAuthor
  taskId: string
  currentUserId: string
  currentUserRole: string
}

function getInitials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CommentItem({ comment, taskId, currentUserId, currentUserRole }: CommentItemProps) {
  const [editing, setEditing] = React.useState(false)
  const [editBody, setEditBody] = React.useState(comment.body)
  const updateComment = useUpdateComment(taskId)
  const deleteComment = useDeleteComment(taskId)

  const isAuthor = comment.author_id === currentUserId
  const canEdit = isAuthor
  const canDelete = isAuthor || currentUserRole === 'admin'

  function handleSaveEdit() {
    const trimmed = editBody.trim()
    if (!trimmed || trimmed === comment.body) {
      setEditing(false)
      return
    }
    updateComment.mutate(
      { commentId: comment.id, body: trimmed },
      { onSuccess: () => setEditing(false) },
    )
  }

  function handleCancelEdit() {
    setEditBody(comment.body)
    setEditing(false)
  }

  return (
    <div className="flex gap-3">
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={comment.author.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs">{getInitials(comment.author.full_name)}</AvatarFallback>
      </Avatar>

      <div className="group min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{comment.author.full_name ?? 'Unknown'}</span>
          <span className="text-muted-foreground text-xs">{formatRelativeTime(comment.created_at)}</span>
          {comment.edited_at && (
            <span className="text-muted-foreground text-xs">(edited)</span>
          )}
        </div>

        {editing ? (
          <div className="mt-1.5 space-y-2">
            <Textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={2}
              className="resize-none text-sm"
              autoFocus
            />
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={handleSaveEdit} disabled={updateComment.isPending}>
                {updateComment.isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                Save
              </Button>
              <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={handleCancelEdit}>
                <X className="size-3" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className={cn('mt-0.5 text-sm', deleteComment.isPending && 'opacity-50')}>
            {comment.body}
          </p>
        )}
      </div>

      {/* Actions — visible on hover */}
      {!editing && (
        <div className="invisible flex shrink-0 items-start gap-1 pt-0.5 group-hover:visible">
          {canEdit && (
            <button
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Edit comment"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => deleteComment.mutate(comment.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete comment"
              disabled={deleteComment.isPending}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
