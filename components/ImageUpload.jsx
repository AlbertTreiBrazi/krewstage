'use client'
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function ImageUpload({
  currentUrl,
  onUploaded,
  storagePath,
  bucket = 'avatars',
  height = 160,
  label = 'Add photo',
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || null)
  const [hovered, setHovered] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select a JPG, PNG or WebP image'); return }
    if (file.size > 8 * 1024 * 1024) { alert('Max 8MB'); return }
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase().replace('jpeg', 'jpg')
      const path = `${storagePath}.${ext}`
      const { error: ue } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type })
      if (ue) throw ue
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      onUploaded?.(publicUrl)
    } catch (err) {
      alert('Upload error: ' + err.message)
      setPreview(currentUrl || null)
    } finally { setUploading(false) }
  }

  return (
    <div
      onClick={() => !uploading && fileRef.current?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 12,
        overflow: 'hidden',
        background: preview ? 'transparent' : 'var(--bg3)',
        border: `2px dashed ${dragOver ? 'var(--brand)' : preview ? 'transparent' : 'var(--border2)'}`,
        cursor: uploading ? 'wait' : 'pointer',
        transition: 'border-color 0.2s',
      }}>

      {/* Image or empty state */}
      {preview
        ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>JPG, PNG, WebP · max 8MB</div>
          </div>}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: uploading ? 'rgba(0,0,0,0.55)' : hovered ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
        pointerEvents: 'none',
      }}>
        {uploading
          ? <div style={{ textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'imgSpin 0.8s linear infinite', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>Uploading...</div>
            </div>
          : (hovered || !preview) && (
              <div style={{ background: 'rgba(255,107,53,0.92)', borderRadius: 10, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
                <span style={{ fontSize: 16 }}>📷</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{preview ? 'Change photo' : label}</span>
              </div>
            )}
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
      <style>{`@keyframes imgSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
