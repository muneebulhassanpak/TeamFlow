'use client'

import * as React from 'react'
import { useComments } from './use-comments'

export function useCommentList(taskId: string) {
  const { data: comments, isLoading } = useComments(taskId)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isLoading && comments && comments.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [comments?.length, isLoading])

  return { comments, isLoading, bottomRef }
}
