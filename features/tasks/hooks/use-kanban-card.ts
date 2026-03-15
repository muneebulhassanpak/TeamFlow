'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskRow } from './use-tasks'
import { getInitials } from '../utils'

export function useKanbanCard(task: TaskRow) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const initials = getInitials(task.assignee?.full_name ?? null, task.assignee?.email)

  return { setNodeRef, style, isDragging, attributes, listeners, initials }
}
