'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { createNotification } from '../../hooks/useNotifications'
import { timeAgo } from '../../lib/constants'
import Avatar from '../../components/Avatar'

function MessagesPageInner() {
  const { user, profile: myProfile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [otherProfile, setOtherProfile] = useState(null)
  const [messages, setMessages] = useState([])
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [convSearch, setConvSearch] = useState('')
  const messagesEndRef = useRef(null)
  const channelRef = useRef(null)

  useEffect(() => {
    fetchConversations()

    // Realtime: conversatie noua sau actualizata (mesaj nou)
    const ch = supabase.channel(`convs-${user.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'conversations',
        filter: `participant_a=eq.${user.id}`
      }, () => fetchConversations())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'conversations',
        filter: `participant_b=eq.${user.id}`
      }, () => fetchConversations())
      .subscribe()

    return () => ch.unsubscribe()
  }, [])
  useEffect(() => { const id = searchParams.get('conv'); if (id) setSelectedConv(id) }, [searchParams])

  useEffect(() => {
    if (!selectedConv) return
    fetchMessages(selectedConv)
    loadOtherProfile(selectedConv)
    subscribeToMessages(selectedConv)
    return () => channelRef.current?.unsubscribe()
  }, [selectedConv])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function fetchConversations() {
    const { data } = await supabase.from('conversations')
      .select('*, messages(content, created_at, sender_id), pa:profiles!conversations_participant_a_fkey(id, full_name, avatar_url), pb:profiles!conversations_participant_b_fkey(id, full_name, avatar_url)')
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order('updated_at', { ascending: false })
      .limit(50)
    // Sortam mesajele client-side pentru preview ultimului mesaj
    const sorted = (data || []).map(c => ({
      ...c,
      messages: (c.messages || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 1)
    }))
    setConversations(sorted)
  }

  const MSGS_PER_PAGE = 50

  async function fetchMessages(convId, loadMore = false) {
    const currentCount = loadMore ? messages.length : 0
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: false })
      .range(currentCount, currentCount + MSGS_PER_PAGE - 1)
    const fetched = (data || []).reverse()
    if (loadMore) {
      setMessages(prev => [...fetched, ...prev])
    } else {
      setMessages(fetched)
    }
    setHasMoreMessages((data || []).length === MSGS_PER_PAGE)
  }

  async function loadOtherProfile(convId) {
    const { data: conv } = await supabase.from('conversations').select('participant_a, participant_b').eq('id', convId).single()
    if (!conv) return
    const otherId = conv.participant_a === user.id ? conv.participant_b : conv.participant_a
    const { data } = await supabase.from('profiles').select('*').eq('id', otherId).single()
    setOtherProfile(data)
  }

  function subscribeToMessages(convId) {
    channelRef.current?.unsubscribe()
    channelRef.current = supabase.channel(`msgs-${convId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${convId}`
      }, () => fetchMessages(convId))  // refetch cu join complet
      .subscribe()
  }

  async function sendMessage() {
    if (!newMsg.trim() || !selectedConv || sending) return
    setSending(true)
    const content = newMsg.trim(); setNewMsg('')
    const { error } = await supabase.from('messages').insert({ conversation_id: selectedConv, sender_id: user.id, content })
    if (!error) {
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', selectedConv)
      if (otherProfile) {
        await createNotification({ userId: otherProfile.id, type: 'message', title: `New message from ${myProfile?.full_name || 'someone'}`, body: content.slice(0, 60) + (content.length > 60 ? '...' : ''), link: `/messages?conv=${selectedConv}`, actorId: user.id })
      }
      fetchConversations()
    }
    setSending(false)
  }

  function getOther(conv) { return conv.participant_a === user.id ? conv.pb : conv.pa }
  function getLastMsg(conv) {
    const last = conv.messages?.[0]
    if (!last) return 'No messages yet'
    return last.content.length > 40 ? last.content.slice(0, 40) + '...' : last.content
  }

  const filteredConvs = conversations.filter(c => {
    if (!convSearch.trim()) return true
    const other = getOther(c)
    return other?.full_name?.toLowerCase().includes(convSearch.toLowerCase())
  })

  return (
    <div className="messages-layout" style={{ maxWidth: 1100, margin: '0 auto', padding: '24px', height: 'calc(100vh - 80px)', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14 }}>

      {/* Conversations panel */}
      <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Messages</h3>
          <input placeholder="Search conversations..." value={convSearch} onChange={e => setConvSearch(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvs.length === 0
            ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No conversations yet.<br />Message a musician from Discover!</div>
            : filteredConvs.map((conv, i) => {
                const other = getOther(conv)
                const active = selectedConv === conv.id
                return (
                  <div key={conv.id} onClick={() => setSelectedConv(conv.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: active ? 'var(--bg3)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}>
                    <Avatar profile={other} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{other?.full_name || 'User'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLastMsg(conv)}</div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{timeAgo(conv.updated_at)}</span>
                  </div>
                )
              })}
        </div>
      </div>

      {/* Chat panel */}
      <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selectedConv ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', gap: 12 }}>
            <div style={{ fontSize: 48 }}>💬</div>
            <p style={{ fontSize: 14 }}>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              {otherProfile && <>
                <Avatar profile={otherProfile} size={40} style={{ cursor: 'pointer' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer', color: 'var(--brand)' }} onClick={() => router.push(`/profile/${otherProfile.id}`)}>{otherProfile.full_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{[otherProfile.city, otherProfile.country].filter(Boolean).join(', ')}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/profile/${otherProfile.id}`)}>View profile</button>
              </>}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hasMoreMessages && (
                <div style={{ textAlign: 'center', paddingBottom: 8 }}>
                  <button onClick={() => fetchMessages(selectedConv, true)}
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 16px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer' }}>
                    ↑ Mesaje mai vechi
                  </button>
                </div>
              )}
              {messages.map(msg => {
                const mine = msg.sender_id === user.id
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '65%' }}>
                      <div style={{ padding: '9px 13px', borderRadius: 14, fontSize: 14, lineHeight: 1.5, background: mine ? 'var(--brand)' : 'var(--bg3)', color: mine ? 'white' : 'var(--text)', borderBottomRightRadius: mine ? 3 : 14, borderBottomLeftRadius: mine ? 14 : 3 }}>{msg.content}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3, textAlign: mine ? 'right' : 'left' }}>{timeAgo(msg.created_at)}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea value={newMsg} onChange={e => setNewMsg(e.target.value.slice(0, 2000))} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} maxLength={2000}
                placeholder="Type a message... (Enter to send)" rows={1} style={{ flex: 1, resize: 'none', minHeight: 40, maxHeight: 120 }} />
              <button onClick={sendMessage} disabled={!newMsg.trim() || sending}
                style={{ width: 42, height: 42, borderRadius: 10, background: newMsg.trim() ? 'var(--brand)' : 'var(--bg3)', border: 'none', cursor: newMsg.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, transition: 'all 0.2s', color: 'white' }}>
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="spinner" />}>
      <MessagesPageInner />
    </Suspense>
  )
}
