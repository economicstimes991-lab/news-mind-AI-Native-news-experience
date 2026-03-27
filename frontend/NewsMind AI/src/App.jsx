import { useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const PERSONAS = [
  { id: 'investor', label: '📈 Investor' },
  { id: 'founder', label: '🚀 Founder' },
  { id: 'student', label: '🎓 Student' }
];

const INTERESTS = ['Markets', 'Startups', 'AI', 'Policy', 'Commodities', 'Earnings'];

function App() {
  const [selectedPersona, setSelectedPersona] = useState('investor');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [started, setStarted] = useState(false);
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const profileLine = useMemo(() => {
    if (!selectedInterests.length) return `${capitalize(selectedPersona)} view`;
    return `${capitalize(selectedPersona)} view • ${selectedInterests.join(', ')}`;
  }, [selectedPersona, selectedInterests]);

  const toggleInterest = (value) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const launchNewsroom = async () => {
    if (!selectedInterests.length) {
      window.alert('Select at least one interest');
      return;
    }

    setStarted(true);
    await fetchNews();
  };

  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError('');

      const params = new URLSearchParams({
        persona: selectedPersona,
        interests: selectedInterests.join(',')
      });

      const response = await fetch(`${API_BASE}/getNews?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to load news (${response.status})`);
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      setNewsError(error.message || 'Error loading your newsroom.');
      setArticles([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const askAI = async (question) => {
    const clean = question.trim();
    if (!clean) return;

    setMessages((prev) => [...prev, { role: 'You', text: clean }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/askNews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: clean, persona: selectedPersona })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch response (${response.status})`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'My ET', text: data.answer || 'No response from AI' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'My ET', text: error.message || 'Error fetching response' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const submitChat = (event) => {
    event.preventDefault();
    void askAI(chatInput);
  };

  if (!started) {
    return (
      <div className="page">
        <div id="landing-page">
          <p className="eyebrow">AI-native newsroom</p>
          <h1>My ET: Your Business Briefing, Rewritten for You</h1>
          <p className="subtext">
            Not a generic feed. Pick a persona and interests to get a personalized stream with
            “why this matters” insights.
          </p>

          <section>
            <h2>1) Choose your persona</h2>
            <div className="persona-grid">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  className={`persona-btn ${selectedPersona === persona.id ? 'active' : ''}`}
                  onClick={() => setSelectedPersona(persona.id)}
                >
                  {persona.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>2) Select interests</h2>
            <div className="interests">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-btn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </section>

          <button id="start-btn" type="button" onClick={launchNewsroom}>
            Launch My Newsroom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="navbar">
        <div>
          <h2>My ET</h2>
          <p className="muted">{profileLine}</p>
        </div>

        <button className="ghost-btn" type="button" onClick={() => setStarted(false)}>
          Change Profile
        </button>
      </div>

      <div className="container">
        <main className="news">
          {newsLoading && <p>Building your personalized newsroom...</p>}
          {newsError && !newsLoading && <p>{newsError}</p>}

          {!newsLoading && !newsError && articles.length === 0 && <p>No stories found for this profile.</p>}

          {!newsLoading &&
            !newsError &&
            articles.map((article) => (
              <article className="card" key={article.id || article.title}>
                <div className="card-top">
                  <span className="tag">{article.format || 'brief'}</span>
                  <span className="muted">{article.source || 'Unknown source'}</span>
                </div>

                <h3>{article.title}</h3>
                <p>{article.summary || article.description || 'No summary available'}</p>

                <div className="insight">
                  <strong>Why this matters to you</strong>
                  <p>{article.whyItMatters || 'No personalized insight yet'}</p>
                </div>

                <p className="reason">{article.relevanceReason || 'General relevance'}</p>

                <div className="card-actions">
                  <button
                    className="secondary"
                    type="button"
                    onClick={() => askAI(`Give me the key risk and opportunity from: ${article.title}`)}
                  >
                    Analyze
                  </button>

                  <a className="link-btn" href={article.url || '#'} target="_blank" rel="noreferrer">
                    Read source
                  </a>
                </div>
              </article>
            ))}
        </main>

        <aside className="chat">
          <h3>Ask My Editor</h3>
          <p className="muted">Ask for implications, risks, or plain-language explainers.</p>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <p key={`${msg.role}-${idx}`}>
                <strong>{msg.role}:</strong> {msg.text}
              </p>
            ))}
            {chatLoading && <p>My ET is thinking…</p>}
          </div>

          <form className="chat-input" onSubmit={submitChat}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="What should I track this week?"
            />
            <button id="send-btn" type="submit" disabled={chatLoading}>
              Send
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default App;