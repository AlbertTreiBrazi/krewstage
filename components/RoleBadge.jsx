'use client'
import { getRoleInfo } from '../lib/constants'

export default function RoleBadge({ role, size = 'normal' }) {
  const info = getRoleInfo(role)
  const small = size === 'small'
  return (
    <span className={`badge ${info.css}`} style={{ fontSize: small ? 11 : 12, gap: 4 }}>
      <span style={{ fontSize: small ? 11 : 13 }}>{info.icon}</span>
      {info.label}
    </span>
  )
}
