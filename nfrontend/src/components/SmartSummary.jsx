// SmartSummary.jsx — upgraded to pass live sentiment to MarketChart
import { Sparkles } from 'lucide-react'
import MarketChart from './MarketChart'

export default function SmartSummary({ sentimentScore = 50 }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'var(--accent-blue)', boxShadow: '0 0 6px var(--accent-blue)' }}
        />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Smart Summary
        </span>
        <Sparkles size={11} style={{ color: 'var(--accent-blue)' }} />
      </div>
      {/* Passes the live news-based score into the animated chart */}
      <MarketChart sentimentScore={sentimentScore} />
    </div>
  )
}
