"use client"

import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuickTaskTitleDialog } from "../hooks/use-quick-task-title-dialog"

interface QuickTaskTitleDialogProps {
  open: boolean
  onSubmit: (title: string) => Promise<void>
  onCancel: () => void
}

export function QuickTaskTitleDialog({ open, onSubmit, onCancel }: QuickTaskTitleDialogProps) {
  const { title, setTitle, isSubmitting, handleSubmit, handleCancel } =
    useQuickTaskTitleDialog({ onSubmit, onCancel })

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <Input
          autoFocus
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleSubmit() }
          }}
          disabled={isSubmitting}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create & Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
