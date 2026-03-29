<div align="center">

# 🧠 NewsMind AI

### An AI-native, personalized business news intelligence platform

*Reads the news. Understands context. Explains what matters — just for you.*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/LLM-Groq_Llama_3.3_70B-F55036?style=flat-square)](https://console.groq.com)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Problem](#-problem)
- [Solution](#-solution)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Performance](#-performance-optimizations)
- [Security](#-security)
- [Impact Model](#-impact-model)

---

## 🚨 Problem

Business professionals, founders, and students consume **100+ news articles per week** but extract very little actionable value. The core pain points:

- **Volume overload** — RSS feeds, newsletters, LinkedIn, Twitter all competing for attention
- **Context gap** — Raw headlines give no "so what?" for *your* specific role or portfolio
- **No personalization** — Bloomberg is for finance; TechCrunch is for tech; nothing adapts to *you*
- **Time cost** — Analysts estimate 45–90 minutes/day are spent skimming news with low ROI

> **The result:** People make decisions with incomplete context, or spend too much time gathering it.

---

## 💡 Solution

NewsMind AI is a **full-stack, AI-native news platform** that:

1. **Fetches** live business headlines from NewsAPI in real time
2. **Ranks** articles by your declared interests (Markets, AI, Startups, Policy, Commodities, Earnings) and recency
3. **Enriches** each article with an LLM — generating a 2-bullet summary, 1-sentence contextual explanation, and a personalized "Why it matters" insight for your persona (Investor / Founder / Student)
4. **Answers** your ad-hoc questions in a chat interface, grounded strictly in today's actual headlines — no hallucination

The whole pipeline runs in **under 4 seconds** on a cold load thanks to dual-layer caching.

---

## 🎥 Live Demo

> **Video walkthrough:** [Watch the 3-minute pitch →](https://youtu.be/YOUR_VIDEO_LINK)

**Test the API directly (no auth required):**
```bash
# Get AI-enriched news
curl "http://localhost:3000/api/getNews?interests=ai,markets&persona=investor"

# Ask the AI
curl -X POST http://localhost:3000/api/askNews \
  -H "Content-Type: application/json" \
  -d '{"question":"What should I watch in markets this week?","persona":"investor"}'
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email/password + Google Sign-In via Firebase Auth |
| 🎯 **Onboarding** | Persona selection (Investor / Founder / Student) + interest chips |
| 📰 **Live Feed** | Real-time business news from NewsAPI, ranked by relevance + recency |
| 🤖 **AI Summaries** | Groq Llama 3.3 70B generates bullet summaries tailored to your persona |
| 💡 **Why It Matters** | One-sentence impact insight, personalized to your role |
| 💬 **News Chat** | Ask anything; AI answers in bullets grounded in today's articles |
| 💾 **Profile Persistence** | Interests + persona saved to Firestore, restored on every login |
| ⚡ **Smart Caching** | 5-min news cache + 15-min LLM cache — zero redundant API calls |
| 📱 **Responsive Design** | Works on desktop and mobile |
| 🛡️ **Rate Limiting** | 100 req/15min general; 15 req/min on AI endpoints |
| 🔄 **Graceful Fallbacks** | Mock articles + static summaries if APIs are unavailable |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | SPA with fast HMR and dev proxy |
| **Routing** | React Router v6 | Client-side navigation with protected routes |
| **Auth (client)** | Firebase Auth SDK v10 | Email/password + Google OAuth |
| **Backend** | Node.js + Express 4 | REST API server |
| **LLM** | Groq API (`llama-3.3-70b-versatile`) | Article enrichment + Q&A |
| **News Data** | NewsAPI (+ GNews fallback) | Live business headlines |
| **Database** | Cloud Firestore (Firebase Admin SDK) | User profile persistence |
| **Caching** | node-cache | In-memory TTL cache (news 5min + LLM 15min) |
| **Security** | helmet + cors + express-rate-limit | HTTP hardening + rate limiting |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│   React 18 + Vite  (http://localhost:5173)                          │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐    │
│  │  Landing   │  │Login/Signup│  │ Onboarding │  │  Dashboard  │    │
│  │   Page     │  │   Pages    │  │   Page     │  │ Feed + Chat │    │
│  └────────────┘  └────────────┘  └────────────┘  └─────────────┘    │
│        │               │                               │            │
│  firebase.js      firebase.js                    services/api.js    │
│  (Auth SDK)       (Auth SDK)                     (axios + token)    │
└────────┼───────────────┼───────────────────────────────┼────────────┘
         │               │                               │
         ▼               ▼                               ▼
┌─────────────────┐                      ┌──────────────────────────────┐
│  Firebase Auth  │                      │  Express Backend :3000       │
│  (Google Cloud) │                      │                              │
│                 │   verifyIdToken()    │  Middleware Stack:           │
│  Email/Password │◄─────────────────────│  helmet → cors → rateLimit   │
│  Google OAuth   │                      │  → optionalAuth → routes     │
└─────────────────┘                      │                              │
         │                               │  GET  /api/getNews           │
         │ ID Token                      │  POST /api/askNews           │
         ▼                               │  GET  /api/profile/:id       │
┌─────────────────┐                      │  POST /api/profile           │
│   Firestore     │◄────────────────────►│                              │
│                 │  read/write profile  │  news.controller             │
│  users/{uid}    │                      │    ↓ fetchBusinessNews()     │
│  {              │                      │    ↓ rankAndFilter()         │
│   persona,      │                      │    ↓ enrichArticles()        │
│   interests,    │                      │                              │
│   name, email   │                      │  NodeCache                   │
│  }              │                      │  newsCache  (TTL: 5 min)     │
└─────────────────┘                      │  llmCache   (TTL: 15 min)    │
                                         └──────────────┬───────────────┘
                                                        │
                              ┌─────────────────────────┤
                              │                         │
                              ▼                         ▼
                 ┌─────────────────────┐   ┌────────────────────────┐
                 │      NewsAPI        │   │      Groq API          │
                 │                     │   │                        │
                 │  topHeadlines       │   │  llama-3.3-70b         │
                 │  (business, en, us) │   │                        │
                 │  30 articles/req    │   │  enrichArticles():     │
                 │                     │   │  batch JSON prompt     │
                 │  Fallback: GNews    │   │  → summary + why       │
                 │  Fallback: mock[]   │   │                        │
                 └─────────────────────┘   │  answerQuestion():     │
                                           │  context + QA prompt   │
                                           │  → bullet-point answer │
                                           └────────────────────────┘
```

### Data flow — GET /api/getNews

```
1. Browser sends GET /api/getNews?interests=ai,markets&persona=investor
2. optionalAuth middleware extracts Firebase UID if token present
3. news.controller fetches profile from Firestore (or memory fallback)
4. news.service.fetchBusinessNews()
   ├─ Cache hit? → return cached articles (5-min TTL)
   └─ Cache miss? → NewsAPI call → normalize → cache → return
5. personalization.service.rankAndFilterArticles()
   ├─ Score each article against interest KEYWORD_MAP
   ├─ Add recency boost (age tiers: <2h, <6h, <12h, <24h, <48h)
   └─ Sort desc, slice top 20, send top 12 to AI
6. llm/ai.service.enrichArticlesForPersona()
   ├─ Cache hit? → return cached enriched cards (15-min TTL)
   └─ Cache miss? → build batch prompt → Groq API (single call)
       → parse JSON → merge with articles → cache → return
7. res.json({ articles, persona, interests, counts })
```

### Data flow — POST /api/askNews

```
1. Browser sends POST /api/askNews { question, persona, userId }
2. Fetch + rank articles (uses same L1 cache from /getNews if warm)
3. Take top 6 ranked articles as LLM context
4. Build QA prompt with persona guidance + article context
5. Groq API → bullet-point answer (strictly grounded in context)
6. res.json({ answer, persona, usedArticles })
```

---

## 📁 Project Structure

```
newsmind-ai/
│
├── backend/                           # Node.js + Express REST API
│   ├── src/
│   │   ├── index.js                   # App bootstrap: middleware, routes, listen
│   │   ├── config/
│   │   │   ├── firebase.config.js     # Admin SDK init (env-vars, no JSON file)
│   │   │   └── cache.config.js        # Two NodeCache instances
│   │   ├── routes/
│   │   │   ├── news.routes.js         # /getNews + /askNews routes
│   │   │   └── user.routes.js         # /profile routes
│   │   ├── controllers/
│   │   │   ├── news.controller.js     # Orchestrates fetch → rank → enrich
│   │   │   └── user.controller.js     # Profile CRUD handlers
│   │   ├── services/
│   │   │   ├── news.service.js        # NewsAPI + GNews + mock fallback
│   │   │   ├── personalization.service.js  # Keyword scoring + recency ranking
│   │   │   └── profile.store.js       # Firestore read/write + memory fallback
│   │   └── middleware/
│   │       ├── auth.middleware.js     # optionalAuth + requireAuth
│   │       └── error.middleware.js    # asyncHandler + global error handler
│   ├── package.json
│   └── .env.example
│
├── llm/                               # AI service layer (shared module)
│   ├── ai.service.js                  # enrichArticlesForPersona + answerNewsQuestion
│   └── promptTemplates.js             # buildEnrichmentPrompt + buildQAPrompt
│
└── frontend/                          # React 18 + Vite SPA
    ├── index.html                     # Entry HTML (Syne + DM Sans fonts)
    ├── vite.config.js                 # Dev proxy: /api → localhost:3000
    ├── src/
    │   ├── main.jsx                   # BrowserRouter + AuthProvider + UserPrefsProvider
    │   ├── App.jsx                    # Route tree (PublicRoute + PrivateRoute guards)
    │   ├── firebase.js                # Firebase client SDK (auth + db + googleProvider)
    │   ├── index.css                  # Design system tokens, global styles, skeletons
    │   ├── pages/
    │   │   ├── LandingPage.jsx        # Hero section, features, personas, CTA
    │   │   ├── LoginPage.jsx          # Email + Google auth with error handling
    │   │   ├── SignupPage.jsx         # Registration with Google, profile init
    │   │   ├── OnboardingPage.jsx     # Persona picker + interest chips → save to Firestore
    │   │   └── DashboardPage.jsx      # News grid + chat sidebar + profile edit drawer
    │   ├── components/
    │   │   ├── NewsCard.jsx           # Article card with expandable explanation + skeleton
    │   │   ├── ChatPanel.jsx          # Q&A interface: auto-scroll, auto-send, suggestions
    │   │   ├── InterestSelector.jsx   # Chip toggle (IDs match backend KEYWORD_MAP)
    │   │   └── Navbar.jsx             # Sticky header: persona badge, refresh, logout
    │   ├── context/
    │   │   ├── AuthContext.jsx        # onAuthStateChanged wrapper (no flash of login)
    │   │   └── UserPrefsContext.jsx   # Persona + interests (localStorage persistence)
    │   └── services/
    │       └── api.js                 # axios instance: VITE_ env vars, token interceptor
    ├── package.json
    └── .env.example
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **NewsAPI key** — Free at [newsapi.org](https://newsapi.org/) (100 req/day free tier)
- **Groq API key** — Free at [console.groq.com](https://console.groq.com/)
- **Firebase project** — Free at [console.firebase.google.com](https://console.firebase.google.com/) (Auth + Firestore)

> 💡 **No keys yet?** The app still runs — mock articles load and AI summaries use static fallbacks.

---

### Step 1 — Clone

```bash
git clone https://github.com/YOUR_USERNAME/newsmind-ai.git
cd newsmind-ai
```

### Step 2 — Backend

```bash
cd backend
cp .env.example .env
# Open .env and fill in your API keys
npm install
npm run dev
# ✅ Server: http://localhost:3000
```

Verify it works:
```bash
curl http://localhost:3000/health
# → {"status":"ok","service":"newsmind-backend"}

curl "http://localhost:3000/api/getNews?interests=ai&persona=student"
# → {"articles":[...]}
```

### Step 3 — Frontend

```bash
cd ../frontend
cp .env.example .env
# Open .env and fill in your Firebase web config
npm install
npm run dev
# ✅ App: http://localhost:5173
```

### Step 4 — Use it

1. Go to `http://localhost:5173`
2. Click **Get Started** → sign up (email or Google)
3. Select persona + interests → **Launch newsroom**
4. Read AI-enriched news cards
5. Click **Ask AI** on any card or type in the chat panel

---

## 🔑 Environment Variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Default: `3000` |
| `NODE_ENV` | No | `development` or `production` |
| `NEWS_API_KEY` | ⭐ Recommended | From [newsapi.org](https://newsapi.org/) |
| `GROQ_API_KEY` | ⭐ Recommended | From [console.groq.com](https://console.groq.com/) |
| `GROQ_MODEL` | No | Default: `llama-3.3-70b-versatile` |
| `FIREBASE_PROJECT_ID` | Optional | Firebase Project Settings |
| `FIREBASE_CLIENT_EMAIL` | Optional | Firebase Service Accounts |
| `FIREBASE_PRIVATE_KEY` | Optional | Firebase Service Accounts (include quotes) |
| `FRONTEND_URL` | No | Default: `http://localhost:5173` |

### `frontend/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Console → Web App Config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Same |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Same |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Same |
| `VITE_FIREBASE_APP_ID` | Yes | Same |
| `VITE_API_BASE_URL` | No | Default: `/api` (Vite proxy handles it) |

---

## 🧪 API Reference

### `GET /health`
```bash
curl http://localhost:3000/health
```
```json
{ "status": "ok", "service": "newsmind-backend", "timestamp": "2024-01-15T10:00:00Z" }
```

---

### `GET /api/getNews`

Returns personalized, AI-enriched articles.

| Param | Type | Example | Description |
|---|---|---|---|
| `interests` | string | `ai,markets` | Comma-separated interest IDs |
| `persona` | string | `investor` | `investor`, `founder`, or `student` |
| `userId` | string | `uid123` | Optional: loads saved profile from Firestore |

**Valid interest IDs:** `markets` · `startups` · `ai` · `policy` · `commodities` · `earnings`

```bash
curl "http://localhost:3000/api/getNews?interests=ai,markets&persona=investor"
```

<details>
<summary>Sample response</summary>

```json
{
  "userId": "guest",
  "persona": "investor",
  "interests": ["ai", "markets"],
  "totalCandidateArticles": 30,
  "returnedArticles": 8,
  "articles": [
    {
      "id": "techcrunch-0",
      "title": "Global chipmakers expand AI data-center capacity",
      "source": "TechCrunch",
      "publishedAt": "2024-01-15T09:30:00Z",
      "url": "https://techcrunch.com/...",
      "summary": "• Semiconductor suppliers announced $12B capex expansion for AI workloads\n• Demand driven by hyperscaler cloud buildout across AWS, Azure, GCP",
      "explanation": "This signals enterprise AI adoption has crossed the chasm — suppliers committing multi-year capital, not just short-term demand.",
      "whyItMatters": "Long chipmaker supply chains lock in multi-year revenue visibility for NVDA, AMD, and TSMC.",
      "relevanceReason": "Matched to: ai, markets",
      "format": "signal",
      "angle": "investor",
      "ranking": { "totalScore": 8.2, "interestScore": 2, "recencyScore": 2.2, "matchedInterests": ["ai","markets"] }
    }
  ]
}
```
</details>

---

### `POST /api/askNews`

Ask the AI a question. Answer is grounded in today's articles only.

```bash
curl -X POST http://localhost:3000/api/askNews \
  -H "Content-Type: application/json" \
  -d '{"question": "What is happening in global markets?", "persona": "investor"}'
```

<details>
<summary>Sample response</summary>

```json
{
  "answer": "• Fed signaling a pause suggests rate-sensitive sectors (REITs, utilities, growth tech) may see relief rallies\n• Bond markets have priced in 2 cuts by Q3 — equity positioning should reflect this lag\n• Watch credit spreads: if they tighten alongside rate pause, risk-on sentiment is genuine\n• Commodity inflation remains a wildcard — oil above $85 could re-ignite CPI and delay cuts\n• Key risk: stronger-than-expected jobs data could force the Fed to resume hiking",
  "persona": "investor",
  "usedArticles": [
    { "id": "reuters-0", "title": "Fed signals pause in rate hikes", "source": "Reuters" }
  ]
}
```
</details>

---

### `POST /api/profile`

```bash
curl -X POST http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{"userId":"uid123","persona":"founder","interests":["startups","ai"],"name":"Alex","email":"alex@example.com"}'
```

### `GET /api/profile/:userId`

```bash
curl http://localhost:3000/api/profile/uid123
```

---

## ⚡ Performance Optimizations

| Optimization | How | Result |
|---|---|---|
| **News cache (L1)** | `node-cache` 5-min TTL | NewsAPI called once per 5 min regardless of traffic |
| **LLM cache (L2)** | `node-cache` 15-min TTL, key = articles+persona+interests | Same feed → zero Groq API calls |
| **Single batch LLM call** | All 12 articles in one Groq prompt returning JSON array | ~85% faster vs per-article calls |
| **Skeleton loaders** | `NewsCardSkeleton` fills the grid immediately | Perceived load feels instant |
| **Vite proxy** | `/api` proxied to `:3000` in dev | No CORS friction |
| **Rate limiting** | 100/15min general, 15/min AI | Prevents LLM cost runaway |
| **Graceful fallbacks** | Mock data + static summaries | Zero downtime if APIs fail |
| **In-memory profile** | `Map` + Firestore write-through | Fast reads, durable writes |

---

## 🔒 Security

- **API keys are backend-only** — never sent to the browser
- `helmet` adds 11 secure HTTP response headers
- `cors` restricts origins to `FRONTEND_URL` only
- Rate limiting: general routes + stricter AI route limits
- Firebase Admin SDK validates ID tokens on all authenticated requests
- `.env` files excluded by `.gitignore`
- Firebase private key `\n` → newline handled safely in code

---

## 📊 Impact Model

*See full model in [IMPACT_MODEL.md](./IMPACT_MODEL.md)*

**500 MAU, 12-month snapshot:**

| Metric | Value |
|---|---|
| Time saved per user/week | ~42 minutes |
| Annual time saved (500 users) | ~18,200 hours |
| LLM cost per user/month | ~$0.009 |
| Annual infrastructure cost | < $300 |
| Equivalent analyst time value | ~$910,000 / year |

---

## 🗺️ Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Full agent roles, communication flows, error handling
- [IMPACT_MODEL.md](./IMPACT_MODEL.md) — Quantified business case with assumptions

---

## 📝 License

MIT © 2026 NewsMind AI

---

<div align="center">

Built with ❤️ using **Groq** · **NewsAPI** · **Firebase** · **React** · **Node.js**

*Submitted for the ET GenAI Hackathon 2026*

</div>
