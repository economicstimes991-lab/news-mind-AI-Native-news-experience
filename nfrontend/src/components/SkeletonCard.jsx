// ─────────────────────────────────────────────────────────────────────────────
// src/components/SkeletonCard.jsx
//
// A "skeleton" is a grey placeholder that pulses while real content loads.
// It shows the same shape as a news card so the UI doesn't jump around.
// ─────────────────────────────────────────────────────────────────────────────

// One shimmering block
function Shimmer({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s infinite',
        ...style,
      }}
    />
  )
}

// One full skeleton card (matches the shape of NewsCard)
export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden flex"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        minHeight: '160px',
      }}
    >
      {/* Left: text area */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <Shimmer style={{ height: '22px', width: '75%' }} />
        <Shimmer style={{ height: '14px', width: '100%' }} />
        <Shimmer style={{ height: '14px', width: '85%' }} />
        <div
          className="p-2.5 rounded-lg flex flex-col gap-2"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <Shimmer style={{ height: '13px', width: '60%' }} />
        </div>
        <div className="flex gap-2 mt-auto">
          <Shimmer style={{ height: '24px', width: '70px', borderRadius: '99px' }} />
          <Shimmer style={{ height: '24px', width: '60px', borderRadius: '99px' }} />
        </div>
      </div>

      {/* Right: image area */}
      <Shimmer
        style={{
          width: '160px',
          flexShrink: 0,
          borderRadius: 0,
          height: 'auto',
        }}
      />
    </div>
  )
}

// Three skeleton cards stacked (used on initial load)
export function SkeletonFeed({ count = 3 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            opacity: 1 - i * 0.15,          // each card is slightly more faded
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}

// Inline CSS for shimmer animation (injected once into the page)
// We do it here so you don't need to edit index.css
const shimmerStyle = document.createElement('style')
shimmerStyle.textContent = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`
document.head.appendChild(shimmerStyle)
