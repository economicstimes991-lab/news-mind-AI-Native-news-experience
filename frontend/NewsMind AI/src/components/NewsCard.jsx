export default function NewsCard({ article, onAsk }) {
  return (
    <div className="news-card">
      <div className="news-meta">
        <span className="news-source">{article.source}</span>
        <span className="news-time">
          {article.publishedAt
            ? new Date(article.publishedAt).toLocaleString()
            : ''}
        </span>
      </div>

      <h2 className="news-title">{article.title}</h2>

      {article.summary && (
        <div className="news-summary">
          <h4>Summary</h4>
          <p>{article.summary}</p>
        </div>
      )}

      {article.whyItMatters && (
        <div className="news-why">
          <h4>Why it matters</h4>
          <p>{article.whyItMatters}</p>
        </div>
      )}

      <div className="news-actions">
        <a href={article.url} target="_blank" rel="noreferrer">
          Read full article
        </a>
        <button type="button" onClick={() => onAsk(article)}>
          Ask about this
        </button>
      </div>
    </div>
  );
}