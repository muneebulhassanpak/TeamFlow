'use client'

import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { Subtask } from '@/types'

interface SubtaskItemProps {
  subtask: Subtask
  onToggle: (subtaskId: string, completed: boolean) => void
  onDelete: (subtaskId: string) => void
}

export function SubtaskItem({ subtask, onToggle, onDelete }: SubtaskItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 transition-colors hover:bg-muted/30">
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={(checked) => onToggle(subtask.id, checked as boolean)}
        className="shrink-0"
      />
      <span
        className={cn(
          'flex-1 text-sm',
          subtask.completed && 'text-muted-foreground line-through',
        )}
      >
        {subtask.title}
      </span>
      <button
        onClick={() => onDelete(subtask.id)}
        className="shrink-0 text-muted-foreground/50 transition-colors hover:text-destructive opacity-0 group-hover:opacity-100"
        aria-label="Delete subtask"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
