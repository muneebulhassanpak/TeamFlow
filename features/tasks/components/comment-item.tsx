"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const { isDeleting } = useCommentItem({ comment, taskId, currentUserId, currentUserRole })

  return (
    <div className={cn("group rounded-lg bg-muted/50 p-3", isDeleting && "opacity-50")}>
      {/* Header row: avatar + name + timestamp + actions */}
      <div className="flex items-center gap-2">
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={comment.author.avatar_url ?? undefined} />
          <AvatarFallback className="text-xs">
            {getInitials(comment.author.full_name)}
          </AvatarFallback>
        </Avatar>

        <span className="flex-1 text-sm font-semibold leading-none">
          {comment.author.full_name ?? "Unknown"}
        </span>

        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(comment.created_at)}
        </span>
      </div>

      {/* Body — indented to align with the name */}
      <div className="mt-1 pl-9">
        <p className="text-sm leading-relaxed text-foreground/80">{comment.body}</p>
      </div>
    </div>
  )
}
