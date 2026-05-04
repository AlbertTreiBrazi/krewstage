'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { createNotification } from './useNotifications'

export function useFollow(currentUserId, targetUserId, currentName) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const inFlight = useRef(false)  // guard against race condition on rapid clicks

  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) { setLoading(false); return }
    supabase.from('follows').select('id')
      .eq('follower_id', currentUserId).eq('following_id', targetUserId).maybeSingle()
      .then(({ data }) => { setIsFollowing(!!data); setLoading(false) })
  }, [currentUserId, targetUserId])

  async function toggleFollow() {
    if (!currentUserId || currentUserId === targetUserId || inFlight.current) return
    inFlight.current = true
    const was = isFollowing
    setIsFollowing(!was)  // optimistic update

    try {
      if (was) {
        const { error } = await supabase.from('follows').delete()
          .eq('follower_id', currentUserId).eq('following_id', targetUserId)
        if (error) setIsFollowing(true)  // rollback
      } else {
        const { error } = await supabase.from('follows')
          .insert({ follower_id: currentUserId, following_id: targetUserId })
        if (error) { setIsFollowing(false); return }
        await createNotification({
          userId: targetUserId, type: 'new_follower',
          title: `${currentName || 'Someone'} started following you`,
          body: 'Check out their profile on KrewStage.',
          link: `/profile/${currentUserId}`, actorId: currentUserId
        })
      }
    } finally {
      inFlight.current = false
    }
  }

  return { isFollowing, loading, toggleFollow }
}
