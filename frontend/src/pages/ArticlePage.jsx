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
                // TODO: Implement Supabase fetch
                // Mock data for now
                setArticle({
                    id: '1',
                    title: 'Z-Image-Turbo: Revolutionary Image Generation',
                    content: `
## Overview

Z-Image-Turbo represents a significant leap forward in AI-powered image generation technology. Developed by Tongyi-MAI, this model combines cutting-edge architecture with unprecedented processing speed.

## Key Features

- **Lightning Fast Generation**: Generate high-quality images in under 2 seconds
- **Superior Quality**: State-of-the-art image fidelity and detail
- **Versatile Applications**: From art creation to product visualization

## Performance Benchmarks

| Metric | Z-Image-Turbo | Previous Best |
|--------|---------------|---------------|
| Generation Time | 1.8s | 4.2s |
| FID Score | 8.2 | 12.1 |
| User Preference | 78% | 22% |

## Code Example

\`\`\`python
from transformers import pipeline

# Load the model
generator = pipeline("text-to-image", model="Tongyi-MAI/Z-Image-Turbo")

# Generate an image
image = generator("A beautiful sunset over mountains")
image.save("output.png")
\`\`\`

## Conclusion

Z-Image-Turbo sets a new standard for image generation models, offering an unmatched combination of speed and quality.
          `,
                    excerpt: 'A breakthrough in fast image generation with unprecedented quality.',
                    hero_image_url: null,
                    read_time_minutes: 8,
                    author: 'TopTierModels AI',
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
                console.error('Error fetching article:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchArticle()
    }, [slug])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
    }

    if (loading) {
        return (
            <div className="article-page container">
                <div className="skeleton" style={{ height: '300px', marginBottom: '2rem' }} />
                <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '1rem', width: '100%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '1rem', width: '90%' }} />
            </div>
        )
    }

    if (!article) {
        return (
            <div className="article-page container">
                <div className="empty-state">
                    <h2>Article not found</h2>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="article-page">
            {/* Hero */}
            <header className="article-hero">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to={`/?category=${model.category}`}>{model.category}</Link>
                        <span>/</span>
                        <span>{model.display_name}</span>
                    </nav>

                    <h1 className="article-title">{article.title}</h1>

                    <div className="article-meta">
                        <span className="category-badge">{model.category}</span>
                        <span className={`tier-badge tier-badge-${scores.tier.toLowerCase()}`}>
                            {scores.tier} Tier
                        </span>
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.read_time_minutes} min read</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container">
                <div className="article-layout">
                    {/* Main Content */}
                    <article className="article-content">
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
                                                    className="btn btn-secondary"
                                                    onClick={() => copyToClipboard(String(children))}
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
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </article>

                    {/* Sidebar */}
                    <aside className="article-sidebar">
                        {/* Score Card */}
                        <div className="sidebar-card">
                            <div className="score-display">
                                <span className="score-big">{scores.overall_score}</span>
                                <span className="score-max">/100</span>
                            </div>
                            <div className={`tier-badge tier-badge-${scores.tier.toLowerCase()} tier-badge-lg`}>
                                {scores.tier} Tier
                            </div>
                        </div>

                        {/* Model Info */}
                        <div className="sidebar-card">
                            <h4>Model Info</h4>
                            <dl className="model-info-list">
                                <div>
                                    <dt>Organization</dt>
                                    <dd>{model.organization}</dd>
                                </div>
                                <div>
                                    <dt>License</dt>
                                    <dd>{model.license}</dd>
                                </div>
                                <div>
                                    <dt>Downloads</dt>
                                    <dd>{model.downloads.toLocaleString()}</dd>
                                </div>
                            </dl>
                            <a
                                href={model.huggingface_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                View on Hugging Face
                            </a>
                        </div>

                        {/* Metrics */}
                        <div className="sidebar-card">
                            <h4>Quick Metrics</h4>
                            <div className="metrics-list">
                                <div className="metric-row">
                                    <span>Performance</span>
                                    <span className="metric-value">{scores.performance_score}/100</span>
                                </div>
                                <div className="metric-row">
                                    <span>Usability</span>
                                    <span className="metric-value">{scores.usability_score}/100</span>
                                </div>
                                <div className="metric-row">
                                    <span>Innovation</span>
                                    <span className="metric-value">{scores.innovation_score}/100</span>
                                </div>
                                <div className="metric-row">
                                    <span>Adoption</span>
                                    <span className="metric-value">{scores.adoption_score}/100</span>
                                </div>
                                <div className="metric-row">
                                    <span>Production</span>
                                    <span className="metric-value">{scores.production_score}/100</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default ArticlePage
