import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'

export const metadata: Metadata = {
  title: 'Sign in — TeamFlow',
}

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="bg-primary mx-auto mb-2 flex size-10 items-center justify-center rounded-lg">
          <span className="text-primary-foreground text-lg font-bold">T</span>
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your TeamFlow account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
