'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UpdateProfileSchema, type UpdateProfileInput } from '../validations/settings'
import { useUpdateProfile } from '../hooks/use-settings'

interface ProfileSettingsFormProps {
  fullName: string | null
  email: string
}

export function ProfileSettingsForm({ fullName, email }: ProfileSettingsFormProps) {
  const update = useUpdateProfile()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { fullName: fullName ?? '' },
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Profile</h2>
        <p className="text-muted-foreground text-sm">Update your personal information.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => update.mutate(v))} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1.5">
            <FormLabel>Email</FormLabel>
            <Input value={email} disabled className="text-muted-foreground" />
            <p className="text-muted-foreground text-xs">Email cannot be changed here.</p>
          </div>

          <Button type="submit" disabled={update.isPending || update.isSuccess} size="sm">
            {update.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  )
}
