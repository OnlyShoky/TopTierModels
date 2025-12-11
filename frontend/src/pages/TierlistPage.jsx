import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getModelsForTierlist } from '../lib/supabase'
import './TierlistPage.css'

function TierlistPage() {
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('all')

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'Image Generation', label: 'Image Generation' },
        { id: 'Text Generation', label: 'Text Generation' },
        { id: 'Audio Processing', label: 'Audio Processing' },
        { id: 'Computer Vision', label: 'Computer Vision' },
        { id: 'Multimodal', label: 'Multimodal' },
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
                        tier: item.model_scores.tier,
                        score: item.model_scores.overall_score,
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

    const filteredModels = activeCategory === 'all'
        ? models
        : models.filter(m => m.category === activeCategory)

    const getModelsByTier = (tier) => filteredModels.filter(m => m.tier === tier)

    return (
        <div className="tierlist-page">
            <div className="container">
                {/* Header */}
                <header className="page-header">
                    <h1>AI Model Tier List</h1>
                    <p>Ranked by performance, speed, and freedom</p>
                </header>

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
                                                {model.score}
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
