'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useFollow } from '../hooks/useFollow'
import { getOrCreateConversation } from '../lib/conversations'
import { getRoleInfo, getAvatarGradient, getInitials, timeAgo, EXPERIENCE_LEVELS, PROJECT_STATUSES } from '../lib/constants'
import Avatar from './Avatar'
import RoleBadge from './RoleBadge'
import AudioPlayer from './AudioPlayer'

export default function ProfilePageClient({ userId }) {
  // userId passed as prop
  const { user, profile: myProfile } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [audioDemos, setAudioDemos] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('audio')
  const [videoUploading, setVideoUploading] = useState(false)
  const [audioUploading, setAudioUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const videoInputRef = useRef(null)
  const audioInputRef = useRef(null)

  const isOwn = !userId || userId === user?.id
  const targetId = isOwn ? user?.id : userId
  const { isFollowing, loading: followLoading, toggleFollow } = useFollow(user?.id, isOwn ? null : targetId, myProfile?.full_name)

  useEffect(() => {
    if (targetId) { fetchProfile(targetId); fetchVideos(targetId); fetchAudio(targetId); fetchProjects(targetId) }
  }, [targetId])

  // Realtime video status
  useEffect(() => {
    if (!targetId) return
    const ch = supabase.channel(`vids-${targetId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'videos', filter: `user_id=eq.${targetId}` },
        p => setVideos(prev => prev.map(v => v.id === p.new.id ? { ...v, ...p.new } : v)))
      .subscribe()
    return () => ch.unsubscribe()
  }, [targetId])

  async function fetchProfile(id) {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) throw error
      setProfile(data)
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }
  async function fetchVideos(id) {
    const { data } = await supabase.from('videos').select('*').eq('user_id', id).order('created_at', { ascending: false })
    setVideos(data || [])
  }
  async function fetchAudio(id) {
    const { data } = await supabase.from('audio_demos').select('*').eq('user_id', id).order('created_at', { ascending: false })
    setAudioDemos(data || [])
  }
  async function fetchProjects(id) {
    const { data } = await supabase.from('projects').select('id, title, genre, status, roles_needed, created_at').eq('owner_id', id).order('created_at', { ascending: false }).limit(6)
    setProjects(data || [])
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 200 * 1024 * 1024) { alert('Max 200MB'); return }
    setVideoUploading(true); setUploadProgress(10)
    try {
      const { data: { upload_url, video_id }, error } = await supabase.functions.invoke('get-upload-url', { body: { filename: file.name, size: file.size } })
      if (error) throw error
      setUploadProgress(30)
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch(upload_url, { method: 'POST', body: fd })
      if (!r.ok) throw new Error('Upload failed')
      setUploadProgress(80)
      await supabase.from('videos').insert({ user_id: user.id, cloudflare_video_id: video_id, title: file.name.replace(/\.[^/.]+$/, ''), status: 'processing' })
      setUploadProgress(100); await fetchVideos(targetId)
    } catch (err) { alert('Video upload error: ' + err.message) }
    finally { setVideoUploading(false); setUploadProgress(0); if (videoInputRef.current) videoInputRef.current.value = '' }
  }

  async function handleAudioUpload(e) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 20 * 1024 * 1024) { alert('Max 20MB for audio demos (MP3 recommended)'); return }
    setAudioUploading(true)
    setUploadProgress(20)
    try {
      const ext = file.name.split('.').pop()
      const key = `${user.id}/${Date.now()}.${ext}`
      setUploadProgress(40)
      const { error: ue } = await supabase.storage.from('audio-demos').upload(key, file, { contentType: file.type })
      if (ue) throw ue
      setUploadProgress(80)
      const { data: { publicUrl } } = supabase.storage.from('audio-demos').getPublicUrl(key)
      const title = file.name.replace(/\.[^/.]+$/, '')
      await supabase.from('audio_demos').insert({ user_id: user.id, r2_key: key, r2_url: publicUrl, title })
      setUploadProgress(100)
      await fetchAudio(targetId)
    } catch (err) { alert('Audio upload error: ' + err.message) }
    finally { setAudioUploading(false); setUploadProgress(0); if (audioInputRef.current) audioInputRef.current.value = '' }
  }

  async function deleteVideo(id, cfId) {
    if (!confirm('Delete this video?')) return
    await supabase.functions.invoke('delete-video', { body: { cloudflare_video_id: cfId } })
    await supabase.from('videos').delete().eq('id', id)
    fetchVideos(targetId)
  }

  async function deleteAudio(id, key) {
    if (!confirm('Delete this audio demo?')) return
    try {
      await supabase.functions.invoke('delete-audio', { body: { r2_key: key } })
    } catch { /* fisierul poate fi deja sters */ }
    await supabase.from('audio_demos').delete().eq('id', id)
    fetchAudio(targetId)
  }

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />
  if (!profile) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text3)' }}>Profile not found</div>

  const expLevel = EXPERIENCE_LEVELS.find(l => l.id === profile.experience_level)
  const expColor = { beginner: 'badge-blue', intermediate: 'badge-amber', professional: 'badge-green' }[profile.experience_level] || 'badge-gray'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

      {/* Profile header */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
          {/* Avatar */}
          <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid var(--border2)' }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', background: getAvatarGradient(profile.id), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 30, color: 'white' }}>{getInitials(profile.full_name)}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>{profile.full_name}</h2>
              {profile.is_pro && <span className="badge badge-brand">PRO</span>}
              {expLevel && <span className={`badge ${expColor}`}>{expLevel.label}</span>}
            </div>
            <div style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 10 }}>
              📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
            </div>
            {/* Roles */}
            {profile.roles?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {profile.roles.map(r => <RoleBadge key={r} role={r} />)}
              </div>
            )}
            {/* Stats */}
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { num: profile.followers_count || 0, label: 'followers' },
                { num: profile.following_count || 0, label: 'following' },
                { num: projects.length, label: 'projects' },
              ].map(s => (
                <div key={s.label}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: 'var(--brand)', fontSize: 18 }}>{s.num}</span>
                  <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 5 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {isOwn ? (
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/edit-profile')}>✏️ Edit profile</button>
            ) : (
              <>
                <button className={`btn btn-sm ${isFollowing ? 'btn-ghost' : 'btn-brand'}`} disabled={followLoading} onClick={toggleFollow}>
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={async () => {
                  try { const id = await getOrCreateConversation(user.id, targetId); router.push(`/messages?conv=${id}`) }
                  catch { router.push('/messages') }
                }}>💬 Message</button>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, paddingTop: 14, borderTop: '1px solid var(--border)', marginBottom: 12 }}>{profile.bio}</p>
        )}

        {/* Genres */}
        {profile.genres?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: profile.open_to_collaborate ? 10 : 0 }}>
            {profile.genres.map(g => <span key={g} className="badge badge-purple">{g}</span>)}
          </div>
        )}
        {profile.open_to_collaborate && <span className="badge badge-green">✓ Open to collaborate</span>}

        {/* Availability */}
        {(profile.available_days?.length > 0 || profile.available_time) && (
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span>📅</span>
            {profile.available_days?.join(', ')}
            {profile.available_time && <span>· {profile.available_time}</span>}
          </div>
        )}

        {/* Social links */}
        {[
          { key: 'social_youtube', icon: '▶', label: 'YouTube' },
          { key: 'social_instagram', icon: '📷', label: 'Instagram' },
          { key: 'social_soundcloud', icon: '☁', label: 'SoundCloud' },
          { key: 'social_spotify', icon: '🎵', label: 'Spotify' },
          { key: 'social_tiktok', icon: '🎵', label: 'TikTok' },
          { key: 'website', icon: '🌐', label: 'Website' },
        ].some(s => profile[s.key]) && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {[
              { key: 'social_youtube', icon: '▶', label: 'YouTube' },
              { key: 'social_instagram', icon: '📷', label: 'Instagram' },
              { key: 'social_soundcloud', icon: '☁', label: 'SoundCloud' },
              { key: 'social_spotify', icon: '🎵', label: 'Spotify' },
              { key: 'social_tiktok', icon: '🎵', label: 'TikTok' },
              { key: 'website', icon: '🌐', label: 'Website' },
            ].filter(s => profile[s.key]).map(s => (
              <a key={s.key} href={profile[s.key]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="btn btn-ghost btn-sm">{s.icon} {s.label}</button>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Instruments */}
      {profile.instruments?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p className="section-title">Instruments</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {profile.instruments.map(instr => {
              const level = profile.instrument_levels?.[instr]
              const lvlColor = { Beginner: 'badge-blue', Intermediate: 'badge-amber', Advanced: 'badge-green', Professional: 'badge-brand' }[level] || 'badge-gray'
              return (
                <div key={instr} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, padding: '9px 15px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{instr}</span>
                  {level && <span className={`badge ${lvlColor}`} style={{ fontSize: 11 }}>{level}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content tabs */}
      <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, width: 'fit-content', marginBottom: 16 }}>
        {[['audio', `Audio (${audioDemos.length})`], ['videos', `Videos (${videos.length})`], ['projects', `Projects (${projects.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '7px 18px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: tab === t ? 'var(--brand)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Audio demos */}
      {tab === 'audio' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="section-title" style={{ margin: 0 }}>🎵 Audio Demos</p>
            {isOwn && <>
              <input type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg" ref={audioInputRef} style={{ display: 'none' }} onChange={handleAudioUpload} />
              <button className="btn btn-brand btn-sm" onClick={() => audioInputRef.current?.click()} disabled={audioUploading}>
                {audioUploading ? `Uploading ${uploadProgress}%` : '+ Add demo'}
              </button>
            </>}
          </div>
          {audioDemos.length === 0
            ? <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text3)' }}><div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div><p>{isOwn ? 'Upload your first audio demo' : 'No audio demos yet'}</p></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {audioDemos.map(d => (
                  <div key={d.id} style={{ position: 'relative' }}>
                    <AudioPlayer url={d.r2_url} title={d.title} genre={d.genre} />
                    {isOwn && <button onClick={() => deleteAudio(d.id, d.r2_key)} style={{ position: 'absolute', top: 8, right: 8, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: 12, padding: '3px 8px' }}>🗑</button>}
                  </div>
                ))}
              </div>}
        </div>
      )}

      {/* Videos */}
      {tab === 'videos' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="section-title" style={{ margin: 0 }}>🎬 Videos</p>
            {isOwn && <>
              <input type="file" accept="video/*" ref={videoInputRef} style={{ display: 'none' }} onChange={handleVideoUpload} />
              <button className="btn btn-brand btn-sm" onClick={() => videoInputRef.current?.click()} disabled={videoUploading}>{videoUploading ? `Uploading ${uploadProgress}%` : '+ Add video'}</button>
            </>}
          </div>
          {videoUploading && uploadProgress > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} /></div>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 5 }}>{uploadProgress < 80 ? 'Uploading to Cloudflare...' : 'Processing...'}</p>
            </div>
          )}
          {videos.length === 0
            ? <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text3)' }}><div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div><p>{isOwn ? 'Upload your first video' : 'No videos yet'}</p></div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {videos.map(v => <VideoThumb key={v.id} video={v} isOwner={isOwn} onPlay={() => setSelectedVideo(v)} onDelete={() => deleteVideo(v.id, v.cloudflare_video_id)} />)}
              </div>}
        </div>
      )}

      {/* Projects */}
      {tab === 'projects' && (
        <div className="card">
          <p className="section-title">🎵 Projects</p>
          {projects.length === 0
            ? <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text3)' }}><p>{isOwn ? 'You have no projects yet.' : 'No projects yet.'}</p>{isOwn && <button className="btn btn-brand btn-sm" style={{ marginTop: 10 }} onClick={() => router.push('/projects/new')}>Post a project</button>}</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {projects.map(p => (
                  <div key={p.id} onClick={() => router.push(`/projects/${p.id}`)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                      <span className={`badge ${(PROJECT_STATUSES[p.status] || PROJECT_STATUSES.open).color}`} style={{ fontSize: 10 }}>{(PROJECT_STATUSES[p.status] || PROJECT_STATUSES.open).label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.genre && <span className="badge badge-purple" style={{ fontSize: 11 }}>{p.genre}</span>}
                      {p.roles_needed?.slice(0, 3).map(r => <RoleBadge key={r} role={r} size="small" />)}
                    </div>
                  </div>
                ))}
              </div>}
        </div>
      )}

      {/* Video modal */}
      {selectedVideo && (
        <div onClick={() => setSelectedVideo(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card2)', borderRadius: 18, overflow: 'hidden', width: '90vw', maxWidth: 720 }}>
            {selectedVideo.status === 'ready'
              ? <iframe src={`https://iframe.videodelivery.net/${selectedVideo.cloudflare_video_id}`} style={{ width: '100%', aspectRatio: '16/9', border: 'none' }} allow="autoplay; fullscreen" allowFullScreen />
              : <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div><div className="spinner" /><p style={{ color: 'var(--text2)', textAlign: 'center', fontSize: 13 }}>Processing...</p></div></div>}
            <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15 }}>{selectedVideo.title}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVideo(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function VideoThumb({ video, isOwner, onPlay, onDelete }) {
  return (
    <div style={{ position: 'relative', background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {video.cloudflare_video_id && video.status === 'ready'
        ? <img src={`https://videodelivery.net/${video.cloudflare_video_id}/thumbnails/thumbnail.jpg`} alt={video.title} loading="lazy" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', cursor: 'pointer' }} onClick={onPlay} onError={e => e.target.style.display = 'none'} />
        : <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={onPlay}>{video.status === 'processing' ? <div className="spinner" style={{ margin: 0 }} /> : '🎬'}</div>}
      {video.status === 'ready' && (
        <div onClick={onPlay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(0,0,0,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = 'transparent' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'white' }}>▶</div>
        </div>
      )}
      <div style={{ padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{video.title}</span>
        {isOwner && <button onClick={onDelete} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, marginLeft: 6 }}>🗑</button>}
      </div>
    </div>
  )
}
