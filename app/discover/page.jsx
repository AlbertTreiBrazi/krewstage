'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { getOrCreateConversation } from '../../lib/conversations'
import { ROLES, GENRES, EXPERIENCE_LEVELS, LOCATION_TYPES, getRoleInfo, getAvatarGradient, getInitials } from '../../lib/constants'
import Avatar from '../../components/Avatar'
import RoleBadge from '../../components/RoleBadge'

const PAGE_SIZE = 12

function DiscoverPageInner() {
  const searchParams = useSearchParams()
  const urlRole = searchParams.get('role') || ''
  const [musicians, setMusicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(urlRole)
  const [genreFilter, setGenreFilter] = useState('')
  const [expFilter, setExpFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const sentinelRef = useRef(null)
  const pageRef = useRef(0)
  const searchTimer = useRef(null)

  // Refs pentru valorile curente — evita stale closures in timers si observers
  const searchRef = useRef('')
  const roleFilterRef = useRef('')
  const genreFilterRef = useRef('')
  const expFilterRef = useRef('')
  const locationFilterRef = useRef('')
  const userIdRef = useRef(user?.id)

  // Sync refs cu state
  useEffect(() => { searchRef.current = search }, [search])
  useEffect(() => { roleFilterRef.current = roleFilter }, [roleFilter])
  useEffect(() => { genreFilterRef.current = genreFilter }, [genreFilter])
  useEffect(() => { expFilterRef.current = expFilter }, [expFilter])
  useEffect(() => { locationFilterRef.current = locationFilter }, [locationFilter])
  useEffect(() => { userIdRef.current = user?.id }, [user?.id])

  async function fetchMusicians(reset = true) {
    const pg = reset ? 0 : pageRef.current
    if (reset) { setLoading(true); pageRef.current = 0 }
    else setLoadingMore(true)

    const currentSearch = searchRef.current
    const currentRole = roleFilterRef.current
    const currentGenre = genreFilterRef.current
    const currentExp = expFilterRef.current
    const currentLocation = locationFilterRef.current
    const currentUserId = userIdRef.current

    try {
      let q = supabase.from('profiles')
        .select('id, full_name, city, country, roles, genres, bio, avatar_url, open_to_collaborate, experience_level, followers_count')
        .not('full_name', 'is', null)
        .not('roles', 'eq', '{}')
        .order('created_at', { ascending: false })
        .range(pg * PAGE_SIZE, (pg + 1) * PAGE_SIZE - 1)

      if (currentUserId) q = q.neq('id', currentUserId)
      if (currentExp) q = q.eq('experience_level', currentExp)
      // Filtrare server-side: rol si gen direct in DB query
      if (currentRole) q = q.contains('roles', [currentRole])
      if (currentGenre) q = q.contains('genres', [currentGenre])
      // Search server-side pe full_name si city
      if (currentSearch) q = q.or(`full_name.ilike.%${currentSearch}%,city.ilike.%${currentSearch}%`)

      const { data, error } = await q
      if (error) throw error
      const results = data || []

      const filtered = results.filter(m => {
        // Local = arata doar muzicieni cu oras completat
        const ml = !currentLocation || currentLocation === 'remote' || (currentLocation === 'local' && !!m.city)
        return ml
      })

      if (reset) setMusicians(filtered)
      else setMusicians(prev => [...prev, ...filtered])
      setHasMore(results.length === PAGE_SIZE)
    } catch (err) {
      console.error('fetchMusicians error:', err)
      if (!reset) setHasMore(false)  // stop infinite scroll on error
    } finally {
      if (reset) setLoading(false); else setLoadingMore(false)
    }
  }

  // Re-fetch la schimbarea filtrelor
  useEffect(() => {
    pageRef.current = 0
    fetchMusicians(true)
  }, [roleFilter, genreFilter, expFilter, locationFilter, user?.id])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loadingMore) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const nextPage = pageRef.current + 1
        pageRef.current = nextPage
        fetchMusicians(false)
      }
    }, { threshold: 0.1 })
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [hasMore, loadingMore, musicians.length])

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Discover musicians</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Find your next collaborator, bandmate or producer</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Search by name, city, bio..." value={search}
          onChange={e => {
            setSearch(e.target.value)
            // Debounce: asteapta 500ms dupa ce userul termina de scris
            clearTimeout(searchTimer.current)
            searchTimer.current = setTimeout(() => fetchMusicians(true), 500)
          }}
          onKeyDown={e => { if (e.key === 'Enter') { clearTimeout(searchTimer.current); fetchMusicians(true) } }}
          style={{ flex: 1, minWidth: 200 }} />
        <select value={expFilter} onChange={e => { setExpFilter(e.target.value) }} style={{ width: 'auto' }}>
          <option value="">All levels</option>
          {EXPERIENCE_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => fetchMusicians(true)}>Search</button>
      </div>

      {/* Role chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        <button className={`chip ${!roleFilter ? 'active-solid' : ''}`} onClick={() => setRoleFilter('')}>All roles</button>
        {ROLES.map(r => (
          <button key={r.id} className={`chip ${roleFilter === r.id ? 'active' : ''}`} onClick={() => setRoleFilter(r.id === roleFilter ? '' : r.id)}>
            {r.icon} {r.label}
          </button>
        ))}
      </div>

      {/* Location chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        <button className={`chip ${!locationFilter ? 'active-solid' : ''}`} onClick={() => setLocationFilter('')}>Anywhere</button>
        {LOCATION_TYPES.map(lt => (
          <button key={lt.id} className={`chip ${locationFilter === lt.id ? 'active' : ''}`}
            onClick={() => setLocationFilter(lt.id === locationFilter ? '' : lt.id)}>
            {lt.id === 'remote' ? '🌐' : lt.id === 'local' ? '📍' : '🔄'} {lt.label}
          </button>
        ))}
      </div>

      {/* Genre chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 28 }}>
        {GENRES.slice(0, 10).map(g => (
          <button key={g} className={`chip ${genreFilter === g ? 'active' : ''}`} onClick={() => setGenreFilter(g === genreFilter ? '' : g)}
            style={{ fontSize: 12 }}>{g}</button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : musicians.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p>No musicians found. Try different filters.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>{musicians.length} musicians found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
            {musicians.map(m => <MusicianCard key={m.id} musician={m} currentUserId={user?.id} onMessage={async e => {
              e.stopPropagation()
              if (!user) { router.push('/auth?mode=register'); return }
              try { const id = await getOrCreateConversation(user.id, m.id); router.push(`/messages?conv=${id}`) } catch { router.push('/messages') }
            }} onClick={() => router.push(`/profile/${m.id}`)} />)}
          </div>
          <div ref={sentinelRef} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            {loadingMore && <div className="spinner" style={{ margin: 0 }} />}
            {!hasMore && musicians.length > 0 && <p style={{ color: 'var(--text3)', fontSize: 13 }}>You've seen everyone 🎸</p>}
          </div>
        </>
      )}
    </div>
  )
}

function MusicianCard({ musician: m, onClick, onMessage, currentUserId }) {
  const expColors = { beginner: 'badge-blue', intermediate: 'badge-amber', professional: 'badge-green' }
  const initials = (m.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const gradients = ['#ff6b35,#ff8c42', '#a855f7,#7c3aed', '#3b82f6,#1d4ed8', '#10b981,#059669', '#f59e0b,#d97706']
  const grad = gradients[(m.full_name?.charCodeAt(0) || 0) % gradients.length]

  return (
    <div className="card card-hover" onClick={onClick} style={{ padding: 0, overflow: 'hidden' }}>
      {/* Photo area */}
      <div style={{ height: 160, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${grad})` }}>
        {m.avatar_url
          ? <img src={m.avatar_url} alt={m.full_name} style={{ width: '100%', height: '100%', objectFit: m.avatar_url.includes('dicebear') ? 'contain' : 'cover', objectPosition: 'center top', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 48, color: 'rgba(255,255,255,0.9)' }}>{initials}</div>
        }
        {m.open_to_collaborate && (
          <span className="badge badge-green" style={{ position: 'absolute', top: 10, right: 10, fontSize: 11 }}>Open</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{m.full_name}</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
          {[m.city, m.country].filter(Boolean).join(', ')}
          {m.experience_level && <span className={`badge ${expColors[m.experience_level] || 'badge-gray'}`} style={{ fontSize: 10, marginLeft: 6 }}>{m.experience_level}</span>}
        </div>

        {m.roles?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {m.roles.slice(0, 3).map(r => <RoleBadge key={r} role={r} size="small" />)}
          </div>
        )}

        {m.genres?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {m.genres.slice(0, 3).map(g => <span key={g} className="badge badge-purple" style={{ fontSize: 11 }}>{g}</span>)}
          </div>
        )}

        {m.bio && <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.bio}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>👥 {m.followers_count || 0}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {m.id !== currentUserId && (
              <button className="btn btn-ghost btn-sm" onClick={onMessage} style={{ fontSize: 12 }}>
                {currentUserId ? '💬' : '🔓'}
              </button>
            )}
            <button className="btn btn-ghost-brand btn-sm" onClick={e => { e.stopPropagation(); onClick() }} style={{ fontSize: 12 }}>View</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="spinner" style={{ marginTop: 80 }} />}>
      <DiscoverPageInner />
    </Suspense>
  )
}
