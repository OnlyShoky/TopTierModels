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
                // Mock results
                setResults([
                    { type: 'model', slug: 'z-image-turbo', title: 'Z-Image-Turbo', tier: 'S', category: 'Image Generation' },
                    { type: 'model', slug: 'whisper-v3', title: 'Whisper V3', tier: 'S', category: 'Audio Processing' },
                ])
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }, 200)

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
            <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-row">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search models..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="search-kbd">esc</kbd>
                </div>

                {query && (
                    <div className="search-results">
                        {loading && (
                            <div className="search-message">Searching...</div>
                        )}

                        {!loading && results.length === 0 && (
                            <div className="search-message">No results for "{query}"</div>
                        )}

                        {!loading && results.length > 0 && (
                            <ul className="search-list">
                                {results.map((result, index) => (
                                    <li key={index}>
                                        <button
                                            className="search-result"
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <span className="search-result-title">{result.title}</span>
                                            <span className="search-result-meta">
                                                <span className={`tier-badge tier-badge-${result.tier.toLowerCase()}`}>
                                                    {result.tier}
                                                </span>
                                                <span className="search-result-category">{result.category}</span>
                                            </span>
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
