# NewsMind AI 🧠📰

A personalized AI-native business news platform that delivers a different business news experience for every user.

## Problem Statement

Business news in 2026 is still delivered like it is 2005 — static articles, one-size-fits-all homepages, and the same content format for everyone. Professionals, investors, founders, and students all see the same feed and must manually filter what matters to them.

**Goal:** Build a news experience that feels like "my AI editor" — something users love so much they say, "I can't go back to reading news the old way."

## Solution: NewsMind AI

**NewsMind AI** is a multi-agent, AI-powered business news platform that:
- Delivers a personalized news feed for each user.
- Lets users ask questions about the news via a chat interface.
- Generates AI insights like short summaries and "Why it matters" explanations for every important story.

---

## High-Level Features Checklist

Use this checklist to track feature development. Tick items (`[x]`) as you complete them.

### Core Product
- [ ] Basic landing page describing the product and CTA to sign in / start.
- [ ] User authentication (Firebase Auth – email/Google).
- [ ] Personalized dashboard page after login.

### News Fetching & Display
- [ ] Integrate with News API provider (GNews / NewsAPI).
- [ ] Fetch latest business/news articles from the API.
- [ ] Normalize news articles (title, description, url, source, publishedAt, image, content).
- [ ] Display news as cards in a scrollable feed.
- [ ] Show loading skeletons/spinners while news is fetched.

### AI Insights (LLM Integration)
- [ ] Connect backend to LLM provider (OpenAI / Gemini).
- [ ] Prompt to **summarize** each news article in simple language.
- [ ] Prompt to **explain** the news (context, key entities, impact).
- [ ] Prompt to generate **"Why it matters"** for the user persona (student, investor, founder, etc.).
- [ ] Attach AI-generated summary and "Why it matters" to each news card.

### Personalization & User Data
- [ ] Interest selection UI (e.g., checkboxes/chips like Startups, Markets, Tech, Policy, India, Global).
- [ ] Save user interests and profile to Firebase (Firestore).
- [ ] Personalization logic to filter articles based on selected interests.
- [ ] Basic ranking logic (e.g., score by interest match + recency).
- [ ] Optionally store saved/liked articles per user.

### Ask News (Chat Experience)
- [ ] Chat UI embedded in dashboard (message list + input box).
- [ ] Backend endpoint to handle news-related questions.
- [ ] Retrieve relevant articles as context for the question.
- [ ] LLM prompt to answer questions using recent relevant news.
- [ ] Display AI responses in the chat with loading indicators.

### UX & Polish
- [ ] Clean, responsive layout for desktop and mobile.
- [ ] Consistent design system (colors, typography, spacing).
- [ ] Smooth loading and interaction animations.
- [ ] Error and empty-state messages (no news, API failure, etc.).
- [ ] Basic accessibility (contrast, keyboard navigation where possible).

### Documentation & Submission
- [ ] README with problem, solution, tech stack, setup steps, and screenshots.
- [ ] Architecture diagram (system flow + agents).
- [ ] Description of multi-agent roles (News Fetch, AI Insight, Personalization, User Interaction).
- [ ] Simple impact model (time saved per user × number of users).
- [ ] Pitch video script and final recording.

---

## System Architecture

**System flow:**

User → Frontend (React)  
↓  
Backend API (Node/Express)  
↓           ↓  
News API    LLM API  
↓           ↓  
Filtered + AI-processed news  
↓  
Firebase (user preferences, profiles)

### Tech Stack
- **Frontend:** React, JavaScript, CSS (or TailwindCSS)
- **Backend:** Node.js, Express
- **AI:** OpenAI API or Gemini API
- **Database/Auth:** Firebase (Firestore + Auth)

---

## Frontend vs Backend Work Distribution

### Member 1 – Frontend + UI/UX (React / JS)

**Responsibilities:**
- Build **Landing Page**
  - Product overview, key value proposition, screenshots/illustrations.
  - Call-to-action to sign in or get started.
- Build **Dashboard UI**
  - Layout for personalized news feed.
  - Top navbar (logo, profile, theme toggle/search if needed).
  - Sidebar or section for interests/filters.
- Implement **News Cards**
  - Show title, source, time, tags.
  - Show AI summary and "Why it matters" text.
  - Buttons for "Read full article", "Ask about this", and optional "Save".
- Implement **Chat UI (Ask News)**
  - Chat window with user and AI message bubbles.
  - Input box and send button with loading state.
- Integrate with backend APIs
  - Call `/getNews` to render feed.
  - Call `/askNews` to show AI answers in chat.
- Handle basic auth state from Firebase (logged-in vs logged-out view).

### Member 2 – Backend + API Integration (Node / Express)

**Responsibilities:**
- Setup **Express server**
  - Configure CORS, JSON parsing, environment variables.
- Integrate **News API** (GNews / NewsAPI)
  - Utility to fetch latest business/news articles.
  - Normalize response to a common article format.
- Implement REST **Routes**
  - `GET /getNews`
    - Accept user ID or interests.
    - Fetch news from News API.
    - Pass through Personalization logic.
    - Call AI layer for summaries/explanations.
    - Return enriched articles to frontend.
  - `POST /askNews`
    - Accept `{ question, userId, optionalContext }`.
    - Retrieve relevant articles for context (optional helper from Member 4).
    - Call AI layer to generate answer.
- Connect backend with Firebase
  - Access user preferences for personalization.
- Ensure security
  - Keep API keys on server side only.
  - Optionally validate Firebase auth tokens.

### Member 3 – AI Engineer (Core Brain 🧠)

**Responsibilities:**
- Setup **LLM client** (OpenAI / Gemini) on backend.
- Design and implement **prompt templates** for:
  - Summarizing articles in 2–4 bullet points.
  - Explaining the news with background/context.
  - Generating a concise "Why it matters" tailored to the user type.
- Create reusable functions:
  - `generateSummary(article)`
  - `generateExplanation(article, audienceType)`
  - `generateWhyItMatters(article, userProfile)`
  - `answerNewsQuestion(question, contextArticles)`
- Compose the **AI Insight Agent** pipeline:
  - Input: normalized article + user profile (optional).
  - Output: summary, explanation, why-it-matters text.
- Compose the **User Interaction Agent** logic for Ask News:
  - Pick relevant articles (keyword/interest based).
  - Build combined prompt with context + question.
  - Return well-structured responses for the frontend.

### Member 4 – Data, Personalization, Firebase

**Responsibilities:**
- Setup **Firebase project**
  - Enable Firestore and Auth.
  - Provide config to frontend and backend.
- Design **data model**
  - `users` collection: { id, name, email, interests, roleType }.
  - Optional collections: `savedArticles`, `interactionHistory`.
- Implement **user profile & interest selection**
  - APIs/hooks for saving and reading interests.
  - Ensure frontend can easily read/update preferences.
- Implement **Personalization Agent**
  - Filter articles by matching their categories/keywords with user interests.
  - Compute a simple relevance score combining interest overlap + recency.
  - Provide helper used inside `/getNews` route.
- Build **Impact Model** for submission
  - Assume: user saves X minutes per article due to summaries & personalization.
  - Estimate daily time saved for N users.

---

## Project Structure (Suggested)

```text
root/
  frontend/
    src/
      components/
      pages/
      hooks/
      styles/
  backend/
    src/
      routes/
      services/
      agents/
      config/
  README.md
