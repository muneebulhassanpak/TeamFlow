"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskRow } from "../hooks/use-tasks"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, GripVertical, CheckSquare, MessageSquare } from "lucide-react"
import { priorityConfig } from "../utils"

interface KanbanCardProps {
  task: TaskRow
  onClick?: () => void
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-28 w-full rounded-md border-2 border-primary border-dashed bg-primary/5 opacity-50"
      />
    )
  }

  const initials = task.assignee?.full_name
    ? task.assignee.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : task.assignee?.email.charAt(0).toUpperCase() ?? "?"

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`group relative flex flex-col gap-3 rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium line-clamp-2 leading-snug flex-1">{task.title}</p>
        
        <div className="flex items-start gap-1 shrink-0 mt-0.5">
          <Badge variant="secondary" className={`font-normal text-[10px] px-1.5 py-0 h-4 ${priorityConfig[task.priority].color}`}>
            {priorityConfig[task.priority].label}
          </Badge>
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing p-0.5 -mr-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded flex-shrink-0"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between pt-2">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground min-h-6">
          {task.due_date && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(task.due_date))}
            </span>
          )}
          {task.subtask_count > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="size-3.5" />
              {task.completed_subtask_count}/{task.subtask_count}
            </span>
          )}
          {task.comment_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {task.comment_count}
            </span>
          )}
        </div>

        <div className="flex items-center ml-auto">
          {task.assignee ? (
            <Avatar className="size-6 border">
              <AvatarImage src={task.assignee.avatar_url ?? ""} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-6 rounded-full border border-dashed flex items-center justify-center bg-muted/50">
              <span className="text-[10px] text-muted-foreground">?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
