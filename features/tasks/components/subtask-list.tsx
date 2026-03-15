'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSubtasks, useCreateSubtask, useUpdateSubtask, useDeleteSubtask } from '../hooks/use-subtasks'
import { SubtaskItem } from './subtask-item'

interface SubtaskListProps {
  taskId: string
}

export function SubtaskList({ taskId }: SubtaskListProps) {
  const [newTitle, setNewTitle] = React.useState('')
  const { data: subtasks, isLoading } = useSubtasks(taskId)
  const create = useCreateSubtask(taskId)
  const update = useUpdateSubtask(taskId)
  const remove = useDeleteSubtask(taskId)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === 'Escape') setNewTitle('')
  }

  function handleAdd() {
    const title = newTitle.trim()
    if (!title) return
    setNewTitle('')
    create.mutate({ title })
  }

  const completed = subtasks?.filter((s) => s.completed).length ?? 0
  const total = subtasks?.length ?? 0

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
              onToggle={(id, completed) => update.mutate({ subtaskId: id, completed })}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Add subtask input */}
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
