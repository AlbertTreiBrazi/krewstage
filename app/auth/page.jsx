'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { ROLES, GENRES, EXPERIENCE_LEVELS } from '../../lib/constants'
import LoadingScreen from '../../components/LoadingScreen'

function AuthPageInner() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    email: '', password: '', full_name: '', city: '', country: 'US',
    roles: [], genres: [], experience_level: 'intermediate', bio: ''
  })

  const up = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const toggleArr = (f, v) => setForm(p => ({ ...p, [f]: p[f].includes(v) ? p[f].filter(x => x !== v) : [...p[f], v] }))

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try { await signIn(form.email, form.password); router.push('/discover') }
    catch (err) { setError(err.message === 'Invalid login credentials' ? 'Wrong email or password' : err.message) }
    finally { setLoading(false) }
  }

  async function handleRegister() {
    setError(''); setLoading(true)
    try {
      await signUp(form.email, form.password, {
        full_name: form.full_name, city: form.city, country: form.country,
        roles: form.roles, genres: form.genres,
        experience_level: form.experience_level, bio: form.bio,
      })
      router.push('/discover')
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
        setError('This email is already in use. Try signing in instead.')
      } else {
        setError(msg)
      }
    }
    finally { setLoading(false) }
  }

  const chipStyle = (active, color = 'var(--brand)', bg = 'var(--brand-dim)', border = 'var(--brand-border)') => ({
    padding: '7px 15px', borderRadius: 100, fontSize: 13, cursor: 'pointer',
    border: `1px solid ${active ? border : 'var(--border2)'}`,
    background: active ? bg : 'transparent', color: active ? color : 'var(--text2)',
    fontFamily: 'DM Sans,sans-serif', transition: 'all 0.15s'
  })

  const STEPS = ['Account', 'Your Role', 'Your Music']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 34, color: 'var(--brand)' }}>
            Krew<span style={{ color: 'var(--text2)', fontWeight: 400 }}>Stage</span>
          </div>
          <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: 14 }}>Find collaborators. Finish songs. Start bands.</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 11, padding: 3, marginBottom: 24 }}>
          {[['login', 'Sign in'], ['register', 'Create account']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setStep(1); setError('') }}
              style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 500, fontSize: 14, transition: 'all 0.2s', background: mode === m ? 'var(--brand)' : 'transparent', color: mode === m ? '#fff' : 'var(--text2)' }}>
              {label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => up('email', e.target.value)} required /></div>
            <div><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => up('password', e.target.value)} required /></div>
            <button type="submit" className="btn btn-brand" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        {/* REGISTER */}
        {mode === 'register' && (
          <>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 100, background: i + 1 <= step ? 'var(--brand)' : 'var(--border2)', transition: 'background 0.3s' }} />
                  <div style={{ fontSize: 11, color: i + 1 <= step ? 'var(--brand)' : 'var(--text3)', marginTop: 5, textAlign: 'center' }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Step 1 — Account */}
            {step === 1 && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div><label>Full name</label><input placeholder="Alex Johnson" value={form.full_name} onChange={e => up('full_name', e.target.value)} /></div>
                <div><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => up('email', e.target.value)} /></div>
                <div><label>Password (min 8 characters)</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => up('password', e.target.value)} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><label>City</label><input placeholder="New York" value={form.city} onChange={e => up('city', e.target.value)} /></div>
                  <div><label>Country</label>
                    <select value={form.country} onChange={e => up('country', e.target.value)}>
                      {[['US','United States'],['GB','UK'],['RO','Romania'],['DE','Germany'],['FR','France'],['ES','Spain'],['IT','Italy'],['BR','Brazil'],['CA','Canada'],['AU','Australia'],['NL','Netherlands'],['SE','Sweden'],['PL','Poland'],['Other','Other']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn btn-brand" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                  disabled={!form.full_name || !form.email || form.password.length < 8}
                  onClick={() => { if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }; setError(''); setStep(2) }}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 — Roles */}
            {step === 2 && (
              <div className="card">
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14, display: 'block' }}>What's your role in music?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {ROLES.map(r => (
                    <button key={r.id} onClick={() => toggleArr('roles', r.id)}
                      style={chipStyle(form.roles.includes(r.id))}>
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
                {form.roles.includes('venue') && (
                  <div className="alert alert-info" style={{ fontSize: 12, marginBottom: 16 }}>
                    🏛️ You selected Venue — after registering, go to <strong>Edit Profile → Venue</strong> to add your venue name, type and capacity.
                  </div>
                )}
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, display: 'block' }}>Experience level</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {EXPERIENCE_LEVELS.map(l => (
                    <button key={l.id} onClick={() => up('experience_level', l.id)}
                      style={{ ...chipStyle(form.experience_level === l.id), flex: 1, flexDirection: 'column', padding: '10px 8px', borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{l.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{l.desc}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button className="btn btn-brand" onClick={() => setStep(3)} disabled={form.roles.length === 0} style={{ flex: 2, justifyContent: 'center' }}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Music */}
            {step === 3 && (
              <div className="card">
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, display: 'block' }}>Genres you work with</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                  {GENRES.map(g => (
                    <button key={g} onClick={() => toggleArr('genres', g)}
                      style={chipStyle(form.genres.includes(g), '#c084fc', 'var(--purple-dim)', 'rgba(168,85,247,0.3)')}>
                      {g}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label>Short bio (optional)</label>
                  <textarea rows={3} placeholder="I produce lo-fi beats and looking for vocalists to complete my EP..." value={form.bio} onChange={e => up('bio', e.target.value)} style={{ resize: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button className="btn btn-brand" onClick={handleRegister} disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                    {loading ? 'Creating account...' : '🎤 Join KrewStage'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthPageInner />
    </Suspense>
  )
}
