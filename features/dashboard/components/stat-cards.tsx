import { CheckCheck, FolderOpen, ListTodo, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { DashboardStats } from '@/features/dashboard/hooks/use-dashboard'

interface StatCardsProps {
  stats: DashboardStats
}

const CARDS = [
  { key: 'activeProjects' as const, label: 'Active Projects',   icon: FolderOpen  },
  { key: 'openTasks'      as const, label: 'Open Tasks',        icon: ListTodo    },
  { key: 'memberCount'    as const, label: 'Team Members',      icon: Users       },
  { key: 'completedThisWeek' as const, label: 'Done This Week', icon: CheckCheck  },
]

export function StatCards({ stats }: StatCardsProps) {
  return (
    <Card className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
      {CARDS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex flex-col gap-1.5 px-5 py-4">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <Icon className="size-3.5" />
            {label}
          </div>
          <p className="text-2xl font-bold tracking-tight">{stats[key]}</p>
        </div>
      ))}
    </Card>
  )
}
