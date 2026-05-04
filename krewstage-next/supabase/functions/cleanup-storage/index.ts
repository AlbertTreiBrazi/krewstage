import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Cleanup-storage necesita service role key — nu poate fi apelata de utilizatori obisnuiti
    const authHeader = req.headers.get('Authorization') || ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const expectedBearer = `Bearer ${serviceKey}`
    if (authHeader !== expectedBearer) {
      return new Response(JSON.stringify({ error: 'Forbidden — service role key required' }), { status: 403 })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey)
    const { data: queue, error: qErr } = await supabase.from('storage_cleanup_queue').select('*').limit(50).order('created_at', { ascending: true })
    if (qErr) throw qErr
    if (!queue || queue.length === 0) {
      return new Response(JSON.stringify({ message: 'Queue empty, nothing to clean.' }), { headers: { 'Content-Type': 'application/json' } })
    }

    let deleted = 0; let failed = 0
    for (const item of queue) {
      try {
        const { error: storageErr } = await supabase.storage.from(item.bucket).remove([item.file_key])
        if (!storageErr || storageErr.message?.includes('not found') || storageErr.message?.includes('404')) {
          await supabase.from('storage_cleanup_queue').delete().eq('id', item.id)
          deleted++
        } else { failed++ }
      } catch { failed++ }
    }

    return new Response(JSON.stringify({ processed: queue.length, deleted, failed }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
