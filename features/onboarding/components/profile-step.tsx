'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { ProfileStepSchema, type ProfileStepInput } from '@/features/onboarding/validations/onboarding'

interface ProfileStepProps {
  defaultValues: ProfileStepInput
  onNext: (data: ProfileStepInput) => void
}

export function ProfileStep({ defaultValues, onNext }: ProfileStepProps) {
  const form = useForm<ProfileStepInput>({
    resolver: zodResolver(ProfileStepSchema),
    defaultValues,
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Your profile</h2>
        <p className="text-muted-foreground text-sm">
          How should we refer to you?
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Muneeb Hassan" autoComplete="name" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  )
}
