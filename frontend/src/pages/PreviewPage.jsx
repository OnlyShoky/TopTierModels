import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './PreviewPage.css'

function PreviewPage() {
    const { previewId } = useParams()
    const [previewData, setPreviewData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)

    useEffect(() => {
        const fetchPreview = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/preview/${previewId}`)
                if (response.ok) {
                    const data = await response.json()
                    setPreviewData(data)
                }
            } catch (error) {
                console.error('Error fetching preview:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPreview()
    }, [previewId])

    const handlePublish = async () => {
        setPublishing(true)
        try {
            const response = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    preview_id: previewId,
                    trigger_netlify_rebuild: true
                })
            })

            if (response.ok) {
                const result = await response.json()
                alert(`Published successfully! View at: ${result.live_url}`)
            } else {
                throw new Error('Publish failed')
            }
        } catch (error) {
            alert('Failed to publish: ' + error.message)
        } finally {
            setPublishing(false)
        }
    }

    const handleCopyLinkedIn = () => {
        if (previewData?.linkedin_data?.content) {
            navigator.clipboard.writeText(previewData.linkedin_data.content)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        }
    }

    if (loading) {
        return (
            <div className="preview-page container">
                <div className="preview-loading">Loading preview...</div>
            </div>
        )
    }

    if (!previewData) {
        return (
            <div className="preview-page container">
                <div className="preview-error">
                    <h2>Preview not found</h2>
                    <p>The preview session may have expired or doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="preview-page">
            {/* Header */}
            <header className="preview-header">
                <div className="container">
                    <div className="preview-header-content">
                        <div>
                            <h1>🔍 Preview Studio</h1>
                            <p className="text-muted">Session: {previewId}</p>
                        </div>
                        <div className="preview-status">
                            <span className="status-badge status-draft">Draft</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="preview-layout">
                    {/* Article Preview */}
                    <div className="preview-article">
                        <div className="preview-section-header">
                            <h3>Article Preview</h3>
                        </div>
                        <div className="preview-article-content card">
                            <h2>{previewData.article_data?.title}</h2>
                            <p className="text-secondary">{previewData.article_data?.excerpt}</p>
                            <div className="preview-article-body"
                                dangerouslySetInnerHTML={{ __html: previewData.article_data?.content }}
                            />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="preview-controls">
                        {/* LinkedIn Preview */}
                        <div className="preview-section-header">
                            <h3>LinkedIn Post</h3>
                        </div>
                        <div className="linkedin-preview card">
                            <div className="linkedin-header">
                                <div className="linkedin-avatar">🤖</div>
                                <div className="linkedin-author">
                                    <strong>TopTierModels</strong>
                                    <span>AI Model Rankings</span>
                                </div>
                            </div>
                            <div className="linkedin-content">
                                {previewData.linkedin_data?.content}
                            </div>
                            <div className="linkedin-hashtags">
                                {previewData.linkedin_data?.hashtags?.map((tag, i) => (
                                    <span key={i}>#{tag}</span>
                                ))}
                            </div>
                            <div className="linkedin-char-count">
                                {previewData.linkedin_data?.content?.length || 0}/3000 characters
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="preview-actions">
                            <button
                                className="btn btn-success"
                                onClick={handlePublish}
                                disabled={publishing}
                            >
                                {publishing ? 'Publishing...' : '🚀 Publish to Supabase'}
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={handleCopyLinkedIn}
                            >
                                {copySuccess ? '✓ Copied!' : '📋 Copy LinkedIn Post'}
                            </button>

                            <button className="btn btn-secondary">
                                🔄 Regenerate
                            </button>

                            <button className="btn btn-secondary">
                                💾 Export JSON
                            </button>

                            <button className="btn btn-danger">
                                🗑️ Discard
                            </button>
                        </div>

                        {/* Scores */}
                        <div className="preview-section-header">
                            <h3>Model Scores</h3>
                        </div>
                        <div className="card" style={{ padding: 'var(--space-4)' }}>
                            <div className="score-display">
                                <span className="score-big">{previewData.scores_data?.overall_score}</span>
                                <span className="score-max">/100</span>
                            </div>
                            <div className={`tier-badge tier-badge-${previewData.scores_data?.tier?.toLowerCase()}`}>
                                {previewData.scores_data?.tier} Tier
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewPage
