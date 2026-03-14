'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useComments } from '../hooks/use-comments'
import { CommentItem } from './comment-item'
import { CommentInput } from './comment-input'

interface CommentListProps {
  taskId: string
  currentUserId: string
  currentUserRole: string
}

export function CommentList({ taskId, currentUserId, currentUserRole }: CommentListProps) {
  const { data: comments, isLoading } = useComments(taskId)

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">
        Comments
        {comments && comments.length > 0 && (
          <span className="text-muted-foreground ml-1.5 text-xs font-normal">{comments.length}</span>
        )}
      </h4>

      {isLoading ? (
        <CommentListSkeleton />
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              taskId={taskId}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No comments yet.</p>
      )}

      <CommentInput taskId={taskId} />
    </div>
  )
}

export function CommentListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback />
          </Avatar>
          <div className="flex-1 space-y-1.5">
            <div className="flex gap-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
