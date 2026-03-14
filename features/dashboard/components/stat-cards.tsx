import { CheckCheck, FolderOpen, ListTodo, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardStats } from '@/features/dashboard/hooks/use-dashboard'

interface StatCardsProps {
  stats: DashboardStats
}

const CARDS = [
  {
    key: 'activeProjects' as const,
    label: 'Active Projects',
    description: 'Currently in progress',
    icon: FolderOpen,
    iconClass: 'bg-blue-500/10 text-blue-500',
  },
  {
    key: 'openTasks' as const,
    label: 'Open Tasks',
    description: 'Across all projects',
    icon: ListTodo,
    iconClass: 'bg-orange-500/10 text-orange-500',
  },
  {
    key: 'memberCount' as const,
    label: 'Team Members',
    description: 'In your workspace',
    icon: Users,
    iconClass: 'bg-green-500/10 text-green-500',
  },
  {
    key: 'completedThisWeek' as const,
    label: 'Done This Week',
    description: 'Tasks completed',
    icon: CheckCheck,
    iconClass: 'bg-violet-500/10 text-violet-500',
  },
]

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ key, label, description, icon: Icon, iconClass }) => (
        <Card key={key} className="p-4">
          <div className="flex items-center justify-between">
            <div className={cn('w-fit rounded-lg p-2', iconClass)}>
              <Icon className="size-4" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{stats[key]}</p>
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
