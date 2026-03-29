// ─────────────────────────────────────────────────────────────────────────────
// src/App.jsx  (UPGRADED — 3-step login flow + Insights route + preferences)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout    from './components/Layout'
import Home      from './pages/Home'
import Insights  from './pages/Insights'
import Chat      from './pages/Chat'
import Saved     from './pages/Saved'
import Settings  from './pages/Settings'
import Login     from './pages/Login'

export default function App() {
  // ── Auth + preference state ──────────────────────────────────────────────
  const [isLoggedIn,   setIsLoggedIn]   = useState(false)

  // userInterests = array of interest IDs chosen on the interest-picker screen
  // e.g. ['business', 'technology', 'ai']
  // We also try to restore from localStorage so refresh doesn't reset it
  const [userInterests, setUserInterests] = useState(() => {
    try {
      const saved = localStorage.getItem('newsmind_interests')
      return saved ? JSON.parse(saved) : ['business', 'technology']
    } catch { return ['business', 'technology'] }
  })

  // ── Bookmarks ────────────────────────────────────────────────────────────
  const [savedArticles, setSavedArticles] = useState([])

  const handleSave = (article) => {
    setSavedArticles(prev => {
      const exists = prev.find(a => a.id === article.id)
      return exists ? prev.filter(a => a.id !== article.id) : [...prev, article]
    })
  }

  const handleRemove = (id) => setSavedArticles(prev => prev.filter(a => a.id !== id))

  // ── Dark mode ────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(true)

  // ── Login handler — called by Login.jsx with the chosen interests ─────────
  // interests = e.g. ['business', 'ai', 'startups']
  const handleLogin = (interests) => {
    setUserInterests(interests)
    localStorage.setItem('newsmind_interests', JSON.stringify(interests))
    setIsLoggedIn(true)
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    setIsLoggedIn(false)
    // Keep interests saved in localStorage for next time
  }

  // Show Login (+ interest picker) if not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home page — receives user interests for personalised "For You" */}
        <Route
          path="/"
          element={
            <Layout darkMode={darkMode}>
              <Home
                savedArticles={savedArticles}
                onSave={handleSave}
                userInterests={userInterests}
              />
            </Layout>
          }
        />

        {/* ✅ NEW: Insights page — global market overview, all categories mixed */}
        <Route
          path="/insights"
          element={
            <Layout darkMode={darkMode}>
              <Insights savedArticles={savedArticles} onSave={handleSave} />
            </Layout>
          }
        />

        <Route
          path="/chat"
          element={
            <Layout darkMode={darkMode}>
              <Chat />
            </Layout>
          }
        />
        <Route
          path="/saved"
          element={
            <Layout darkMode={darkMode}>
              <Saved savedArticles={savedArticles} onRemove={handleRemove} />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout darkMode={darkMode}>
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogout={handleLogout}
                userInterests={userInterests}
              />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
