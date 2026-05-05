'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { createNotification } from '../../hooks/useNotifications'
import { GENRES, timeAgo, getAvatarGradient, getInitials } from '../../lib/constants'
import Avatar from '../../components/Avatar'

const BAND_COLORS = ['#ff6b35','#a855f7','#3b82f6','#10b981','#f59e0b','#ef4444','#06b6d4','#84cc16']

export default function BandsPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [bands, setBands] = useState([])
  const [myBands, setMyBands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedBand, setSelectedBand] = useState(null)
  const [tab, setTab] = useState('all')

  useEffect(() => { fetchBands() }, [])

  async function fetchBands() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('bands')
        .select('*, owner:profiles!bands_owner_id_fkey(id, full_name, avatar_url), band_members(id, user_id, role, instrument, profiles(id, full_name, avatar_url))')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      setBands(data || [])
      setMyBands((data || []).filter(b => b.owner_id === user.id || b.band_members?.some(m => m.user_id === user.id)))
    } catch (err) {
      console.error('fetchBands error:', err)
      setBands([]); setMyBands([])
    } finally {
      setLoading(false)
    }
  }

  const displayed = tab === 'mine' ? myBands : bands

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Bands</h2><p style={{ color: 'var(--text2)', fontSize: 14 }}>Create a band or join one</p></div>
        <button className="btn btn-brand" onClick={() => user ? setShowCreate(true) : router.push('/auth?mode=register')}>+ Create band</button>
      </div>

      <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, width: 'fit-content', marginBottom: 24 }}>
        {[['all','All bands'],['mine',`My bands (${myBands.length})`]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: tab === t ? 'var(--brand)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)' }}>
            {l}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎸</div>
          <p style={{ marginBottom: 16 }}>{tab === 'mine' ? "You're not in any band yet." : 'No bands created yet.'}</p>
          <button className="btn btn-brand" onClick={() => setShowCreate(true)}>Create the first band</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {displayed.map(band => (
            <BandCard key={band.id} band={band} currentUserId={user.id} onClick={() => setSelectedBand(band)} onRefresh={fetchBands} />
          ))}
        </div>
      )}

      {showCreate && <CreateBandModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchBands(); setTab('mine') }} userId={user.id} />}
      {selectedBand && <BandDetailModal band={selectedBand} currentUser={user} currentProfile={profile} onClose={() => setSelectedBand(null)} onRefresh={fetchBands} />}
    </div>
  )
}

function BandCard({ band, currentUserId, onClick }) {
  const isOwner = band.owner_id === currentUserId
  const isMember = band.band_members?.some(m => m.user_id === currentUserId)
  return (
    <div className="card card-hover" onClick={onClick} style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: 52, background: band.cover_color || '#ff6b35', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -20, left: 18, width: 42, height: 42, borderRadius: 11, background: band.cover_color || '#ff6b35', border: '3px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>{band.name[0].toUpperCase()}</div>
        {(isMember || isOwner) && <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 100, padding: '2px 10px', fontSize: 11, color: 'white' }}>{isOwner ? '👑 Owner' : '✓ Member'}</span>}
      </div>
      <div style={{ padding: '28px 18px 18px' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{band.name}</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {band.genre && <span className="badge badge-purple">{band.genre}</span>}
          {band.city && <span className="badge badge-blue">📍 {band.city}</span>}
          {band.is_looking_for_members && <span className="badge badge-green">Looking</span>}
        </div>
        {band.description && <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{band.description}</p>}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            {(band.band_members || []).slice(0, 4).map((m, i) => (
              <div key={m.id} style={{ width: 26, height: 26, borderRadius: '50%', background: getAvatarGradient(m.user_id), border: '2px solid var(--card)', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', fontFamily: 'Syne,sans-serif' }}>
                {getInitials(m.profiles?.full_name)}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 10 }}>{band.band_members?.length || 0} members</span>
        </div>
      </div>
    </div>
  )
}

function CreateBandModal({ onClose, onCreated, userId }) {
  const [form, setForm] = useState({ name: '', description: '', genre: '', city: '', cover_color: BAND_COLORS[0] })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const up = (f, v) => setForm(p => ({ ...p, [f]: v }))
  async function create() {
    if (!form.name.trim()) return
    setSaving(true); setError('')
    try {
      const { data, error: be } = await supabase.from('bands').insert({ ...form, name: form.name.trim(), owner_id: userId }).select().single()
      if (be) throw be
      const { error: me } = await supabase.from('band_members').insert({ band_id: data.id, user_id: userId, role: 'owner' })
      if (me) console.error('band_members insert:', me) // non-fatal
      onCreated()
    } catch (err) {
      setError(err.message || 'Failed to create band')
    } finally {
      setSaving(false)
    }
  }
  return (
    <Modal onClose={onClose} title="Create a band">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div><label>Band name *</label><input placeholder="e.g. The Electric Wolves" value={form.name} onChange={e => up('name', e.target.value)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label>Genre</label><select value={form.genre} onChange={e => up('genre', e.target.value)}><option value="">Select</option>{GENRES.map(g => <option key={g}>{g}</option>)}</select></div>
          <div><label>City</label><input placeholder="New York" value={form.city} onChange={e => up('city', e.target.value)} /></div>
        </div>
        <div><label>Description</label><textarea rows={3} placeholder="What's your band about?" value={form.description} onChange={e => up('description', e.target.value)} style={{ resize: 'none' }} /></div>
        <div><label>Band color</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BAND_COLORS.map(c => <div key={c} onClick={() => up('cover_color', c)} style={{ width: 30, height: 30, borderRadius: 8, background: c, cursor: 'pointer', border: form.cover_color === c ? '3px solid white' : '3px solid transparent', outline: form.cover_color === c ? `2px solid ${c}` : 'none' }} />)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button className="btn btn-brand" onClick={create} disabled={saving || !form.name.trim()} style={{ flex: 2, justifyContent: 'center' }}>{saving ? 'Creating...' : '🎸 Create band'}</button>
        </div>
        {error && <div style={{ color: '#ef4444', fontSize: 13, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
      </div>
    </Modal>
  )
}

function BandDetailModal({ band: initialBand, currentUser, currentProfile, onClose, onRefresh }) {
  const router = useRouter()
  const [band, setBand] = useState(initialBand)
  const [inviteSearch, setInviteSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [inviting, setInviting] = useState(null)
  const isOwner = band.owner_id === currentUser.id
  const isMember = band.band_members?.some(m => m.user_id === currentUser.id)
  const members = band.band_members || []

  async function refreshBand() {
    const { data } = await supabase.from('bands')
      .select('*, owner:profiles!bands_owner_id_fkey(id, full_name, avatar_url), band_members(id, user_id, role, instrument, profiles(id, full_name, avatar_url))')
      .eq('id', band.id).single()
    if (data) setBand(data)
    onRefresh()  // refresh the background list too
  }

  async function search(q) {
    if (!q.trim()) { setSearchResults([]); return }
    const memberIds = members.map(m => m.user_id)
    const { data } = await supabase.from('profiles').select('id, full_name, avatar_url, roles, city').ilike('full_name', `%${q}%`).not('id', 'in', `(${[currentUser.id, ...memberIds].join(',')})`).limit(5)
    setSearchResults(data || [])
  }

  async function invite(p) {
    setInviting(p.id)
    await supabase.from('band_members').insert({ band_id: band.id, user_id: p.id, role: 'member' })
    await createNotification({ userId: p.id, type: 'band_invite', title: `You've been added to "${band.name}"`, body: `${currentProfile?.full_name || 'Someone'} invited you to join the band.`, link: '/bands', actorId: currentUser.id })
    setInviting(null); setInviteSearch(''); setSearchResults([])
    await refreshBand()  // stay open, just refresh members
  }

  async function removeMember(memberId) {
    await supabase.from('band_members').delete().eq('id', memberId)
    await refreshBand()
  }

  async function deleteBand() {
    if (!confirm(`Delete "${band.name}"? This cannot be undone.`)) return
    await supabase.from('bands').delete().eq('id', band.id)
    onRefresh(); onClose()
  }

  return (
    <Modal onClose={onClose} title={null} wide>
      <div style={{ height: 68, background: band.cover_color || '#ff6b35', borderRadius: '12px 12px 0 0', margin: '-24px -24px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -22, left: 22, width: 50, height: 50, borderRadius: 13, background: band.cover_color, border: '3px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: 'white' }}>{band.name[0].toUpperCase()}</div>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 8, color: 'white', fontSize: 20, cursor: 'pointer', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{band.name}</h2>
            <div style={{ display: 'flex', gap: 7, marginTop: 7 }}>
              {band.genre && <span className="badge badge-purple">{band.genre}</span>}
              {band.city && <span className="badge badge-blue">📍 {band.city}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
        {!isMember && !isOwner && (
          <button className="btn btn-brand btn-sm" onClick={async () => {
            if (!currentUser) { router.push('/auth?mode=register'); return }
            await supabase.from('band_members').insert({ band_id: band.id, user_id: currentUser.id, role: 'member' })
            await createNotification({ userId: band.owner_id, type: 'new_member', title: `${currentProfile?.full_name || 'Someone'} joined "${band.name}"`, body: 'A new member has joined your band.', link: '/bands', actorId: currentUser.id })
            await refreshBand()
          }}>Join band</button>
        )}
            {isMember && !isOwner && <button className="btn btn-danger btn-sm" onClick={() => { const m = members.find(m => m.user_id === currentUser.id); if (m) removeMember(m.id) }}>Leave band</button>}
            {isOwner && <button className="btn btn-danger btn-sm" onClick={deleteBand}>🗑 Delete band</button>}
          </div>
        </div>
        {band.description && <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>{band.description}</p>}

        <div style={{ marginBottom: 18 }}>
          <p className="section-title">Members ({members.length})</p>
          {members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <Avatar profile={m.profiles} size={36} style={{ cursor: 'pointer' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--brand)' }} onClick={() => { router.push(`/profile/${m.user_id}`); onClose() }}>{m.profiles?.full_name || 'User'}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{m.role === 'owner' ? '👑 Owner' : m.instrument || 'Member'}</div>
              </div>
              {isOwner && m.user_id !== currentUser.id && <button onClick={() => removeMember(m.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18 }}>×</button>}
            </div>
          ))}
        </div>

        {isOwner && (
          <div>
            <p className="section-title">Invite musicians</p>
            <input placeholder="Search by name..." value={inviteSearch} onChange={e => { setInviteSearch(e.target.value); search(e.target.value) }} />
            {searchResults.length > 0 && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, marginTop: 6, overflow: 'hidden' }}>
                {searchResults.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar profile={p} size={32} />
                      <div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.full_name}</div><div style={{ fontSize: 12, color: 'var(--text2)' }}>{p.city}</div></div>
                    </div>
                    <button className="btn btn-brand btn-sm" onClick={() => invite(p)} disabled={inviting === p.id}>{inviting === p.id ? '...' : '+ Invite'}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

function Modal({ children, onClose, title, wide }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--card2)', border: '1px solid var(--border2)', borderRadius: 18, padding: 24, width: '100%', maxWidth: wide ? 560 : 460, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 22, cursor: 'pointer' }}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
