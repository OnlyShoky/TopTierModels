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
        <div className={`tier-section tier-section-${tier.toLowerCase()}`}>
            <div className="tier-header" style={{ borderColor: config.color }}>
                <div className="tier-label" style={{ background: config.color }}>
                    {tier}
                </div>
                <div className="tier-info">
                    <span className="tier-name">{config.label}</span>
                    <span className="tier-range">{config.range} points</span>
                </div>
                <span className="tier-count">{models.length} models</span>
            </div>

            <div className="tier-models">
                {models.length === 0 ? (
                    <p className="tier-empty">No models in this tier yet</p>
                ) : (
                    models.map(model => (
                        <Link
                            key={model.id}
                            to={`/article/${model.slug}`}
                            className="tier-model-card"
                        >
                            <div className="tier-model-icon">🤖</div>
                            <div className="tier-model-info">
                                <span className="tier-model-name">{model.name}</span>
                                <span className="tier-model-category">{model.category}</span>
                            </div>
                            <div className="tier-model-score">
                                <span className="score-value">{model.score}</span>
                                <span className="score-label">/100</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default TierSection
