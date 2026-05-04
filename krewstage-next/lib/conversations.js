import { supabase } from './supabase'

export async function getOrCreateConversation(myUserId, otherUserId) {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant_a.eq.${myUserId},participant_b.eq.${otherUserId}),and(participant_a.eq.${otherUserId},participant_b.eq.${myUserId})`)
    .maybeSingle()
  if (existing) return existing.id
  const { data, error } = await supabase
    .from('conversations')
    .insert({ participant_a: myUserId, participant_b: otherUserId })
    .select('id').single()
  if (error) throw error
  return data.id
}
