'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { useUpdateTask, TaskRow } from './use-tasks'
import { useProjectMembers } from '@/features/projects/hooks/use-projects'

export function useTaskDetailsContent(task: TaskRow | null) {
  const update = useUpdateTask(task?.project_id ?? '')
  const { data: members } = useProjectMembers(task?.project_id ?? '')

  // ── Inline edit state ──────────────────────────────────────────────────────
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [titleValue, setTitleValue] = React.useState(task?.title ?? '')

  const [editingDesc, setEditingDesc] = React.useState(false)
  const [descValue, setDescValue] = React.useState(task?.description ?? '')

  // Sync local state when task changes from outside (optimistic or refetch)
  React.useEffect(() => {
    if (!editingTitle) setTitleValue(task?.title ?? '')
  }, [task?.title, editingTitle])

  React.useEffect(() => {
    if (!editingDesc) setDescValue(task?.description ?? '')
  }, [task?.description, editingDesc])

  // ── Save helpers ───────────────────────────────────────────────────────────
  function saveTitle() {
    const trimmed = titleValue.trim()
    if (!trimmed) {
      setTitleValue(task!.title)
      setEditingTitle(false)
      return
    }
    if (trimmed === task!.title) {
      setEditingTitle(false)
      return
    }
    update.mutate(
      { taskId: task!.id, title: trimmed },
      {
        onSuccess: () => setEditingTitle(false),
        onError: (err) => {
          toast.error(err.message || 'Failed to update title')
          setTitleValue(task!.title)
          setEditingTitle(false)
        },
      }
    )
  }

  function cancelTitle() {
    setTitleValue(task!.title)
    setEditingTitle(false)
  }

  function saveDesc() {
    const trimmed = descValue.trim()
    const current = task!.description ?? ''
    if (trimmed === current) {
      setEditingDesc(false)
      return
    }
    update.mutate(
      { taskId: task!.id, description: trimmed || null },
      {
        onSuccess: () => setEditingDesc(false),
        onError: (err) => {
          toast.error(err.message || 'Failed to update description')
          setDescValue(current)
          setEditingDesc(false)
        },
      }
    )
  }

  function cancelDesc() {
    setDescValue(task!.description ?? '')
    setEditingDesc(false)
  }

  function updateField(patch: Parameters<typeof update.mutate>[0]) {
    update.mutate(patch, {
      onError: (err) => toast.error(err.message || 'Failed to update task'),
    })
  }

  return {
    members,
    isUpdating: update.isPending,
    editingTitle,
    setEditingTitle,
    titleValue,
    setTitleValue,
    saveTitle,
    cancelTitle,
    editingDesc,
    setEditingDesc,
    descValue,
    setDescValue,
    saveDesc,
    cancelDesc,
    updateField,
  }
}
