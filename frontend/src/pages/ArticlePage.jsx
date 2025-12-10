import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
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
                // Mock data
                setArticle({
                    id: '1',
                    title: 'Z-Image-Turbo',
                    content: `## Overview

Z-Image-Turbo represents a significant leap forward in AI-powered image generation technology. Developed by Tongyi-MAI, this model combines cutting-edge architecture with unprecedented processing speed.

## Key Features

- **Lightning Fast Generation**: Generate high-quality images in under 2 seconds
- **Superior Quality**: State-of-the-art image fidelity and detail
- **Versatile Applications**: From art creation to product visualization

## Performance

| Metric | Value |
|--------|-------|
| Generation Time | 1.8s |
| FID Score | 8.2 |
| Resolution | 1024x1024 |

## Usage

\`\`\`python
from transformers import pipeline

generator = pipeline("text-to-image", model="Tongyi-MAI/Z-Image-Turbo")
image = generator("A beautiful sunset over mountains")
image.save("output.png")
\`\`\`

## Conclusion

Z-Image-Turbo sets a new standard for image generation models.`,
                    excerpt: 'A breakthrough in fast image generation.',
                    read_time_minutes: 8,
                    author: 'TopTierModels',
                    published_at: new Date().toISOString()
                })

                setModel({
                    id: '1',
                    model_name: 'Tongyi-MAI/Z-Image-Turbo',
                    display_name: 'Z-Image-Turbo',
                    category: 'Image Generation',
                    organization: 'Tongyi-MAI',
                    license: 'MIT',
                    downloads: 125000,
                    likes: 4500,
                    huggingface_url: 'https://huggingface.co/Tongyi-MAI/Z-Image-Turbo'
                })

                setScores({
                    overall_score: 95,
                    tier: 'S',
                    performance_score: 98,
                    usability_score: 92,
                    innovation_score: 96,
                    adoption_score: 90,
                    production_score: 94
                })
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
                                <span className="stat-value">{scores.quality_score || scores.performance_score}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Speed</span>
                                <span className="stat-value">{scores.speed_score || scores.usability_score}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Freedom</span>
                                <span className="stat-value">{scores.freedom_score || scores.production_score}</span>
                            </div>
                        </div>

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
