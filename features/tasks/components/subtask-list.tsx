'use client'

import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSubtaskList } from '../hooks/use-subtask-list'
import { SubtaskItem } from './subtask-item'

interface SubtaskListProps {
  taskId: string
}

export function SubtaskList({ taskId }: SubtaskListProps) {
  const {
    subtasks,
    isLoading,
    newTitle,
    setNewTitle,
    completed,
    total,
    handleKeyDown,
    handleAdd,
    onToggle,
    onDelete,
  } = useSubtaskList(taskId)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Subtasks
          {total > 0 && (
            <span className="text-muted-foreground ml-1.5 text-xs font-normal">
              {completed}/{total}
            </span>
          )}
        </h4>
      </div>

      {isLoading ? (
        <SubtaskListSkeleton />
      ) : (
        <div className="space-y-0.5">
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

      <div className="flex items-center gap-2 pt-1">
        <Plus className="text-muted-foreground size-3.5 shrink-0" />
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="Add subtask…"
          className="text-muted-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  )
}

export function SubtaskListSkeleton() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 px-1 py-1">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}
