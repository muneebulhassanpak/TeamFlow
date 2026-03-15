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
      className="rounded-xl border bg-background focus-within:ring-2 focus-within:ring-ring"
    >
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a comment… (⌘↵)"
        rows={2}
        className="resize-none border-0 bg-transparent px-3 pt-3 pb-1 text-sm shadow-none focus-visible:ring-0"
      />
      <div className="flex justify-end px-2 pb-2">
        <Button
          type="submit"
          size="icon"
          disabled={!body.trim()}
          className="size-7 rounded-lg"
          title="Submit comment"
        >
          <SendHorizonal className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}
