const express = require('express');
const { fetchBusinessNews } = require('../services/newsService');
const { enrichArticlesForPersona, answerNewsQuestion } = require('../services/aiService');
const { rankAndFilterArticles, normalizeInterest } = require('../services/personalizationService');
const { upsertProfile, getProfile } = require('../services/profileStore');

const router = express.Router();

function normalizeInterests(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map(normalizeInterest).filter(Boolean);
  }

  return String(input)
    .split(',')
    .map((i) => normalizeInterest(i))
    .filter(Boolean);
}

router.get('/profile/:userId', (req, res) => {
  const profile = getProfile(req.params.userId);
  res.json({ profile });
});

router.post('/profile', (req, res) => {
  const { userId, persona, interests, roleType } = req.body || {};
  const profile = upsertProfile({
    userId,
    persona,
    interests: normalizeInterests(interests),
    roleType: roleType || persona
  });

  res.json({ profile });
});

router.get('/getNews', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const profile = getProfile(userId);

    const persona = req.query.persona || profile.persona || 'student';
    const interests = normalizeInterests(req.query.interests || profile.interests);

    const articles = await fetchBusinessNews();
    const ranked = rankAndFilterArticles(articles, interests);
    const enriched = await enrichArticlesForPersona(ranked, persona, interests);

    res.json({
      userId,
      persona,
      interests,
      totalCandidateArticles: articles.length,
      returnedArticles: enriched.length,
      articles: enriched
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch personalized news' });
  }
});

router.post('/askNews', async (req, res) => {
  try {
    const { question, persona = 'student', userId = 'guest' } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    const profile = getProfile(userId);
    const activePersona = persona || profile.persona;
    const interests = normalizeInterests(profile.interests);

    const articles = await fetchBusinessNews();
    const ranked = rankAndFilterArticles(articles, interests);
    const context = ranked.slice(0, 6);
    const answer = await answerNewsQuestion(question, context, activePersona);

    res.json({
      answer,
      usedArticles: context.map((a) => ({ id: a.id, title: a.title })),
      persona: activePersona
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

module.exports = router;