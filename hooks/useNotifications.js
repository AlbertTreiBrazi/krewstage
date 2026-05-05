'use client'
import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifs = useCallback(async () => {
    if (!user) { setNotifications([]); setUnreadCount(0); return }
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*, actor:profiles!notifications_actor_id_fkey(id, full_name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)
      const list = data || []
      setNotifications(list)
      setUnreadCount(list.filter(n => !n.read).length)
    } catch (err) {
      console.error('[useNotifications] fetch failed:', err)
    }
  }, [user])

  useEffect(() => {
    if (!user) { setNotifications([]); setUnreadCount(0); return }
    fetchNotifs()

    // Un singur canal global pentru toate componentele
    const ch = supabase.channel(`notifs-${user.id}`)
    ch.on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'notifications',
      filter: `user_id=eq.${user.id}`
    }, payload => {
      setNotifications(p => [payload.new, ...p])
      setUnreadCount(p => p + 1)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try { new Notification(payload.new.title, { body: payload.new.body || '', icon: '/favicon.svg' }) } catch {}
      }
    })
    ch.subscribe()

    return () => { try { ch.unsubscribe(); supabase.removeChannel(ch) } catch {} }
  }, [user, fetchNotifs])

  async function markAllRead() {
    if (!user || !unreadCount) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifications(p => p.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  async function markRead(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(p => Math.max(0, p - 1))
  }

  async function deleteNotif(id) {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(p => {
      const r = p.find(n => n.id === id)
      if (r && !r.read) setUnreadCount(c => Math.max(0, c - 1))
      return p.filter(n => n.id !== id)
    })
  }

  async function requestPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission() } catch {}
    }
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, deleteNotif, requestPermission, refetch: fetchNotifs }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    return {
      notifications: [], unreadCount: 0,
      markAllRead: () => {}, markRead: () => {}, deleteNotif: () => {},
      requestPermission: () => {}, refetch: () => {}
    }
  }
  return ctx
}

export async function createNotification({ userId, type, title, body, link, actorId }) {
  if (!userId) return
  try {
    await supabase.from('notifications').insert({
      user_id: userId, type, title, body: body || null, link: link || null, actor_id: actorId || null
    })
  } catch (err) {
    console.error('[createNotification] failed:', err)
  }
}
