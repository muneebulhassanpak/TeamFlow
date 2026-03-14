import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from '@/features/auth/components/signup-form'
import { VerifyEmailNotice } from '@/features/auth/components/verify-email-notice'
import { AuthCardWrapper } from '@/features/auth/components/auth-card-wrapper'

export const metadata: Metadata = {
  title: 'Create account — TeamFlow',
}

interface SignupPageProps {
  searchParams: Promise<{ verify?: string }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams
  const showVerify = params.verify === '1'

  if (showVerify) {
    return (
      <AuthCardWrapper>
        <Card>
          <CardHeader className="text-center">
            <div className="bg-primary mx-auto mb-2 flex size-10 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-lg font-bold">T</span>
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>We sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyEmailNotice />
          </CardContent>
        </Card>
      </AuthCardWrapper>
    )
  }

  return (
    <AuthCardWrapper>
      <Card>
        <CardHeader className="text-center">
          <div className="bg-primary mx-auto mb-2 flex size-10 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-lg font-bold">T</span>
          </div>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Get your team up and running in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </AuthCardWrapper>
  )
}
