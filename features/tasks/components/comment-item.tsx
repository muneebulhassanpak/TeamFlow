"use client"

import { Loader2, Pencil, Trash2, X, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCommentItem } from "../hooks/use-comment-item"
import { getInitials, formatRelativeTime } from "../utils"
import type { TaskCommentWithAuthor } from "@/types"

interface CommentItemProps {
  comment: TaskCommentWithAuthor
  taskId: string
  currentUserId: string
  currentUserRole: string
}

export function CommentItem({
  comment,
  taskId,
  currentUserId,
  currentUserRole,
}: CommentItemProps) {
  const {
    editing,
    setEditing,
    editBody,
    setEditBody,
    isUpdating,
    isDeleting,
    canEdit,
    canDelete,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  } = useCommentItem({ comment, taskId, currentUserId, currentUserRole })

  return (
    <div className="flex gap-3">
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={comment.author.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs">
          {getInitials(comment.author.full_name)}
        </AvatarFallback>
      </Avatar>

      <div className="group min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium">
            {comment.author.full_name ?? "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(comment.created_at)}
          </span>
          {comment.edited_at && (
            <span className="text-xs text-muted-foreground">(edited)</span>
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 px-2 text-xs"
                onClick={handleSaveEdit}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Check className="size-3" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 px-2 text-xs"
                onClick={handleCancelEdit}
              >
                <X className="size-3" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className={cn("mt-0.5 text-sm", isDeleting && "opacity-50")}>
            {comment.body}
          </p>
        )}
      </div>

      {!editing && (
        <div className="invisible flex shrink-0 items-start gap-1 pt-0.5 group-hover:visible">
          {canEdit && (
            <button
              onClick={() => setEditing(true)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Edit comment"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-muted-foreground transition-colors hover:text-destructive"
              aria-label="Delete comment"
              disabled={isDeleting}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
