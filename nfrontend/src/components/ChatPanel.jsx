import { useState } from 'react'
import { Send, Mic, Bot, ChevronRight } from 'lucide-react'
import { aiResponses } from '../data/newsData'
import { useNavigate } from 'react-router-dom'

const exampleQuestions = [
  "What's the latest in EV?",
  'How is the market reacting?',
  'Top startup news today?',
]

// Get a random AI response
const getAIResponse = () => {
  const pool = aiResponses.default
  return pool[Math.floor(Math.random() * pool.length)]
}

// Render markdown-style **bold** text
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

export default function ChatPanel() {
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const navigate = useNavigate()

  const sendMessage = async (text) => {
    const userMsg = text || input
    if (!userMsg.trim()) return
    setInput('')

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    // Simulate AI "thinking" delay
    await new Promise(r => setTimeout(r, 1200))
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'ai', text: getAIResponse() }])
  }

  return (
    <div
      className="rounded-2xl flex flex-col"
      style={{
        background: 'rgba(13,20,32,0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        height: '340px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Bot size={16} style={{ color: 'var(--accent-blue)' }} />
          <span className="font-semibold text-white text-sm">Chat with AI</span>
        </div>
        <button onClick={() => navigate('/chat')} className="text-xs" style={{ color: 'var(--accent-blue)' }}>
          Full chat →
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 ? (
          /* Example questions shown when chat is empty */
          <div>
            <p className="text-xs mb-2 px-1" style={{ color: 'var(--text-muted)' }}>Example Questions</p>
            {exampleQuestions.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm mb-1.5 text-left transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(42,165,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                • {q}
                <ChevronRight size={13} />
              </button>
            ))}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[85%] px-3 py-2 text-xs leading-relaxed"
                style={{
                  ...(msg.role === 'user'
                    ? { background: 'linear-gradient(135deg,#2aa5ff,#0570eb)', borderRadius: '14px 14px 4px 14px', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px 14px 14px 4px', color: 'var(--text-muted)' }
                  ),
                }}
              >
                {msg.role === 'ai' ? <RichText text={msg.text} /> : msg.text}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2.5 rounded-2xl flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 text-xs px-3 py-2 rounded-xl outline-none"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={() => sendMessage()}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#2aa5ff,#0570eb)' }}
        >
          <Send size={12} className="text-white" />
        </button>
      </div>
    </div>
  )
}
