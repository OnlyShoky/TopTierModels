import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getModelsForTierlist } from '../lib/supabase'
import './TierlistPage.css'

function TierlistPage() {
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('all')
    const [activeMetric, setActiveMetric] = useState('overall')

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'Image Generation', label: 'Image Generation' },
        { id: 'Text Generation', label: 'Text Generation' },
        { id: 'Audio Processing', label: 'Audio Processing' },
        { id: 'Computer Vision', label: 'Computer Vision' },
        { id: 'Multimodal', label: 'Multimodal' },
    ]

    const metrics = [
        { id: 'overall', label: 'Overall' },
        { id: 'quality', label: 'Quality' },
        { id: 'speed', label: 'Speed' },
        { id: 'freedom', label: 'Freedom' },
    ]

    const tiers = ['S', 'A', 'B', 'C', 'D']

    // Helper to map tier directly to CSS variable
    const getTierColor = (tier) => {
        const map = {
            'S': 'var(--tier-s)',
            'A': 'var(--tier-a)',
            'B': 'var(--tier-b)',
            'C': 'var(--tier-c)',
            'D': 'var(--tier-d)',
        }
        return map[tier] || 'var(--color-text)'
    }

    const getTierBg = (tier) => {
        const map = {
            'S': 'var(--tier-s-muted)',
            'A': 'var(--tier-a-muted)',
            'B': 'var(--tier-b-muted)',
            'C': 'var(--tier-c-muted)',
            'D': 'var(--tier-d-muted)',
        }
        return map[tier] || 'var(--color-bg-muted)'
    }

    // Helper to calculate tier from raw score
    const calculateTier = (score) => {
        if (score >= 90) return 'S'
        if (score >= 80) return 'A'
        if (score >= 70) return 'B'
        if (score >= 60) return 'C'
        return 'D'
    }

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true)
            try {
                const data = await getModelsForTierlist(activeCategory)

                const formattedModels = data.map(item => {
                    const article = item.articles && item.articles[0]
                    return {
                        id: item.id,
                        name: item.display_name,
                        category: item.category,
                        // Store all scores
                        scores: {
                            overall: item.model_scores.overall_score,
                            quality: item.model_scores.quality_score,
                            speed: item.model_scores.speed_score,
                            freedom: item.model_scores.freedom_score,
                        },
                        // Store DB tier as default, but we'll calculate dynamic ones too
                        dbTier: item.model_scores.tier,
                        slug: article ? article.slug : '#'
                    }
                })

                setModels(formattedModels)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchModels()
    }, [activeCategory])

    // Get models for specific tier based on active metric
    const getModelsByTier = (tier) => {
        // Filter by category first
        let filtered = activeCategory === 'all'
            ? models
            : models.filter(m => m.category === activeCategory)

        // Filter by tier and sort
        const tierModels = filtered
            .map(m => {
                // Determine score and tier based on active metric
                let score, currentTier

                if (activeMetric === 'overall') {
                    score = m.scores.overall
                    currentTier = m.dbTier // Use stored tier for overall consistency
                } else {
                    score = m.scores[activeMetric] || 0
                    currentTier = calculateTier(score) // Dynamic tier for sub-metrics
                }

                return { ...m, activeScore: score, activeTier: currentTier }
            })
            .filter(m => m.activeTier === tier)
            .sort((a, b) => b.activeScore - a.activeScore) // High to low

        return tierModels
    }

    return (
        <div className="tierlist-page">
            <div className="container">
                {/* Header */}
                <header className="page-header">
                    <h1>AI Model Tier List</h1>
                    <p>Ranked by performance, speed, and freedom</p>
                </header>

                {/* Controls Container */}
                <div className="controls-container">
                    {/* Category Tabs */}
                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Metric Selector - Right aligned or separate row */}
                    <div className="metric-tabs">
                        <span className="metric-label">Rank by:</span>
                        {metrics.map(metric => (
                            <button
                                key={metric.id}
                                className={`metric-tab ${activeMetric === metric.id ? 'active' : ''}`}
                                onClick={() => setActiveMetric(metric.id)}
                            >
                                {metric.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tier Rows Container */}
                <div className="tier-list-container">
                    {loading ? (
                        <div className="tier-loading">Loading rankings...</div>
                    ) : (
                        tiers.map(tier => (
                            <div key={tier} className="tier-row">
                                {/* Tier Label (Left) */}
                                <div
                                    className="tier-label"
                                    style={{ backgroundColor: getTierBg(tier) }}
                                >
                                    <span style={{ color: getTierColor(tier) }}>{tier}</span>
                                </div>

                                {/* Content Area (Right) */}
                                <div className="tier-content">
                                    {getModelsByTier(tier).map(model => (
                                        <Link
                                            key={model.id}
                                            to={`/article/${model.slug}`}
                                            className="model-card"
                                            title={model.name}
                                        >
                                            <div className="model-info-top">
                                                <div className="model-name">{model.name}</div>
                                                <div className="model-category">{model.category}</div>
                                            </div>

                                            <div
                                                className="model-score-badge"
                                                style={{ color: getTierColor(tier) }}
                                            >
                                                {model.activeScore}
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Empty State */}
                                    {getModelsByTier(tier).length === 0 && (
                                        <div className="tier-empty">
                                            No models
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="methodology">
                    <button className="btn-ghost">
                        Methodology & Scoring System
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TierlistPage
