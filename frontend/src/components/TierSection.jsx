import { memo } from 'react'
import { Link } from 'react-router-dom'
import './TierSection.css'

const tierConfig = {
    S: { label: 'S Tier', range: '90-100', color: 'var(--tier-s)' },
    A: { label: 'A Tier', range: '80-89', color: 'var(--tier-a)' },
    B: { label: 'B Tier', range: '70-79', color: 'var(--tier-b)' },
    C: { label: 'C Tier', range: '60-69', color: 'var(--tier-c)' },
    D: { label: 'D Tier', range: '0-59', color: 'var(--tier-d)' },
}

function TierSection({ tier, models }) {
    const config = tierConfig[tier]

    return (
        <div className="tier-section">
            <div className="tier-header">
                <div className={`tier-badge tier-badge-${tier.toLowerCase()} tier-badge-lg`}>
                    {tier}
                </div>
                <div className="tier-info">
                    <span className="tier-label">{config.label}</span>
                    <span className="tier-range">{config.range}</span>
                </div>
                <span className="tier-count">{models.length}</span>
            </div>

            <div className="tier-models">
                {models.map(model => (
                    <Link
                        key={model.id}
                        to={`/article/${model.slug}`}
                        className="tier-model"
                    >
                        <span className="tier-model-name">{model.name}</span>
                        <span className="tier-model-meta">
                            <span className="tier-model-category">{model.category}</span>
                            <span className="tier-model-score">{model.score}</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// Memoize to prevent re-renders when parent updates
export default memo(TierSection, (prevProps, nextProps) => {
    return prevProps.tier === nextProps.tier &&
        prevProps.models.length === nextProps.models.length &&
        prevProps.models.every((m, i) => m.id === nextProps.models[i]?.id)
})
