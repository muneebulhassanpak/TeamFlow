'use client'

import * as React from 'react'
import { useUpdateComment, useDeleteComment } from './use-comments'
import type { TaskCommentWithAuthor } from '@/types'

interface UseCommentItemOptions {
  comment: TaskCommentWithAuthor
  taskId: string
  currentUserId: string
  currentUserRole: string
}

export function useCommentItem({ comment, taskId, currentUserId, currentUserRole }: UseCommentItemOptions) {
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

  function handleDelete() {
    deleteComment.mutate(comment.id)
  }

  return {
    editing,
    setEditing,
    editBody,
    setEditBody,
    isUpdating: updateComment.isPending,
    isDeleting: deleteComment.isPending,
    canEdit,
    canDelete,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  }
}
