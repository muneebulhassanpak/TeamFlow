'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { OrgStepSchema, type OrgStepInput } from '@/features/onboarding/validations/onboarding'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface OrgStepProps {
  defaultValues: OrgStepInput
  onNext: (data: OrgStepInput) => void
  onBack: () => void
}

export function OrgStep({ defaultValues, onNext, onBack }: OrgStepProps) {
  const form = useForm<OrgStepInput>({
    resolver: zodResolver(OrgStepSchema),
    defaultValues,
  })

  const orgName = useWatch({ control: form.control, name: 'orgName', defaultValue: '' })

  // Auto-generate slug from org name unless user has manually edited it
  useEffect(() => {
    if (!form.formState.dirtyFields.orgSlug) {
      const generated = slugify(orgName ?? '')
      if (generated) form.setValue('orgSlug', generated, { shouldValidate: false })
    }
  }, [orgName, form])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Your organization</h2>
        <p className="text-muted-foreground text-sm">
          This will be your workspace for all projects and team members.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
          <FormField
            control={form.control}
            name="orgName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL slug</FormLabel>
                <FormControl>
                  <div className="flex items-center rounded-md border">
                    <span className="text-muted-foreground border-r px-3 py-2 text-sm select-none">
                      teamflow.app/
                    </span>
                    <Input
                      className="rounded-l-none border-0 shadow-none focus-visible:ring-0"
                      placeholder="acme-inc"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        form.setValue('orgSlug', e.target.value, { shouldDirty: true })
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Only lowercase letters, numbers, and hyphens.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
