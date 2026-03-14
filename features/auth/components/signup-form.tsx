'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Github, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { SignupSchema, type SignupInput } from '@/features/auth/validations/auth'
import { useSignup, useOAuth } from '@/features/auth/hooks/use-auth'

export function SignupForm() {
  const signup = useSignup()
  const oauth = useOAuth()

  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  function onSubmit(values: SignupInput) {
    signup.mutate(values)
  }

  const isPending = signup.isPending || signup.isSuccess || oauth.isPending

  return (
    <div className="flex flex-col gap-6">
      {/* OAuth buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          disabled={isPending}
          onClick={() => oauth.mutate('google')}
        >
          {oauth.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          disabled={isPending}
          onClick={() => oauth.mutate('github')}
        >
          {oauth.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Github className="size-4" />
          )}
          GitHub
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Email + password form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Muneeb Hassan"
                    autoComplete="name"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {signup.error && (
            <p className="text-destructive text-sm">{signup.error.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {(signup.isPending || signup.isSuccess) && <Loader2 className="size-4 animate-spin" />}
            Create account
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  )
}
