export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat cards placeholder */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Active Projects', 'Open Tasks', 'Team Members', 'Completed This Week'].map((label) => (
          <div key={label} className="bg-card border-border rounded-lg border p-5">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="mt-1 text-3xl font-bold">—</p>
          </div>
        ))}
      </div>

      {/* Coming soon placeholder */}
      <div className="bg-muted/40 border-border rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Dashboard widgets coming in a later module.</p>
      </div>
    </div>
  )
}
