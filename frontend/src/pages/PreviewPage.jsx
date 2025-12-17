import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import usePreviewWebSocket from '../hooks/usePreviewWebSocket'
import './ArticlePage.css'
import './PreviewPage.css'

function PreviewPage() {
    const { previewId } = useParams()
    const [previewData, setPreviewData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)
    const [activeTab, setActiveTab] = useState('article') // 'article' or 'linkedin'
    const [copySuccess, setCopySuccess] = useState(false)

    const { data: wsData, isConnected } = usePreviewWebSocket(previewId, true)

    useEffect(() => {
        if (wsData) {
            setPreviewData(wsData)
            setLoading(false)
        }
    }, [wsData])

    useEffect(() => {
        const fetchPreview = async () => {
            if (previewData) return
            setLoading(true)
            try {
                const response = await fetch(`/api/preview/${previewId}`)
                if (response.ok) {
                    const data = await response.json()
                    setPreviewData(data)
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPreview()
    }, [previewId, previewData])

    const handlePublish = async () => {
        setPublishing(true)
        try {
            const response = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preview_id: previewId, trigger_netlify_rebuild: true })
            })
            if (response.ok) {
                const result = await response.json()
                alert(`Published! ${result.live_url}`)
            }
        } catch (error) {
            alert('Publish failed: ' + error.message)
        } finally {
            setPublishing(false)
        }
    }

    const handleCopy = () => {
        if (previewData?.linkedin_data?.content) {
            navigator.clipboard.writeText(previewData.linkedin_data.content)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        }
    }

    const formatNumber = (num) => {
        if (!num) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
        return num.toString()
    }

    const [linkedinConnected, setLinkedinConnected] = useState(false)

    // Check LinkedIn status
    useEffect(() => {
        fetch('/api/linkedin/status')
            .then(res => res.json())
            .then(data => setLinkedinConnected(data.connected))
            .catch(err => console.error('LinkedIn status check failed', err))
    }, [])

    const handleConnectLinkedIn = async () => {
        try {
            const res = await fetch('/api/linkedin/auth')
            const data = await res.json()
            if (data.url) {
                // Open popup
                const width = 600
                const height = 700
                const left = (window.innerWidth - width) / 2
                const top = (window.innerHeight - height) / 2

                window.open(
                    data.url,
                    'LinkedInAuth',
                    `width=${width},height=${height},left=${left},top=${top}`
                )

                // Listen for message from popup
                const handleMessage = (event) => {
                    if (event.data && event.data.type === 'LINKEDIN_CONNECTED') {
                        setLinkedinConnected(true)
                        alert('LinkedIn connected successfully!')
                        window.removeEventListener('message', handleMessage)
                    }
                }
                window.addEventListener('message', handleMessage)
            }
        } catch (err) {
            console.error(err)
            alert('Failed to start LinkedIn connection')
        }
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

    if (!previewData) {
        return (
            <div className="article-page container">
                <div className="empty-state">
                    <h3>Preview not found</h3>
                    <p>Session may have expired</p>
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        )
    }

    const article = previewData.article_data || {}
    const model = previewData.model_data || {}
    const scores = previewData.scores_data || {}
    const linkedin = previewData.linkedin_data || {}

    return (
        <div className="article-page">
            <div className="container">
                {/* Preview Banner */}
                <div className="preview-banner">
                    <div className="preview-banner-left">
                        <span className="preview-badge">Preview</span>
                        {isConnected && <span className="preview-live">Live</span>}
                        <span className="preview-id">ID: {previewId}</span>
                    </div>
                    <div className="preview-banner-right">
                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                            {copySuccess ? '✓ Copied' : 'Copy LinkedIn'}
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handlePublish} disabled={publishing}>
                            {publishing ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="preview-tabs">
                    <button
                        className={`preview-tab ${activeTab === 'article' ? 'active' : ''}`}
                        onClick={() => setActiveTab('article')}
                    >
                        Article Preview
                    </button>
                    <button
                        className={`preview-tab ${activeTab === 'linkedin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('linkedin')}
                    >
                        LinkedIn Post
                    </button>
                </div>

                {/* Article Tab */}
                {activeTab === 'article' && (
                    <>
                        {/* Breadcrumb */}
                        <nav className="breadcrumb">
                            <Link to="/">Models</Link>
                            <span>/</span>
                            <span>{model.category || 'Other'}</span>
                            <span>/</span>
                            <span>{model.display_name}</span>
                        </nav>

                        <div className="article-layout">
                            {/* Main Content */}
                            <main className="article-main">
                                <header className="article-header">
                                    <div className="article-meta-row">
                                        <span className={`tier-badge tier-badge-${(scores.tier || 'b').toLowerCase()} tier-badge-lg`}>
                                            {scores.tier || 'B'}
                                        </span>
                                        <span className="tag">{model.category || 'Other'}</span>
                                    </div>
                                    <h1>{article.title || model.display_name}</h1>
                                    <p className="article-excerpt">{article.excerpt}</p>
                                </header>

                                <article className="article-content prose">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            pre: ({ children }) => <>{children}</>,
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                if (!inline && match) {
                                                    return (
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
                                                    )
                                                } else if (!inline) {
                                                    return (
                                                        <pre className="not-prose bg-gray-800 p-4 rounded-lg overflow-x-auto">
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        </pre>
                                                    )
                                                } else {
                                                    return (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }
                                        }}
                                    >
                                        {article.content || ''}
                                    </ReactMarkdown>
                                </article>
                            </main>

                            {/* Sidebar */}
                            <aside className="article-sidebar">
                                {/* Score */}
                                <div className="sidebar-card">
                                    <div className="score">
                                        <span className="score-value">{Math.round(scores.overall_score || 0)}</span>
                                        <span className="score-max">/100</span>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="sidebar-card">
                                    <h4 className="sidebar-title">Metrics</h4>
                                    <div className="stat-row">
                                        <span className="stat-label">Quality</span>
                                        <span className="stat-value">{scores.quality_score || 0}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="stat-label">Speed</span>
                                        <span className="stat-value">{scores.speed_score || 0}</span>
                                    </div>
                                    <div className="stat-row">
                                        <span className="stat-label">Freedom</span>
                                        <span className="stat-value">{scores.freedom_score || 0}</span>
                                    </div>
                                </div>

                                {/* Tags - use seo_keywords from article */}
                                {article.seo_keywords && article.seo_keywords.length > 0 && (
                                    <div className="sidebar-card">
                                        <h4 className="sidebar-title">Tags</h4>
                                        <div className="model-tags">
                                            {article.seo_keywords.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="model-tag"
                                                    style={{ backgroundColor: 'rgb(29, 78, 216)' }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Info */}
                                <div className="sidebar-card">
                                    <h4 className="sidebar-title">Details</h4>
                                    {model.organization && (
                                        <div className="stat-row">
                                            <span className="stat-label">Organization</span>
                                            <span className="stat-value">{model.organization}</span>
                                        </div>
                                    )}
                                    {model.license && (
                                        <div className="stat-row">
                                            <span className="stat-label">License</span>
                                            <span className="stat-value">
                                                {model.model_metadata?.license_url ? (
                                                    <a
                                                        href={model.model_metadata.license_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline hover:text-blue-500"
                                                    >
                                                        {model.license.replace(/^license:/, '')}
                                                    </a>
                                                ) : (
                                                    model.license.replace(/^license:/, '')
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {model.model_size && (
                                        <div className="stat-row">
                                            <span className="stat-label">Model Size</span>
                                            <span className="stat-value">{model.model_size}</span>
                                        </div>
                                    )}
                                    {model.tensor_types && model.tensor_types.length > 0 && (
                                        <div className="stat-row">
                                            <span className="stat-label">Tensor Type</span>
                                            <span className="stat-value">{model.tensor_types.join(', ')}</span>
                                        </div>
                                    )}
                                    {model.safetensors !== null && model.safetensors !== undefined && (
                                        <div className="stat-row">
                                            <span className="stat-label">Safetensors</span>
                                            <span className="stat-value">{model.safetensors ? 'Yes' : 'No'}</span>
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={model.huggingface_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Expl →
                                </a>
                            </aside>
                        </div>
                    </>
                )}

                {/* LinkedIn Tab */}
                {activeTab === 'linkedin' && (
                    <div className="linkedin-tab">
                        <div className="linkedin-mockup">
                            <div className="linkedin-header">
                                <div className="linkedin-avatar">TM</div>
                                <div className="linkedin-info">
                                    <div className="linkedin-name">TopTierModels</div>
                                    <div className="linkedin-handle">AI Model Rankings & Analysis</div>
                                </div>
                            </div>
                            <div className="linkedin-content">
                                {linkedin.content}
                            </div>
                            <div className="linkedin-hashtags">
                                {(linkedin.hashtags || []).map((tag, i) => (
                                    <span key={i} className="linkedin-hashtag">#{tag}</span>
                                ))}
                            </div>
                            <div className="linkedin-footer">
                                <span className="linkedin-char-count">{linkedin.character_count || 0}/3000 characters</span>
                            </div>
                        </div>

                        <div className="linkedin-actions">
                            {!linkedinConnected ? (
                                <button
                                    className="btn btn-primary"
                                    style={{ backgroundColor: '#0077b5', marginRight: '1rem' }}
                                    onClick={handleConnectLinkedIn}
                                >
                                    Login with LinkedIn
                                </button>
                            ) : (
                                <span className="connection-status" style={{ marginRight: '1rem', color: 'green', fontWeight: 'bold' }}>
                                    ✓ Connected to LinkedIn
                                </span>
                            )}

                            <button className="btn btn-secondary" onClick={handleCopy}>
                                {copySuccess ? '✓ Copied to Clipboard' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviewPage
