import { Settings } from 'lucide-react'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your workspace settings.</p>
      </div>
      <Empty className="border rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Settings />
          </EmptyMedia>
          <EmptyTitle>Settings coming soon</EmptyTitle>
          <EmptyDescription>Workspace configuration options will be available here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
