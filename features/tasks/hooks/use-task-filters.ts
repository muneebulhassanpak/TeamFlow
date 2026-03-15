'use client'

import { parseAsString, useQueryState } from 'nuqs'
import { useProjectMembers } from '@/features/projects/hooks/use-projects'

export function useTaskFilters(projectId: string) {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
  const [priority, setPriority] = useQueryState('priority', parseAsString.withDefault(''))
  const [assigneeId, setAssigneeId] = useQueryState('assigneeId', parseAsString.withDefault(''))

  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(projectId)

  const hasFilters = search !== '' || priority !== '' || assigneeId !== ''

  function clearFilters() {
    setSearch('')
    setPriority('')
    setAssigneeId('')
  }

  return {
    search,
    setSearch,
    priority,
    setPriority,
    assigneeId,
    setAssigneeId,
    members,
    isLoadingMembers,
    hasFilters,
    clearFilters,
  }
}
