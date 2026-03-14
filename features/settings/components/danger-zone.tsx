'use client'

import * as React from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useOrg } from '@/features/app-shell/context/org-context'
import { useDeleteWorkspace } from '../hooks/use-settings'

export function DangerZone() {
  const { org, role } = useOrg()
  const [open, setOpen] = React.useState(false)
  const [confirmValue, setConfirmValue] = React.useState('')
  const deleteWorkspace = useDeleteWorkspace(org.id)

  if (role !== 'admin') return null

  const canDelete = confirmValue === org.slug

  function handleDelete() {
    if (!canDelete) return
    deleteWorkspace.mutate()
  }

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmValue('')
    setOpen(next)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
        <p className="text-muted-foreground text-sm">
          Irreversible actions. Proceed with caution.
        </p>
      </div>

      <div className="border-destructive/40 rounded-lg border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Delete workspace</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Permanently deletes this workspace and all its projects, tasks, and members. This
              cannot be undone.
            </p>
          </div>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="shrink-0">
                Delete workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TriangleAlert className="text-destructive size-4" />
                  Delete workspace
                </DialogTitle>
                <DialogDescription>
                  This will permanently delete{' '}
                  <span className="text-foreground font-medium">{org.name}</span> and all of its
                  data — projects, tasks, members, and activity logs. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <Label>
                  Type{' '}
                  <span className="text-foreground font-mono font-semibold">{org.slug}</span> to
                  confirm
                </Label>
                <Input
                  value={confirmValue}
                  onChange={(e) => setConfirmValue(e.target.value)}
                  placeholder={org.slug}
                  autoComplete="off"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={!canDelete || deleteWorkspace.isPending}
                  onClick={handleDelete}
                >
                  {deleteWorkspace.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Delete workspace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
