'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else setLoading(false)
      })
      .catch((err) => {
        console.error('[useAuth] getSession failed:', err)
        setUser(null); setProfile(null); setLoading(false)
      })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error) throw error
      setProfile(data)
    } catch { setProfile(null) }
    finally { setLoading(false) }
  }

  async function signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      // Triggerul handle_new_user creaza randul in profiles (id + email).
      // Incercam UPDATE cu retry — triggerul poate dura 1-2s.
      const updateData = {
        email,
        roles: [], genres: [], instruments: [], instrument_levels: {},
        available_days: [], social_youtube: '', social_instagram: '',
        social_soundcloud: '', social_spotify: '', social_tiktok: '', website: '',
        is_venue: false, venue_name: '', venue_type: '', venue_capacity: null, venue_website: '',
        open_to_collaborate: true,
        ...userData
      }
      // Retry de 3 ori cu delay crescator (triggerul poate fi lent)
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        const { error: pe } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', data.user.id)
        if (!pe) break
        if (attempt === 2) console.error('[signUp] profile update failed after 3 attempts:', pe)
      }
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function updateProfile(updates) {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single()
    if (error) throw error
    setProfile(data)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile, refetchProfile: () => fetchProfile(user?.id) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
