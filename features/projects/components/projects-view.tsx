"use client"

import { FolderOpen, Plus } from "lucide-react"
import { useOrg } from "@/features/app-shell/context/org-context"
import { useProjects } from "@/features/projects/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateProjectDialog } from "./create-project-dialog"
import { ProjectCard } from "./project-card"

export function ProjectsView() {
  const { org } = useOrg()
  const { data: projects, isLoading, error } = useProjects(org.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects?.length ?? 0}{" "}
            {projects?.length === 1 ? "project" : "projects"} in {org.name}
          </p>
        </div>
        <CreateProjectDialog>
          <Button>
            <Plus className="size-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="size-8" />
              </div>
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <div className="mt-4 flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>Failed to load projects</EmptyTitle>
            <EmptyDescription>{(error as Error).message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : projects?.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to start organising your team&apos;s
              work.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateProjectDialog>
              <Button>
                <Plus className="size-4" />
                New Project
              </Button>
            </CreateProjectDialog>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(projects ?? []).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
