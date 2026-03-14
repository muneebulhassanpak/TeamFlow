"use client"

import { useState } from "react"
import { format } from "date-fns"
import { TaskRow } from "../hooks/use-tasks"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, Flag, CheckCircle2, User, LayoutList, Maximize, Minimize } from "lucide-react"
import { cn } from "@/lib/utils"
import { priorityConfig, statusLabels } from "../utils"

interface TaskDetailsDialogProps {
  task: TaskRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden gap-0 border-muted transition-all duration-300",
          isExpanded ? "sm:max-w-[1100px]" : "sm:max-w-[600px]"
        )}
      >
        {/* Expand/Collapse Button (Absolute positioned near the X close button) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-11 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 z-50 bg-transparent flex items-center justify-center p-0.5"
        >
          {isExpanded ? <Minimize /> : <Maximize />}
          <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
        </button>

        {/* Hidden Visually, Needed for screen readers */}
        <div className="sr-only">
          <DialogDescription>Task details for {task.title}</DialogDescription>
        </div>

        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <LayoutList className="w-3.5 h-3.5" /> Task
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Created {format(new Date(task.created_at), "MMM d, yyyy")}
                </span>
              </div>
              <DialogTitle className="text-2xl font-semibold leading-snug tracking-tight text-foreground">{task.title}</DialogTitle>
            </div>

            <div className="space-y-4">
              {task.description ? (
                <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap bg-primary/5 p-4 rounded-lg border border-primary/10">
                  {task.description}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic px-4 py-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                  No description provided.
                </div>
              )}
            </div>
          </div>

          {/* Properties Footer */}
          <div className="bg-muted/30 border-t px-6 py-4 flex flex-wrap items-center gap-6 shrink-0">
              
            {/* Status */}
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {statusLabels[task.status]}
              </span>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2.5">
              <Flag className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className={`font-normal ${priorityConfig[task.priority].color}`}>
                {priorityConfig[task.priority].label}
              </Badge>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : <span className="text-muted-foreground font-normal">No due date</span>}
              </span>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-2.5 ml-auto">
              <User className="w-4 h-4 text-muted-foreground" />
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 border">
                    <AvatarImage src={task.assignee.avatar_url ?? ""} />
                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{task.assignee.full_name || "Unknown"}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
