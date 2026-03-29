// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Home.jsx  (UPGRADED — real news API + dynamic chart)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { RefreshCw, Sparkles, ChevronRight, Wifi, WifiOff, Clock } from 'lucide-react'
import NewsCard      from '../components/NewsCard'
import SmartSummary  from '../components/SmartSummary'
import ChatPanel     from '../components/ChatPanel'
import { SkeletonFeed } from '../components/SkeletonCard'
import { useNews }   from '../hooks/useNews'
import { useNavigate } from 'react-router-dom'
import { aiResponses } from '../data/newsData'

// Render **bold** markdown inline
const RichText = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="text-white">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

// ── Empty state (no articles found) ──────────────────────────────────────────
function EmptyState({ tab, onRefresh }) {
  return (
    <div
      className="text-center py-16 rounded-2xl animate-fade-in"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.10)' }}
    >
      <p className="text-4xl mb-3">📭</p>
      <p className="font-semibold text-white mb-1">No articles found for "{tab}"</p>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Check your API key in the .env file or try again.
      </p>
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
        style={{ background: 'rgba(42,165,255,0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(42,165,255,0.25)' }}
      >
        <RefreshCw size={13} /> Try Again
      </button>
    </div>
  )
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 animate-fade-in"
      style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.22)' }}
    >
      <div className="flex items-center gap-2">
        <WifiOff size={14} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
        <span className="text-sm" style={{ color: 'rgba(255,77,109,0.9)' }}>
          {message === 'Failed to fetch'
            ? 'Network error — showing demo data'
            : `API error: ${message}`}
        </span>
      </div>
      <button
        onClick={onRetry}
        className="text-xs px-3 py-1 rounded-lg ml-3 flex-shrink-0"
        style={{ background: 'rgba(255,77,109,0.12)', color: 'var(--accent-red)' }}
      >
        Retry
      </button>
    </div>
  )
}

// ── Demo mode banner (shown when no API key is set) ───────────────────────────
function DemoBanner() {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 animate-fade-in"
      style={{ background: 'rgba(255,179,71,0.07)', border: '1px solid rgba(255,179,71,0.20)' }}
    >
      <span className="text-lg">🔑</span>
      <div>
        <span className="text-sm font-semibold" style={{ color: 'var(--accent-amber)' }}>
          Demo Mode —{' '}
        </span>
        <span className="text-sm" style={{ color: 'rgba(255,179,71,0.75)' }}>
          Add your NewsAPI key in the <code className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">.env</code> file to see live news.
          Get a free key at{' '}
          <a
            href="https://newsapi.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--accent-amber)' }}
          >
            newsapi.org
          </a>
        </span>
      </div>
    </div>
  )
}

// ── Last updated badge ────────────────────────────────────────────────────────
function LastUpdatedBadge({ lastUpdated, onRefresh, loading }) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'var(--text-muted)',
      }}
      title="Click to refresh news"
    >
      {loading
        ? <div className="spinner" style={{ width: 11, height: 11 }} />
        : <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
      }
      {lastUpdated
        ? <span>Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        : <span>Refresh</span>
      }
    </button>
  )
}

// ── Main Home component ───────────────────────────────────────────────────────
export default function Home({ activeTab = 'For You', savedArticles = [], onSave, userInterests = [] }) {
  const navigate = useNavigate()

  // useNews does all the heavy lifting: fetching, caching, auto-refresh
  const {
    articles,
    loading,
    error,
    lastUpdated,
    sentimentScore,
    usingFallback,
    refresh,
  } = useNews(activeTab, activeTab === 'For You' ? userInterests : [])

  const [aiSummary,  setAiSummary]  = useState(null)
  const [loadingAI,  setLoadingAI]  = useState(false)

  // Simulate AI generating a summary (mock for now)
  const handleAskAI = async () => {
    setLoadingAI(true)
    setAiSummary(null)
    await new Promise(r => setTimeout(r, 1400))
    const pool = aiResponses.default
    setAiSummary(pool[Math.floor(Math.random() * pool.length)])
    setLoadingAI(false)
  }

  // ── Live news count banner ─────────────────────────────────────────────────
  const LiveBadge = () => (
    <div className="flex items-center gap-1.5">
      <Wifi size={12} style={{ color: 'var(--accent-green)' }} />
      <span className="text-xs" style={{ color: 'var(--accent-green)' }}>
        {articles.length} live articles
      </span>
    </div>
  )

  return (
    <div className="flex gap-0">
      {/* ────────────────────────────────────────────────────────────────────
          LEFT: Main news feed
      ──────────────────────────────────────────────────────────────────── */}
      <section className="flex-1 p-6 min-w-0">

        {/* Page header */}
        <div className="flex items-start justify-between mb-5 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {activeTab === 'For You' ? 'Your Daily Briefing' : activeTab}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              {!loading && articles.length > 0 && !usingFallback && <LiveBadge />}
            </div>
          </div>

          {/* Refresh button + last updated time */}
          <LastUpdatedBadge lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />
        </div>

        {/* Banners */}
        {usingFallback && <DemoBanner />}
        {error && !usingFallback && <ErrorBanner message={error} onRetry={refresh} />}

        {/* Auto-refresh countdown */}
        {!usingFallback && lastUpdated && (
          <div
            className="flex items-center gap-1.5 mb-4 text-xs"
            style={{ color: 'rgba(107,122,153,0.5)' }}
          >
            <Clock size={10} />
            <span>Auto-refreshes every 60 seconds</span>
          </div>
        )}

        {/* AI Summary banner */}
        {(aiSummary || loadingAI) && (
          <div
            className="mb-5 p-4 rounded-2xl animate-fade-in"
            style={{
              background: 'rgba(42,165,255,0.08)',
              border: '1px solid rgba(42,165,255,0.25)',
              boxShadow: '0 4px 24px rgba(42,165,255,0.12)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} style={{ color: 'var(--accent-blue)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                AI Market Summary
              </span>
            </div>
            {loadingAI ? (
              <div className="flex items-center gap-2">
                <div className="spinner" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Generating summary…</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                <RichText text={aiSummary} />
              </p>
            )}
          </div>
        )}

        {/* ── News cards ── */}
        {loading ? (
          // Show skeleton cards while loading
          <SkeletonFeed count={3} />
        ) : articles.length === 0 ? (
          // Empty state
          <EmptyState tab={activeTab} onRefresh={refresh} />
        ) : (
          // Real news cards
          <div className="flex flex-col gap-4">
            {articles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                isSaved={savedArticles?.some(a => a.id === article.id)}
                onSave={onSave}
              />
            ))}

            {/* "Load more" hint */}
            <p className="text-center text-xs py-4" style={{ color: 'rgba(107,122,153,0.4)' }}>
              Showing {articles.length} articles · Auto-refreshes every 60 seconds
            </p>
          </div>
        )}
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          RIGHT: Sidebar panel
      ──────────────────────────────────────────────────────────────────── */}
      <aside
        className="w-[310px] flex-shrink-0 p-4 pt-6 flex flex-col gap-4"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Smart Summary with LIVE sentiment score from real news */}
        <SmartSummary sentimentScore={sentimentScore} />

        {/* Ask AI + Quick Insights */}
        <div className="flex gap-2">
          <button
            onClick={handleAskAI}
            disabled={loadingAI}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #0570eb, #2aa5ff)',
              boxShadow: '0 4px 16px rgba(42,165,255,0.3)',
              color: '#fff',
              opacity: loadingAI ? 0.7 : 1,
            }}
          >
            {loadingAI
              ? <div className="spinner" style={{ width: 14, height: 14, borderTopColor: '#fff' }} />
              : <Sparkles size={14} />
            }
            Ask AI
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all duration-200"
            style={{
              background: 'rgba(42,165,255,0.12)',
              border: '1px solid rgba(42,165,255,0.25)',
              color: 'var(--accent-blue)',
            }}
          >
            Quick insights <ChevronRight size={13} />
          </button>
        </div>

        {/* Sentiment summary text */}
        <div
          className="px-3 py-2.5 rounded-xl text-xs"
          style={{
            background: sentimentScore >= 50
              ? 'rgba(16,220,138,0.07)'
              : 'rgba(255,77,109,0.07)',
            border: `1px solid ${sentimentScore >= 50 ? 'rgba(16,220,138,0.18)' : 'rgba(255,77,109,0.18)'}`,
            color: sentimentScore >= 50 ? 'var(--accent-green)' : 'var(--accent-red)',
          }}
        >
          {sentimentScore >= 70 && '🚀 Strong bullish sentiment from today\'s headlines'}
          {sentimentScore >= 50 && sentimentScore < 70 && '📈 Slightly positive market mood today'}
          {sentimentScore >= 30 && sentimentScore < 50 && '📉 Cautious sentiment in the markets'}
          {sentimentScore < 30  && '⚠️ Bearish signals dominating today\'s news'}
        </div>

        {/* Chat panel */}
        <ChatPanel />
      </aside>
    </div>
  )
}
