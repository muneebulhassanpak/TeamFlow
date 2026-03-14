"use client"

import { useState } from "react"
import { format } from "date-fns"
import { TaskRow } from "../hooks/use-tasks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, AlignLeft, Flag, CheckCircle2 } from "lucide-react"

interface TaskDetailsDialogProps {
  task: TaskRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "border-red-500 bg-red-100 text-red-800",
}

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done"
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  if (!task) return null

  const initials = task.assignee?.full_name
    ? task.assignee.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : task.assignee?.email.charAt(0).toUpperCase() ?? "?"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        
        {/* Header Region */}
        <div className="bg-muted/30 px-6 py-4 flex flex-col gap-3 border-b">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-normal flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusLabels[task.status]}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Created {format(new Date(task.created_at), "MMM d, yyyy")}
            </span>
          </div>
          <DialogTitle className="text-xl leading-snug">{task.title}</DialogTitle>
        </div>

        {/* Content Region */}
        <div className="p-6 grid gap-6">
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-muted/20 border">
            {/* Properties */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 pb-1">
                <Flag className="w-3.5 h-3.5" />
                Priority
              </span>
              <Badge variant="secondary" className={`font-normal ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 pb-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                Due Date
              </span>
              <span className="text-sm font-medium">
                {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
              </span>
            </div>
            
            <div className="space-y-2 col-span-2 pt-2 border-t">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignee</span>
              {task.assignee ? (
                <div className="flex items-center gap-3 bg-background border rounded-md p-2 w-max pr-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.avatar_url ?? ""} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{task.assignee.full_name || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground mt-1">{task.assignee.email}</span>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">Unassigned</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              <AlignLeft className="w-4 h-4 text-muted-foreground" />
              Description
            </span>
            {task.description ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided for this task.
              </p>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
