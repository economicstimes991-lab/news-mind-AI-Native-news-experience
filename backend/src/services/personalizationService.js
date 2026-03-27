const KEYWORD_MAP = {
  markets: ['market', 'stocks', 'equity', 'indices', 'trading', 'wall street'],
  startups: ['startup', 'funding', 'series', 'vc', 'venture', 'founder'],
  ai: ['ai', 'artificial intelligence', 'llm', 'chip', 'semiconductor', 'model'],
  policy: ['policy', 'regulation', 'government', 'fed', 'central bank', 'law'],
  commodities: ['oil', 'gas', 'gold', 'commodity', 'metals', 'energy'],
  earnings: ['earnings', 'quarterly', 'revenue', 'profit', 'guidance']
};

function normalizeInterest(value = '') {
  return value.trim().toLowerCase();
}

function extractArticleText(article) {
  return [article.title, article.description, article.content, article.source]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function computeInterestScore(article, interests = []) {
  const text = extractArticleText(article);
  const normalizedInterests = interests.map(normalizeInterest);

  let matches = 0;
  const reasons = [];

  normalizedInterests.forEach((interest) => {
    const keywords = KEYWORD_MAP[interest] || [interest];
    const hit = keywords.some((keyword) => text.includes(keyword));
    if (hit) {
      matches += 1;
      reasons.push(interest);
    }
  });

  return {
    score: matches,
    reasons
  };
}

function computeRecencyBoost(publishedAt) {
  if (!publishedAt) return 0;
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  if (Number.isNaN(ageHours)) return 0;
  if (ageHours < 4) return 2;
  if (ageHours < 12) return 1.2;
  if (ageHours < 24) return 0.8;
  if (ageHours < 48) return 0.4;
  return 0;
}

function rankAndFilterArticles(articles = [], interests = []) {
  const scored = articles.map((article) => {
    const { score: interestScore, reasons } = computeInterestScore(article, interests);
    const recencyScore = computeRecencyBoost(article.publishedAt);
    const totalScore = interestScore * 3 + recencyScore;

    return {
      ...article,
      ranking: {
        totalScore: Number(totalScore.toFixed(2)),
        interestScore,
        recencyScore: Number(recencyScore.toFixed(2)),
        matchedInterests: reasons
      }
    };
  });

  const hasInterests = interests.length > 0;
  const filtered = hasInterests
    ? scored.filter((article) => article.ranking.interestScore > 0)
    : scored;

  return filtered
    .sort((a, b) => b.ranking.totalScore - a.ranking.totalScore)
    .slice(0, 20);
}

module.exports = {
  rankAndFilterArticles,
  normalizeInterest
};