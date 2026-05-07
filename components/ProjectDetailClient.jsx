'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { sanitizeUrl } from '../lib/utils'
import { createNotification } from '../hooks/useNotifications'
import { PROJECT_STATUSES, PROJECT_TYPES, LOCATION_TYPES, getRoleInfo, timeAgo } from '../lib/constants'
import Avatar from './Avatar'
import RoleBadge from './RoleBadge'
import AudioPlayer from './AudioPlayer'

export default function ProjectDetailClient({ projectId }) {
  // projectId passed as prop
  const { user, profile } = useAuth()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [applications, setApplications] = useState([])
  const [myApplication, setMyApplication] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [appForm, setAppForm] = useState({ role_offered: '', message: '', demo_url: '' })
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const isOwner = project?.owner_id === user?.id
  const isCollaborator = project?.collaborator_ids?.includes(user?.id)
  const canChat = isOwner || isCollaborator
  const status = project ? (PROJECT_STATUSES[project.status] || PROJECT_STATUSES.open) : null
  const projType = project ? PROJECT_TYPES.find(pt => pt.id === project.project_type) : null
  const locBadge = !project ? null : project.location_type === 'remote'
    ? { icon: '🌐', label: 'Remote', cls: 'badge-blue' }
    : project.location_type === 'local'
    ? { icon: '📍', label: project.location_city || 'Local', cls: 'badge-amber' }
    : { icon: '🔄', label: 'Remote or Local', cls: 'badge-gray' }

  // Tab default e setat dupa ce proiectul se incarca (project incepe null)
  const [tab, setTab] = useState('details')
  const tabInitialized = useRef(false)

  useEffect(() => {
    if (project && !tabInitialized.current) {
      tabInitialized.current = true
      if (isOwner) setTab('applications')
      else if (canChat) setTab('chat')
      else setTab('details')
    }
  }, [project, isOwner, canChat])

  useEffect(() => { fetchAll() }, [projectId])

  useEffect(() => {
    if (!canChat) return
    fetchMessages()
    const ch = supabase.channel(`proj-chat-${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public',
        table: 'project_messages',
        filter: `project_id=eq.${projectId}`
      }, () => fetchMessages())  // refetch complet ca sa avem si sender profile join
      .subscribe()
    return () => ch.unsubscribe()
  }, [projectId, canChat])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  async function fetchAll() {
    setLoading(true)
    try {
      const [{ data: proj }, { data: apps }] = await Promise.all([
        supabase.from('projects').select('*, owner:profiles!projects_owner_id_fkey(id, full_name, avatar_url, city, roles)').eq('id', projectId).single(),
        supabase.from('project_applications').select('*, applicant:profiles!project_applications_applicant_id_fkey(id, full_name, avatar_url, roles, city)').eq('project_id', projectId)
      ])
      setProject(proj || null)
      setApplications(apps || [])
      setMyApplication((apps || []).find(a => a.applicant_id === user?.id) || null)
    } catch (err) {
      console.error('fetchAll error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchMessages() {
    const { data } = await supabase.from('project_messages').select('*, sender:profiles!project_messages_sender_id_fkey(id, full_name, avatar_url)').eq('project_id', projectId).order('created_at')
    setChatMessages(data || [])
  }

  async function submitApplication() {
    if (!appForm.role_offered) { alert('Select a role'); return }
    setApplying(true)
    try {
      const { error } = await supabase.from('project_applications').insert({ project_id: projectId, applicant_id: user.id, role_offered: appForm.role_offered, message: appForm.message, demo_url: appForm.demo_url, status: 'pending' })
      if (error) throw error
      await createNotification({ userId: project.owner_id, type: 'project_application', title: `New application for "${project.title}"`, body: `${profile?.full_name || 'Someone'} applied as ${getRoleInfo(appForm.role_offered).label}`, link: `/projects/${projectId}`, actorId: user.id })
      fetchAll()
      setAppForm({ role_offered: '', message: '', demo_url: '' })
    } catch (err) { alert(err.message) }
    finally { setApplying(false) }
  }

  async function handleApplication(appId, applicantId, accept) {
    const newStatus = accept ? 'accepted' : 'rejected'
    await supabase.from('project_applications').update({ status: newStatus }).eq('id', appId)
    if (accept) {
      await supabase.from('projects').update({ collaborator_ids: [...(project.collaborator_ids || []), applicantId] }).eq('id', projectId)
      await createNotification({ userId: applicantId, type: 'application_accepted', title: `You've been accepted to "${project.title}"!`, body: 'You now have access to the project chat.', link: `/projects/${projectId}`, actorId: user.id })
    } else {
      await createNotification({ userId: applicantId, type: 'application_rejected', title: `Update on "${project.title}"`, body: 'Your application was not accepted this time.', link: `/projects/${projectId}`, actorId: user.id })
    }
    fetchAll()
  }

  async function updateStatus(newStatus) {
    await supabase.from('projects').update({ status: newStatus }).eq('id', projectId)

    // Notifica toti colaboratorii acceptati
    const collaboratorIds = project.collaborator_ids || []
    if (collaboratorIds.length > 0) {
      const isCompleted = newStatus === 'completed'
      const isCancelled = newStatus === 'cancelled'
      if (isCompleted || isCancelled) {
        const title = isCompleted
          ? `"${project.title}" has been completed!`
          : `"${project.title}" has been cancelled`
        const body = isCompleted
          ? 'Congratulations! The project you collaborated on is now finished.'
          : 'The project owner has cancelled this project.'
        await Promise.all(collaboratorIds.map(uid =>
          createNotification({
            userId: uid,
            type: 'project_completed',
            title,
            body,
            link: `/projects/${projectId}`,
            actorId: user.id
          })
        ))
      }
    }

    fetchAll()
  }

  async function sendMessage() {
    if (!newMsg.trim() || sending) return
    setSending(true)
    const content = newMsg.trim()
    setNewMsg('')
    await supabase.from('project_messages').insert({ project_id: projectId, sender_id: user.id, content })
    setSending(false)
  }

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />
  if (!project) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text3)' }}>Project not found</div>

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => router.push('/projects')} style={{ marginBottom: 20 }}>← Back to projects</button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        {project.image_url && (
          <div style={{ height: 220, overflow: 'hidden' }}>
            <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {projType && <span className="badge badge-brand">{projType.icon} {projType.label}</span>}
              {locBadge && <span className={`badge ${locBadge.cls}`}>{locBadge.icon} {locBadge.label}</span>}
              {project.genre && <span className="badge badge-purple">{project.genre}</span>}
              {project.mood && <span className="badge badge-gray">{project.mood}</span>}
              <span className={`badge ${status.color}`}>{status.label}</span>
              {project.applications_count > 0 && <span className="badge badge-blue">👥 {project.applications_count} applicants</span>}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, lineHeight: 1.3 }}>{project.title}</h1>
            {project.description && <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{project.description}</p>}
          </div>
          {isOwner && (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column' }}>
              {project.status === 'open' && <button className="btn btn-ghost btn-sm" onClick={() => updateStatus('in_progress')}>Mark In Progress</button>}
              {project.status === 'in_progress' && <button className="btn btn-ghost-brand btn-sm" onClick={() => updateStatus('completed')}>✓ Mark Completed</button>}
              {project.status !== 'cancelled' && <button className="btn btn-danger btn-sm" onClick={() => updateStatus('cancelled')}>Cancel</button>}
            </div>
          )}
        </div>

        {/* Owner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <Avatar profile={project.owner} size={38} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--brand)' }} onClick={() => router.push(`/profile/${project.owner.id}`)}>{project.owner?.full_name}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{project.owner?.city} · posted {timeAgo(project.created_at)}</div>
          </div>
        </div>
        </div>
      </div>

      {/* Roles needed */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="section-title">Looking for</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.roles_needed?.map(r => <RoleBadge key={r} role={r} />)}
        </div>
      </div>

      {/* Demo audio */}
      {project.demo_audio_url && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p className="section-title">Demo</p>
          <AudioPlayer url={project.demo_audio_url} title="Project demo" genre={project.genre} />
        </div>
      )}

      {/* Reference links */}
      {project.reference_links?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p className="section-title">Reference tracks</p>
          {project.reference_links.filter(l => l).map((link, i) => (
            <a key={i} href={sanitizeUrl(link)} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', color: 'var(--brand)', fontSize: 14, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              🔗 {link}
            </a>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, width: 'fit-content', marginBottom: 16 }}>
        {[
          ['details', 'Apply', !isOwner && !myApplication && project.status === 'open' && !!user],
          ['applications', `Applications (${applications.length})`, isOwner],
          ['chat', 'Project Chat', canChat],
        ].filter(([,, show]) => show !== false).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '7px 18px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: tab === t ? 'var(--brand)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Apply form */}
      {tab === 'details' && !isOwner && (
        <div className="card">
          {!user ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Want to collaborate on this project?</p>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>Create a free account to apply and connect with musicians.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-brand" onClick={() => router.push('/auth?mode=register')}>Sign up free</button>
                <button className="btn btn-ghost" onClick={() => router.push('/auth')}>Log in</button>
              </div>
            </div>
          ) : myApplication ? (
            <div className="alert alert-info">
              You've already applied as <strong>{getRoleInfo(myApplication.role_offered).label}</strong> — status: <strong>{myApplication.status}</strong>
            </div>
          ) : project.status !== 'open' ? (
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>This project is no longer accepting applications.</p>
          ) : (
            <>
              <p className="section-title">Apply to this project</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label>Your role *</label>
                  <select value={appForm.role_offered} onChange={e => setAppForm(p => ({ ...p, role_offered: e.target.value }))}>
                    <option value="">Select your role</option>
                    {project.roles_needed?.map(r => <option key={r} value={r}>{getRoleInfo(r).icon} {getRoleInfo(r).label}</option>)}
                  </select>
                </div>
                <div><label>Message</label><textarea rows={3} placeholder="Tell them about your experience and why you'd be a great fit..." value={appForm.message} onChange={e => setAppForm(p => ({ ...p, message: e.target.value }))} style={{ resize: 'none' }} /></div>
                <div><label>Demo link (optional)</label><input placeholder="SoundCloud, YouTube, or any audio link..." value={appForm.demo_url} onChange={e => setAppForm(p => ({ ...p, demo_url: e.target.value }))} /></div>
                <button className="btn btn-brand" onClick={submitApplication} disabled={applying || !appForm.role_offered} style={{ justifyContent: 'center' }}>
                  {applying ? 'Sending...' : '🎵 Apply now'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Applications list (owner) */}
      {tab === 'applications' && isOwner && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {applications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>No applications yet. Share your project!</div>
          ) : applications.map(app => (
            <div key={app.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                <Avatar profile={app.applicant} size={42} style={{ cursor: 'pointer' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, cursor: 'pointer', color: 'var(--brand)' }} onClick={() => router.push(`/profile/${app.applicant.id}`)}>{app.applicant?.full_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{app.applicant?.city} · applied {timeAgo(app.created_at)}</div>
                  <div style={{ marginTop: 6 }}><RoleBadge role={app.role_offered} size="small" /></div>
                </div>
                <span className={`badge ${app.status === 'accepted' ? 'badge-green' : app.status === 'rejected' ? 'badge-gray' : 'badge-amber'}`}>{app.status}</span>
              </div>
              {app.message && <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12, background: 'var(--bg3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>{app.message}</p>}
              {app.demo_url && <a href={sanitizeUrl(app.demo_url)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', marginBottom: 12 }}>🎵 Listen to demo</a>}
              {app.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost-brand btn-sm" onClick={() => handleApplication(app.id, app.applicant_id, true)}>✓ Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleApplication(app.id, app.applicant_id, false)}>✗ Decline</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Project chat */}
      {tab === 'chat' && canChat && (
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 500 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14 }}>Project Chat</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatMessages.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, margin: 'auto' }}>No messages yet. Start the conversation!</div>}
            {chatMessages.map(msg => {
              const mine = msg.sender_id === user?.id
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                  {!mine && <Avatar profile={msg.sender} size={28} />}
                  <div style={{ maxWidth: '65%' }}>
                    {!mine && <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 3 }}>{msg.sender?.full_name}</div>}
                    <div style={{ padding: '9px 13px', borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: mine ? 'var(--brand)' : 'var(--bg3)', color: mine ? 'white' : 'var(--text)', borderBottomRightRadius: mine ? 3 : 12, borderBottomLeftRadius: mine ? 12 : 3 }}>{msg.content}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3, textAlign: mine ? 'right' : 'left' }}>{timeAgo(msg.created_at)}</div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="Message the team... (Enter to send)" rows={1} style={{ flex: 1, resize: 'none', minHeight: 40 }} />
            <button onClick={sendMessage} disabled={!newMsg.trim() || sending}
              style={{ width: 40, height: 40, borderRadius: 9, background: newMsg.trim() ? 'var(--brand)' : 'var(--bg3)', border: 'none', cursor: newMsg.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, transition: 'all 0.2s' }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
