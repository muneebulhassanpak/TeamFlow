'use client'

import * as React from 'react'
import { Loader2, SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateComment } from '../hooks/use-comments'

interface CommentInputProps {
  taskId: string
}

export function CommentInput({ taskId }: CommentInputProps) {
  const [body, setBody] = React.useState('')
  const create = useCreateComment(taskId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return
    create.mutate({ body: trimmed }, { onSuccess: () => setBody('') })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment… (⌘↵ to submit)"
        rows={2}
        className="resize-none text-sm"
        disabled={create.isPending}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={!body.trim() || create.isPending}
          className="gap-1.5"
        >
          {create.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <SendHorizonal className="size-3.5" />
          )}
          Comment
        </Button>
      </div>
    </form>
  )
}
