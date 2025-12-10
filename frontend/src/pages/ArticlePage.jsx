import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getArticleBySlug } from '../lib/supabase'
import './ArticlePage.css'

function ArticlePage() {
    const { slug } = useParams()
    const [article, setArticle] = useState(null)
    const [model, setModel] = useState(null)
    const [scores, setScores] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true)
            try {
                const data = await getArticleBySlug(slug)

                if (!data) {
                    throw new Error('Article not found')
                }

                setArticle({
                    id: data.id,
                    title: data.title,
                    content: data.content,
                    excerpt: data.excerpt,
                    read_time_minutes: data.read_time_minutes,
                    author: data.author,
                    published_at: data.published_at
                })

                setModel({
                    id: data.models.id,
                    model_name: data.models.model_name,
                    display_name: data.models.display_name,
                    category: data.models.category,
                    organization: data.models.organization,
                    license: data.models.license,
                    downloads: data.models.downloads,
                    likes: data.models.likes,
                    huggingface_url: data.models.huggingface_url,
                    code_snippets: data.models.code_snippets,
                    tags: data.models.tags || []
                })

                setScores(data.models.model_scores)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchArticle()
    }, [slug])

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
        return num.toString()
    }

    if (loading) {
        return (
            <div className="article-page container">
                <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '1rem', width: '100%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '1rem', width: '80%' }} />
            </div>
        )
    }

    if (!article) {
        return (
            <div className="article-page container">
                <div className="empty-state">
                    <h3>Model not found</h3>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="article-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Models</Link>
                    <span>/</span>
                    <span>{model.category}</span>
                    <span>/</span>
                    <span>{model.display_name}</span>
                </nav>

                <div className="article-layout">
                    {/* Main Content */}
                    <main className="article-main">
                        <header className="article-header">
                            <div className="article-meta-row">
                                <span className={`tier-badge tier-badge-${scores.tier.toLowerCase()} tier-badge-lg`}>
                                    {scores.tier}
                                </span>
                                <span className="tag">{model.category}</span>
                            </div>
                            <h1>{article.title}</h1>
                            <p className="article-excerpt">{article.excerpt}</p>
                        </header>

                        <article className="article-content prose">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <div className="code-block">
                                                <div className="code-block-header">
                                                    <span>{match[1]}</span>
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => navigator.clipboard.writeText(String(children))}
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className={className} {...props}>{children}</code>
                                        )
                                    }
                                }}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </article>
                    </main>

                    {/* Sidebar */}
                    <aside className="article-sidebar">
                        {/* Score */}
                        <div className="sidebar-card">
                            <div className="score">
                                <span className="score-value">{scores.overall_score}</span>
                                <span className="score-max">/100</span>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="sidebar-card">
                            <h4 className="sidebar-title">Metrics</h4>
                            <div className="stat-row">
                                <span className="stat-label">Quality</span>
                                <span className="stat-value">{scores.quality_score}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Speed</span>
                                <span className="stat-value">{scores.speed_score}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Freedom</span>
                                <span className="stat-value">{scores.freedom_score}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        {model.tags && model.tags.length > 0 && (
                            <div className="sidebar-card">
                                <h4 className="sidebar-title">Tags</h4>
                                <div className="model-tags">
                                    {model.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="model-tag"
                                            style={{ backgroundColor: 'rgb(29, 78, 216)' }} // Use a default nice blue
                                        >
                                            {typeof tag === 'string' ? tag : tag.tag_name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Info */}
                        <div className="sidebar-card">
                            <h4 className="sidebar-title">Details</h4>
                            <div className="stat-row">
                                <span className="stat-label">Organization</span>
                                <span className="stat-value">{model.organization}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">License</span>
                                <span className="stat-value">{model.license}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Downloads</span>
                                <span className="stat-value">{formatNumber(model.downloads)}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Likes</span>
                                <span className="stat-value">{formatNumber(model.likes)}</span>
                            </div>
                        </div>

                        <a
                            href={model.huggingface_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            View on Hugging Face →
                        </a>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default ArticlePage
