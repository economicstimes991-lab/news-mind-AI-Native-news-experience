import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'
import { aiResponses } from '../data/newsData'

// Suggested starter prompts
const starters = [
  '📈 Summarize today\'s market news',
  '🤖 What\'s happening in AI?',
  '🚀 Top startup funding rounds?',
  '💹 Is the market bullish or bearish?',
  '🏦 Impact of RBI rate hike on loans?',
  '⚡ EV sector outlook for 2025?',
]

// Get a random AI response
const getAIResponse = () => {
  const pool = aiResponses.default
  return pool[Math.floor(Math.random() * pool.length)]
}

// Render **bold** markdown
const RichText = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I'm **NewsMind AI** — your personal business intelligence assistant. Ask me anything about markets, startups, finance, or today's news. I'm here to help you stay informed!",
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input,    setInput]    = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const userMsg = text || input
    if (!userMsg.trim() || isTyping) return
    setInput('')

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: now }])
    setIsTyping(true)

    // Simulate AI thinking time (1.5-2.5 seconds)
    const delay = 1500 + Math.random() * 1000
    await new Promise(r => setTimeout(r, delay))

    const aiNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'ai', text: getAIResponse(), time: aiNow }])
  }

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      text: 'Chat cleared! Ask me anything about today\'s business news.',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-68px)]">
      {/* ── Header ─────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2aa5ff, #06d6f5)',
              boxShadow: '0 0 20px rgba(42,165,255,0.35)',
            }}
          >
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-[15px]">NewsMind AI</h2>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent-green)' }}
              />
              <span className="text-xs" style={{ color: 'var(--accent-green)' }}>Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={13} /> Clear
        </button>
      </div>

      {/* ── Messages ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {/* Starter suggestions at the top if only 1 message */}
        {messages.length <= 1 && (
          <div className="animate-fade-in">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              Try asking:
            </p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {starters.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(42,165,255,0.3)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #2aa5ff, #0570eb)'
                  : 'rgba(255,255,255,0.08)',
                boxShadow: msg.role === 'user' ? '0 0 12px rgba(42,165,255,0.3)' : 'none',
              }}
            >
              {msg.role === 'user'
                ? <User size={14} className="text-white" />
                : <Sparkles size={14} style={{ color: 'var(--accent-blue)' }} />
              }
            </div>

            {/* Bubble */}
            <div className="max-w-[70%]">
              <div
                className="px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #2aa5ff, #0570eb)',
                        borderRadius: '18px 18px 4px 18px',
                        color: '#fff',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '18px 18px 18px 4px',
                        color: 'var(--text-muted)',
                      }
                }
              >
                {msg.role === 'ai' ? <RichText text={msg.text} /> : msg.text}
              </div>
              <p className="text-[10px] mt-1 px-1" style={{ color: 'rgba(107,122,153,0.6)' }}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div
              className="px-4 py-3 flex items-center gap-1.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px 18px 18px 4px',
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ───────────────────────── */}
      <div
        className="px-6 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center gap-3 p-2 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <input
            type="text"
            placeholder="Ask about markets, startups, economy…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent text-sm outline-none px-2"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: input.trim() && !isTyping
                ? 'linear-gradient(135deg, #2aa5ff, #0570eb)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: input.trim() && !isTyping ? '0 4px 16px rgba(42,165,255,0.3)' : 'none',
            }}
          >
            <Send size={15} style={{ color: input.trim() && !isTyping ? '#fff' : 'var(--text-muted)' }} />
          </button>
        </div>
        <p className="text-center text-[11px] mt-2" style={{ color: 'rgba(107,122,153,0.5)' }}>
          NewsMind AI may produce inaccurate information about markets. Always verify.
        </p>
      </div>
    </div>
  )
}
