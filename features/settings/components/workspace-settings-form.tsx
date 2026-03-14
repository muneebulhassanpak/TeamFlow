'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useOrg } from '@/features/app-shell/context/org-context'
import { UpdateWorkspaceSchema, type UpdateWorkspaceInput } from '../validations/settings'
import { useUpdateWorkspace } from '../hooks/use-settings'

export function WorkspaceSettingsForm() {
  const { org, role } = useOrg()
  const isAdmin = role === 'admin'
  const update = useUpdateWorkspace(org.id)

  const form = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(UpdateWorkspaceSchema),
    defaultValues: { name: org.name },
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Workspace</h2>
        <p className="text-muted-foreground text-sm">
          {isAdmin
            ? 'Manage your workspace details.'
            : 'Workspace details — only admins can edit these.'}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => update.mutate(v))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace name</FormLabel>
                <FormControl>
                  <Input placeholder="Workspace name" disabled={!isAdmin} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1.5">
            <FormLabel>Slug</FormLabel>
            <Input value={org.slug} disabled className="text-muted-foreground font-mono text-sm" />
            <p className="text-muted-foreground text-xs">
              Used in URLs — cannot be changed after creation.
            </p>
          </div>

          <div className="space-y-1.5">
            <FormLabel>Plan</FormLabel>
            <div>
              <Badge variant="secondary" className="capitalize">
                {org.plan}
              </Badge>
            </div>
          </div>

          {isAdmin && (
            <Button type="submit" disabled={update.isPending || update.isSuccess} size="sm">
              {update.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save changes
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
