import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeamFlow',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-foreground dark:bg-background relative flex min-h-svh flex-col items-center justify-center p-4">
      {/* Decorative circles — top-right corner, desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        {/* Outer large circle */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Inner smaller circle */}
        <div className="bg-foreground dark:bg-background absolute top-0 right-0 h-[160px] w-[160px] translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
