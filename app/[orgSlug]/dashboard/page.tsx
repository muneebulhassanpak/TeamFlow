import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { DashboardView } from '@/features/dashboard/components/dashboard-view'

export default async function DashboardPage() {
  const { user, error } = await getAuthUser()
  if (error || !user) redirect('/login')

  return <DashboardView userId={user.id} />
}
