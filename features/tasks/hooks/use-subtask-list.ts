'use client'

import * as React from 'react'
import { useSubtasks, useCreateSubtask, useUpdateSubtask, useDeleteSubtask } from './use-subtasks'

export function useSubtaskList(taskId: string) {
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

  return {
    subtasks,
    isLoading,
    newTitle,
    setNewTitle,
    completed,
    total,
    handleKeyDown,
    handleAdd,
    onToggle: (id: string, done: boolean) => update.mutate({ subtaskId: id, completed: done }),
    onDelete: (id: string) => remove.mutate(id),
  }
}
