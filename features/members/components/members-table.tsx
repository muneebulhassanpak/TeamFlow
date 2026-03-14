"use client"

import { MoreHorizontal, ArrowUpDown, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SharedPagination } from "@/components/shared/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useRemoveMember,
  type MemberRow,
} from "@/features/members/hooks/use-members"
import { useOrg } from "@/features/app-shell/context/org-context"

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(" ")
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

interface MembersTableProps {
  data: MemberRow[]
  total: number
  page: number
  pageSize: number
  sortDir: "asc" | "desc"
  currentUserId: string
  onPageChange: (page: number) => void
  onSortDirChange: (dir: "asc" | "desc") => void
}

export function MembersTable({
  data,
  total,
  page,
  pageSize,
  sortDir,
  currentUserId,
  onPageChange,
  onSortDirChange,
}: MembersTableProps) {
  const { org, role } = useOrg()
  const removeMember = useRemoveMember(org.id)
  const isAdmin = role === "admin"

  const pageCount = Math.ceil(total / pageSize)
  const colSpan = isAdmin ? 4 : 3

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() =>
                    onSortDirChange(sortDir === "asc" ? "desc" : "asc")
                  }
                >
                  Role
                  <ArrowUpDown className="ml-2 size-3.5" />
                </Button>
              </TableHead>
              <TableHead>Joined</TableHead>
              {isAdmin && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {m.avatar_url && (
                          <AvatarImage
                            src={m.avatar_url}
                            alt={m.full_name ?? m.email}
                          />
                        )}
                        <AvatarFallback className="text-xs">
                          {getInitials(m.full_name, m.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        {m.full_name && (
                          <span className="text-sm font-medium">
                            {m.full_name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={m.role === "admin" ? "default" : "secondary"}
                    >
                      {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(m.joined_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {m.user_id !== currentUserId && (
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                {removeMember.isPending &&
                                removeMember.variables === m.user_id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="size-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => removeMember.mutate(m.user_id)}
                              >
                                Remove member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center">
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <SharedPagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  )
}
