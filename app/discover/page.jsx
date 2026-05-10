'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { getOrCreateConversation } from '../../lib/conversations'
import { ROLES, GENRES, EXPERIENCE_LEVELS, LOCATION_TYPES, getRoleInfo } from '../../lib/constants'

const PAGE_SIZE = 12

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 8px', color: 'var(--text3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {title}
        <span style={{ fontSize: 12, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>⌃</span>
      </button>
      {open && children}
    </div>
  )
}

function SidebarBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400, background: active ? 'var(--brand-dim)' : 'transparent', color: active ? 'var(--brand)' : 'var(--text2)', transition: 'all 0.15s', display: 'block', marginBottom: 1 }}>
      {children}
    </button>
  )
}

function DiscoverPageInner() {
  const searchParams = useSearchParams()
  const [musicians, setMusicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
  const [genreFilter, setGenreFilter] = useState('')
  const [expFilter, setExpFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showAllGenres, setShowAllGenres] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const sentinelRef = useRef(null)
  const pageRef = useRef(0)
  const searchTimer = useRef(null)
  const refs = { search: useRef(''), role: useRef(searchParams.get('role') || ''), genre: useRef(''), exp: useRef(''), location: useRef(''), userId: useRef(user?.id) }

  useEffect(() => { refs.search.current = search }, [search])
  useEffect(() => { refs.role.current = roleFilter }, [roleFilter])
  useEffect(() => { refs.genre.current = genreFilter }, [genreFilter])
  useEffect(() => { refs.exp.current = expFilter }, [expFilter])
  useEffect(() => { refs.location.current = locationFilter }, [locationFilter])
  useEffect(() => { refs.userId.current = user?.id }, [user?.id])

  async function fetchMusicians(reset = true) {
    const pg = reset ? 0 : pageRef.current
    if (reset) { setLoading(true); pageRef.current = 0 } else setLoadingMore(true)
    try {
      let q = supabase.from('profiles')
        .select('id, full_name, city, country, roles, genres, bio, avatar_url, open_to_collaborate, experience_level, followers_count')
        .not('full_name', 'is', null).not('roles', 'eq', '{}')
        .order('created_at', { ascending: false })
        .range(pg * PAGE_SIZE, (pg + 1) * PAGE_SIZE - 1)
      if (refs.userId.current) q = q.neq('id', refs.userId.current)
      if (refs.exp.current) q = q.eq('experience_level', refs.exp.current)
      if (refs.role.current) q = q.contains('roles', [refs.role.current])
      if (refs.genre.current) q = q.contains('genres', [refs.genre.current])
      if (refs.search.current) q = q.or(`full_name.ilike.%${refs.search.current}%,city.ilike.%${refs.search.current}%`)
      const { data, error } = await q
      if (error) throw error
      const results = (data || []).filter(m => !refs.location.current || refs.location.current === 'remote' || (refs.location.current === 'local' && !!m.city))
      if (reset) setMusicians(results); else setMusicians(prev => [...prev, ...results])
      setHasMore((data || []).length === PAGE_SIZE)
    } catch (err) { console.error(err); if (!reset) setHasMore(false) }
    finally { if (reset) setLoading(false); else setLoadingMore(false) }
  }

  useEffect(() => { pageRef.current = 0; fetchMusicians(true) }, [roleFilter, genreFilter, expFilter, locationFilter, user?.id])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loadingMore) return
    const obs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { pageRef.current += 1; fetchMusicians(false) } }, { threshold: 0.1 })
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [hasMore, loadingMore, musicians.length])

  const hasFilters = roleFilter || genreFilter || expFilter || locationFilter || search
  function clearAll() { setRoleFilter(''); setGenreFilter(''); setExpFilter(''); setLocationFilter(''); setSearch('') }
  const visibleGenres = showAllGenres ? GENRES : GENRES.slice(0, 8)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

      {/* SIDEBAR */}
      <aside className="hide-mobile" style={{ width: 210, flexShrink: 0, position: 'sticky', top: 88, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Filters</span>
          {hasFilters && <button onClick={clearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>⊗ Clear all</button>}
        </div>

        <FilterSection title="Roles">
          <SidebarBtn active={!roleFilter} onClick={() => setRoleFilter('')}>All roles</SidebarBtn>
          {ROLES.map(r => <SidebarBtn key={r.id} active={roleFilter === r.id} onClick={() => setRoleFilter(r.id === roleFilter ? '' : r.id)}>{r.icon} {r.label}</SidebarBtn>)}
        </FilterSection>

        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 18px' }} />

        <FilterSection title="Collaboration">
          <SidebarBtn active={!locationFilter} onClick={() => setLocationFilter('')}>Anywhere</SidebarBtn>
          <SidebarBtn active={locationFilter === 'remote'} onClick={() => setLocationFilter(locationFilter === 'remote' ? '' : 'remote')}>🌐 Remote</SidebarBtn>
          <SidebarBtn active={locationFilter === 'local'} onClick={() => setLocationFilter(locationFilter === 'local' ? '' : 'local')}>📍 Local / Live</SidebarBtn>
          <SidebarBtn active={locationFilter === 'both'} onClick={() => setLocationFilter(locationFilter === 'both' ? '' : 'both')}>🔄 Both</SidebarBtn>
        </FilterSection>

        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 18px' }} />

        <FilterSection title="Genres">
          {visibleGenres.map(g => <SidebarBtn key={g} active={genreFilter === g} onClick={() => setGenreFilter(g === genreFilter ? '' : g)}>{g}</SidebarBtn>)}
          <button onClick={() => setShowAllGenres(!showAllGenres)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--brand)', fontWeight: 600, padding: '4px 10px' }}>
            {showAllGenres ? '− Less' : `+ ${GENRES.length - 8} more`}
          </button>
        </FilterSection>

        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 18px' }} />

        <FilterSection title="Experience" defaultOpen={false}>
          <SidebarBtn active={!expFilter} onClick={() => setExpFilter('')}>All levels</SidebarBtn>
          {EXPERIENCE_LEVELS.map(l => <SidebarBtn key={l.id} active={expFilter === l.id} onClick={() => setExpFilter(l.id === expFilter ? '' : l.id)}>
            {l.label}<span style={{ fontSize: 10, color: 'var(--text3)', display: 'block', fontWeight: 400 }}>{l.desc}</span>
          </SidebarBtn>)}
        </FilterSection>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.5px' }}>Discover musicians</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Find your next collaborator, bandmate or producer</p>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text3)' }}>🔍</span>
            <input placeholder="Search by name, city, bio..." value={search}
              onChange={e => { setSearch(e.target.value); clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => fetchMusicians(true), 500) }}
              onKeyDown={e => { if (e.key === 'Enter') { clearTimeout(searchTimer.current); fetchMusicians(true) } }}
              style={{ paddingLeft: 36, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <select value={expFilter} onChange={e => setExpFilter(e.target.value)} style={{ width: 'auto', flexShrink: 0 }}>
            <option value="">All levels</option>
            {EXPERIENCE_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
          <button className="btn btn-brand" onClick={() => fetchMusicians(true)}>Search</button>
          {hasFilters && <button className="btn btn-ghost" onClick={clearAll}>⊗ Clear</button>}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              roleFilter && { label: `${ROLES.find(r => r.id === roleFilter)?.icon} ${ROLES.find(r => r.id === roleFilter)?.label}`, clear: () => setRoleFilter('') },
              genreFilter && { label: genreFilter, clear: () => setGenreFilter('') },
              locationFilter && { label: locationFilter === 'remote' ? '🌐 Remote' : locationFilter === 'local' ? '📍 Local' : '🔄 Both', clear: () => setLocationFilter('') },
            ].filter(Boolean).map((chip, i) => (
              <span key={i} style={{ background: 'var(--brand)', color: '#fff', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                {chip.label}
                <button onClick={chip.clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
              </span>
            ))}
          </div>
        )}

        {!loading && musicians.length > 0 && <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 14 }}>{musicians.length}{hasMore ? '+' : ''} musicians found</p>}

        {loading ? <div className="spinner" style={{ marginTop: 60 }} /> : musicians.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No musicians found</p>
            <p style={{ fontSize: 13 }}>Try adjusting your filters</p>
            {hasFilters && <button className="btn btn-ghost" onClick={clearAll} style={{ marginTop: 16 }}>Clear all filters</button>}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(272px, 1fr))', gap: 16 }}>
              {musicians.map(m => <MusicianCard key={m.id} musician={m} currentUserId={user?.id}
                onMessage={async e => { e.stopPropagation(); if (!user) { router.push('/auth?mode=register'); return }; try { const id = await getOrCreateConversation(user.id, m.id); router.push(`/messages?conv=${id}`) } catch { router.push('/messages') } }}
                onClick={() => router.push(`/profile/${m.id}`)} />)}
            </div>
            <div ref={sentinelRef} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
              {loadingMore && <div className="spinner" style={{ margin: 0 }} />}
              {!hasMore && musicians.length > 0 && <p style={{ color: 'var(--text3)', fontSize: 13 }}>You've seen everyone 🎸</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MusicianCard({ musician: m, onClick, onMessage, currentUserId }) {
  const [hovered, setHovered] = useState(false)
  const expColors = { beginner: '#60a5fa', intermediate: '#f59e0b', professional: '#10b981' }
  const expLabels = { beginner: 'Beginner', intermediate: 'Intermediate', professional: 'Advanced' }
  const darkGrads = ['135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%', '135deg,#0d0d0d 0%,#1a0a2e 100%', '135deg,#0a1628 0%,#1e3a5f 100%', '135deg,#140d1e 0%,#2d1b69 100%', '135deg,#0d1f0d 0%,#1a3a1a 100%']
  const grad = darkGrads[(m.full_name?.charCodeAt(0) || 0) % darkGrads.length]

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--card)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: `1px solid ${hovered ? 'var(--brand)' : 'var(--border)'}`, transition: 'all 0.2s', transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? '0 12px 32px rgba(255,107,53,0.12)' : '0 2px 8px rgba(0,0,0,0.2)' }}>
      {/* Photo */}
      <div style={{ height: 210, position: 'relative', overflow: 'hidden', background: `linear-gradient(${grad})` }}>
        {m.avatar_url
          ? <img src={m.avatar_url} alt={m.full_name} style={{ width: '100%', height: '100%', objectFit: m.avatar_url.includes('dicebear') ? 'contain' : 'cover', objectPosition: 'center top', display: 'block', transition: 'transform 0.4s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 60, color: 'rgba(255,255,255,0.2)', letterSpacing: -2 }}>
              {(m.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }} />
        {m.open_to_collaborate && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: 100, padding: '4px 11px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} /> Open
          </div>
        )}
        {m.experience_level && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: `${expColors[m.experience_level]}33`, backdropFilter: 'blur(4px)', color: expColors[m.experience_level], border: `1px solid ${expColors[m.experience_level]}66`, borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
            {expLabels[m.experience_level] || m.experience_level}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ fontWeight: 800, fontSize: 17, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3, letterSpacing: '-0.2px' }}>{m.full_name}</div>
        {(m.city || m.country) && <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>📍 {[m.city, m.country].filter(Boolean).join(', ')}</div>}

        {m.roles?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
            {m.roles.slice(0, 3).map(r => { const info = getRoleInfo(r); return <span key={r} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 100, padding: '2px 9px', fontSize: 11, color: 'var(--text2)', fontWeight: 500 }}>{info.icon} {info.label}</span> })}
          </div>
        )}

        {m.genres?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {m.genres.slice(0, 3).map(g => <span key={g} style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '2px 8px', fontSize: 11, color: '#a855f7', fontWeight: 500 }}>{g}</span>)}
          </div>
        )}

        {m.bio && <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.bio}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>👥 {m.followers_count || 0} followers</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {m.id !== currentUserId && (
              <button onClick={onMessage} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                {currentUserId ? '💬' : '🔓'}
              </button>
            )}
            <button onClick={e => { e.stopPropagation(); onClick() }} style={{ background: 'var(--brand)', border: 'none', borderRadius: 8, padding: '0 16px', height: 32, fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              View
            </button>
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
