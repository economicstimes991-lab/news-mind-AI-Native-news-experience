// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Login.jsx
//
// 3-STEP FLOW:
//   Step 1 → Login form (email + password)
//   Step 2 → Interest selection (pick topics you care about)
//   Step 3 → Dashboard  (controlled by App.jsx)
//
// All three steps share the same glass-card layout so the UI feels seamless.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail, Check, Sparkles } from 'lucide-react'

// ── All available interest topics ────────────────────────────────────────────
// Each maps to one or more NewsAPI categories (used later in news.js)
export const ALL_INTERESTS = [
  { id: 'business',   label: 'Business',    emoji: '💼', color: 'rgba(42,165,255,0.15)',   border: 'rgba(42,165,255,0.35)',   text: 'var(--accent-blue)'  },
  { id: 'technology', label: 'Technology',  emoji: '💻', color: 'rgba(6,214,245,0.12)',    border: 'rgba(6,214,245,0.35)',    text: 'var(--accent-cyan)'  },
  { id: 'startups',   label: 'Startups',    emoji: '🚀', color: 'rgba(16,220,138,0.12)',   border: 'rgba(16,220,138,0.35)',   text: 'var(--accent-green)' },
  { id: 'finance',    label: 'Finance',     emoji: '📊', color: 'rgba(255,179,71,0.12)',   border: 'rgba(255,179,71,0.35)',   text: 'var(--accent-amber)' },
  { id: 'ai',         label: 'AI & ML',     emoji: '🤖', color: 'rgba(139,92,246,0.14)',   border: 'rgba(139,92,246,0.40)',   text: '#a78bfa'             },
  { id: 'general',    label: 'World News',  emoji: '🌍', color: 'rgba(255,255,255,0.06)',  border: 'rgba(255,255,255,0.20)', text: 'var(--text-muted)'   },
  { id: 'science',    label: 'Science',     emoji: '🔬', color: 'rgba(34,211,238,0.12)',   border: 'rgba(34,211,238,0.35)',   text: '#22d3ee'             },
  { id: 'health',     label: 'Health',      emoji: '🏥', color: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.35)',   text: '#34d399'             },
]

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Login Form
// ─────────────────────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPass,  setFocusPass]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in both fields.'); return }
    if (!email.includes('@'))              { setError('Please enter a valid email address.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))   // simulate auth delay
    setLoading(false)
    onSuccess(email)   // pass email up so we can show it on step 2
  }

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#2aa5ff,#06d6f5)', boxShadow: '0 0 28px rgba(42,165,255,0.45)' }}>
          <Zap size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-[22px] text-white tracking-tight leading-none">NewsMind</h1>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent-blue)' }}>
            AI Platform
          </span>
        </div>
      </div>

      <h2 className="text-[26px] font-bold text-white leading-tight mb-1">Welcome back 👋</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to your account to continue</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Email Address
          </label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${focusEmail ? 'rgba(42,165,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: focusEmail ? '0 0 0 3px rgba(42,165,255,0.10)' : 'none',
            }}>
            <Mail size={16} style={{ color: focusEmail ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
              className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }}
              autoComplete="email" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Password</label>
            <button type="button" className="text-xs" style={{ color: 'var(--accent-blue)' }}>Forgot password?</button>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${focusPass ? 'rgba(42,165,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: focusPass ? '0 0 0 3px rgba(42,165,255,0.10)' : 'none',
            }}>
            <Lock size={16} style={{ color: focusPass ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
            <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)}
              className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }}
              autoComplete="current-password" />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{ color: 'var(--text-muted)' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm animate-fade-in"
            style={{ background: 'rgba(255,77,109,0.10)', border: '1px solid rgba(255,77,109,0.25)', color: 'var(--accent-red)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200 mt-2"
          style={{
            background: loading ? 'rgba(42,165,255,0.4)' : 'linear-gradient(135deg,#2aa5ff,#0570eb)',
            boxShadow: loading ? 'none' : '0 8px 28px rgba(42,165,255,0.35)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}>
          {loading
            ? <><div className="spinner" style={{ borderTopColor: '#fff' }} /> Signing in…</>
            : <>Sign In <ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="mt-6 p-3 rounded-xl text-center text-xs"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
        🎯 <strong className="text-white">Demo:</strong> Enter any email + password to log in
      </div>

      <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <button className="font-semibold" style={{ color: 'var(--accent-blue)' }}>Sign up free</button>
      </p>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Interest Selection
// ─────────────────────────────────────────────────────────────────────────────
function InterestPicker({ userEmail, onDone }) {
  // Start with 'business' and 'technology' pre-selected — good defaults
  const [selected, setSelected] = useState(new Set(['business', 'technology']))
  const [loading,  setLoading]  = useState(false)

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        // Don't allow deselecting if only 1 is left — need at least 1
        if (next.size === 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleDone = async () => {
    setLoading(true)
    // Save to localStorage so preferences survive page refresh
    const prefs = Array.from(selected)
    localStorage.setItem('newsmind_interests', JSON.stringify(prefs))
    await new Promise(r => setTimeout(r, 600))   // brief animation pause
    setLoading(false)
    onDone(prefs)
  }

  const firstName = userEmail.split('@')[0].split('.')[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#2aa5ff,#06d6f5)', boxShadow: '0 0 20px rgba(42,165,255,0.4)' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent-blue)' }}>
              Step 2 of 2
            </span>
          </div>
        </div>

        <h2 className="text-[24px] font-bold text-white leading-tight mb-2">
          What interests you, {displayName}? 👋
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Pick at least one topic. Your "For You" feed will be personalised based on your choices.
        </p>
      </div>

      {/* Interest grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {ALL_INTERESTS.map(interest => {
          const isOn = selected.has(interest.id)
          return (
            <button
              key={interest.id}
              onClick={() => toggle(interest.id)}
              className="relative flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all duration-200"
              style={{
                background : isOn ? interest.color : 'rgba(255,255,255,0.03)',
                border     : `1px solid ${isOn ? interest.border : 'rgba(255,255,255,0.07)'}`,
                boxShadow  : isOn ? `0 4px 20px ${interest.color}` : 'none',
                transform  : isOn ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (!isOn) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              onMouseLeave={e => { if (!isOn) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              {/* Emoji */}
              <span className="text-xl flex-shrink-0">{interest.emoji}</span>

              {/* Label */}
              <span className="font-semibold text-sm" style={{ color: isOn ? interest.text : 'var(--text-muted)' }}>
                {interest.label}
              </span>

              {/* Checkmark */}
              {isOn && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: interest.border }}>
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selection count */}
      <p className="text-xs text-center mb-4" style={{ color: 'var(--text-muted)' }}>
        {selected.size} topic{selected.size !== 1 ? 's' : ''} selected
      </p>

      {/* Continue button */}
      <button
        onClick={handleDone}
        disabled={loading || selected.size === 0}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200"
        style={{
          background : 'linear-gradient(135deg,#2aa5ff,#0570eb)',
          boxShadow  : '0 8px 28px rgba(42,165,255,0.35)',
          cursor     : loading ? 'not-allowed' : 'pointer',
          opacity    : loading ? 0.8 : 1,
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
      >
        {loading
          ? <><div className="spinner" style={{ borderTopColor: '#fff' }} /> Personalising your feed…</>
          : <>Start Reading <ArrowRight size={16} /></>}
      </button>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: Login wrapper — manages which step to show
// ─────────────────────────────────────────────────────────────────────────────
export default function Login({ onLogin }) {
  // step = 'login' | 'interests'
  const [step,      setStep]      = useState('login')
  const [userEmail, setUserEmail] = useState('')

  // Called when step 1 (login form) succeeds
  const handleLoginSuccess = (email) => {
    setUserEmail(email)
    setStep('interests')
  }

  // Called when step 2 (interests) is done
  // interests = ['business', 'technology', ...]
  const handleInterestsDone = (interests) => {
    onLogin(interests)   // tell App.jsx we're fully done → go to dashboard
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(42,165,255,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,214,245,0.06) 0%, transparent 70%)' }} />

      {/* Step indicator dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {['login', 'interests'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: step === s || (i === 0 && step === 'interests')
                  ? 'var(--accent-blue)'
                  : 'rgba(255,255,255,0.15)',
                boxShadow: step === s ? '0 0 8px var(--accent-blue)' : 'none',
                transform: step === s ? 'scale(1.3)' : 'scale(1)',
              }} />
            {i === 0 && (
              <div className="w-8 h-px"
                style={{ background: step === 'interests' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.12)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Main glass card */}
      <div
        className="relative w-full max-w-md animate-fade-in"
        style={{
          background    : 'rgba(13,20,32,0.90)',
          border        : '1px solid rgba(255,255,255,0.09)',
          borderRadius  : '28px',
          backdropFilter: 'blur(24px)',
          boxShadow     : '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(42,165,255,0.06)',
          padding       : '40px 36px',
          // Animate card when switching steps
          transition    : 'all 0.3s ease',
        }}
        key={step}   // changing key forces React to re-mount = fade-in animation
      >
        {step === 'login'
          ? <LoginForm     onSuccess={handleLoginSuccess}  />
          : <InterestPicker userEmail={userEmail} onDone={handleInterestsDone} />
        }
      </div>
    </div>
  )
}
