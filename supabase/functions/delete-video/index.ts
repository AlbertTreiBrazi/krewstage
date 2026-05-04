import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    // Verifica JWT si ownership video
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors })
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors })

    const { cloudflare_video_id } = await req.json()
    if (!cloudflare_video_id) throw new Error('Missing cloudflare_video_id')

    // Verifica ca videoclipul apartine utilizatorului autentificat
    const { data: video, error: videoErr } = await supabase
      .from('videos').select('user_id').eq('cloudflare_video_id', cloudflare_video_id).single()
    if (videoErr || !video) return new Response(JSON.stringify({ error: 'Video not found' }), { status: 404, headers: cors })
    if (video.user_id !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: cors })

    const ACCOUNT_ID = Deno.env.get('CLOUDFLARE_ACCOUNT_ID')
    const API_TOKEN = Deno.env.get('CLOUDFLARE_API_TOKEN')
    const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/${cloudflare_video_id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    })
    return new Response(JSON.stringify({ success: resp.ok }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
