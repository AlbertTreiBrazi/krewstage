'use client'
import { AuthProvider } from '../hooks/useAuth'
import { NotificationsProvider } from '../hooks/useNotifications'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  )
}
