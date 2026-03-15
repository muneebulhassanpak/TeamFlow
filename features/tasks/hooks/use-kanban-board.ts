"use client"

import { useState, useEffect, useMemo } from "react"
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { TaskRow } from "./use-tasks"

interface UseKanbanBoardOptions {
  tasks: TaskRow[]
  onReorder: (tasks: TaskRow[]) => void
}

export function useKanbanBoard({ tasks: initialTasks, onReorder }: UseKanbanBoardOptions) {
  const [tasks, setTasks] = useState<TaskRow[]>(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // Derive from live tasks array so dialog always reflects cache updates
  const selectedTask = selectedTaskId ? (tasks.find((t) => t.id === selectedTaskId) ?? null) : null
  const setSelectedTask = (task: TaskRow | null) => setSelectedTaskId(task?.id ?? null)

  useEffect(() => {
    const sorted = [...initialTasks].sort((a, b) => a.position - b.position)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(sorted)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeId),
    [activeId, tasks]
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    if (activeTaskId === overId) return

    const isActiveTask = active.data.current?.type === "Task"
    const isOverTask = over.data.current?.type === "Task"
    const isOverColumn = over.data.current?.type === "Column"

    if (!isActiveTask) return

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeTaskId)
      const activeTask = prev[activeIndex]

      if (isOverTask) {
        const overIndex = prev.findIndex((t) => t.id === overId)
        const overTask = prev[overIndex]

        if (activeTask.status !== overTask.status) {
          const newTasks = [...prev]
          newTasks[activeIndex] = { ...activeTask, status: overTask.status }
          return arrayMove(newTasks, activeIndex, overIndex)
        }
      }

      if (isOverColumn) {
        if (activeTask.status !== overId) {
          const newTasks = [...prev]
          newTasks[activeIndex] = {
            ...activeTask,
            status: overId as TaskRow["status"],
          }
          return arrayMove(newTasks, activeIndex, newTasks.length - 1)
        }
      }

      return prev
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) {
      setTasks([...initialTasks].sort((a, b) => a.position - b.position))
      return
    }

    const activeTaskId = active.id as string
    const overId = over.id as string

    const activeIndex = tasks.findIndex((t) => t.id === activeTaskId)
    const overIndex = tasks.findIndex((t) => t.id === overId)

    let finalTasks = [...tasks]
    if (activeIndex !== overIndex) {
      finalTasks = arrayMove(finalTasks, activeIndex, overIndex)
    }

    const formatted = finalTasks.map((t, idx) => ({
      ...t,
      position: (idx + 1) * 1024,
    }))

    setTasks(formatted)

    const changedTasks = formatted.filter((t) => {
      const init = initialTasks.find((initT) => initT.id === t.id)
      return !init || init.status !== t.status || init.position !== t.position
    })

    if (changedTasks.length > 0) {
      onReorder(changedTasks)
    }
  }

  return {
    tasks,
    activeId,
    activeTask,
    selectedTask,
    setSelectedTask,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
