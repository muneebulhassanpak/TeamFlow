'use client'

import * as React from 'react'
import { useCreateComment } from './use-comments'

export function useCommentInput(taskId: string) {
  const [body, setBody] = React.useState('')
  const create = useCreateComment(taskId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return
    setBody('')
    create.mutate({ body: trimmed })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return { body, setBody, handleSubmit, handleKeyDown }
}
