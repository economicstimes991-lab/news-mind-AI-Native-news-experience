import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const AUTH_STORAGE_KEY = 'newsmind-auth';

const PERSONAS = [
  { id: 'investor', label: 'Investor', emoji: '📈', description: 'Track market signals, risks, and opportunities.' },
  { id: 'founder', label: 'Founder', emoji: '🚀', description: 'Focus on strategy, competition, and product implications.' },
  { id: 'student', label: 'Student', emoji: '🎓', description: 'Get plain-language explainers and business fundamentals.' }
];

const INTERESTS = ['Markets', 'Startups', 'AI', 'Policy', 'Commodities', 'Earnings'];

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [user, setUser] = useState(null);

  const [selectedPersona, setSelectedPersona] = useState('investor');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [started, setStarted] = useState(false);

  const [health, setHealth] = useState({ loading: false, ok: false, message: '' });
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setUser(parsed);
          setSelectedPersona(parsed.persona || 'investor');
          setSelectedInterests(parsed.interests || []);
          setStarted(Boolean((parsed.interests || []).length));
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ ...user, persona: selectedPersona, interests: selectedInterests })
    );
  }, [user, selectedPersona, selectedInterests]);

  useEffect(() => {
    const pingBackend = async () => {
      setHealth({ loading: true, ok: false, message: '' });
      try {
        const response = await fetch(`${API_BASE.replace(/\/api$/, '')}/health`);
        if (!response.ok) throw new Error(`Health check failed (${response.status})`);
        const data = await response.json();
        setHealth({ loading: false, ok: data.status === 'ok', message: data.service || 'Backend connected' });
      } catch (error) {
        setHealth({ loading: false, ok: false, message: error.message || 'Backend unreachable' });
      }
    };

    void pingBackend();
  }, []);

  const profileLine = useMemo(() => {
    if (!selectedInterests.length) return `${capitalize(selectedPersona)} view`;
    return `${capitalize(selectedPersona)} view • ${selectedInterests.join(', ')}`;
  }, [selectedPersona, selectedInterests]);

  const toggleInterest = (value) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleAuthInput = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAuth = (event) => {
    event.preventDefault();

    if (!authForm.email.trim() || !authForm.password.trim()) {
      window.alert('Email and password are required.');
      return;
    }

    const displayName = authMode === 'signup' ? authForm.name.trim() || 'NewsMind User' : authForm.email.split('@')[0];

    setUser({ name: displayName, email: authForm.email.trim() });
    setAuthForm({ name: '', email: '', password: '' });
  };

  const logout = () => {
    setUser(null);
    setStarted(false);
    setArticles([]);
    setMessages([]);
    setSelectedInterests([]);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const launchNewsroom = async () => {
    if (!selectedInterests.length) {
      window.alert('Select at least one interest to personalize your feed.');
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
      if (!response.ok) throw new Error(`Failed to load news (${response.status})`);

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

      if (!response.ok) throw new Error(`Failed to fetch response (${response.status})`);

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'AI Editor', text: data.answer || 'No response from AI' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'AI Editor', text: error.message || 'Error fetching response' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const submitChat = (event) => {
    event.preventDefault();
    void askAI(chatInput);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
            <p className="mb-3 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              AI-native newsroom
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              NewsMind AI for your hackathon demo
            </h1>
            <p className="mt-4 text-slate-300">
              Login, choose your persona, get personalized business news cards, and use AI Q&A on top of current headlines.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {PERSONAS.map((persona) => (
                <article key={persona.id} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                  <p className="text-xl">{persona.emoji}</p>
                  <h2 className="mt-2 text-lg font-semibold">{persona.label}</h2>
                  <p className="mt-2 text-sm text-slate-300">{persona.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <div className="mb-6 flex rounded-full bg-slate-800 p-1 text-sm">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  authMode === 'login' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'text-slate-300'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  authMode === 'signup' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'text-slate-300'
                }`}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-4" onSubmit={submitAuth}>
              {authMode === 'signup' && (
                <label className="block">
                  <span className="mb-1 block text-sm text-slate-300">Name</span>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none ring-cyan-400 transition focus:ring"
                    name="name"
                    value={authForm.name}
                    onChange={handleAuthInput}
                    placeholder="Your name"
                    type="text"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Email</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none ring-cyan-400 transition focus:ring"
                  name="email"
                  value={authForm.email}
                  onChange={handleAuthInput}
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Password</span>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none ring-cyan-400 transition focus:ring"
                  name="password"
                  value={authForm.password}
                  onChange={handleAuthInput}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </label>

              <button
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300"
                type="submit"
              >
                {authMode === 'signup' ? 'Create account' : 'Continue to dashboard'}
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div>
              <p className="text-sm text-slate-300">Welcome, {user.name}</p>
              <h1 className="text-2xl font-bold">Set up your AI-native newsroom</h1>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Logout
            </button>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">1) Choose your persona</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedPersona === persona.id
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-800/70 hover:border-slate-500'
                  }`}
                >
                  <p className="text-xl">{persona.emoji}</p>
                  <p className="mt-2 font-semibold">{persona.label}</p>
                  <p className="text-sm text-slate-300">{persona.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">2) Select interests</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedInterests.includes(interest)
                      ? 'border-cyan-300 bg-cyan-400 text-slate-900'
                      : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </section>

          <button
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-900 hover:bg-cyan-300"
            type="button"
            onClick={launchNewsroom}
          >
            Launch personalized dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2fr_1fr]">
        <header className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div>
            <h1 className="text-2xl font-bold">NewsMind AI Dashboard</h1>
            <p className="text-sm text-slate-300">{profileLine}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchNews}
              className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300"
            >
              Refresh feed
            </button>
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Edit profile
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/10"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
            <strong className="mr-2">Backend status:</strong>
            {health.loading ? 'Checking...' : health.ok ? `Connected (${health.message})` : `Offline (${health.message})`}
          </section>

          {newsLoading && <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">Building your personalized newsroom...</section>}

          {newsError && !newsLoading && (
            <section className="rounded-2xl border border-rose-500/40 bg-rose-900/20 p-4 text-rose-200">{newsError}</section>
          )}

          {!newsLoading && !newsError && articles.length === 0 && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">No stories found for this profile.</section>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {!newsLoading &&
              !newsError &&
              articles.map((article) => (
                <article key={article.id || article.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="rounded-full bg-cyan-500/15 px-2 py-1 font-semibold uppercase tracking-wide text-cyan-300">
                      {article.format || 'brief'}
                    </span>
                    <span>{article.source || 'Unknown source'}</span>
                  </div>

                  <h3 className="text-lg font-semibold leading-snug">{article.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{article.summary || article.description || 'No summary available'}</p>

                  <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Why this matters</p>
                    <p className="mt-1 text-sm text-slate-100">{article.whyItMatters || 'No personalized insight yet'}</p>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">{article.relevanceReason || 'General relevance'}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-lg border border-slate-600 px-3 py-2 text-xs hover:bg-slate-800"
                      type="button"
                      onClick={() => askAI(`Give me the key risk and opportunity from: ${article.title}`)}
                    >
                      Analyze with AI
                    </button>

                    <a
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white"
                      href={article.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read source
                    </a>
                  </div>
                </article>
              ))}
          </div>
        </main>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:sticky lg:top-4 lg:h-[calc(100vh-4rem)]">
          <h2 className="text-lg font-semibold">Ask AI about the news</h2>
          <p className="mt-1 text-sm text-slate-300">Use /askNews to get implications, summaries, and guidance.</p>

          <div className="mt-4 h-[55vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            {messages.length === 0 && <p className="text-sm text-slate-400">Try: “What should I monitor this week in AI markets?”</p>}
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`mb-3 rounded-lg p-3 text-sm ${
                  msg.role === 'You' ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">{msg.role}</p>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-100">{msg.text}</p>
              </div>
            ))}
            {chatLoading && <p className="text-sm text-cyan-300">AI Editor is thinking…</p>}
          </div>

          <form className="mt-3 flex gap-2" onSubmit={submitChat}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask a question about current news"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none ring-cyan-400 transition focus:ring"
            />
            <button
              className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={chatLoading}
            >
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