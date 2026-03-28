import { useState } from 'react';
import api from '../api/client';

export default function ChatPanel({ initialQuestion }) {
  const [messages, setMessages] = useState(
    initialQuestion
      ? [{ role: 'user', content: initialQuestion }]
      : []
  );
  const [input, setInput] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/askNews', { question });
      const answer = res.data.answer || 'No answer.';
      setMessages([
        ...newMessages,
        { role: 'assistant', content: answer }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong fetching the answer.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <h3>Ask News</h3>
      <div className="chat-window">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={
              m.role === 'user' ? 'chat-bubble user' : 'chat-bubble ai'
            }
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="chat-bubble ai">Thinking…</div>}
      </div>

      <form onSubmit={send} className="chat-input-row">
        <input
          type="text"
          placeholder="Ask about today's news…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}