import { useState, useEffect } from 'react'
import TierSection from '../components/TierSection'
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

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true)
            try {
                const mockModels = [
                    { id: '1', name: 'Z-Image-Turbo', category: 'Image Generation', tier: 'S', score: 95, slug: 'z-image-turbo' },
                    { id: '2', name: 'Whisper V3', category: 'Audio Processing', tier: 'S', score: 92, slug: 'whisper-v3' },
                    { id: '3', name: 'LLaMA 3 Instruct', category: 'Text Generation', tier: 'A', score: 87, slug: 'llama-3-instruct' },
                    { id: '4', name: 'CLIP ViT-L', category: 'Multimodal', tier: 'A', score: 85, slug: 'clip-vit-l' },
                    { id: '5', name: 'Stable Diffusion XL', category: 'Image Generation', tier: 'A', score: 88, slug: 'stable-diffusion-xl' },
                    { id: '6', name: 'YOLOv8', category: 'Computer Vision', tier: 'B', score: 78, slug: 'yolov8' },
                ]
                setModels(mockModels)
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
                    <h1>Tierlist</h1>
                    <p className="text-secondary">Models ranked by performance, usability, and innovation</p>
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

                {/* Tier Sections */}
                {loading ? (
                    <div className="tier-loading">
                        {tiers.map(tier => (
                            <div key={tier} className="skeleton" style={{ height: '100px', marginBottom: 'var(--space-4)' }} />
                        ))}
                    </div>
                ) : (
                    <div className="tier-list">
                        {tiers.map(tier => {
                            const tierModels = getModelsByTier(tier)
                            if (tierModels.length === 0) return null
                            return <TierSection key={tier} tier={tier} models={tierModels} />
                        })}
                    </div>
                )}

                {/* Methodology Link */}
                <div className="methodology">
                    <button className="btn btn-ghost">
                        How are models scored? →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TierlistPage
