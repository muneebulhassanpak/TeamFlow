'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCommentList } from '../hooks/use-comment-list'
import { CommentItem } from './comment-item'

interface CommentListProps {
  taskId: string
  currentUserId: string
  currentUserRole: string
}

export function CommentList({ taskId, currentUserId, currentUserRole }: CommentListProps) {
  const { comments, isLoading, bottomRef } = useCommentList(taskId)

  return (
    <div className="space-y-3">
      {isLoading ? (
        <CommentListSkeleton />
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
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
      <div ref={bottomRef} />
    </div>
  )
}

export function CommentListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg bg-muted/50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="ml-auto h-3 w-10" />
          </div>
          <div className="pl-9 space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
