import { useState } from 'react'
import { Bookmark, BookmarkCheck, Flame, AlertTriangle, TrendingUp } from 'lucide-react'

// Map urgency levels to their styles
const urgencyConfig = {
  High: {
    icon: Flame,
    color: '#ff4d6d',
    bg:   'rgba(255,77,109,0.12)',
    border:'rgba(255,77,109,0.3)',
    label: '🔥 High',
  },
  Medium: {
    icon: AlertTriangle,
    color: '#ffb347',
    bg:   'rgba(255,179,71,0.12)',
    border:'rgba(255,179,71,0.3)',
    label: '⚠️ Medium',
  },
  Low: {
    icon: TrendingUp,
    color: '#2aa5ff',
    bg:   'rgba(42,165,255,0.12)',
    border:'rgba(42,165,255,0.3)',
    label: '📈 Low',
  },
}

// Map glow type to shadow color
const glowMap = {
  green: '0 8px 40px rgba(16,220,138,0.20), 0 2px 8px rgba(16,220,138,0.10)',
  red:   '0 8px 40px rgba(255,77,109,0.20), 0 2px 8px rgba(255,77,109,0.10)',
  amber: '0 8px 40px rgba(255,179,71,0.15), 0 2px 8px rgba(255,179,71,0.08)',
  blue:  '0 8px 40px rgba(42,165,255,0.18), 0 2px 8px rgba(42,165,255,0.08)',
}

export default function NewsCard({ article, isSaved, onSave }) {
  const [hovered, setHovered] = useState(false)
  const urgency = urgencyConfig[article.urgency] || urgencyConfig.Medium

  return (
    <article
      className="news-card animate-fade-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered ? glowMap[article.glow] : '0 2px 12px rgba(0,0,0,0.3)',
        borderColor: hovered ? article.borderColor.replace('/', '') : 'rgba(255,255,255,0.07)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div className="flex">
        {/* ── Left: Text content ───────────────────── */}
        <div
          className="flex-1 p-5"
          style={{
            background: `linear-gradient(135deg, ${article.glowColor}, transparent)`,
          }}
        >
          {/* Title */}
          <h3
            className="font-bold text-[17px] leading-snug mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
            {article.description}
          </p>

          {/* Why it matters */}
          <div
            className="text-sm mb-4 p-2.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="font-semibold text-white">Why it matters: </span>
            <span style={{ color: 'var(--text-muted)' }}>{article.whyItMatters}</span>
          </div>

          {/* Tags + Urgency + Bookmark */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Urgency badge */}
            <span
              className="tag"
              style={{
                background: urgency.bg,
                border: `1px solid ${urgency.border}`,
                color: urgency.color,
              }}
            >
              {urgency.label}
            </span>

            {/* Category tags */}
            {article.tags.map(tag => (
              <span
                key={tag}
                className="tag"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'var(--text-muted)',
                }}
              >
                {tag}
              </span>
            ))}

            {/* Time */}
            <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
              {article.time}
            </span>

            {/* Bookmark button */}
            <button
              onClick={e => { e.stopPropagation(); onSave(article) }}
              className="p-1.5 rounded-lg transition-all duration-200 ml-1"
              style={{ background: isSaved ? 'rgba(42,165,255,0.15)' : 'rgba(255,255,255,0.06)' }}
              title={isSaved ? 'Remove bookmark' : 'Bookmark'}
            >
              {isSaved
                ? <BookmarkCheck size={15} style={{ color: 'var(--accent-blue)' }} />
                : <Bookmark size={15} style={{ color: 'var(--text-muted)' }} />
              }
            </button>
          </div>
        </div>

        {/* ── Right: Image ──────────────────────────── */}
        <div className="w-[160px] h-auto relative overflow-hidden flex-shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          {/* Gradient overlay on image */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(17,24,39,0.4), transparent)',
            }}
          />
        </div>
      </div>
    </article>
  )
}
