'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { useMembers } from '@/features/members/hooks/use-members'
import { MembersTable } from './members-table'
import { InviteDialog } from './invite-dialog'
import { PendingInvitations } from './pending-invitations'
import { useOrg } from '@/features/app-shell/context/org-context'

interface MembersViewProps {
  currentUserId: string
}

export function MembersView({ currentUserId }: MembersViewProps) {
  const { org, role } = useOrg()
  const { data: members = [], isLoading, error } = useMembers(org.id)
  const isAdmin = role === 'admin'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-muted-foreground text-sm">
            {members.length} {members.length === 1 ? 'member' : 'members'} in {org.name}
          </p>
        </div>
        {isAdmin && <InviteDialog />}
      </div>

      {/* Members table */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-8 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading members…
        </div>
      ) : error ? (
        <p className="text-destructive text-sm">{(error as Error).message}</p>
      ) : (
        <MembersTable data={members} currentUserId={currentUserId} />
      )}

      {/* Pending invitations — admins only */}
      {isAdmin && <PendingInvitations />}
    </div>
  )
}
