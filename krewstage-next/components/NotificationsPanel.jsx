'use client'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '../hooks/useNotifications'
import { timeAgo } from '../lib/constants'
import Avatar from './Avatar'

const TYPE_ICONS = {
  message: '💬',
  project_application: '🎵',
  application_accepted: '✅',
  application_rejected: '❌',
  band_invite: '🎸',
  new_follower: '👤',
  project_completed: '🏆',
}

export default function NotificationsPanel({ onClose }) {
  const { notifications, unreadCount, markAllRead, markRead, deleteNotif } = useNotifications()
  const router = useRouter()
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  function handleClick(n) {
    markRead(n.id)
    if (n.link) router.push(n.link)
    onClose()
  }

  return (
    <div ref={ref} style={{
      position: 'absolute', right: 0, top: 50,
      background: 'var(--card2)', border: '1px solid var(--border2)',
      borderRadius: 16, width: 330, zIndex: 300,
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden'
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14 }}>
          Notifications {unreadCount > 0 && <span style={{ color: 'var(--brand)', fontSize: 12 }}>({unreadCount})</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--brand)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
            Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
            No notifications yet
          </div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => handleClick(n)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
              borderBottom: '1px solid var(--border)', cursor: 'pointer',
              background: n.read ? 'transparent' : 'rgba(255,107,53,0.05)',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(255,107,53,0.05)'}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
              {TYPE_ICONS[n.type] || '🔔'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: 'var(--text)', lineHeight: 1.4 }}>{n.title}</div>
              {n.body && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</div>}
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{timeAgo(n.created_at)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand)' }} />}
              <button onClick={e => { e.stopPropagation(); deleteNotif(n.id) }}
                style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
