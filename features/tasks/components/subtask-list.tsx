'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSubtaskList } from '../hooks/use-subtask-list'
import { SubtaskItem } from './subtask-item'

interface SubtaskListProps {
  taskId: string
}

export function SubtaskList({ taskId }: SubtaskListProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const {
    subtasks,
    isLoading,
    newTitle,
    setNewTitle,
    isAdding,
    openAdding,
    completed,
    total,
    handleKeyDown,
    handleBlur,
    onToggle,
    onDelete,
  } = useSubtaskList(taskId)

  // Focus the input whenever isAdding becomes true
  React.useEffect(() => {
    if (isAdding) inputRef.current?.focus()
  }, [isAdding])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Subtasks</h4>
        {total > 0 && (
          <span className="text-xs text-muted-foreground">
            {completed} / {total} Completed
          </span>
        )}
      </div>

      {isLoading ? (
        <SubtaskListSkeleton />
      ) : (
        <div className="space-y-2">
          {subtasks?.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {isAdding && (
        <div className="flex items-center gap-3 rounded-md border bg-background px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Subtask title…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      )}

      {!isAdding && (
        <button
          type="button"
          onClick={openAdding}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="size-3.5" />
          Add subtask
        </button>
      )}
    </div>
  )
}

export function SubtaskListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md border px-3 py-2.5">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}
