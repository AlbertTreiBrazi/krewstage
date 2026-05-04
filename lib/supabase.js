import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

function getSupabase() {
  if (supabaseInstance) return supabaseInstance
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })
  return supabaseInstance
}

export const supabase = getSupabase()
