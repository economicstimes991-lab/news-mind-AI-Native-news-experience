import { useState } from 'react'
import { Moon, Sun, Bell, Shield, Globe, Layout, LogOut, ChevronRight, User } from 'lucide-react'

// A single toggle row component
function ToggleRow({ icon: Icon, label, description, checked, onChange, color = 'var(--accent-blue)' }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
          )}
        </div>
      </div>

      {/* Toggle switch */}
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider" />
      </label>
    </div>
  )
}

// A clickable list row
function OptionRow({ icon: Icon, label, value, color = 'var(--text-muted)' }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Icon size={17} style={{ color }} />
        </div>
        <p className="text-sm font-medium text-white">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span>}
        <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}

export default function Settings({ darkMode, setDarkMode, onLogout }) {
  const [notifications, setNotifications] = useState(true)
  const [compactMode,   setCompactMode]   = useState(false)
  const [language,      setLanguage]      = useState('English')

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Profile card */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl mb-8 animate-fade-in"
        style={{
          background: 'rgba(42,165,255,0.07)',
          border: '1px solid rgba(42,165,255,0.2)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #2aa5ff, #0570eb)',
            boxShadow: '0 0 20px rgba(42,165,255,0.3)',
          }}
        >
          A
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-[16px]">Arjun Sharma</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>arjun@newsmind.ai</p>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: 'rgba(42,165,255,0.15)', color: 'var(--accent-blue)' }}
          >
            Pro Plan
          </span>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}
        >
          <User size={13} /> Edit
        </button>
      </div>

      {/* ── Appearance section ─────────────────── */}
      <section className="mb-6 animate-fade-in">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 px-1"
          style={{ color: 'var(--text-muted)' }}>
          Appearance
        </h2>
        <div className="flex flex-col gap-2">
          <ToggleRow
            icon={darkMode ? Moon : Sun}
            label="Dark Mode"
            description="Switch between light and dark interface"
            checked={darkMode}
            onChange={e => setDarkMode(e.target.checked)}
            color="var(--accent-blue)"
          />
          <ToggleRow
            icon={Layout}
            label="Compact Mode"
            description="Show more articles in less space"
            checked={compactMode}
            onChange={e => setCompactMode(e.target.checked)}
            color="var(--accent-cyan)"
          />
        </div>
      </section>

      {/* ── Notifications section ──────────────── */}
      <section className="mb-6 animate-fade-in">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 px-1"
          style={{ color: 'var(--text-muted)' }}>
          Notifications
        </h2>
        <div className="flex flex-col gap-2">
          <ToggleRow
            icon={Bell}
            label="Breaking News Alerts"
            description="Get notified for high-impact news"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            color="var(--accent-amber)"
          />
        </div>
      </section>

      {/* ── Preferences section ────────────────── */}
      <section className="mb-6 animate-fade-in">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 px-1"
          style={{ color: 'var(--text-muted)' }}>
          Preferences
        </h2>
        <div className="flex flex-col gap-2">
          <OptionRow icon={Globe}   label="Language"   value={language}  color="var(--accent-green)" />
          <OptionRow icon={Shield}  label="Privacy"    value="Managed"   color="var(--accent-red)"   />
        </div>
      </section>

      {/* ── Logout button ──────────────────────── */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-200 animate-fade-in"
        style={{
          background: 'rgba(255,77,109,0.07)',
          border: '1px solid rgba(255,77,109,0.18)',
          color: 'var(--accent-red)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,109,0.07)'}
      >
        <LogOut size={17} />
        <span className="font-semibold text-sm">Log Out</span>
      </button>

      <p className="text-center text-[11px] mt-6" style={{ color: 'rgba(107,122,153,0.4)' }}>
        NewsMind AI v1.0.0 · Built with ❤️ for Hackathon 2025
      </p>
    </div>
  )
}
