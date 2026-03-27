const express = require('express');
const { fetchBusinessNews } = require('../services/newsService');
const router = express.Router();

const { answerNewsQuestion } = require('../services/aiService');

router.post('/askNews', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    // simple context: fetch some latest articles
    const articles = await fetchBusinessNews();
    const context = articles.slice(0, 5);

    const answer = await answerNewsQuestion(question, context);
    res.json({ answer, usedArticles: context.map(a => ({ id: a.id, title: a.title })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

router.get('/getNews', async (req, res) => {
  try {
    // later: read userId/interests from req.query or req.headers
    const articles = await fetchBusinessNews();
    res.json({ articles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;