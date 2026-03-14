'use client'

import * as React from 'react'
import { Trash2 } from 'lucide-react'
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
    <div className="group flex items-center gap-2.5 rounded-md px-1 py-1 hover:bg-muted/50">
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
        className="text-muted-foreground hover:text-destructive invisible shrink-0 transition-colors group-hover:visible"
        aria-label="Delete subtask"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}
