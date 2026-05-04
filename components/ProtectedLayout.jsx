'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Navbar from './Navbar'
import LoadingScreen from './LoadingScreen'

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading])

  if (loading) return <LoadingScreen />
  if (!user) return null
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
