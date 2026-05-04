export const ROLES = [
  { id: 'vocalist',   label: 'Vocalist',        icon: '🎤', css: 'role-vocalist'  },
  { id: 'guitarist',  label: 'Guitarist',        icon: '🎸', css: 'role-guitarist' },
  { id: 'bassist',    label: 'Bassist',          icon: '🎸', css: 'role-bassist'   },
  { id: 'drummer',    label: 'Drummer',          icon: '🥁', css: 'role-drummer'   },
  { id: 'keys',       label: 'Keys / Piano',     icon: '🎹', css: 'role-keys'      },
  { id: 'producer',   label: 'Producer',         icon: '🎛️', css: 'role-producer'  },
  { id: 'composer',   label: 'Composer',         icon: '🎼', css: 'role-composer'  },
  { id: 'lyricist',   label: 'Lyricist',         icon: '✍️',  css: 'role-lyricist'  },
  { id: 'dj',         label: 'DJ',               icon: '🎧', css: 'role-dj'        },
  { id: 'engineer',   label: 'Sound Engineer',   icon: '🎚️', css: 'role-engineer'  },
  { id: 'venue',      label: 'Venue',            icon: '🏛️', css: 'role-venue'     },
]

// Tipuri de proiect muzical
export const PROJECT_TYPES = [
  { id: 'collab',       label: 'Collaboration',     icon: '🎵', desc: 'Looking for collaborators on a song or project' },
  { id: 'live_gig',     label: 'Live Opportunity',  icon: '🎤', desc: 'Venue or event looking for artists to perform' },
  { id: 'band_search',  label: 'Band Search',       icon: '🎸', desc: 'Looking for members to form or join a band' },
  { id: 'session',      label: 'Session Work',      icon: '🎙️', desc: 'Studio session, recording or rehearsal' },
]

// Remote vs Local
export const LOCATION_TYPES = [
  { id: 'remote',  label: 'Remote',       desc: 'Work from anywhere, online collaboration' },
  { id: 'local',   label: 'Local / Live', desc: 'In person, specific city or venue' },
  { id: 'both',    label: 'Both',         desc: 'Remote or in person, flexible' },
]

// Tipuri de venue
export const VENUE_TYPES = [
  'Bar / Pub', 'Club', 'Concert Hall', 'Restaurant', 'Festival',
  'Private Event', 'Studio', 'Theatre', 'Outdoor', 'Other',
]

export const GENRES = [
  'Rock', 'Metal', 'Indie', 'Alternative', 'Pop', 'R&B', 'Hip-Hop',
  'Jazz', 'Blues', 'Folk', 'Country', 'Classical', 'Electronic',
  'Funk', 'Soul', 'Reggae', 'Punk', 'Lo-Fi', 'Ambient', 'Latin',
]

export const MOODS = ['Chill', 'Energetic', 'Dark', 'Uplifting', 'Emotional', 'Aggressive', 'Romantic']

export const EXPERIENCE_LEVELS = [
  { id: 'beginner',      label: 'Beginner',      desc: 'Just starting out'     },
  { id: 'intermediate',  label: 'Intermediate',  desc: '2-5 years experience'  },
  { id: 'professional',  label: 'Professional',  desc: '5+ years, gigging'     },
]

export const INSTRUMENT_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional']

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const TIMES = ['Morning', 'Afternoon', 'Evening', 'Anytime']

export const PROJECT_STATUSES = {
  open:        { label: 'Open',        color: 'badge-green'  },
  in_progress: { label: 'In Progress', color: 'badge-amber'  },
  completed:   { label: 'Completed',   color: 'badge-blue'   },
  cancelled:   { label: 'Cancelled',   color: 'badge-gray'   },
}

export const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.id, r]))

export function getRoleInfo(roleId) {
  return ROLE_MAP[roleId] || { id: roleId, label: roleId, icon: '🎵', css: 'badge-gray' }
}

export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#ff6b35,#f7931e)',
  'linear-gradient(135deg,#a855f7,#ec4899)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#10b981,#22c55e)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
]

export function getAvatarGradient(str) {
  if (!str) return AVATAR_GRADIENTS[0]
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_GRADIENTS[Math.abs(h) % AVATAR_GRADIENTS.length]
}

export function getInitials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function formatDuration(seconds) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
