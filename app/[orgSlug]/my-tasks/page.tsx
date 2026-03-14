import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { MyTasksView } from '@/features/dashboard/components/my-tasks-view'

export default async function MyTasksPage() {
  const { user, error } = await getAuthUser()
  if (error || !user) redirect('/login')

  return <MyTasksView userId={user.id} />
}
