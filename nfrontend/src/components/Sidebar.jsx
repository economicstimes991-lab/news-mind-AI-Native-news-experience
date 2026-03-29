import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Lightbulb,
  MessageSquare,
  Bookmark,
  Settings,
  Zap,
} from 'lucide-react'

// The navigation items in the sidebar
const navItems = [
  { label: 'Home',     icon: Home,          path: '/'         },
  { label: 'Insights', icon: Lightbulb,     path: '/insights' },
  { label: 'Chat',     icon: MessageSquare, path: '/chat'     },
  { label: 'Saved',    icon: Bookmark,      path: '/saved'    },
  { label: 'Settings', icon: Settings,      path: '/settings' },
]

export default function Sidebar() {
  const navigate  = useNavigate()   // lets us change pages programmatically
  const location  = useLocation()   // gives us the current URL path

  return (
    <aside
      className="fixed left-0 top-0 h-full w-[220px] z-30 flex flex-col py-6 px-3"
      style={{
        background: 'rgba(8,12,20,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Logo ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #2aa5ff, #06d6f5)',
            boxShadow: '0 0 20px rgba(42,165,255,0.4)',
          }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-[15px] leading-none tracking-tight">
            NewsMind
          </span>
          <span
            className="block text-[10px] font-semibold tracking-widest uppercase mt-0.5"
            style={{ color: 'var(--accent-blue)' }}
          >
            AI
          </span>
        </div>
      </div>

      {/* ── Navigation Items ──────────────────────── */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          // Check if this nav item is the current active page
          const isActive = location.pathname === path

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`nav-item ${isActive ? 'active' : ''} w-full text-left`}
            >
              <Icon
                size={18}
                style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)' }}
              />
              <span>{label}</span>
              {/* Blue dot indicator for active item */}
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--accent-blue)' }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Bottom badge ─────────────────────────── */}
      <div
        className="mx-2 p-3 rounded-xl text-xs"
        style={{
          background: 'rgba(42,165,255,0.08)',
          border: '1px solid rgba(42,165,255,0.15)',
        }}
      >
        <div className="font-semibold text-white mb-1">Pro Plan Active</div>
        <div style={{ color: 'var(--text-muted)' }}>Unlimited AI summaries</div>
      </div>
    </aside>
  )
}
