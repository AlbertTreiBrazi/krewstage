// Sanitizeaza URL-uri din input utilizator
// Blocheaza javascript:, data:, vbscript: si alte protocoale periculoase
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  // Permite doar https:// si http://
  if (!/^https?:\/\//i.test(trimmed)) return ''
  return trimmed
}
