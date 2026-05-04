'use client'
import ProfilePageClient from '../../components/ProfilePageClient'

// /profile = propriul profil (fără userId)
export default function ProfilePage() {
  return <ProfilePageClient userId={null} />
}
