'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*, actor:profiles!notifications_actor_id_fkey(id, full_name, avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    const list = data || []
    setNotifications(list)
    setUnreadCount(list.filter(n => !n.read).length)
  }, [user])

  useEffect(() => {
    if (!user) return
    fetch()
    const ch = supabase.channel(`notifs-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        payload => {
          setNotifications(p => [payload.new, ...p])
          setUnreadCount(p => p + 1)
          if (Notification.permission === 'granted') {
            new Notification(payload.new.title, { body: payload.new.body || '', icon: '/favicon.svg' })
          }
        })
      .subscribe()
    return () => ch.unsubscribe()
  }, [user, fetch])

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
    setNotifications(p => { const r = p.find(n => n.id === id); if (r && !r.read) setUnreadCount(c => Math.max(0, c - 1)); return p.filter(n => n.id !== id) })
  }

  async function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission()
  }

  return { notifications, unreadCount, markAllRead, markRead, deleteNotif, requestPermission, refetch: fetch }
}

export async function createNotification({ userId, type, title, body, link, actorId }) {
  if (!userId) return
  await supabase.from('notifications').insert({ user_id: userId, type, title, body: body || null, link: link || null, actor_id: actorId || null })
}
