const NewsAPI = require('newsapi');

const hasNewsKey = Boolean(process.env.NEWS_API_KEY);
const newsapi = hasNewsKey ? new NewsAPI(process.env.NEWS_API_KEY) : null;

const mockArticles = [
  {
    id: 'mock-1',
    title: 'Global chipmakers expand AI data-center capacity amid demand surge',
    description: 'Semiconductor suppliers announced fresh capex plans targeting enterprise AI workloads.',
    url: 'https://example.com/chips-ai-capacity',
    source: 'Market Wire',
    publishedAt: new Date().toISOString(),
    imageUrl: '',
    content: 'Chipmakers are accelerating expansion as cloud demand rises.'
  },
  {
    id: 'mock-2',
    title: 'Fintech startup raises Series B to scale SME lending platform',
    description: 'The round highlights renewed venture interest in profitability-focused fintech models.',
    url: 'https://example.com/fintech-series-b',
    source: 'Startup Desk',
    publishedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    imageUrl: '',
    content: 'Investors cited underwriting quality and default controls as strengths.'
  },
  {
    id: 'mock-3',
    title: 'Oil prices slip as supply outlook improves across major producers',
    description: 'Energy markets reacted to revised supply projections and easing logistics bottlenecks.',
    url: 'https://example.com/oil-supply-outlook',
    source: 'Commodities Daily',
    publishedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    imageUrl: '',
    content: 'Analysts expect reduced volatility if inventories continue normalizing.'
  }
];

async function fetchBusinessNews() {
  if (!hasNewsKey) {
    return mockArticles;
  }

  const res = await newsapi.v2.topHeadlines({
    category: 'business',
    language: 'en',
    country: 'us',
    pageSize: 20
  });

  return (res.articles || []).map((a, idx) => ({
    id: `${a.source.id || 'src'}-${idx}`,
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source.name,
    publishedAt: a.publishedAt,
    imageUrl: a.urlToImage,
    content: a.content
  }));
}

module.exports = { fetchBusinessNews };