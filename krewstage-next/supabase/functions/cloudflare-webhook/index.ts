import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.json()
    const { uid, readyToStream, status } = body
    if (!uid) return new Response('Missing uid', { status: 400 })
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const newStatus = readyToStream ? 'ready' : (status === 'error' ? 'error' : 'processing')
    await supabase.from('videos').update({ status: newStatus }).eq('cloudflare_video_id', uid)
    return new Response('OK', { status: 200 })
  } catch (err) {
    return new Response(err.message, { status: 500 })
  }
})
