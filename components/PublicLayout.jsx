'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Avatar from './Avatar'
import { useNotifications } from '../hooks/useNotifications'
import NotificationsPanel from './NotificationsPanel'
import { useRef } from 'react'

const TABS = [
  { path: '/discover', label: 'Discover', icon: '🔍' },
  { path: '/projects', label: 'Projects', icon: '🎵' },
  { path: '/bands', label: 'Bands', icon: '🎸' },
  { path: '/venues', label: 'Venues', icon: '🏛️' },
  { path: '/messages', label: 'Messages', icon: '💬' },
]

export default function PublicLayout({ children }) {
  const { user, profile, loading, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => { setMenuOpen(false); setNotifOpen(false) }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    function h(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [menuOpen])

  const isActive = (p) => pathname === p || pathname?.startsWith(p + '/')

  return (
    <>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => router.push(user ? '/discover' : '/')} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--brand)', cursor: 'pointer', letterSpacing: '-0.3px', flexShrink: 0 }}>
          Krew<span style={{ color: 'var(--text2)', fontWeight: 400 }}>Stage</span>
        </div>

        <div style={{ display: 'flex', gap: 2, background: 'var(--bg3)', padding: 3, borderRadius: 11 }}>
          {TABS.filter(t => t.path !== '/messages' || user).map(tab => (
            <button key={tab.path} onClick={() => {
              if (!user && (tab.path === '/messages')) { router.push('/auth'); return }
              router.push(tab.path)
            }}
              style={{ padding: '7px 16px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', background: isActive(tab.path) ? 'var(--brand)' : 'transparent', color: isActive(tab.path) ? '#fff' : 'var(--text2)' }}>
              <span style={{ marginRight: 5 }}>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Hamburger — vizibil doar pe mobile */}
          <button
            className="show-mobile-flex"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false) }}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, position: 'relative' }}>
                  🔔
                  {unreadCount > 0 && (
                    <div style={{ position: 'absolute', top: -3, right: -3, background: 'var(--brand)', borderRadius: '50%', minWidth: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', border: '2px solid var(--bg)', padding: '0 3px' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </button>
                {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
              </div>
              <div ref={menuRef} style={{ position: 'relative' }}>
                <div onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false) }} style={{ cursor: 'pointer' }}>
                  <Avatar profile={profile} size={36} />
                </div>
                {menuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 44, background: 'var(--card2)', border: '1px solid var(--border2)', borderRadius: 12, padding: 8, minWidth: 190, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text2)', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                      {profile?.full_name || profile?.email || 'My Profile'}
                      {profile?.is_pro && <span className="badge badge-brand" style={{ marginLeft: 8, fontSize: 10 }}>PRO</span>}
                    </div>
                    {[{ label: '👤 My Profile', path: '/profile' }, { label: '✏️ Edit Profile', path: '/edit-profile' }, { label: '🎵 My Projects', path: '/projects' }].map(item => (
                      <button key={item.path} onClick={() => { router.push(item.path); setMenuOpen(false) }}
                        className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 2, border: 'none' }}>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6 }}>
                      <button onClick={async () => { await signOut(); router.push('/') }} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        🚪 Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => router.push('/auth')} style={{ background: 'transparent', border: '1px solid var(--border2)', borderRadius: 8, padding: '7px 16px', fontSize: 13, color: 'var(--text2)', cursor: 'pointer' }}>Log In</button>
              <button onClick={() => router.push('/auth?mode=register')} style={{ background: 'var(--brand)', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Sign Up</button>
            </div>
          )}
        </div>
      </nav>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--card2)', borderTop: '1px solid var(--border2)', borderRadius: '20px 20px 0 0', padding: '16px 16px 32px' }}>
            <div style={{ width: 36, height: 4, background: 'var(--border2)', borderRadius: 2, margin: '0 auto 20px' }} />
            {TABS.filter(t => t.path !== '/messages' || user).map(tab => (
              <button key={tab.path} onClick={() => {
                if (!user && tab.path === '/messages') { router.push('/auth'); return }
                router.push(tab.path)
              }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 16, fontWeight: 500, marginBottom: 4, transition: 'all 0.15s', background: isActive(tab.path) ? 'var(--brand-dim)' : 'transparent', color: isActive(tab.path) ? 'var(--brand)' : 'var(--text)' }}>
                <span style={{ fontSize: 20 }}>{tab.icon}</span>{tab.label}
              </button>
            ))}
            {!user && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => router.push('/auth')} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border2)', borderRadius: 10, padding: '11px', fontSize: 14, color: 'var(--text2)', cursor: 'pointer' }}>Log In</button>
                <button onClick={() => router.push('/auth?mode=register')} style={{ flex: 1, background: 'var(--brand)', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </>
  )
}
