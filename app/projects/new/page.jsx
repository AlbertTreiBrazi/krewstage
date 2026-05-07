'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../hooks/useAuth'
import { ROLES, GENRES, MOODS, PROJECT_TYPES, LOCATION_TYPES } from '../../../lib/constants'
import ImageUpload from '../../../components/ImageUpload'

export default function CreateProjectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [audioUploading, setAudioUploading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', genre: '', mood: '', image_url: '',
    project_type: 'collab', location_type: 'both', location_city: '',
    roles_needed: [], reference_links: [''],
    demo_audio_url: '', demo_audio_key: ''
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/auth?mode=register')
  }, [user, loading])

  if (loading || !user) return <div className="spinner" style={{ marginTop: 80 }} />

  const up = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const toggleRole = (r) => setForm(p => ({ ...p, roles_needed: p.roles_needed.includes(r) ? p.roles_needed.filter(x => x !== r) : [...p.roles_needed, r] }))

  async function uploadAudio(file) {
    setAudioUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const key = `${user.id}/${Date.now()}.${ext}`
      const { error: ue } = await supabase.storage.from('audio-demos').upload(key, file, { contentType: file.type })
      if (ue) throw ue
      const { data: { publicUrl } } = supabase.storage.from('audio-demos').getPublicUrl(key)
      up('demo_audio_url', publicUrl)
      up('demo_audio_key', key)
      setAudioFile(file)
    } catch (err) { alert('Audio upload error: ' + err.message) }
    finally { setAudioUploading(false) }
  }

  async function submit() {
    if (!form.title.trim()) { setError('Title is required'); return }
    if (form.roles_needed.length === 0) { setError('Select at least one role you need'); return }
    setSaving(true); setError('')
    try {
      const refs = form.reference_links.filter(l => l.trim())
      const { data, error: err } = await supabase.from('projects').insert({
        owner_id: user.id, title: form.title.trim(), description: form.description,
        genre: form.genre, mood: form.mood,
        project_type: form.project_type, location_type: form.location_type,
        location_city: form.location_city || null,
        roles_needed: form.roles_needed,
        reference_links: refs, demo_audio_url: form.demo_audio_url || null,
        demo_audio_key: form.demo_audio_key || null, status: 'open',
        image_url: form.image_url || null
      }).select().single()
      if (err) throw err
      router.push(`/projects/${data.id}`)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const chipStyle = (active) => ({
    padding: '7px 14px', borderRadius: 100, fontSize: 13, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--brand-border)' : 'var(--border2)'}`,
    background: active ? 'var(--brand-dim)' : 'transparent',
    color: active ? 'var(--brand)' : 'var(--text2)',
    fontFamily: 'DM Sans,sans-serif', transition: 'all 0.15s'
  })

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.push('/projects')}>← Back</button>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Post a project</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Project type */}
        <div className="card">
          <p className="section-title">What kind of project is this?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PROJECT_TYPES.map(pt => (
              <div key={pt.id} onClick={() => up('project_type', pt.id)}
                style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${form.project_type === pt.id ? 'var(--brand-border)' : 'var(--border2)'}`, background: form.project_type === pt.id ? 'var(--brand-dim)' : 'var(--bg3)', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{pt.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: form.project_type === pt.id ? 'var(--brand)' : 'var(--text)' }}>{pt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{pt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Location type */}
        <div className="card">
          <p className="section-title">Remote or in person?</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: form.location_type === 'local' ? 12 : 0 }}>
            {LOCATION_TYPES.map(lt => (
              <button key={lt.id} onClick={() => up('location_type', lt.id)}
                style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: `1px solid ${form.location_type === lt.id ? 'var(--brand-border)' : 'var(--border2)'}`, background: form.location_type === lt.id ? 'var(--brand-dim)' : 'transparent', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.15s', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: form.location_type === lt.id ? 'var(--brand)' : 'var(--text)' }}>{lt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{lt.desc}</div>
              </button>
            ))}
          </div>
          {form.location_type !== 'remote' && (
            <div><label>City</label><input placeholder="e.g. New York, Bucharest, London..." value={form.location_city} onChange={e => up('location_city', e.target.value)} /></div>
          )}
        </div>

        {/* Title + Genre */}
        <div className="card">
          <p className="section-title">Project details</p>
          {/* Project image */}
          <div style={{ marginBottom: 14 }}>
            <label>Project photo <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span></label>
            <div style={{ height: 180, marginTop: 6, borderRadius: 12, overflow: 'hidden' }}>
              <ImageUpload
                userId={user?.id}
                currentUrl={form.image_url}
                storagePath={`${user?.id}/project_${Date.now()}`}
                aspectRatio="project"
                label="Add a project photo"
                onUploaded={url => up('image_url', url)}
              />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}><label>Project title *</label><input placeholder='e.g. "Need vocalist for dark pop track"' value={form.title} onChange={e => up('title', e.target.value)} /></div>
          <div style={{ marginBottom: 14 }}><label>Description</label><textarea rows={4} placeholder="Describe your project, what you've made so far, what you're looking for..." value={form.description} onChange={e => up('description', e.target.value)} style={{ resize: 'none' }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label>Genre</label>
              <select value={form.genre} onChange={e => up('genre', e.target.value)}>
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div><label>Mood / Vibe</label>
              <select value={form.mood} onChange={e => up('mood', e.target.value)}>
                <option value="">Select mood</option>
                {MOODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Roles needed */}
        <div className="card">
          <p className="section-title">Roles you're looking for *</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => toggleRole(r.id)} style={chipStyle(form.roles_needed.includes(r.id))}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo audio */}
        <div className="card">
          <p className="section-title">Demo audio (optional)</p>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>Upload a demo beat, hook, or rough recording to attract the right collaborators. Max 20MB, MP3 recommended.</p>
          {audioFile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', border: '1px solid var(--brand-border)' }}>
              <span style={{ fontSize: 20 }}>🎵</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{audioFile.name}</div>
                <div style={{ fontSize: 12, color: 'var(--green)' }}>✓ Uploaded</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => { setAudioFile(null); up('demo_audio_url', ''); up('demo_audio_key', '') }}>Remove</button>
            </div>
          ) : (
            <label style={{ display: 'block', border: '2px dashed var(--border2)', borderRadius: 'var(--radius-sm)', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', color: 'var(--text3)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div>
              <div style={{ fontSize: 14, color: 'var(--text2)' }}>{audioUploading ? 'Uploading...' : 'Click to upload MP3 or WAV'}</div>
              <input type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadAudio(f) }} disabled={audioUploading} />
            </label>
          )}
        </div>

        {/* Reference links */}
        <div className="card">
          <p className="section-title">Reference links (optional)</p>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>YouTube, SoundCloud, or Spotify links for reference tracks</p>
          {form.reference_links.map((link, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input placeholder="https://soundcloud.com/..." value={link} onChange={e => { const links = [...form.reference_links]; links[i] = e.target.value; up('reference_links', links) }} />
              {i > 0 && <button className="btn btn-danger btn-sm" onClick={() => up('reference_links', form.reference_links.filter((_, j) => j !== i))}>×</button>}
            </div>
          ))}
          {form.reference_links.length < 4 && (
            <button className="btn btn-ghost btn-sm" onClick={() => up('reference_links', [...form.reference_links, ''])}>+ Add link</button>
          )}
        </div>

        <button className="btn btn-brand" onClick={submit} disabled={saving || audioUploading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
          {saving ? 'Posting...' : '🎵 Post project'}
        </button>
      </div>
    </div>
  )
}
