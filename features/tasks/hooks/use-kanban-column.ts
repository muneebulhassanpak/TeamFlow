'use client'

import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskRow } from './use-tasks'

export function useKanbanColumn(id: string, tasks: TaskRow[]) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'Column', columnId: id },
  })

  return { taskIds, setNodeRef, isOver }
}
