"use client"

import * as React from "react"
import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCreateComment } from "../hooks/use-comments"

interface CommentInputProps {
  taskId: string
}

export function CommentInput({ taskId }: CommentInputProps) {
  const [body, setBody] = React.useState("")
  const create = useCreateComment(taskId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return
    setBody("")
    create.mutate({ body: trimmed })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment… (⌘↵)"
        rows={1}
        className="flex-1 resize-none text-sm h-9 py-2 min-h-0"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!body.trim()}
        className="shrink-0"
        title="Submit comment"
      >
        <SendHorizonal className="size-4" />
      </Button>
    </form>
  )
}
