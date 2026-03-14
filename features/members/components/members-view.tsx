"use client"

import * as React from "react"
import { Search, SearchX, Users, ChevronDown, X, FolderKanban } from "lucide-react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useMembers } from "@/features/members/hooks/use-members"
import { useProjects } from "@/features/projects/hooks/use-projects"
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
    role: parseAsString.withDefault(""),
    projectIds: parseAsArrayOf(parseAsString).withDefault([]),
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
    role: filters.role,
    projectIds: filters.projectIds,
  })

  const { data: projectsResponse } = useProjects(org.id, { pageSize: 100 })
  const allProjects = projectsResponse?.data ?? []

  const hasFilters = filters.role !== "" || filters.projectIds.length > 0

  function clearFilters() {
    setFilters({ role: "", projectIds: [], page: 1 })
  }

  const members = response?.data ?? []
  const total = response?.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Members</h1>
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "member" : "members"} in {org.name}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>

        {/* Role filter */}
        <Select
          value={filters.role || "all"}
          onValueChange={(v) => setFilters({ role: v === "all" ? "" : v, page: 1 })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>

        {/* Projects multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <FolderKanban className="size-4" />
              {filters.projectIds.length === 0 ? (
                "All projects"
              ) : (
                <span className="flex items-center gap-1.5">
                  All projects
                  <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-xs">
                    {filters.projectIds.length}
                  </Badge>
                </span>
              )}
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2">
            {allProjects.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">No projects</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {allProjects.map((project) => (
                  <label
                    key={project.id}
                    className="hover:bg-muted flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-sm"
                  >
                    <Checkbox
                      checked={filters.projectIds.includes(project.id)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...filters.projectIds, project.id]
                          : filters.projectIds.filter((id) => id !== project.id)
                        setFilters({ projectIds: next, page: 1 })
                      }}
                    />
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </label>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
            Clear
          </Button>
        )}

        {/* Invite button — pushed to right */}
        {isAdmin && (
          <div className="ml-auto">
            <InviteDialog />
          </div>
        )}
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
        <Empty className="border rounded-xl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>Failed to load members</EmptyTitle>
            <EmptyDescription>{(error as Error).message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : members.length === 0 ? (
        filters.q ? (
          <Empty className="border rounded-xl">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No members found</EmptyTitle>
              <EmptyDescription>
                No members match &ldquo;{filters.q}&rdquo;. Try a different
                search.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Empty className="border rounded-xl">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No members yet</EmptyTitle>
              <EmptyDescription>
                Invite your team to start collaborating in {org.name}.
              </EmptyDescription>
            </EmptyHeader>
            {isAdmin && (
              <EmptyContent>
                <InviteDialog />
              </EmptyContent>
            )}
          </Empty>
        )
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
