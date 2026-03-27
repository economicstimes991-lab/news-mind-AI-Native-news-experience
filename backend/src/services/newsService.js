const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

async function fetchBusinessNews() {
  const res = await newsapi.v2.topHeadlines({
    category: 'business',
    language: 'en',
    country: 'in'
  });
  return res.articles.map((a, idx) => ({
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