"use client"

import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { FolderOpen, Plus, Search } from "lucide-react"

import { useOrg } from "@/features/app-shell/context/org-context"
import { useProjects } from "@/features/projects/hooks/use-projects"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { CreateProjectDialog } from "./create-project-dialog"
import { ProjectsTable } from "./projects-table"

export function ProjectsView() {
  const { org } = useOrg()

  // ─── URL State via nuqs ───────────────────────────────────────────────────
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10))
  const [sortDir, setSortDir] = useQueryState(
    "sortDir",
    parseAsString.withDefault("desc")
  ) as [
      "asc" | "desc",
      (val: "asc" | "desc" | null) => Promise<URLSearchParams>
    ]

  const {
    data: response,
    isLoading,
    error,
  } = useProjects(org.id, {
    search,
    page,
    pageSize,
    sortBy: "created_at",
    sortDir,
  })

  // ─── Render ───────────────────────────────────────────────────────────────

  if (error) {
    return (
      <Empty className="border rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>Failed to load projects</EmptyTitle>
          <EmptyDescription>{(error as Error).message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const data = response?.data ?? []
  const total = response?.total ?? 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "project" : "projects"} in {org.name}
          </p>
        </div>
        <CreateProjectDialog>
          <Button className="shrink-0">
            <Plus className="size-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (page !== 1) setPage(1)
            }}
          />
        </div>
      </div>

      <ProjectsTable
        data={data}
        total={total}
        page={page}
        pageSize={pageSize}
        sortDir={sortDir}
        search={search}
        isLoading={isLoading}
        onPageChange={setPage}
        onSortDirChange={setSortDir}
      />
    </div>
  )
}
