"use client"

import { useState, useEffect, useMemo } from "react"
import { KanbanColumn } from "./kanban-column"
import { TaskRow } from "../hooks/use-tasks"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"

type ColumnType = "todo" | "in_progress" | "in_review" | "done"

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
]

interface KanbanBoardProps {
  tasks: TaskRow[]
  onReorder: (tasks: TaskRow[]) => void
}

export function KanbanBoard({
  tasks: initialTasks,
  onReorder,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<TaskRow[]>(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Sync state when props change
  useEffect(() => {
    // Basic sorting to ensure list stays stable initially
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

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === "Task"
    const isOverTask = over.data.current?.type === "Task"
    const isOverColumn = over.data.current?.type === "Column"

    if (!isActiveTask) return

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId)
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
            status: overId as ColumnType,
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
      // Attempted drop outside droppable areas -> revert
      setTasks([...initialTasks].sort((a, b) => a.position - b.position))
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const activeIndex = tasks.findIndex((t) => t.id === activeId)
    const overIndex = tasks.findIndex((t) => t.id === overId)

    let finalTasks = [...tasks]

    // If moving within same column or we updated column in handleDragOver, we just arrayMove here to commit visually
    if (activeIndex !== overIndex) {
      finalTasks = arrayMove(finalTasks, activeIndex, overIndex)
    }

    // Recalculate positions by assigning a linear spacing
    const formatted = finalTasks.map((t, idx) => ({
      ...t,
      position: (idx + 1) * 1024,
    }))

    setTasks(formatted)

    // Diff against initial tasks to see which ones actually changed 
    // It's possible we moved many tasks' positions to fulfill the reorder.
    // For simplicity of our bulk reorder API, we can just send the ones that changed status or position.
    const changedTasks = formatted.filter((t) => {
      const init = initialTasks.find((initT) => initT.id === t.id)
      return !init || init.status !== t.status || init.position !== t.position
    })

    if (changedTasks.length > 0) {
      onReorder(changedTasks)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.4" } },
          }),
        }}
      >
        {activeTask ? <KanbanCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
