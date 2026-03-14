"use client"

import { parseAsString, useQueryState } from "nuqs"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProjectMembers } from "@/features/projects/hooks/use-projects"

export function TaskFilters({ projectId }: { projectId: string }) {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [priority, setPriority] = useQueryState(
    "priority",
    parseAsString.withDefault("")
  )
  const [assigneeId, setAssigneeId] = useQueryState(
    "assigneeId",
    parseAsString.withDefault("")
  )

  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(projectId)

  const hasFilters = search !== "" || priority !== "" || assigneeId !== ""

  const clearFilters = () => {
    setSearch("")
    setPriority("")
    setAssigneeId("")
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-[250px]">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search fields..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select
        value={priority === "" ? "all" : priority}
        onValueChange={(val) => setPriority(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={assigneeId === "" ? "all" : assigneeId}
        onValueChange={(val) => setAssigneeId(val === "all" ? "" : val)}
        disabled={isLoadingMembers}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Everyone</SelectItem>
          {members?.map((member) => (
            <SelectItem key={member.user_id} value={member.user_id}>
              {member.full_name || member.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-10 px-3 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
          <span className="ml-2">Clear</span>
        </Button>
      )}
    </div>
  )
}
