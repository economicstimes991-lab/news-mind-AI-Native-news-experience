import { Bookmark, Trash2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Saved({ savedArticles, onRemove }) {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bookmark size={22} style={{ color: 'var(--accent-blue)' }} />
          Saved Articles
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''} bookmarked
        </p>
      </div>

      {/* Empty state */}
      {savedArticles.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.10)',
          }}
        >
          <div className="text-5xl mb-4">🔖</div>
          <h3 className="font-semibold text-white text-lg mb-2">No saved articles yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Bookmark articles from the home feed to read them later.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #2aa5ff, #0570eb)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(42,165,255,0.3)',
            }}
          >
            Browse News <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {savedArticles.map((article, i) => (
            <div
              key={article.id}
              className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 animate-fade-in group"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              {/* Colour accent based on glow */}
              <div
                className="w-1 self-stretch rounded-full flex-shrink-0"
                style={{
                  background:
                    article.glow === 'green' ? 'var(--accent-green)'
                    : article.glow === 'red'   ? 'var(--accent-red)'
                    : article.glow === 'blue'  ? 'var(--accent-blue)'
                    : 'var(--accent-amber)',
                }}
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-[15px] leading-snug mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {article.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[11px]"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[11px]" style={{ color: 'rgba(107,122,153,0.5)' }}>
                    {article.time}
                  </span>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemove(article.id)}
                className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                style={{
                  background: 'rgba(255,77,109,0.1)',
                  border: '1px solid rgba(255,77,109,0.2)',
                  color: 'var(--accent-red)',
                }}
                title="Remove bookmark"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
