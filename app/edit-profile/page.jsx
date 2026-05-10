'use client'
import { sanitizeUrl } from '../../lib/utils'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import AvatarUpload from '../../components/AvatarUpload'
import ImageUpload from '../../components/ImageUpload'
import { ROLES, GENRES, EXPERIENCE_LEVELS, INSTRUMENT_LEVELS, DAYS, TIMES, VENUE_TYPES } from '../../lib/constants'

const INSTRUMENTS = ['Guitar','Bass','Drums','Piano','Vocals','Electric Guitar','Saxophone','Trumpet','Violin','Ukulele','Synthesizer','Flute','Cello','Clarinet','Trombone']

export default function EditProfilePage() {
  const { profile, updateProfile, user } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('basic')
  const [formReady, setFormReady] = useState(false)

  useEffect(() => {
    // Asteapta profile din Supabase inainte de initializare (nu null)
    // formReady previne re-initializarea dupa ce userul a inceput sa editeze
    if (!formReady && profile) {
      setForm({
        full_name: profile.full_name || '',
        city: profile.city || '',
        country: profile.country || 'US',
        bio: profile.bio || '',
        roles: profile.roles || [],
        instruments: profile.instruments || [],
        instrument_levels: profile.instrument_levels || {},
        genres: profile.genres || [],
        experience_level: profile.experience_level || 'intermediate',
        open_to_collaborate: profile.open_to_collaborate ?? true,
        available_days: profile.available_days || [],
        available_time: profile.available_time || '',
        is_venue: profile.is_venue || false,
        venue_name: profile.venue_name || '',
        venue_type: profile.venue_type || '',
        venue_capacity: profile.venue_capacity || null,
        venue_website: profile.venue_website || '',
        social_instagram: profile.social_instagram || '',
        social_youtube: profile.social_youtube || '',
        social_soundcloud: profile.social_soundcloud || '',
        social_spotify: profile.social_spotify || '',
        social_tiktok: profile.social_tiktok || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || '',
        cover_image_url: profile.cover_image_url || '',
      })
      setFormReady(true)
    }
  }, [profile])

  if (!form) return <div className="spinner" style={{ marginTop: 80 }} />

  const up = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const toggleArr = (f, v) => setForm(p => ({ ...p, [f]: p[f].includes(v) ? p[f].filter(x => x !== v) : [...p[f], v] }))
  const setLevel = (instr, level) => setForm(p => ({ ...p, instrument_levels: { ...p.instrument_levels, [instr]: level } }))
  const removeInstr = (instr) => setForm(p => { const l = { ...p.instrument_levels }; delete l[instr]; return { ...p, instruments: p.instruments.filter(i => i !== instr), instrument_levels: l } })

  async function save() {
    setSaving(true)
    const sanitized = { ...form,
      social_instagram:  sanitizeUrl(form.social_instagram),
      social_youtube:    sanitizeUrl(form.social_youtube),
      social_soundcloud: sanitizeUrl(form.social_soundcloud),
      social_spotify:    sanitizeUrl(form.social_spotify),
      social_tiktok:     sanitizeUrl(form.social_tiktok),
      website:           sanitizeUrl(form.website),
      cover_image_url:   sanitizeUrl(form.cover_image_url) || null,
      venue_website:     sanitizeUrl(form.venue_website),
    }
    try { await updateProfile(sanitized); setSaved(true); setTimeout(() => { setSaved(false); router.push('/profile') }, 1500) }
    catch (err) { alert('Error: ' + err.message) }
    finally { setSaving(false) }
  }

  const chip = (active, c = 'var(--brand)', bg = 'var(--brand-dim)', b = 'var(--brand-border)') => ({
    padding: '7px 15px', borderRadius: 100, fontSize: 13, cursor: 'pointer',
    border: `1px solid ${active ? b : 'var(--border2)'}`, background: active ? bg : 'transparent',
    color: active ? c : 'var(--text2)', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.15s'
  })

  const TABS = [{ id: 'basic', label: '👤 Basic' }, { id: 'music', label: '🎸 Music' }, { id: 'availability', label: '📅 Schedule' }, { id: 'social', label: '🔗 Links' }, { id: 'venue', label: '🏛️ Venue' }]

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.push('/profile')}>← Back</button>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Edit profile</h2>
      </div>

      {saved && <div className="alert alert-success">✓ Profile saved!</div>}

      {/* Cover photo + Avatar */}
      <div className="card" style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
        {/* Cover photo banner */}
        <div style={{ position: 'relative', height: 140 }}>
          <ImageUpload
            currentUrl={form.cover_image_url}
            storagePath={`${user?.id}/cover`}
            height={140}
            label="Add cover photo"
            onUploaded={url => up('cover_image_url', url)}
          />
          {/* Avatar suprapus pe cover */}
          <div style={{ position: 'absolute', bottom: -30, left: 20, zIndex: 10, border: '3px solid var(--card)', borderRadius: '50%' }}>
            <AvatarUpload userId={user?.id} currentUrl={form.avatar_url} fullName={form.full_name} onUploaded={url => up('avatar_url', url)} />
          </div>
        </div>
        <div style={{ padding: '40px 20px 16px' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Profile photo & cover</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, lineHeight: 1.6 }}>
            📷 <strong>Cover photo</strong> (bannerul mare): dimensiune recomandată <strong>1200 × 400px</strong> sau orice poză orizontală — concert, studio, scenă.<br/>
            👤 <strong>Avatar</strong> (cercul mic): dimensiune recomandată <strong>400 × 400px</strong> — poza ta de față. Poza va fi tăiată în cerc.<br/>
            Format: JPG, PNG sau WebP · max 8MB fiecare.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, marginBottom: 14 }}>
        {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '8px 4px', borderRadius: 9, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: tab === t.id ? 'var(--brand)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text2)' }}>{t.label}</button>)}
      </div>

      {/* BASIC */}
      {tab === 'basic' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div><label>Full name</label><input value={form.full_name} onChange={e => up('full_name', e.target.value.slice(0,60))} maxLength={60} placeholder="Alex Johnson" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label>City</label><input value={form.city} onChange={e => up('city', e.target.value.slice(0,60))} maxLength={60} placeholder="New York" /></div>
            <div><label>Country</label>
              <select value={form.country} onChange={e => up('country', e.target.value)}>
                {[['US','United States'],['GB','UK'],['RO','Romania'],['DE','Germany'],['FR','France'],['ES','Spain'],['IT','Italy'],['BR','Brazil'],['CA','Canada'],['AU','Australia'],['NL','Netherlands'],['SE','Sweden'],['PL','Poland'],['Other','Other']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div><label>Bio</label><textarea rows={4} value={form.bio} onChange={e => up('bio', e.target.value.slice(0,500))} maxLength={500} placeholder="Tell the community about yourself, your experience and what you're looking for..." style={{ resize: 'none' }} /></div>
          <div>
            <label>Experience level</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {EXPERIENCE_LEVELS.map(l => <button key={l.id} onClick={() => up('experience_level', l.id)} style={{ ...chip(form.experience_level === l.id), flex: 1, flexDirection: 'column', padding: '10px 8px', borderRadius: 10, textAlign: 'center' }}><div style={{ fontWeight: 600, fontSize: 13 }}>{l.label}</div><div style={{ fontSize: 11, opacity: 0.7 }}>{l.desc}</div></button>)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
            <div><div style={{ fontWeight: 500, fontSize: 14 }}>Open to collaborate</div><div style={{ fontSize: 12, color: 'var(--text2)' }}>Show "Open" badge on your profile</div></div>
            <div className={`toggle ${form.open_to_collaborate ? 'on' : 'off'}`} onClick={() => up('open_to_collaborate', !form.open_to_collaborate)}><div className="toggle-thumb" /></div>
          </div>
        </div>
      )}

      {/* MUSIC */}
      {tab === 'music' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12, display: 'block' }}>Your roles</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ROLES.map(r => <button key={r.id} onClick={() => toggleArr('roles', r.id)} style={chip(form.roles.includes(r.id))}>{r.icon} {r.label}</button>)}
            </div>
          </div>
          <div className="card">
            <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12, display: 'block' }}>Instruments</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: form.instruments.length ? 16 : 0 }}>
              {INSTRUMENTS.map(i => <button key={i} onClick={() => toggleArr('instruments', i)} style={chip(form.instruments.includes(i))}>{i}</button>)}
            </div>
            {form.instruments.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Skill level per instrument:</div>
                {form.instruments.map(instr => (
                  <div key={instr} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, flex: 1 }}>{instr}</span>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {INSTRUMENT_LEVELS.map(lv => <button key={lv} onClick={() => setLevel(instr, lv)} style={{ ...chip(form.instrument_levels[instr] === lv), padding: '4px 10px', fontSize: 11 }}>{lv}</button>)}
                    </div>
                    <button onClick={() => removeInstr(instr)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12, display: 'block' }}>Genres</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GENRES.map(g => <button key={g} onClick={() => toggleArr('genres', g)} style={chip(form.genres.includes(g), '#c084fc', 'var(--purple-dim)', 'rgba(168,85,247,0.3)')}>{g}</button>)}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE */}
      {tab === 'availability' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12, display: 'block' }}>Available days</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DAYS.map(d => <button key={d} onClick={() => toggleArr('available_days', d)} style={chip(form.available_days.includes(d), '#60a5fa', 'var(--blue-dim)', 'rgba(59,130,246,0.3)')}>{d}</button>)}
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12, display: 'block' }}>Preferred time</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TIMES.map(t => <button key={t} onClick={() => up('available_time', t)} style={chip(form.available_time === t, '#f472b6', 'rgba(236,72,153,0.12)', 'rgba(236,72,153,0.3)')}>{t}</button>)}
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL */}
      {tab === 'social' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Add links to your music profiles. They'll appear on your public profile.</p>
          {[
            { key: 'social_youtube', label: '▶ YouTube', placeholder: 'https://youtube.com/@yourchannel' },
            { key: 'social_instagram', label: '📷 Instagram', placeholder: 'https://instagram.com/yourhandle' },
            { key: 'social_soundcloud', label: '☁ SoundCloud', placeholder: 'https://soundcloud.com/yourprofile' },
            { key: 'social_spotify', label: '🎵 Spotify', placeholder: 'https://open.spotify.com/artist/...' },
            { key: 'social_tiktok', label: '🎵 TikTok', placeholder: 'https://tiktok.com/@yourhandle' },
            { key: 'website', label: '🌐 Website', placeholder: 'https://yourwebsite.com' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}><label>{label}</label><input value={form[key]} onChange={e => up(key, e.target.value)} placeholder={placeholder} /></div>
          ))}
        </div>
      )}

      {/* VENUE */}
      {tab === 'venue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="alert alert-info" style={{ fontSize: 13 }}>
            Fill in venue details if you selected "Venue" as one of your roles. Your venue will appear in the Venues section.
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div><div style={{ fontWeight: 500, fontSize: 14 }}>I represent a venue</div><div style={{ fontSize: 12, color: 'var(--text2)' }}>Enable to show venue details on your profile</div></div>
              <div className={`toggle ${form.is_venue ? 'on' : 'off'}`} onClick={() => up('is_venue', !form.is_venue)}><div className="toggle-thumb" /></div>
            </div>
            {form.is_venue && <>
              <div><label>Venue name</label><input value={form.venue_name} onChange={e => up('venue_name', e.target.value.slice(0,80))} maxLength={80} placeholder="The Jazz Lounge, Club Nova..." /></div>
              <div><label>Venue type</label>
                <select value={form.venue_type} onChange={e => up('venue_type', e.target.value)}>
                  <option value="">Select type</option>
                  {VENUE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Capacity</label><input type="number" value={form.venue_capacity || ''} onChange={e => up('venue_capacity', e.target.value ? parseInt(e.target.value, 10) : null)} placeholder="e.g. 200" /></div>
                <div><label>Venue website</label><input value={form.venue_website} onChange={e => up('venue_website', e.target.value)} placeholder="https://yourvenue.com" /></div>
              </div>
            </>}
          </div>
        </div>
      )}

      <button className="btn btn-brand" onClick={save} disabled={saving} style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 16, fontSize: 15 }}>
        {saving ? 'Saving...' : '💾 Save changes'}
      </button>
    </div>
  )
}
