'use client'
export const dynamic = 'force-dynamic'
import { use } from 'react'
import ProfilePageClient from '../../../components/ProfilePageClient'

export default function ProfilePage({ params }) {
  const { userId } = use(params)
  return <ProfilePageClient userId={userId} />
}
