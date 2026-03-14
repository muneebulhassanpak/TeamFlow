import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeamFlow',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
