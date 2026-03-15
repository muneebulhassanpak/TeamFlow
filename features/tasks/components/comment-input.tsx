"use client"

import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCommentInput } from "../hooks/use-comment-input"

interface CommentInputProps {
  taskId: string
}

export function CommentInput({ taskId }: CommentInputProps) {
  const { body, setBody, handleSubmit, handleKeyDown } = useCommentInput(taskId)

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
