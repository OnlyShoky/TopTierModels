import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { getArticles } from '../lib/supabase'
import './HomePage.css'

function HomePage() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        category: 'all',
        tier: 'all'
    })

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            try {
                const data = await getArticles({
                    category: filters.category,
                    tier: filters.tier
                })

                // Map Supabase data to component format
                const formattedArticles = data.map(item => ({
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    excerpt: item.excerpt,
                    category: item.models.category,
                    tier: item.models.model_scores.tier,
                    score: item.models.model_scores.overall_score,
                    published_at: item.published_at,
                    hero_image_url: item.hero_image_url
                }))

                setArticles(formattedArticles)
            } catch (error) {
                console.error('Error fetching articles:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [filters])

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'Image Generation', label: 'Image' },
        { id: 'Text Generation', label: 'Text' },
        { id: 'Audio Processing', label: 'Audio' },
        { id: 'Computer Vision', label: 'Vision' },
        { id: 'Multimodal', label: 'Multimodal' },
    ]

    const tiers = ['all', 'S', 'A', 'B', 'C', 'D']

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            AI Model Rankings
                        </h1>
                        <p className="hero-subtitle">
                            Discover and compare the best models from Hugging Face.
                            Analyzed, scored, and ranked.
                        </p>
                        <div className="hero-actions">
                            <Link to="/tierlist" className="btn btn-primary btn-lg">
                                View Tierlist
                            </Link>
                            <a href="#models" className="btn btn-secondary btn-lg">
                                Browse Models
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">50+</span>
                            <span className="stat-label">Models</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">8</span>
                            <span className="stat-label">Categories</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">5</span>
                            <span className="stat-label">Tiers</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section id="models" className="filter-section">
                <div className="container">
                    <div className="filter-bar">
                        <div className="filter-tabs">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`filter-tab ${filters.category === cat.id ? 'active' : ''}`}
                                    onClick={() => setFilters({ ...filters, category: cat.id })}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="filter-select">
                            <select
                                className="input"
                                value={filters.tier}
                                onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
                            >
                                <option value="all">All Tiers</option>
                                {tiers.slice(1).map(tier => (
                                    <option key={tier} value={tier}>{tier} Tier</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Models Grid */}
            <section className="models-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-title">
                            {articles.length} models
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card">
                                    <div className="card-body">
                                        <div className="skeleton" style={{ height: '1.25rem', width: '70%', marginBottom: '0.5rem' }} />
                                        <div className="skeleton" style={{ height: '1rem', width: '100%', marginBottom: '0.25rem' }} />
                                        <div className="skeleton" style={{ height: '1rem', width: '80%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="empty-state">
                            <h3>No models found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default HomePage
