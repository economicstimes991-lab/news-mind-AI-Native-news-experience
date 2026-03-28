import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import InterestSelector from '../components/InterestSelector';
import NewsCard from '../components/NewsCard';
import ChatPanel from '../components/ChatPanel';

export default function DashboardPage() {
  const { user, initialLoading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState('');
  const [interests, setInterests] = useState([]);
  const [chatSeed, setChatSeed] = useState('');

  useEffect(() => {
    if (!user || initialLoading) return;

    const load = async () => {
      try {
        setLoadingNews(true);
        setError('');
        const res = await api.get('/getNews');
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load news.');
      } finally {
        setLoadingNews(false);
      }
    };

    load();
  }, [user, initialLoading]);

  const handleAskArticle = (article) => {
    const q = `Why does this matter: "${article.title}"?`;
    setChatSeed(q);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (initialLoading) {
    return <div className="center">Loading...</div>;
  }

  if (!user) {
    return <div className="center">Please login to view your dashboard.</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>NewsMind AI</h1>
          <p>Hi {user.email}, here is your personalized business news.</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-left">
          <InterestSelector selected={interests} onChange={setInterests} />

          {loadingNews && <p>Loading news…</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="news-list">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onAsk={handleAskArticle}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-right">
          <ChatPanel initialQuestion={chatSeed} />
        </section>
      </main>
    </div>
  );
}