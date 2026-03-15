'use client'

import * as React from 'react'
import { useSubtasks, useCreateSubtask, useUpdateSubtask, useDeleteSubtask } from './use-subtasks'

export function useSubtaskList(taskId: string) {
  const [newTitle, setNewTitle] = React.useState('')
  const [isAdding, setIsAdding] = React.useState(false)
  const { data: subtasks, isLoading } = useSubtasks(taskId)
  const create = useCreateSubtask(taskId)
  const update = useUpdateSubtask(taskId)
  const remove = useDeleteSubtask(taskId)

  function openAdding() {
    setIsAdding(true)
    setNewTitle('')
  }

  function closeAdding() {
    setIsAdding(false)
    setNewTitle('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === 'Escape') closeAdding()
  }

  function handleAdd() {
    const title = newTitle.trim()
    if (!title) {
      closeAdding()
      return
    }
    setNewTitle('')
    create.mutate({ title })
    // keep input open so the user can add another subtask quickly
  }

  function handleBlur() {
    if (!newTitle.trim()) closeAdding()
    else handleAdd()
  }

  const completed = subtasks?.filter((s) => s.completed).length ?? 0
  const total = subtasks?.length ?? 0

  return {
    subtasks,
    isLoading,
    newTitle,
    setNewTitle,
    isAdding,
    openAdding,
    closeAdding,
    completed,
    total,
    handleKeyDown,
    handleAdd,
    handleBlur,
    onToggle: (id: string, done: boolean) => update.mutate({ subtaskId: id, completed: done }),
    onDelete: (id: string) => remove.mutate(id),
  }
}
