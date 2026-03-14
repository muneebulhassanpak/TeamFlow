import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { NotificationsView } from '@/features/notifications/components/notifications-view'

export default async function NotificationsPage() {
  const { user, error } = await getAuthUser()
  if (error || !user) redirect('/login')

  return <NotificationsView userId={user.id} />
}
