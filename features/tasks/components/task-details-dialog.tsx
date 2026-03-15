"use client"

import * as React from "react"
import { format } from "date-fns"
import { TaskRow } from "../hooks/use-tasks"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageSquare, Maximize, Minimize, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { priorityConfig } from "../utils"
import { useTaskDetailsDialog } from "../hooks/use-task-details-dialog"
import { SubtaskList } from "./subtask-list"
import { CommentList } from "./comment-list"
import { CommentInput } from "./comment-input"
import { DatePicker } from "@/components/shared/date-picker"
import { useTaskDetailsContent } from "../hooks/use-task-details-content"

interface TaskDetailsDialogProps {
  task: TaskRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
  currentUserRole: string
}

export function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  currentUserId,
  currentUserRole,
}: TaskDetailsDialogProps) {
  const { isExpanded, setIsExpanded, handleDelete } =
    useTaskDetailsDialog({ task, onOpenChange })

  const {
    members,
    isUpdating,
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
  } = useTaskDetailsContent(task)

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex h-[85vh] flex-col gap-0 overflow-hidden p-0 transition-all duration-300 [&>button:last-child]:hidden",
          isExpanded ? "sm:max-w-275" : "sm:max-w-225"
        )}
      >
        <div className="sr-only">
          <DialogDescription>Task details for {task.title}</DialogDescription>
        </div>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
          <span className="text-xs text-muted-foreground">
            Created {format(new Date(task.created_at), "MMM d, yyyy")}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
              title="Delete Task"
            >
              <Trash2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize className="size-3.5" /> : <Maximize className="size-3.5" />}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                <X className="size-3.5" />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* ── Left panel ── */}
          <div className="flex min-w-0 flex-col border-r" style={{ flex: "2" }}>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">

              {/* Title */}
              {editingTitle ? (
                <Input
                  autoFocus
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); saveTitle() }
                    if (e.key === "Escape") { e.preventDefault(); cancelTitle() }
                  }}
                  className="h-auto border-none px-0 text-2xl font-bold leading-snug tracking-tight shadow-none focus-visible:ring-0"
                  disabled={isUpdating}
                />
              ) : (
                <DialogTitle
                  onClick={() => setEditingTitle(true)}
                  className="-mx-1 cursor-text rounded px-1 text-2xl font-bold leading-snug tracking-tight transition-colors hover:bg-muted/40"
                >
                  {task.title}
                </DialogTitle>
              )}

              {/* Properties — labeled grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</span>
                  <Select
                    value={task.status}
                    onValueChange={(v) => updateField({ taskId: task.id, status: v as TaskRow["status"] })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority</span>
                  <Select
                    value={task.priority}
                    onValueChange={(v) => updateField({ taskId: task.id, priority: v as TaskRow["priority"] })}
                  >
                    <SelectTrigger className={cn("w-full", priorityConfig[task.priority].color)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due Date</span>
                  <DatePicker
                    value={task.due_date ? new Date(task.due_date) : undefined}
                    onChange={(d) => updateField({ taskId: task.id, due_date: d ? d.toISOString().split("T")[0] : null })}
                    placeholder="No due date"
                    className="w-full font-normal"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assignee</span>
                  <Select
                    value={task.assignee_id ?? "unassigned"}
                    onValueChange={(v) => updateField({ taskId: task.id, assignee_id: v === "unassigned" ? null : v })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {members?.map((m) => (
                        <SelectItem key={m.user_id} value={m.user_id}>
                          {m.full_name || m.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t" />

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Description</h4>
                {editingDesc ? (
                  <Textarea
                    autoFocus
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    onBlur={saveDesc}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") { e.preventDefault(); cancelDesc() }
                    }}
                    placeholder="Add a description…"
                    className="min-h-20 resize-none border-none px-0 text-sm shadow-none focus-visible:ring-0"
                    disabled={isUpdating}
                  />
                ) : (
                  <div
                    onClick={() => setEditingDesc(true)}
                    className="-mx-1 cursor-text rounded px-1 py-1 transition-colors hover:bg-muted/40"
                  >
                    {task.description ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                        {task.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">Add a description…</p>
                    )}
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <SubtaskList taskId={task.id} />
            </div>
          </div>

          {/* ── Right panel — Comments ── */}
          <div className="flex min-w-0 flex-col" style={{ flex: "1" }}>
            <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
              <MessageSquare className="size-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide">Comments</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <CommentList
                taskId={task.id}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            </div>
            <div className="shrink-0 border-t px-4 py-3">
              <CommentInput taskId={task.id} />
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
