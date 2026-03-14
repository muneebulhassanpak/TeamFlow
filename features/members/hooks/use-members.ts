import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orgKeys } from '@/lib/query-keys'
import type { OrgRole } from '@/types'

export interface MemberRow {
  id: string
  user_id: string
  role: OrgRole
  joined_at: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export interface InvitationRow {
  id: string
  email: string
  role: OrgRole
  created_at: string
  expires_at: string
}

// ─── Fetch members ────────────────────────────────────────────────────────────

export function useMembers(orgId: string) {
  return useQuery({
    queryKey: orgKeys.members(orgId),
    queryFn: async (): Promise<MemberRow[]> => {
      const res = await fetch(`/api/members?orgId=${orgId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to fetch members')
      return json.data
    },
    enabled: !!orgId,
  })
}

// ─── Remove member ────────────────────────────────────────────────────────────

export function useRemoveMember(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/members?orgId=${orgId}&userId=${userId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to remove member')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.members(orgId) }),
  })
}

// ─── Fetch invitations ────────────────────────────────────────────────────────

export function useInvitations(orgId: string) {
  return useQuery({
    queryKey: orgKeys.invitations(orgId),
    queryFn: async (): Promise<InvitationRow[]> => {
      const res = await fetch(`/api/invitations?orgId=${orgId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to fetch invitations')
      return json.data
    },
    enabled: !!orgId,
  })
}

// ─── Send invitation ──────────────────────────────────────────────────────────

export function useInviteMember(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { email: string; role: OrgRole }) => {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, ...input }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to send invitation')
      return json.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.invitations(orgId) }),
  })
}

// ─── Revoke invitation ────────────────────────────────────────────────────────

export function useRevokeInvitation(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const res = await fetch(`/api/invitations/${inviteId}?orgId=${orgId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to revoke invitation')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.invitations(orgId) }),
  })
}
