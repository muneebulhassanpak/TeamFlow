'use client'

import * as React from 'react'
import { Loader2, MoreHorizontal, Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useInvitations, useRevokeInvitation } from '@/features/members/hooks/use-members'
import { useOrg } from '@/features/app-shell/context/org-context'

export function PendingInvitations() {
  const { org } = useOrg()
  const { data: invitations = [], isLoading } = useInvitations(org.id)
  const revoke = useRevokeInvitation(org.id)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Loading invitations…
      </div>
    )
  }

  if (invitations.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock className="text-muted-foreground size-4" />
        <h2 className="text-sm font-medium">Pending invitations</h2>
        <Badge variant="secondary" className="text-xs">
          {invitations.length}
        </Badge>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="text-sm">{inv.email}</TableCell>
                <TableCell>
                  <Badge variant={inv.role === 'admin' ? 'default' : 'secondary'}>
                    {inv.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(inv.expires_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          {revoke.isPending && revoke.variables === inv.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="size-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => revoke.mutate(inv.id)}
                        >
                          Revoke invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
