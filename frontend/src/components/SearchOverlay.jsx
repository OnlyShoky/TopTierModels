import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchOverlay.css'

function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const debounceTimer = setTimeout(async () => {
            setLoading(true)
            try {
                // TODO: Implement Supabase search
                // For now, return mock results
                setResults([
                    { type: 'article', slug: 'sample', title: 'Sample Model', tier: 'S', category: 'Image Generation' }
                ])
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [query])

    const handleResultClick = (result) => {
        navigate(`/article/${result.slug}`)
        onClose()
        setQuery('')
    }

    if (!isOpen) return null

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-container" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search models, articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="search-close" onClick={onClose}>
                        <kbd>ESC</kbd>
                    </button>
                </div>

                {query && (
                    <div className="search-results">
                        {loading && (
                            <div className="search-loading">Searching...</div>
                        )}

                        {!loading && results.length === 0 && (
                            <div className="search-empty">
                                <p>No results found for "{query}"</p>
                                <p className="text-muted">Try searching for model names or categories</p>
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <ul className="search-results-list">
                                {results.map((result, index) => (
                                    <li key={index}>
                                        <button
                                            className="search-result-item"
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <div className="search-result-content">
                                                <span className="search-result-title">{result.title}</span>
                                                <span className="search-result-meta">
                                                    <span className={`tier-badge tier-badge-${result.tier.toLowerCase()}`}>
                                                        {result.tier}
                                                    </span>
                                                    <span className="category-badge">{result.category}</span>
                                                </span>
                                            </div>
                                            <svg className="search-result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchOverlay
