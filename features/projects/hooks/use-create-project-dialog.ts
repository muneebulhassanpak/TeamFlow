"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useOrg } from "@/features/app-shell/context/org-context"
import { useCreateProject } from "@/features/projects/hooks/use-projects"
import {
  CreateProjectSchema,
  type CreateProjectInput,
} from "@/features/projects/validations/projects"
import { useMembers } from "@/features/members/hooks/use-members"

export interface MemberSelection {
  isManager: boolean
}

export function useCreateProjectDialog() {
  const { org } = useOrg()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [selections, setSelections] = useState<Record<string, MemberSelection>>({})
  const [search, setSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createProject = useCreateProject(org.id)
  const { data: membersData, isLoading: membersLoading } = useMembers(org.id, {
    pageSize: 100,
  })

  const orgMembers = membersData?.data ?? []

  const filteredMembers = search.trim()
    ? orgMembers.filter(
        (m) =>
          m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : orgMembers

  const selectedCount = Object.keys(selections).length

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: { name: "", description: "", color: "#3B82F6" },
  })

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setStep(1)
      setSelections({})
      setSearch("")
      form.reset()
    }
    setOpen(nextOpen)
  }

  async function handleNext() {
    const valid = await form.trigger(["name", "color"])
    if (valid) setStep(2)
  }

  function toggleMember(userId: string) {
    setSelections((prev) => {
      if (prev[userId]) {
        const next = { ...prev }
        delete next[userId]
        return next
      }
      return { ...prev, [userId]: { isManager: false } }
    })
  }

  function setRole(userId: string, isManager: boolean) {
    setSelections((prev) => {
      if (!prev[userId]) return prev
      return { ...prev, [userId]: { isManager } }
    })
  }

  async function handleCreate() {
    const values = form.getValues()
    setIsSubmitting(true)
    try {
      const project = await createProject.mutateAsync(values)
      const projectId = project?.id as string | undefined
      if (projectId && selectedCount > 0) {
        for (const [userId, sel] of Object.entries(selections)) {
          await fetch(`/api/projects/${projectId}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, isManager: sel.isManager }),
          })
        }
      }
      handleClose(false)
    } catch (_err) {
      // Error surfaced by the mutation's toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
    goBack: () => setStep(1),
  }
}
