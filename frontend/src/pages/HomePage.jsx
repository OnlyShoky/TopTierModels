import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
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
                // Mock data
                const mockArticles = [
                    {
                        id: '1',
                        slug: 'z-image-turbo',
                        title: 'Z-Image-Turbo',
                        excerpt: 'Revolutionary fast image generation with unprecedented quality.',
                        category: 'Image Generation',
                        tier: 'S',
                        score: 95,
                        downloads: 125000,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '2',
                        slug: 'llama-3-instruct',
                        title: 'LLaMA 3 Instruct',
                        excerpt: 'Meta\'s instruction-tuned language model with remarkable capabilities.',
                        category: 'Text Generation',
                        tier: 'A',
                        score: 87,
                        downloads: 890000,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '3',
                        slug: 'whisper-v3',
                        title: 'Whisper V3',
                        excerpt: 'OpenAI\'s most capable speech recognition model.',
                        category: 'Audio Processing',
                        tier: 'S',
                        score: 92,
                        downloads: 560000,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '4',
                        slug: 'clip-vit-large',
                        title: 'CLIP ViT-L/14',
                        excerpt: 'Zero-shot image classification with natural language prompts.',
                        category: 'Multimodal',
                        tier: 'A',
                        score: 85,
                        downloads: 340000,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '5',
                        slug: 'yolov8',
                        title: 'YOLOv8',
                        excerpt: 'Real-time object detection with state-of-the-art performance.',
                        category: 'Computer Vision',
                        tier: 'B',
                        score: 78,
                        downloads: 780000,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '6',
                        slug: 'stable-diffusion-xl',
                        title: 'Stable Diffusion XL',
                        excerpt: 'High-resolution image synthesis with enhanced quality.',
                        category: 'Image Generation',
                        tier: 'A',
                        score: 88,
                        downloads: 1200000,
                        published_at: new Date().toISOString()
                    }
                ]
                setArticles(mockArticles)
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

    const filteredArticles = articles.filter(article => {
        if (filters.category !== 'all' && article.category !== filters.category) return false
        if (filters.tier !== 'all' && article.tier !== filters.tier) return false
        return true
    })

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
                            {filteredArticles.length} models
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
                    ) : filteredArticles.length === 0 ? (
                        <div className="empty-state">
                            <h3>No models found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3">
                            {filteredArticles.map(article => (
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
