import { CheckCheck, FolderOpen, ListTodo, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/features/dashboard/hooks/use-dashboard'

interface StatCardsProps {
  stats: DashboardStats
}

const CARDS = [
  {
    key: 'activeProjects' as const,
    label: 'Active Projects',
    icon: FolderOpen,
  },
  {
    key: 'openTasks' as const,
    label: 'Open Tasks',
    icon: ListTodo,
  },
  {
    key: 'memberCount' as const,
    label: 'Team Members',
    icon: Users,
  },
  {
    key: 'completedThisWeek' as const,
    label: 'Completed This Week',
    icon: CheckCheck,
  },
]

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats[key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
