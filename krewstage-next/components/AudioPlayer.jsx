'use client'
import { useState, useRef, useEffect } from 'react'
import { formatDuration } from '../lib/constants'

export default function AudioPlayer({ url, title, genre, small = false }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    // Reset state when URL changes
    setPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    const onLoad = () => setDuration(Math.floor(audio.duration))
    const onTime = () => { setCurrentTime(Math.floor(audio.currentTime)); setProgress(audio.currentTime / audio.duration * 100) }
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrentTime(0) }
    audio.addEventListener('loadedmetadata', onLoad)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', onLoad)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [url])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  function seek(e) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    audio.currentTime = x * audio.duration
  }

  if (small) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', border: '1px solid var(--border)' }}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <button onClick={togglePlay}
        style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: 'white', marginLeft: playing ? 0 : 2 }}>{playing ? '⏸' : '▶'}</span>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div className="progress-bar" style={{ marginTop: 4, cursor: 'pointer' }} onClick={seek}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{formatDuration(currentTime)}</span>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '16px', border: '1px solid var(--border)' }}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        {/* Play button */}
        <button onClick={togglePlay}
          style={{ width: 44, height: 44, borderRadius: '50%', background: playing ? 'var(--brand-dim)' : 'var(--brand)', border: playing ? '1px solid var(--brand-border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
          <span style={{ fontSize: 18, color: playing ? 'var(--brand)' : 'white', marginLeft: playing ? 0 : 2 }}>{playing ? '⏸' : '▶'}</span>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
          {genre && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{genre}</div>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>
          {formatDuration(currentTime)} / {duration ? formatDuration(duration) : '--:--'}
        </div>
      </div>
      {/* Progress bar */}
      <div className="progress-bar" style={{ cursor: 'pointer', height: 6 }} onClick={seek}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
