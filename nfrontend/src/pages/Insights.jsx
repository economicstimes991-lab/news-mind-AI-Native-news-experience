// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Insights.jsx  (NEW)
//
// Global Market Overview — shows ALL categories mixed together.
// Acts like a real-time "world market dashboard".
//
// Features:
//   • Fetches business + tech + general + science + health + AI in one go
//   • Shuffled for variety
//   • Live sentiment chart at the top
//   • Category filter chips (filter locally — no extra API calls)
//   • Auto-refreshes every 60 seconds
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react'
import { RefreshCw, Globe, Wifi, WifiOff, LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react'
import NewsCard          from '../components/NewsCard'
import MarketChart       from '../components/MarketChart'
import { SkeletonFeed }  from '../components/SkeletonCard'
import { useNews }       from '../hooks/useNews'

// ─── Category chips for local filtering ──────────────────────────────────────
const FILTER_CHIPS = [
  { id: 'all',        label: '🌐 All'         },
  { id: 'green',      label: '📈 Bullish'     },
  { id: 'red',        label: '📉 Bearish'     },
  { id: 'High',       label: '🔥 Breaking'    },
  { id: 'Medium',     label: '📌 Updates'     },
]

// ─── Stats bar at the top ─────────────────────────────────────────────────────
function InsightsStats({ articles, sentimentScore }) {
  const bullish  = articles.filter(a => a.glow  === 'green').length
  const bearish  = articles.filter(a => a.glow  === 'red').length
  const breaking = articles.filter(a => a.urgency === 'High').length
  const isUp     = sentimentScore >= 50

  const stats = [
    { label: 'Total Stories',   value: articles.length, color: 'var(--accent-blue)',  icon: '📰' },
    { label: 'Bullish Signals', value: bullish,          color: 'var(--accent-green)', icon: '📈' },
    { label: 'Bearish Signals', value: bearish,          color: 'var(--accent-red)',   icon: '📉' },
    { label: 'Breaking News',   value: breaking,         color: 'var(--accent-amber)', icon: '🔥' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <div
          key={s.label}
          className="rounded-2xl p-4 text-center animate-fade-in"
          style={{
            background : 'rgba(255,255,255,0.03)',
            border     : '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Sentiment summary bar ────────────────────────────────────────────────────
function SentimentBar({ score }) {
  const isUp = score >= 50
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5"
      style={{
        background: isUp ? 'rgba(16,220,138,0.07)' : 'rgba(255,77,109,0.07)',
        border    : `1px solid ${isUp ? 'rgba(16,220,138,0.20)' : 'rgba(255,77,109,0.20)'}`,
      }}
    >
      {isUp
        ? <TrendingUp  size={18} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
        : <TrendingDown size={18} style={{ color: 'var(--accent-red)',   flexShrink: 0 }} />
      }
      <div className="flex-1">
        <span className="font-semibold text-sm text-white">Global Sentiment Score: </span>
        <span className="font-bold text-sm" style={{ color: isUp ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {score}/100
        </span>
        <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
          — based on today's headlines across all categories
        </span>
      </div>
      {/* Visual bar */}
      <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width     : `${score}%`,
            background: isUp ? 'var(--accent-green)' : 'var(--accent-red)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Main Insights page ───────────────────────────────────────────────────────
export default function Insights({ savedArticles = [], onSave }) {
  const [activeFilter, setActiveFilter] = useState('all')

  // 'Insights' is a special tab — news.js fetches ALL categories for it
  const {
    articles,
    loading,
    error,
    lastUpdated,
    sentimentScore,
    usingFallback,
    refresh,
  } = useNews('Insights')

  // ── Local filter — no extra API calls needed ────────────────────────────────
  // We just hide/show cards from the already-fetched pool
  const filteredArticles = useMemo(() => {
    if (activeFilter === 'all')   return articles
    if (activeFilter === 'green') return articles.filter(a => a.glow === 'green')
    if (activeFilter === 'red')   return articles.filter(a => a.glow === 'red')
    return articles.filter(a => a.urgency === activeFilter)
  }, [articles, activeFilter])

  return (
    <div className="flex gap-0">
      {/* ── LEFT: Main insights feed ────────────────────────────────────────── */}
      <section className="flex-1 p-6 min-w-0">

        {/* Header */}
        <div className="flex items-start justify-between mb-5 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={20} style={{ color: 'var(--accent-blue)' }} />
              <h1 className="text-2xl font-bold text-white">Global Insights</h1>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                All categories · Shuffled · Live
              </p>
              {!loading && !usingFallback && articles.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Wifi size={11} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-xs" style={{ color: 'var(--accent-green)' }}>
                    {articles.length} live stories
                  </span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-1.5">
                  <WifiOff size={11} style={{ color: 'var(--accent-red)' }} />
                  <span className="text-xs" style={{ color: 'var(--accent-red)' }}>Showing demo data</span>
                </div>
              )}
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border    : '1px solid rgba(255,255,255,0.08)',
              color     : 'var(--text-muted)',
            }}
          >
            {loading
              ? <div className="spinner" style={{ width: 11, height: 11 }} />
              : <RefreshCw size={11} />
            }
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
              : 'Refresh'
            }
          </button>
        </div>

        {/* Stats grid */}
        {!loading && articles.length > 0 && (
          <InsightsStats articles={articles} sentimentScore={sentimentScore} />
        )}

        {/* Sentiment bar */}
        {!loading && articles.length > 0 && (
          <SentimentBar score={sentimentScore} />
        )}

        {/* Filter chips */}
        {!loading && articles.length > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <LayoutGrid size={13} style={{ color: 'var(--text-muted)' }} />
            {FILTER_CHIPS.map(chip => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background  : activeFilter === chip.id ? 'rgba(42,165,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border      : `1px solid ${activeFilter === chip.id ? 'rgba(42,165,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color       : activeFilter === chip.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                  transform   : activeFilter === chip.id ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                {chip.label}
                {activeFilter === chip.id && articles.length > 0 && (
                  <span className="ml-1.5 opacity-70">
                    ({chip.id === 'all' ? articles.length : filteredArticles.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Article feed */}
        {loading ? (
          <SkeletonFeed count={4} />
        ) : filteredArticles.length === 0 ? (
          <div
            className="text-center py-14 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-semibold text-white mb-1">No articles match this filter</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-3 text-sm px-4 py-2 rounded-xl"
              style={{ background: 'rgba(42,165,255,0.12)', color: 'var(--accent-blue)' }}
            >
              Show all articles
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                isSaved={savedArticles?.some(a => a.id === article.id)}
                onSave={onSave}
              />
            ))}
            <p className="text-center text-xs py-4" style={{ color: 'rgba(107,122,153,0.4)' }}>
              {filteredArticles.length} stories · Auto-refreshes every 60s · Shuffled for variety
            </p>
          </div>
        )}
      </section>

      {/* ── RIGHT: Chart sidebar ─────────────────────────────────────────────── */}
      <aside
        className="w-[300px] flex-shrink-0 p-4 pt-6 flex flex-col gap-4"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Section label */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Live Market Pulse
          </p>
          <MarketChart sentimentScore={sentimentScore} />
        </div>

        {/* Breakdown by sentiment */}
        {!loading && articles.length > 0 && (
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(13,20,32,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Story Breakdown
            </p>
            {[
              { label: 'Bullish',  count: articles.filter(a => a.glow === 'green').length, color: 'var(--accent-green)', pct: articles.filter(a => a.glow === 'green').length / articles.length },
              { label: 'Bearish',  count: articles.filter(a => a.glow === 'red').length,   color: 'var(--accent-red)',   pct: articles.filter(a => a.glow === 'red').length   / articles.length },
              { label: 'Neutral',  count: articles.filter(a => a.glow === 'blue').length,  color: 'var(--accent-blue)',  pct: articles.filter(a => a.glow === 'blue').length  / articles.length },
            ].map(item => (
              <div key={item.label} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-xs font-bold" style={{ color: item.color }}>
                    {item.count} ({Math.round(item.pct * 100)}%)
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct * 100}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top sources */}
        {!loading && articles.length > 0 && (
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(13,20,32,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Top Sources
            </p>
            {Object.entries(
              articles.reduce((acc, a) => {
                acc[a.source] = (acc[a.source] || 0) + 1
                return acc
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between mb-2">
                  <span className="text-xs truncate" style={{ color: 'var(--text-muted)', maxWidth: '75%' }}>
                    {source}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(42,165,255,0.12)', color: 'var(--accent-blue)' }}
                  >
                    {count}
                  </span>
                </div>
              ))}
          </div>
        )}
      </aside>
    </div>
  )
}
