"use client"

import { TaskRow } from "../hooks/use-tasks"
import { useKanbanCard } from "../hooks/use-kanban-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GripVertical, CheckSquare, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { priorityConfig } from "../utils"

interface KanbanCardProps {
  task: TaskRow
  onClick?: () => void
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const { setNodeRef, style, isDragging, attributes, listeners, initials } =
    useKanbanCard(task)

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-24 w-full rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="group flex cursor-pointer flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Row 1: priority badge + drag handle */}
      <div className="flex items-center justify-between">
        <Badge
          className={cn(
            "rounded-full border-0 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            priorityConfig[task.priority].color
          )}
        >
          {priorityConfig[task.priority].label}
        </Badge>

        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </div>
      </div>

      {/* Row 2: title */}
      <p className="line-clamp-2 text-sm font-medium leading-snug">
        {task.title}
      </p>

      {/* Row 3: assignee + stats */}
      <div className="flex items-center justify-between">
        {task.assignee ? (
          <Avatar className="size-6">
            <AvatarImage src={task.assignee.avatar_url ?? ""} />
            <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-6 rounded-full border border-dashed bg-muted/60" />
        )}

        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          {task.comment_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {task.comment_count}
            </span>
          )}
          {task.subtask_count > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="size-3.5" />
              {task.completed_subtask_count}/{task.subtask_count}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
