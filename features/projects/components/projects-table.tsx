"use client"

import {
  MoreHorizontal,
  Users,
  CheckSquare,
  Archive,
  Trash2,
  Settings,
  ArrowUpDown,
  FolderOpen,
  Loader2
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { ProjectRow } from "@/features/projects/hooks/use-projects"
import { useProjectsTable } from "@/features/projects/hooks/use-projects-table"

interface ProjectsTableProps {
  data: ProjectRow[]
  total: number
  page: number
  pageSize: number
  sortDir: "asc" | "desc"
  search: string
  isLoading: boolean
  onPageChange: (page: number) => void
  onSortDirChange: (dir: "asc" | "desc") => void
}

export function ProjectsTable({
  data,
  total,
  page,
  pageSize,
  sortDir,
  search,
  isLoading,
  onPageChange,
  onSortDirChange,
}: ProjectsTableProps) {
  const {
    org,
    isAdmin,
    deleteProjectId,
    setDeleteProjectId,
    isDeleting,
    handleArchive,
    handleDelete,
  } = useProjectsTable()

  const pageCount = Math.ceil(total / pageSize)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() =>
                    onSortDirChange(sortDir === "asc" ? "desc" : "asc")
                  }
                >
                  Name
                  <ArrowUpDown className="ml-2 size-3.5" />
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-4 shrink-0 rounded" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Skeleton className="size-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="size-4 shrink-0 rounded"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex flex-col">
                        <Link
                          href={`/${org.slug}/projects/${project.id}`}
                          className="font-medium hover:underline"
                        >
                          {project.name}
                        </Link>
                        {project.archived && (
                          <Badge variant="secondary" className="mt-1 w-fit text-[10px] uppercase leading-none px-1.5 py-0.5">
                            Archived
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-50 truncate text-muted-foreground">
                    {project.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4" />
                      {project.member_count}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckSquare className="size-4" />
                      {project.task_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/${org.slug}/projects/${project.id}/settings`}>
                              <Settings className="size-4" />
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem onClick={() => handleArchive(project)}>
                                <Archive className="size-4" />
                                {project.archived ? "Unarchive" : "Archive"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={() => setDeleteProjectId(project.id)}
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center px-0">
                  <Empty className="w-full flex h-full flex-col justify-center items-center py-6 border-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
                      <EmptyTitle>{search ? "No matches found" : "No projects yet"}</EmptyTitle>
                      <EmptyDescription>
                        {search ? "Try a different search term." : "Create your first project to start organising."}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <SharedPagination
          page={page}
          pageCount={Math.max(1, pageCount)}
          onPageChange={onPageChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteProjectId}
        onOpenChange={(open) => {
          if (!open) setDeleteProjectId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This
              action cannot be undone. All tasks and data associated with
              this project will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteProjectId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
