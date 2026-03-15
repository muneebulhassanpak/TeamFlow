"use client"

import { useState } from "react"

interface UseQuickTaskTitleDialogOptions {
  onSubmit: (title: string) => Promise<void>
  onCancel: () => void
}

export function useQuickTaskTitleDialog({ onSubmit, onCancel }: UseQuickTaskTitleDialogOptions) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    const trimmed = title.trim()
    if (!trimmed) return
    setIsSubmitting(true)
    try {
      await onSubmit(trimmed)
    } finally {
      setIsSubmitting(false)
      setTitle("")
    }
  }

  function handleCancel() {
    setTitle("")
    onCancel()
  }

  return { title, setTitle, isSubmitting, handleSubmit, handleCancel }
}
