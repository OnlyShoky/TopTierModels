import { useState, useEffect } from 'react'
import ArticleCard from '../components/ArticleCard'
import { getArticles } from '../lib/supabase'
import './HomePage.css' // Reusing grid styles

function ModelsPage() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const ITEMS_PER_PAGE = 12

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            try {
                // Fetch one extra item to check if there are more pages
                const data = await getArticles({
                    page: page,
                    limit: ITEMS_PER_PAGE,
                    category: 'all',
                    tier: 'all'
                })

                // Map Supabase data to component format
                const formattedArticles = data.map(item => ({
                    id: item.id,
                    slug: item.slug,
                    title: item.title,
                    excerpt: item.excerpt,
                    category: item.models?.category || 'Uncategorized',
                    tier: item.models?.model_scores?.tier || '?',
                    score: item.models?.model_scores?.overall_score || 0,
                    published_at: item.published_at,
                    hero_image_url: item.hero_image_url
                }))

                setArticles(formattedArticles)

                // If we got fewer items than requested, we've reached the end
                if (data.length < ITEMS_PER_PAGE) {
                    setHasMore(false)
                } else {
                    // Ideally we'd fetch limit+1 to know for sure, 
                    // or use a count query, but for now this is a simple heuristic.
                    // Let's assume there might be more if we got a full page.
                    // To be precise without count, we could check next page existence, 
                    // but "Next" button logic usually suffices.
                    setHasMore(true)
                }

                // Better hasMore logic: 
                // Since getArticles doesn't return total count in this simple implementation,
                // we'll rely on the user hitting "Next" and seeing empty/fewer results.
                // Or, we could try to fetch 13 and display 12.

            } catch (error) {
                console.error('Error fetching models:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
        window.scrollTo(0, 0)
    }, [page])

    const handlePrevious = () => {
        if (page > 1) setPage(p => p - 1)
    }

    const handleNext = () => {
        setPage(p => p + 1)
    }

    return (
        <div className="home-page"> {/* Reusing container class */}
            <div className="container" style={{ marginTop: '2rem' }}>
                <header className="section-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="section-title">All Models (Page {page})</h1>
                </header>

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
                        <button onClick={() => setPage(1)} className="btn btn-secondary">Go back to start</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="pagination-controls" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginTop: '3rem',
                            paddingBottom: '3rem'
                        }}>
                            <button
                                className="btn btn-secondary"
                                onClick={handlePrevious}
                                disabled={page === 1 || loading}
                            >
                                Previous
                            </button>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Page {page}
                            </span>
                            <button
                                className="btn btn-secondary"
                                onClick={handleNext}
                                disabled={loading || articles.length < ITEMS_PER_PAGE} // Disable if current page is not full
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ModelsPage
