'use client'
export const dynamic = 'force-dynamic'
import ProfilePageClient from '../../../components/ProfilePageClient'

export default function ProfilePage({ params }) {
  const userId = params?.userId || null
  return <ProfilePageClient userId={userId} />
}
