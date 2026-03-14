"use client"

import * as React from "react"
import { Search } from "lucide-react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"

import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useMembers } from "@/features/members/hooks/use-members"
import { MembersTable } from "./members-table"
import { InviteDialog } from "./invite-dialog"
import { PendingInvitations } from "./pending-invitations"
import { useOrg } from "@/features/app-shell/context/org-context"

const PAGE_SIZE = 10

interface MembersViewProps {
  currentUserId: string
}

export function MembersView({ currentUserId }: MembersViewProps) {
  const { org, role } = useOrg()
  const isAdmin = role === "admin"

  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    sortBy: parseAsStringEnum<"role" | "joined_at">([
      "role",
      "joined_at",
    ]).withDefault("joined_at"),
    sortDir: parseAsStringEnum<"asc" | "desc">(["asc", "desc"]).withDefault(
      "asc"
    ),
  })

  // Local input state for debouncing the search URL param
  const [inputValue, setInputValue] = React.useState(filters.q)

  // Sync local input if parent search changes (e.g. back/forward navigation)
  React.useEffect(() => {
    setInputValue(filters.q)
  }, [filters.q])

  // Debounce: push to URL only after 300 ms of no typing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== filters.q) setFilters({ q: inputValue, page: 1 })
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    data: response,
    isLoading,
    error,
  } = useMembers(org.id, {
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
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "member" : "members"} in {org.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
          {isAdmin && <InviteDialog />}
        </div>
      </div>

      {/* Members table */}
      {isLoading && !response ? (
        <div className="rounded-md border">
          <div className="border-b px-4 py-2">
            <Skeleton className="h-4 w-20" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-20" />
              {isAdmin && <Skeleton className="size-8" />}
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      ) : (
        <MembersTable
          data={members}
          total={total}
          page={filters.page}
          pageSize={PAGE_SIZE}
          sortDir={filters.sortDir}
          currentUserId={currentUserId}
          onPageChange={(page) => setFilters({ page })}
          onSortDirChange={(sortDir) =>
            setFilters({ sortBy: "role", sortDir, page: 1 })
          }
        />
      )}

      {/* Pending invitations — admins only */}
      {isAdmin && <PendingInvitations />}
    </div>
  )
}
