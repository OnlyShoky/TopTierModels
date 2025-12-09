import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import usePreviewWebSocket from '../hooks/usePreviewWebSocket'
import './PreviewPage.css'

function PreviewPage() {
    const { previewId } = useParams()
    const [previewData, setPreviewData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)
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
                <div className="empty-state">
                    <h3>Preview not found</h3>
                    <p>Session may have expired</p>
                </div>
            </div>
        )
    }

    return (
        <div className="preview-page">
            {/* Header */}
            <header className="preview-header">
                <div className="container">
                    <div className="preview-header-inner">
                        <div>
                            <h1>Preview</h1>
                            <p className="text-muted text-sm">Session: {previewId}</p>
                        </div>
                        <div className="preview-badges">
                            {isConnected && <span className="status-live">Live</span>}
                            <span className="status-draft">Draft</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="preview-layout">
                    {/* Main */}
                    <main className="preview-main">
                        <div className="section-header">
                            <span className="section-title">Article</span>
                        </div>
                        <div className="preview-card">
                            <h2>{previewData.article_data?.title}</h2>
                            <p className="text-secondary">{previewData.article_data?.excerpt}</p>
                            <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewData.article_data?.content }} />
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="preview-sidebar">
                        {/* Actions */}
                        <div className="preview-actions">
                            <button className="btn btn-primary" onClick={handlePublish} disabled={publishing}>
                                {publishing ? 'Publishing...' : 'Publish'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleCopy}>
                                {copySuccess ? 'Copied!' : 'Copy LinkedIn'}
                            </button>
                        </div>

                        {/* LinkedIn */}
                        <div className="sidebar-card">
                            <h4 className="sidebar-title">LinkedIn Post</h4>
                            <div className="linkedin-preview">
                                <p>{previewData.linkedin_data?.content}</p>
                                <div className="linkedin-hashtags">
                                    {previewData.linkedin_data?.hashtags?.map((tag, i) => (
                                        <span key={i}>#{tag}</span>
                                    ))}
                                </div>
                                <span className="text-muted text-xs">
                                    {previewData.linkedin_data?.content?.length || 0}/3000
                                </span>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="sidebar-card">
                            <h4 className="sidebar-title">Score</h4>
                            <div className="score">
                                <span className="score-value">{previewData.scores_data?.overall_score}</span>
                                <span className="score-max">/100</span>
                            </div>
                            <div className={`tier-badge tier-badge-${previewData.scores_data?.tier?.toLowerCase()}`}>
                                {previewData.scores_data?.tier} Tier
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default PreviewPage
