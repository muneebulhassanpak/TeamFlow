"use client"

import { useMemo } from "react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { TaskRow } from "../hooks/use-tasks"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CreateTaskDialog } from "./create-task-dialog"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
  projectId: string
  id: "todo" | "in_progress" | "in_review" | "done"
  title: string
  tasks: TaskRow[]
  onTaskClick?: (task: TaskRow) => void
}

export function KanbanColumn({ projectId, id, title, tasks, onTaskClick }: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])
  
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: "Column",
      columnId: id,
    },
  })

  return (
    <div className="flex h-[calc(100vh-14rem)] min-w-[280px] flex-1 shrink-0 flex-col rounded-xl border bg-muted/40 pb-2">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-muted-foreground/20 text-xs font-medium text-foreground">
            {tasks.length}
          </span>
          <CreateTaskDialog projectId={projectId} defaultStatus={id}>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:bg-muted-foreground/20">
              <Plus className="h-4 w-4" />
            </Button>
          </CreateTaskDialog>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        {/* The droppable area needs min height so we can drop into empty columns */}
        <div
          ref={setNodeRef}
          className={`flex min-h-[150px] flex-col gap-3 pb-4 transition-colors ${
            isOver ? "bg-accent/50 rounded-lg p-2 -m-2 mb-2" : ""
          }`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
            ))}
          </SortableContext>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}
