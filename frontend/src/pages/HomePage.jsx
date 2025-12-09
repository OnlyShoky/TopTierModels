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
    const [page, setPage] = useState(1)
    const articlesPerPage = 12

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            try {
                // TODO: Implement Supabase fetch
                // For now, return mock data
                const mockArticles = [
                    {
                        id: '1',
                        slug: 'z-image-turbo',
                        title: 'Z-Image-Turbo: Revolutionary Image Generation',
                        excerpt: 'A breakthrough in fast image generation with unprecedented quality.',
                        category: 'Image Generation',
                        tier: 'S',
                        hero_image_url: null,
                        read_time_minutes: 8,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '2',
                        slug: 'llama-3-instruct',
                        title: 'LLaMA 3 Instruct: Next-Gen Language Model',
                        excerpt: 'Meta\'s latest instruction-tuned language model with remarkable capabilities.',
                        category: 'Text Generation',
                        tier: 'A',
                        hero_image_url: null,
                        read_time_minutes: 10,
                        published_at: new Date().toISOString()
                    },
                    {
                        id: '3',
                        slug: 'whisper-v3',
                        title: 'Whisper V3: State-of-the-Art Speech Recognition',
                        excerpt: 'OpenAI\'s most capable speech recognition model to date.',
                        category: 'Audio Processing',
                        tier: 'S',
                        hero_image_url: null,
                        read_time_minutes: 6,
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
    }, [filters, page])

    const categories = [
        'all', 'Image Generation', 'Text Generation', 'Computer Vision',
        'NLP', 'Multimodal', 'Audio Processing', 'Video Generation'
    ]

    const tiers = ['all', 'S', 'A', 'B', 'C', 'D']

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover the Best <span className="gradient-text">AI Models</span>, Ranked
                        </h1>
                        <p className="hero-subtitle">
                            Comprehensive analysis and tier rankings for every AI domain.
                            Find the perfect model for your next project.
                        </p>
                        <div className="hero-actions">
                            <Link to="/tierlist" className="btn btn-primary">
                                View Tierlist
                            </Link>
                            <a href="#articles" className="btn btn-secondary">
                                Browse Articles
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section id="articles" className="filter-section py-8">
                <div className="container">
                    <div className="filter-bar">
                        <div className="filter-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                className="input"
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="tier">Tier</label>
                            <select
                                id="tier"
                                className="input"
                                value={filters.tier}
                                onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
                            >
                                {tiers.map(tier => (
                                    <option key={tier} value={tier}>
                                        {tier === 'all' ? 'All Tiers' : `${tier} Tier`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <span className="article-count">
                            {articles.length} articles
                        </span>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="articles-section py-8">
                <div className="container">
                    {loading ? (
                        <div className="grid grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card">
                                    <div className="skeleton" style={{ aspectRatio: '16/9' }} />
                                    <div className="card-body">
                                        <div className="skeleton" style={{ height: '1.5rem', width: '60%', marginBottom: '0.5rem' }} />
                                        <div className="skeleton" style={{ height: '1rem', width: '100%' }} />
                                        <div className="skeleton" style={{ height: '1rem', width: '80%', marginTop: '0.5rem' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="empty-state">
                            <h3>No articles found</h3>
                            <p>Try adjusting your filters or check back later.</p>
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
