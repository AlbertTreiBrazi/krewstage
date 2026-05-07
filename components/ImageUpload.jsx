'use client'
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Component reutilizabil pentru upload imagini
// bucket: 'avatars' (existent) — folosit pentru toate pozele
// storagePath: calea in bucket, ex: `${userId}/cover`
// currentUrl: URL-ul curent al imaginii
// onUploaded: callback cu noul URL
// aspectRatio: 'cover' (16:9 banner) | 'square' (1:1) | 'project' (3:2)
// label: textul butonului

export default function ImageUpload({ 
  userId, 
  currentUrl, 
  onUploaded, 
  storagePath,
  bucket = 'avatars',
  aspectRatio = 'cover',
  label = 'Upload photo',
  placeholder = null,
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const dimensions = {
    cover:   { width: '100%', paddingBottom: '33%', minHeight: 120 },
    square:  { width: 120, height: 120, paddingBottom: undefined },
    project: { width: '100%', paddingBottom: '56%', minHeight: 160 },
  }[aspectRatio] || { width: '100%', paddingBottom: '33%' }

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Selectează o imagine (JPG, PNG, WebP)'); return }
    if (file.size > 8 * 1024 * 1024) { alert('Imaginea trebuie să fie sub 8MB'); return }

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `${storagePath}.${ext}`
      const { error: ue } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type })
      if (ue) throw ue
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      onUploaded?.(publicUrl)
    } catch (err) {
      alert('Upload error: ' + err.message)
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
    }
  }

  function onInputChange(e) { handleFile(e.target.files?.[0]) }
  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const isSquare = aspectRatio === 'square'

  return (
    <div
      onClick={() => !uploading && fileRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      style={{
        position: 'relative',
        width: isSquare ? dimensions.width : '100%',
        height: isSquare ? dimensions.height : undefined,
        paddingBottom: isSquare ? undefined : dimensions.paddingBottom,
        borderRadius: isSquare ? '50%' : 14,
        overflow: 'hidden',
        background: preview ? 'transparent' : 'var(--bg3)',
        border: `2px dashed ${dragOver ? 'var(--brand)' : preview ? 'transparent' : 'var(--border2)'}`,
        cursor: uploading ? 'wait' : 'pointer',
        transition: 'border-color 0.2s',
        flexShrink: 0,
      }}>

      {/* Imagine sau placeholder */}
      <div style={{
        position: isSquare ? 'absolute' : 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {preview ? (
          <img
            src={preview}
            alt="cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : placeholder ? (
          placeholder
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>JPG, PNG, WebP · max 8MB</div>
          </div>
        )}
      </div>

      {/* Overlay hover cu camera icon */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: uploading ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
        onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = 'rgba(0,0,0,0.45)' }}
        onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = 'rgba(0,0,0,0)' }}>
        {uploading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 28, height: 28, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>Uploading...</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', opacity: 0, transition: 'opacity 0.2s' }}
            ref={el => {
              if (el) {
                el.parentElement.onmouseenter = () => el.style.opacity = 1
                el.parentElement.onmouseleave = () => el.style.opacity = 0
              }
            }}>
            <div style={{ background: 'rgba(255,107,53,0.9)', borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📷</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{preview ? 'Change photo' : label}</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
