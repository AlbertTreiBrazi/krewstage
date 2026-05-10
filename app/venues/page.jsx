'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { sanitizeUrl } from '../../lib/utils'
import { PROJECT_TYPES, GENRES, timeAgo, getAvatarGradient, getInitials } from '../../lib/constants'
import Avatar from '../../components/Avatar'
import RoleBadge from '../../components/RoleBadge'

export default function VenuePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [venues, setVenues] = useState([])
  const [liveGigs, setLiveGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('venues')
  const [genreFilter, setGenreFilter] = useState('')

  useEffect(() => { fetchAll() }, [genreFilter])

  async function fetchAll() {
    setLoading(true)
    try {
      const [{ data: venueProfiles }, { data: gigs }] = await Promise.all([
        supabase.from('profiles')
          .select('id, full_name, city, country, bio, avatar_url, cover_image_url, roles, genres, venue_name, venue_type, venue_capacity, venue_website, followers_count')
          .contains('roles', ['venue'])
          .order('created_at', { ascending: false })
          .limit(40),
        supabase.from('projects')
          .select('*, owner:profiles!projects_owner_id_fkey(id, full_name, avatar_url, venue_name, venue_type, city)')
          .eq('project_type', 'live_gig')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(40)
      ])
      setVenues(venueProfiles || [])
      let gigsData = gigs || []
      if (genreFilter) gigsData = gigsData.filter(g => g.genre === genreFilter)
      setLiveGigs(gigsData)
    } catch (err) {
      console.error('fetchAll venues error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Venues & Live Opportunities</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Bars, clubs, events and venues looking for artists · Artists looking for gigs</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, width: 'fit-content', marginBottom: 20 }}>
        {[
          ['venues', `🏛️ Venues (${venues.length})`],
          ['gigs',   `🎤 Live Gigs (${liveGigs.length})`]
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: tab === t ? 'var(--brand)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Genre filter for gigs */}
      {tab === 'gigs' && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 20 }}>
          <button className={`chip ${!genreFilter ? 'active-solid' : ''}`} onClick={() => setGenreFilter('')}>All genres</button>
          {GENRES.slice(0, 12).map(g => (
            <button key={g} className={`chip ${genreFilter === g ? 'active' : ''}`} onClick={() => setGenreFilter(g === genreFilter ? '' : g)} style={{ fontSize: 12 }}>{g}</button>
          ))}
        </div>
      )}

      {loading ? <div className="spinner" /> : (
        <>
          {/* VENUES TAB */}
          {tab === 'venues' && (
            venues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
                <p style={{ marginBottom: 16 }}>No venues registered yet.</p>
                <p style={{ fontSize: 13, color: 'var(--text3)' }}>Are you a venue? Register with the "Venue" role and start posting live opportunities.</p>
                <button className="btn btn-brand" style={{ marginTop: 16 }} onClick={() => router.push('/edit-profile')}>Register as Venue</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {venues.map(v => <VenueCard key={v.id} venue={v} onClick={() => router.push(`/profile/${v.id}`)} />)}
              </div>
            )
          )}

          {/* GIGS TAB */}
          {tab === 'gigs' && (
            liveGigs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎤</div>
                <p style={{ marginBottom: 16 }}>No live opportunities posted yet.</p>
                <button className="btn btn-brand" onClick={() => router.push('/projects/new')}>Post a live opportunity</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                {liveGigs.map(g => <GigCard key={g.id} gig={g} onClick={() => router.push(`/projects/${g.id}`)} />)}
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

function VenueCard({ venue: v, onClick }) {
  return (
    <div className="card card-hover" onClick={onClick} style={{ padding: 0, overflow: 'hidden' }}>
      {/* Venue cover photo */}
      <div style={{ height: 110, position: 'relative', overflow: 'hidden', background: v.cover_image_url ? 'transparent' : 'linear-gradient(135deg, var(--bg3) 0%, var(--card2) 100%)' }}>
        {v.cover_image_url && <img src={v.cover_image_url} alt={v.venue_name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
        {!v.cover_image_url && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, opacity: 0.2 }}>🏛️</div>}
        <div style={{ position: 'absolute', bottom: -20, left: 14, width: 42, height: 42, borderRadius: '50%', border: '3px solid var(--card)', overflow: 'hidden', background: 'var(--card)' }}>
          <Avatar profile={v} size={42} />
        </div>
      </div>
      <div style={{ padding: '26px 14px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{ width: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.venue_name || v.full_name}</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
            {v.venue_type && <span>{v.venue_type} · </span>}
            {[v.city, v.country].filter(Boolean).join(', ')}
          </div>
          {v.venue_capacity && (
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>Capacity: {v.venue_capacity}</div>
          )}
        </div>
        <span className="badge badge-amber" style={{ fontSize: 11, flexShrink: 0 }}>🏛️ Venue</span>
      </div>

      {v.genres?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
          {v.genres.slice(0, 4).map(g => <span key={g} className="badge badge-purple" style={{ fontSize: 11 }}>{g}</span>)}
        </div>
      )}

      {v.bio && (
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.bio}</p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>👥 {v.followers_count || 0} followers</span>
        {v.venue_website && (
          <a href={sanitizeUrl(v.venue_website)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
            <button className="btn btn-ghost btn-sm">🌐 Website</button>
          </a>
        )}
      </div>
      </div>
    </div>
  )
}

function GigCard({ gig: g, onClick }) {
  return (
    <div className="card card-hover" onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{g.title}</h3>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <span className="badge badge-brand" style={{ fontSize: 11 }}>🎤 Live Gig</span>
            {g.location_type !== 'remote' && g.location_city && (
              <span className="badge badge-amber" style={{ fontSize: 11 }}>📍 {g.location_city}</span>
            )}
            {g.genre && <span className="badge badge-purple" style={{ fontSize: 11 }}>{g.genre}</span>}
          </div>
        </div>
        <span className="badge badge-green" style={{ fontSize: 11, flexShrink: 0 }}>Open</span>
      </div>

      {g.description && (
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.description}</p>
      )}

      {g.roles_needed?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Looking for</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {g.roles_needed.map(r => <RoleBadge key={r} role={r} size="small" />)}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar profile={g.owner} size={24} />
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{g.owner?.venue_name || g.owner?.full_name}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(g.created_at)}</span>
      </div>
    </div>
  )
}
