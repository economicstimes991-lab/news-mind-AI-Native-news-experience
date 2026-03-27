const NewsAPI = require('newsapi');

const hasNewsApiKey = Boolean(process.env.NEWS_API_KEY);
const hasGNewsKey = Boolean(process.env.GNEWS_API_KEY);
const newsapi = hasNewsApiKey ? new NewsAPI(process.env.NEWS_API_KEY) : null;

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

function normalizeArticle(a, idx) {
  return {
    id: `${a.source?.id || a.source?.name || 'src'}-${idx}`,
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name || a.source || 'Unknown source',
    publishedAt: a.publishedAt,
    imageUrl: a.urlToImage || a.image || '',
    content: a.content
  };
}

async function fetchFromNewsApi() {
  const res = await newsapi.v2.topHeadlines({
    category: 'business',
    language: 'en',
    country: 'us',
    pageSize: 30
  });

  return (res.articles || []).map(normalizeArticle);
}

async function fetchFromGNews() {
  const url = new URL('https://gnews.io/api/v4/top-headlines');
  url.searchParams.set('token', process.env.GNEWS_API_KEY);
  url.searchParams.set('topic', 'business');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('country', 'us');
  url.searchParams.set('max', '30');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`GNews request failed (${response.status})`);
  }

  const body = await response.json();
  return (body.articles || []).map(normalizeArticle);
}

async function fetchBusinessNews() {
  try {
    if (hasNewsApiKey) {
      return await fetchFromNewsApi();
    }

    if (hasGNewsKey) {
      return await fetchFromGNews();
    }

    return mockArticles;
  } catch (error) {
    console.error('Failed fetching live news, falling back to mock data.', error.message);
    return mockArticles;
  }
}

module.exports = { fetchBusinessNews };