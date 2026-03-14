'use client'

import { Loader2 } from 'lucide-react'
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

import { useMembers } from '@/features/members/hooks/use-members'
import { MembersTable } from './members-table'
import { InviteDialog } from './invite-dialog'
import { PendingInvitations } from './pending-invitations'
import { useOrg } from '@/features/app-shell/context/org-context'

const PAGE_SIZE = 10

interface MembersViewProps {
  currentUserId: string
}

export function MembersView({ currentUserId }: MembersViewProps) {
  const { org, role } = useOrg()
  const isAdmin = role === 'admin'

  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    sortBy: parseAsStringEnum<'role' | 'joined_at'>(['role', 'joined_at']).withDefault('joined_at'),
    sortDir: parseAsStringEnum<'asc' | 'desc'>(['asc', 'desc']).withDefault('asc'),
  })

  const { data: response, isLoading, error } = useMembers(org.id, {
    search: filters.q,
    page: filters.page,
    pageSize: PAGE_SIZE,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  })

  const members = response?.data ?? []
  const total = response?.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-muted-foreground text-sm">
            {total} {total === 1 ? 'member' : 'members'} in {org.name}
          </p>
        </div>
        {isAdmin && <InviteDialog />}
      </div>

      {/* Members table */}
      {isLoading && !response ? (
        <div className="flex items-center gap-2 py-8 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading members…
        </div>
      ) : error ? (
        <p className="text-destructive text-sm">{(error as Error).message}</p>
      ) : (
        <MembersTable
          data={members}
          total={total}
          page={filters.page}
          pageSize={PAGE_SIZE}
          search={filters.q}
          sortDir={filters.sortDir}
          currentUserId={currentUserId}
          onSearchChange={(q) => setFilters({ q, page: 1 })}
          onPageChange={(page) => setFilters({ page })}
          onSortDirChange={(sortDir) => setFilters({ sortBy: 'role', sortDir, page: 1 })}
        />
      )}

      {/* Pending invitations — admins only */}
      {isAdmin && <PendingInvitations />}
    </div>
  )
}
