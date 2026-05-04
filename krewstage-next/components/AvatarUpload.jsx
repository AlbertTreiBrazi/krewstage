'use client'
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getAvatarGradient, getInitials } from '../lib/constants'

export default function AvatarUpload({ userId, currentUrl, fullName, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || null)
  const fileRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`
      const { error: ue } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
      if (ue) throw ue
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)
      onUploaded?.(publicUrl)
    } catch (err) { alert('Upload error: ' + err.message); setPreview(currentUrl || null) }
    finally { setUploading(false) }
  }

  const grad = getAvatarGradient(userId)
  const init = getInitials(fullName)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => fileRef.current?.click()}
        style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', background: preview ? 'transparent' : grad, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid var(--border2)' }}>
        {preview
          ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 30, color: 'white' }}>{init}</span>}
      </div>
      <div onClick={() => fileRef.current?.click()}
        style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: uploading ? 'var(--bg3)' : 'var(--brand)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13 }}>
        {uploading ? <div style={{ width: 11, height: 11, border: '2px solid var(--text3)', borderTopColor: 'var(--text)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : '📷'}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFile} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
