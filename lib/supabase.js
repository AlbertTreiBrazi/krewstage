import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

function getSupabase() {
  if (supabaseInstance) return supabaseInstance
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      console.error(
        '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Set them in Vercel → Project Settings → Environment Variables and redeploy.'
      )
    }
  }

  supabaseInstance = createClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  )
  return supabaseInstance
}

export const supabase = getSupabase()
