import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useUpdateProject,
  useAddProjectMember,
  useRemoveProjectMember,
  useDeleteProject,
} from "@/features/projects/hooks/use-projects"
import { UpdateProjectSchema } from "@/features/projects/validations/projects"
import { Loader2, MoreHorizontal, Plus, Trash2, UserMinus } from "lucide-react"
import { toast } from "sonner"

type Project = {
  id: string
  name: string
  description: string | null
  color: string
  org_id: string
  archived: boolean
  created_at: string
  updated_at: string
}

type ProjectMember = {
  user_id: string
  is_manager: boolean
  profiles: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
}

type OrgMember = {
  user_id: string
  role: "owner" | "admin" | "member"
  profiles: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
}

interface ProjectSettingsViewProps {
  orgId: string
  project: Project
  projectMembers: ProjectMember[]
  orgMembers: OrgMember[]
  currentUserRole: "owner" | "admin" | "member"
}

export function ProjectSettingsView({
  orgId,
  project,
  projectMembers,
  orgMembers,
  currentUserRole,
}: ProjectSettingsViewProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const updateProjectMutation = useUpdateProject(orgId)
  const addMemberMutation = useAddProjectMember(project.id)
  const removeMemberMutation = useRemoveProjectMember(project.id)
  const deleteProjectMutation = useDeleteProject(orgId)

  const form = useForm<z.infer<typeof UpdateProjectSchema>>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
      color: project.color,
    },
  })

  const onSubmit = async (values: z.infer<typeof UpdateProjectSchema>) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        ...values,
      })
      toast.success("Project updated successfully")
    } catch (error) {
      toast.error("Failed to update project")
    }
  }

  const handleAddMember = async (userId: string, isManager: boolean) => {
    try {
      await addMemberMutation.mutateAsync({
        userId,
        isManager,
      })
      setIsAddMemberOpen(false)
      toast.success("Member added to project")
    } catch (error) {
      toast.error("Failed to add member")
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberMutation.mutateAsync(userId)
      toast.success("Member removed from project")
    } catch (error) {
      toast.error("Failed to remove member")
    }
  }

  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id)
      toast.success("Project deleted successfully")
      // Redirect will happen via the mutation
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  const canManageMembers =
    currentUserRole === "owner" || currentUserRole === "admin"
  const canDeleteProject =
    currentUserRole === "owner" || currentUserRole === "admin"

  // Get available members to add (org members not already in project)
  const availableMembers = orgMembers.filter(
    (orgMember) =>
      !projectMembers.some((pm) => pm.user_id === orgMember.user_id)
  )

  return (
    <div className="space-y-6">
      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Update your project information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          {...field}
                          className="h-8 w-12 rounded border"
                        />
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={updateProjectMutation.isPending}>
                {updateProjectMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Project Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Members</CardTitle>
              <CardDescription>
                Manage who has access to this project
              </CardDescription>
            </div>
            {canManageMembers && availableMembers.length > 0 && (
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Project Member</DialogTitle>
                    <DialogDescription>
                      Select a member to add to this project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {availableMembers.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={member.profiles.avatar_url || undefined}
                            />
                            <AvatarFallback>
                              {member.profiles.full_name?.[0] ||
                                member.profiles.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {member.profiles.full_name ||
                                member.profiles.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.profiles.email}
                            </p>
                          </div>
                        </div>
                        <Select
                          onValueChange={(role) =>
                            handleAddMember(member.user_id, role === "admin")
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectMembers.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={member.profiles.avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {member.profiles.full_name?.[0] ||
                        member.profiles.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.profiles.full_name || member.profiles.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.profiles.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.is_manager ? "default" : "secondary"}>
                    {member.is_manager ? "admin" : "member"}
                  </Badge>
                  {canManageMembers && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.user_id)}
                          className="text-destructive"
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove from project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {canDeleteProject && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Project</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this project and all associated data
                </p>
              </div>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{project.name}"? This
                      action cannot be undone. All tasks, members, and data
                      associated with this project will be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteProject}
                      disabled={deleteProjectMutation.isPending}
                    >
                      {deleteProjectMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
