'use client'
import { getAvatarGradient, getInitials } from '../lib/constants'

export default function Avatar({ profile, size = 40, style = {} }) {
  const sz = typeof size === 'number' ? size : size
  const fontSize = sz * 0.37

  return (
    <div className="avatar" style={{
      width: sz, height: sz,
      background: profile?.avatar_url ? 'transparent' : getAvatarGradient(profile?.id),
      fontSize, color: 'white', flexShrink: 0, border: '2px solid var(--border2)',
      ...style
    }}>
      {profile?.avatar_url
        ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        : <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{getInitials(profile?.full_name)}</span>
      }
    </div>
  )
}
