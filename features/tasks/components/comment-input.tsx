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
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0"
    >
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment… (⌘↵)"
        rows={1}
        className="flex-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none outline-none focus-visible:ring-0 min-h-0 h-6 leading-6"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!body.trim()}
        className="size-8 shrink-0 rounded-lg"
        title="Submit comment"
      >
        <SendHorizonal className="size-4" />
      </Button>
    </form>
  )
}
