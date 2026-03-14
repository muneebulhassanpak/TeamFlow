import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get started — TeamFlow',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
