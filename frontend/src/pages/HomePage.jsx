import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { getArticles } from '../lib/supabase'
import './HomePage.css'

// SVG Icons
const Heart = ({ size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
)

const Coffee = ({ size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" x2="6" y1="2" y2="4" />
        <line x1="10" x2="10" y1="2" y2="4" />
        <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
)

const t = {
    supportTitle: "Support the Project",
    supportText: "If you find these rankings useful, consider checking out my other work or supporting the project.",
    paypal: "Donate via PayPal",
    coffee: "Buy me a Coffee",
    thanks: "Thank you for your support!"
}

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
                            <span className="stat-value">10+</span>
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

            {/* Donation Section */}
            <div className="donation-section">
                <div className="donation-container">
                    <h2 className="donation-title">{t.supportTitle}</h2>
                    <p className="donation-text">{t.supportText}</p>
                    <div className="donation-buttons">
                        <a href="https://www.paypal.com/donate/?hosted_button_id=P49L3AK8RDVMN" target="_blank" rel="noopener noreferrer" className="btn-donate btn-paypal">
                            <Heart className="btn-icon" size={20} />
                            {t.paypal}
                        </a>
                        <a href="https://www.buymeacoffee.com/shoky" target="_blank" rel="noopener noreferrer" className="btn-donate btn-coffee">
                            <Coffee className="btn-icon" size={20} />
                            {t.coffee}
                        </a>
                    </div>
                    <p className="donation-thanks">{t.thanks}</p>
                </div>
            </div>
        </div>
    )
}

export default HomePage
