import { useState, useEffect } from 'react'
import TierSection from '../components/TierSection'
import './TierlistPage.css'

function TierlistPage() {
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const categories = [
        { id: 'all', name: 'All Categories', icon: '🌐' },
        { id: 'Image Generation', name: 'Image Generation', icon: '🎨' },
        { id: 'Text Generation', name: 'Text Generation', icon: '📝' },
        { id: 'Computer Vision', name: 'Computer Vision', icon: '👁️' },
        { id: 'Audio Processing', name: 'Audio Processing', icon: '🎵' },
        { id: 'Multimodal Models', name: 'Multimodal', icon: '🔮' },
    ]

    const tiers = ['S', 'A', 'B', 'C', 'D']

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true)
            try {
                // TODO: Implement Supabase fetch
                // Mock data for now
                const mockModels = [
                    { id: '1', name: 'Z-Image-Turbo', category: 'Image Generation', tier: 'S', score: 95, slug: 'z-image-turbo' },
                    { id: '2', name: 'Whisper V3', category: 'Audio Processing', tier: 'S', score: 92, slug: 'whisper-v3' },
                    { id: '3', name: 'LLaMA 3 Instruct', category: 'Text Generation', tier: 'A', score: 87, slug: 'llama-3-instruct' },
                    { id: '4', name: 'CLIP ViT-L', category: 'Multimodal Models', tier: 'A', score: 84, slug: 'clip-vit-l' },
                    { id: '5', name: 'YOLO v8', category: 'Computer Vision', tier: 'B', score: 76, slug: 'yolo-v8' },
                ]
                setModels(mockModels)
            } catch (error) {
                console.error('Error fetching models:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchModels()
    }, [activeCategory])

    const filteredModels = models.filter(model => {
        const matchesCategory = activeCategory === 'all' || model.category === activeCategory
        const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const getModelsByTier = (tier) => filteredModels.filter(m => m.tier === tier)

    return (
        <div className="tierlist-page">
            <div className="container">
                {/* Header */}
                <header className="tierlist-header">
                    <h1>AI Model Tierlist</h1>
                    <p className="text-secondary">
                        Models ranked by performance, usability, and innovation
                    </p>
                </header>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className="category-tab-icon">{cat.icon}</span>
                            <span className="category-tab-name">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="tierlist-search">
                    <input
                        type="text"
                        className="input"
                        placeholder="Search models by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tiers */}
                {loading ? (
                    <div className="tierlist-loading">
                        {tiers.map(tier => (
                            <div key={tier} className="tier-section skeleton" style={{ height: '150px' }} />
                        ))}
                    </div>
                ) : (
                    <div className="tierlist-content">
                        {tiers.map(tier => (
                            <TierSection
                                key={tier}
                                tier={tier}
                                models={getModelsByTier(tier)}
                            />
                        ))}
                    </div>
                )}

                {/* Methodology */}
                <button className="methodology-btn btn btn-secondary">
                    How are models scored?
                </button>
            </div>
        </div>
    )
}

export default TierlistPage
