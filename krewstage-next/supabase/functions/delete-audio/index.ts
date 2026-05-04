import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    // Verifica JWT si ownership fisier audio
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors })
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors })

    const { r2_key } = await req.json()
    if (!r2_key) throw new Error('Missing r2_key')

    // Verifica ca fisierul audio apartine utilizatorului autentificat
    const { data: audio, error: audioErr } = await supabase
      .from('audio_demos').select('user_id').eq('r2_key', r2_key).single()
    if (audioErr || !audio) return new Response(JSON.stringify({ error: 'Audio not found' }), { status: 404, headers: cors })
    if (audio.user_id !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: cors })

    const { error: storageErr } = await supabase.storage.from('audio-demos').remove([r2_key])
    if (storageErr && !storageErr.message?.includes('not found')) throw storageErr

    return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
