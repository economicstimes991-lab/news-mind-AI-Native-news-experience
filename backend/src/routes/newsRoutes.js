const express = require('express');
const { fetchBusinessNews } = require('../services/newsService');
const { enrichArticlesForPersona, answerNewsQuestion } = require('../services/aiService');

const router = express.Router();

function normalizeInterests(input) {
  if (!input) return [];
  return String(input)
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
}

router.get('/getNews', async (req, res) => {
  try {
    const persona = req.query.persona || 'student';
    const interests = normalizeInterests(req.query.interests);

    const articles = await fetchBusinessNews();
    const enriched = await enrichArticlesForPersona(articles, persona, interests);

    res.json({
      persona,
      interests,
      articles: enriched
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

router.post('/askNews', async (req, res) => {
  try {
    const { question, persona = 'student' } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }
    const articles = await fetchBusinessNews();
    const context = articles.slice(0, 6);
    const answer = await answerNewsQuestion(question, context, persona);

    res.json({
      answer,
      usedArticles: context.map((a) => ({ id: a.id, title: a.title }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

module.exports = router;