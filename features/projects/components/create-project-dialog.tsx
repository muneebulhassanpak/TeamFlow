"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/shared/stepper"
import { useCreateProjectDialog } from "@/features/projects/hooks/use-create-project-dialog"
import { CreateProjectStep1 } from "./create-project-step1"
import { CreateProjectStep2 } from "./create-project-step2"

interface CreateProjectDialogProps {
  children: React.ReactNode
}

const STEPS = [{ label: "Project Details" }, { label: "Add Members" }]

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const {
    open,
    step,
    form,
    selections,
    search,
    setSearch,
    isSubmitting,
    filteredMembers,
    membersLoading,
    selectedCount,
    handleClose,
    handleNext,
    handleCreate,
    toggleMember,
    setRole,
    goBack,
  } = useCreateProjectDialog()

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <div className="flex justify-center pt-1 pb-0.5">
            <Stepper steps={STEPS} currentStep={step} />
          </div>
          <DialogDescription>
            {step === 1
              ? "Set up your project details."
              : "Add org members to this project. You can always do this later."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && <CreateProjectStep1 form={form} onNext={handleNext} />}

        {step === 2 && (
          <CreateProjectStep2
            members={filteredMembers}
            isLoading={membersLoading}
            search={search}
            onSearchChange={setSearch}
            selections={selections}
            selectedCount={selectedCount}
            onToggle={toggleMember}
            onRoleChange={setRole}
          />
        )}

        {/* ── Footer ── */}
        {step === 1 ? (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="step1-form">
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="sm:justify-between">
            {/* Back — pinned to the left */}
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={isSubmitting}
            >
              <ChevronLeft className="mr-1 size-4" />
              Back
            </Button>

            {/* Skip + Create — grouped on the right */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCreate}
                disabled={isSubmitting}
              >
                {isSubmitting && selectedCount === 0 && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Skip
              </Button>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={isSubmitting || selectedCount === 0}
              >
                {isSubmitting && selectedCount > 0 && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Create Project
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
