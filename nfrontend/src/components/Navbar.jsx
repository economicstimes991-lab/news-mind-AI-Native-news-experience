import { useState } from 'react'
import { Search, Bell } from 'lucide-react'
import { tabs } from '../data/newsData'

// Navbar receives: activeTab (which tab is selected) and setActiveTab (to change it)
export default function Navbar({ activeTab, setActiveTab }) {
  const [searchValue, setSearchValue] = useState('')
  const [hasNotif, setHasNotif]       = useState(true)

  return (
    <header
      className="fixed top-0 z-20 flex items-center gap-4 px-6"
      style={{
        left: '220px',            // starts after sidebar
        right: 0,
        height: '68px',
        background: 'rgba(8,12,20,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Tabs ─────────────────────────────────── */}
      <nav className="flex items-center gap-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-muted)',
              background: activeTab === tab ? 'rgba(42,165,255,0.1)' : 'transparent',
            }}
          >
            {tab}
            {/* Underline indicator */}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                style={{ background: 'var(--accent-blue)' }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* ── Search bar ──────────────────────────── */}
      <div className="flex-1 relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          placeholder="Search for news and insights..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-primary)',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(42,165,255,0.4)')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
      </div>

      {/* ── Right section ───────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          onClick={() => setHasNotif(false)}
        >
          <Bell size={17} style={{ color: 'var(--text-muted)' }} />
          {hasNotif && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent-blue)', boxShadow: '0 0 6px var(--accent-blue)' }}
            />
          )}
        </button>

        {/* Minimize icon placeholder */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <span className="w-4 h-0.5 rounded" style={{ background: 'var(--text-muted)' }} />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #2aa5ff, #0570eb)',
            boxShadow: '0 0 12px rgba(42,165,255,0.3)',
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}
