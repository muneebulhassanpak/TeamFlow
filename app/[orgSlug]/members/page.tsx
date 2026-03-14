import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { MembersView } from '@/features/members/components/members-view'

export default async function MembersPage() {
  const { user, error } = await getAuthUser()
  if (error || !user) redirect('/login')

  return <MembersView currentUserId={user.id} />
}
