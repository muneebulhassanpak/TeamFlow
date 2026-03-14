"use client"

import { Search, Users } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { getMemberInitial } from "@/features/projects/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MemberRow } from "@/features/members/hooks/use-members"
import type { MemberSelection } from "@/features/projects/hooks/use-create-project-dialog"
import { cn } from "@/lib/utils"

interface CreateProjectStep2Props {
  members: MemberRow[]
  isLoading: boolean
  search: string
  onSearchChange: (value: string) => void
  selections: Record<string, MemberSelection>
  selectedCount: number
  onToggle: (userId: string) => void
  onRoleChange: (userId: string, isManager: boolean) => void
}

export function CreateProjectStep2({
  members,
  isLoading,
  search,
  onSearchChange,
  selections,
  selectedCount,
  onToggle,
  onRoleChange,
}: CreateProjectStep2Props) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Member list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <Empty className="border rounded-xl py-4 md:py-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>{search ? "No members found" : "No members yet"}</EmptyTitle>
            <EmptyDescription>
              {search ? "Try a different search." : "Invite members to your workspace first."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
          {members.map((member) => {
            const isSelected = !!selections[member.user_id]
            const initials = getMemberInitial(member.full_name, member.email)

            return (
              <div
                key={member.user_id}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                  isSelected ? "bg-muted/70" : "hover:bg-muted/40"
                )}
              >
                <Checkbox
                  id={`member-${member.user_id}`}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(member.user_id)}
                />

                <Avatar className="size-9 shrink-0">
                  <AvatarImage src={member.avatar_url ?? undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <label
                  htmlFor={`member-${member.user_id}`}
                  className="flex-1 cursor-pointer"
                >
                  <p className="text-sm font-medium leading-none">
                    {member.full_name ?? member.email}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </label>

                <Select
                  disabled={!isSelected}
                  value={
                    isSelected
                      ? selections[member.user_id]!.isManager
                        ? "manager"
                        : "member"
                      : "member"
                  }
                  onValueChange={(val) =>
                    onRoleChange(member.user_id, val === "manager")
                  }
                >
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      )}

      {selectedCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedCount} member{selectedCount !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  )
}
