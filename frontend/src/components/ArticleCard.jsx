import { memo, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './ArticleCard.css'

function ArticleCard({ article }) {
    // Memoize expensive computation
    const formattedDownloads = useMemo(() => {
        const num = article.downloads || 0
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
        return num > 0 ? num.toString() : ''
    }, [article.downloads])

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
                    {formattedDownloads && (
                        <span className="article-card-downloads">
                            {formattedDownloads} downloads
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

// Memoize component to prevent unnecessary re-renders
export default memo(ArticleCard, (prevProps, nextProps) => {
    return prevProps.article.id === nextProps.article.id &&
        prevProps.article.score === nextProps.article.score
})
