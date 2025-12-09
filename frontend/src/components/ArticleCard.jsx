import { Link } from 'react-router-dom'
import './ArticleCard.css'

function ArticleCard({ article }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
        return num.toString()
    }

    return (
        <Link to={`/article/${article.slug}`} className="article-card card card-interactive">
            <div className="card-body">
                <div className="article-card-header">
                    <span className={`tier-badge tier-badge-${article.tier.toLowerCase()}`}>
                        {article.tier}
                    </span>
                    <span className="article-card-score">{article.score}</span>
                </div>

                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-excerpt">{article.excerpt}</p>

                <div className="article-card-footer">
                    <span className="tag">{article.category}</span>
                    <span className="article-card-downloads">
                        {formatNumber(article.downloads)} downloads
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default ArticleCard
