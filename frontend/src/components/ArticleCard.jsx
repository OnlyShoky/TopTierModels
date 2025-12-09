import { Link } from 'react-router-dom'
import './ArticleCard.css'

function ArticleCard({ article }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <Link to={`/article/${article.slug}`} className="article-card card">
            <div className="article-card-image">
                {article.hero_image_url ? (
                    <img src={article.hero_image_url} alt={article.title} />
                ) : (
                    <div className="article-card-placeholder">
                        <span>🤖</span>
                    </div>
                )}
                <div className="article-card-badges">
                    <span className="category-badge">{article.category}</span>
                    <span className={`tier-badge tier-badge-${article.tier.toLowerCase()}`}>
                        {article.tier}
                    </span>
                </div>
            </div>
            <div className="card-body">
                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-excerpt">{article.excerpt}</p>
                <div className="article-card-meta">
                    <span>{formatDate(article.published_at)}</span>
                    <span>•</span>
                    <span>{article.read_time_minutes} min read</span>
                </div>
            </div>
        </Link>
    )
}

export default ArticleCard
