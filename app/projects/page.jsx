'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { ROLES, GENRES, PROJECT_STATUSES, PROJECT_TYPES, LOCATION_TYPES, getRoleInfo, timeAgo } from '../../lib/constants'
import Avatar from '../../components/Avatar'
import RoleBadge from '../../components/RoleBadge'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all') // all | mine
  const [roleFilter, setRoleFilter] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => { fetchProjects() }, [tab, roleFilter, genreFilter, locationFilter, typeFilter])

  async function fetchProjects() {
    setLoading(true)
    try {
      let q = supabase.from('projects')
        .select('*, owner:profiles!projects_owner_id_fkey(id, full_name, avatar_url, city)')
        .order('created_at', { ascending: false })
        .limit(40)

      if (tab === 'mine') q = q.eq('owner_id', user.id)
      else q = q.eq('status', 'open')
      if (genreFilter) q = q.eq('genre', genreFilter)
      if (locationFilter) q = q.eq('location_type', locationFilter)
      if (typeFilter) q = q.eq('project_type', typeFilter)

      const { data, error } = await q
      if (error) throw error
      let results = data || []
      if (roleFilter) results = results.filter(p => p.roles_needed?.includes(roleFilter))
      setProjects(results)
    } catch (err) {
      console.error('fetchProjects error:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Projects</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Find open projects and offer your skills</p>
        </div>
        <button className="btn btn-brand" onClick={() => router.push('/projects/new')}>+ New project</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, width: 'fit-content', marginBottom: 20 }}>
        {[['all', 'All open projects'], ['mine', 'My projects']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: tab === t ? 'var(--brand)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        <button className={`chip ${!typeFilter ? 'active-solid' : ''}`} onClick={() => setTypeFilter('')}>All types</button>
        {PROJECT_TYPES.map(pt => (
          <button key={pt.id} className={`chip ${typeFilter === pt.id ? 'active' : ''}`} onClick={() => setTypeFilter(pt.id === typeFilter ? '' : pt.id)}>
            {pt.icon} {pt.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        <button className={`chip ${!locationFilter ? 'active-solid' : ''}`} onClick={() => setLocationFilter('')}>Anywhere</button>
        {LOCATION_TYPES.map(lt => (
          <button key={lt.id} className={`chip ${locationFilter === lt.id ? 'active' : ''}`} onClick={() => setLocationFilter(lt.id === locationFilter ? '' : lt.id)}>
            {lt.id === 'remote' ? '🌐' : lt.id === 'local' ? '📍' : '🔄'} {lt.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        <button className={`chip ${!roleFilter ? 'active-solid' : ''}`} onClick={() => setRoleFilter('')}>All roles</button>
        {ROLES.map(r => <button key={r.id} className={`chip ${roleFilter === r.id ? 'active' : ''}`} onClick={() => setRoleFilter(r.id === roleFilter ? '' : r.id)}>{r.icon} {r.label}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 24 }}>
        {GENRES.slice(0, 10).map(g => <button key={g} className={`chip ${genreFilter === g ? 'active' : ''}`} onClick={() => setGenreFilter(g === genreFilter ? '' : g)} style={{ fontSize: 12 }}>{g}</button>)}
      </div>

      {loading ? <div className="spinner" /> : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎵</div>
          <p style={{ marginBottom: 16 }}>{tab === 'mine' ? 'You have no projects yet.' : 'No open projects right now.'}</p>
          <button className="btn btn-brand" onClick={() => router.push('/projects/new')}>Post the first one</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} onClick={() => router.push(`/projects/${p.id}`)} />)}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project: p, onClick }) {
  const status = PROJECT_STATUSES[p.status] || PROJECT_STATUSES.open
  const projType = PROJECT_TYPES.find(pt => pt.id === p.project_type)
  const locBadge = p.location_type === 'remote' ? { icon: '🌐', label: 'Remote', cls: 'badge-blue' }
    : p.location_type === 'local' ? { icon: '📍', label: p.location_city || 'Local', cls: 'badge-amber' }
    : { icon: '🔄', label: 'Remote or Local', cls: 'badge-gray' }
  return (
    <div className="card card-hover" onClick={onClick}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {projType && <span className="badge badge-brand" style={{ fontSize: 11 }}>{projType.icon} {projType.label}</span>}
            <span className={`badge ${locBadge.cls}`} style={{ fontSize: 11 }}>{locBadge.icon} {locBadge.label}</span>
            {p.genre && <span className="badge badge-purple" style={{ fontSize: 11 }}>{p.genre}</span>}
            {p.mood && <span className="badge badge-gray" style={{ fontSize: 11 }}>{p.mood}</span>}
            <span className={`badge ${status.color}`} style={{ fontSize: 11 }}>{status.label}</span>
          </div>
        </div>
        {p.demo_audio_url && <span style={{ fontSize: 18, flexShrink: 0, marginLeft: 8 }} title="Has demo">🎵</span>}
      </div>

      {p.description && <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>}

      {/* Roles needed */}
      {p.roles_needed?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Looking for</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {p.roles_needed.map(r => <RoleBadge key={r} role={r} size="small" />)}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar profile={p.owner} size={26} />
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{p.owner?.full_name}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text3)' }}>
          <span>👥 {p.applications_count || 0}</span>
          <span>{timeAgo(p.created_at)}</span>
        </div>
      </div>
    </div>
  )
}
