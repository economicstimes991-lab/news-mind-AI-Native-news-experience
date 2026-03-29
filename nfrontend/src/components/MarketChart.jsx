// ─────────────────────────────────────────────────────────────────────────────
// src/components/MarketChart.jsx
//
// A beautiful, animated line chart that shows market sentiment.
// • Sentiment score comes from real news (positive vs negative headlines)
// • Chart adds a new data point every 4 seconds
// • Green = bullish mood, Red = bearish mood
// • Built with Recharts (install: npm install recharts)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

// Generate a starting history of 10 data points around a base score
const generateHistory = (baseScore) => {
  const now   = Date.now()
  return Array.from({ length: 10 }, (_, i) => {
    const jitter = (Math.random() - 0.5) * 12   // ±6 random variation
    return {
      time : formatTime(new Date(now - (9 - i) * 4000)),
      value: Math.max(10, Math.min(95, Math.round(baseScore + jitter))),
    }
  })
}

// "14:32" style label
const formatTime = (date) =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

// Custom tooltip shown when user hovers over the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  const isUp = val >= 50
  return (
    <div
      style={{
        background : 'rgba(13,20,32,0.95)',
        border     : '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding    : '10px 14px',
        boxShadow  : '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: 'rgba(107,122,153,0.8)', fontSize: '11px', marginBottom: 4 }}>{label}</p>
      <p style={{ color: isUp ? '#10dc8a' : '#ff4d6d', fontWeight: 700, fontSize: '15px' }}>
        {isUp ? '▲' : '▼'} {val}
        <span style={{ fontWeight: 400, fontSize: '12px', marginLeft: 4 }}>/ 100</span>
      </p>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MarketChart({ sentimentScore = 50 }) {
  const [chartData, setChartData] = useState(() => generateHistory(sentimentScore))
  const intervalRef = useRef(null)

  // Current latest value
  const latestValue = chartData[chartData.length - 1]?.value ?? sentimentScore
  const prevValue   = chartData[chartData.length - 2]?.value ?? sentimentScore
  const isUp        = latestValue >= 50
  const changed     = latestValue - prevValue
  const isGrowing   = changed >= 0

  // Chart colors based on sentiment
  const COLOR_UP   = '#10dc8a'
  const COLOR_DOWN = '#ff4d6d'
  const lineColor  = isUp ? COLOR_UP : COLOR_DOWN

  // ── Update chart every 4 seconds with a new value ───────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setChartData(prev => {
        const last    = prev[prev.length - 1]?.value ?? sentimentScore
        // New value drifts toward the real sentiment score with some noise
        const drift   = (sentimentScore - last) * 0.15          // pull toward target
        const jitter  = (Math.random() - 0.5) * 8              // ±4 random noise
        const next    = Math.max(5, Math.min(98, Math.round(last + drift + jitter)))

        const newPoint = { time: formatTime(new Date()), value: next }

        // Keep only the last 20 points (slide the window)
        const updated = [...prev.slice(-19), newPoint]
        return updated
      })
    }, 4000)

    return () => clearInterval(intervalRef.current)
  }, [sentimentScore])

  // When sentimentScore changes (tab change / news refresh), update the target
  useEffect(() => {
    setChartData(generateHistory(sentimentScore))
  }, [sentimentScore])

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background : 'rgba(13,20,32,0.92)',
        border     : `1px solid ${isUp ? 'rgba(16,220,138,0.15)' : 'rgba(255,77,109,0.15)'}`,
        boxShadow  : isUp
          ? '0 4px 30px rgba(16,220,138,0.08)'
          : '0 4px 30px rgba(255,77,109,0.08)',
        transition : 'all 0.6s ease',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={15} style={{ color: lineColor }} />
          <span className="text-white font-semibold text-sm">Market Sentiment</span>
          {/* Pulsing live dot */}
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background : lineColor,
              boxShadow  : `0 0 6px ${lineColor}`,
              animation  : 'pulse 2s infinite',
            }}
          />
        </div>

        {/* Score badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl"
          style={{
            background : isUp ? 'rgba(16,220,138,0.12)' : 'rgba(255,77,109,0.12)',
            border     : `1px solid ${isUp ? 'rgba(16,220,138,0.25)' : 'rgba(255,77,109,0.25)'}`,
          }}
        >
          {isGrowing
            ? <TrendingUp  size={12} style={{ color: COLOR_UP   }} />
            : <TrendingDown size={12} style={{ color: COLOR_DOWN }} />
          }
          <span className="text-xs font-bold" style={{ color: lineColor }}>
            {latestValue}/100
          </span>
          <span className="text-xs" style={{ color: isGrowing ? COLOR_UP : COLOR_DOWN }}>
            {isGrowing ? '+' : ''}{changed}
          </span>
        </div>
      </div>

      {/* ── Mood label ──────────────────────────────────────────────────────── */}
      <p className="text-xs mb-3" style={{ color: 'rgba(107,122,153,0.8)' }}>
        Based on{' '}
        <span style={{ color: lineColor, fontWeight: 600 }}>
          {isUp ? 'mostly positive' : 'mostly negative'}
        </span>{' '}
        news sentiment — updates every 4 seconds
      </p>

      {/* ── Recharts AreaChart ──────────────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData} margin={{ top: 5, right: 4, left: -30, bottom: 0 }}>
          <defs>
            {/* Gradient fill under the line */}
            <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={lineColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.00} />
            </linearGradient>
          </defs>

          {/* Subtle grid lines */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />

          {/* 50 = neutral line */}
          <ReferenceLine
            y={50}
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="4 4"
            label={{ value: 'Neutral', fill: 'rgba(107,122,153,0.6)', fontSize: 9, position: 'insideTopLeft' }}
          />

          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(107,122,153,0.5)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'rgba(107,122,153,0.5)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            tickCount={5}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotoneX"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2.5}
            fill="url(#sentimentGrad)"
            dot={false}
            activeDot={{
              r           : 5,
              fill        : lineColor,
              stroke      : '#080c14',
              strokeWidth : 2,
              filter      : `drop-shadow(0 0 6px ${lineColor})`,
            }}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* ── Market mini stats grid ──────────────────────────────────────────── */}
      <MiniStats isUp={isUp} score={latestValue} />
    </div>
  )
}

// ── Mini stats below the chart ─────────────────────────────────────────────────
function MiniStats({ isUp, score }) {
  // These values are simulated but vary with the sentiment
  const stats = [
    { label: 'Sensex',  value: isUp ? `+${(score * 0.018).toFixed(2)}%` : `-${((100-score)*0.014).toFixed(2)}%`, positive: isUp  },
    { label: 'Nifty',   value: isUp ? `+${(score * 0.012).toFixed(2)}%` : `-${((100-score)*0.010).toFixed(2)}%`, positive: isUp  },
    { label: 'USD/INR', value: isUp ? '-0.18%'                           : '+0.24%',                               positive: isUp  },
    { label: 'Gold',    value: isUp ? `+${(score*0.008).toFixed(2)}%`   : `-${((100-score)*0.005).toFixed(2)}%`, positive: true  },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {stats.map(s => (
        <div
          key={s.label}
          className="flex flex-col items-center py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <span className="text-[10px] mb-0.5" style={{ color: 'rgba(107,122,153,0.7)' }}>
            {s.label}
          </span>
          <span
            className="text-[11px] font-bold"
            style={{ color: s.positive ? '#10dc8a' : '#ff4d6d' }}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}
