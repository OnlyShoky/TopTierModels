import './AboutPage.css'

function AboutPage() {
    const scores = [
        { name: 'Performance', weight: '30%', desc: 'Accuracy, speed, efficiency' },
        { name: 'Usability', weight: '25%', desc: 'Documentation, API simplicity' },
        { name: 'Innovation', weight: '20%', desc: 'Novelty, research impact' },
        { name: 'Adoption', weight: '15%', desc: 'Downloads, community' },
        { name: 'Production', weight: '10%', desc: 'Stability, support' },
    ]

    const tiers = [
        { tier: 'S', range: '90-100', desc: 'Exceptional, industry-leading' },
        { tier: 'A', range: '80-89', desc: 'Excellent, highly recommended' },
        { tier: 'B', range: '70-79', desc: 'Good, solid choice' },
        { tier: 'C', range: '60-69', desc: 'Adequate, situational' },
        { tier: 'D', range: '0-59', desc: 'Limited, not recommended' },
    ]

    return (
        <div className="about-page">
            <div className="container">
                <header className="page-header">
                    <h1>About</h1>
                    <p className="text-secondary">How we analyze and rank AI models</p>
                </header>

                <div className="about-grid">
                    {/* Mission */}
                    <section className="about-section">
                        <h2>Mission</h2>
                        <p>
                            TopTierModels transforms technical AI documentation into accessible content.
                            We analyze models from Hugging Face and rank them using a transparent scoring system.
                        </p>
                    </section>

                    {/* Scoring */}
                    <section className="about-section">
                        <h2>Scoring Methodology</h2>
                        <p className="mb-4">We evaluate models across five weighted dimensions:</p>
                        <div className="score-table">
                            {scores.map(s => (
                                <div key={s.name} className="score-row">
                                    <span className="score-name">{s.name}</span>
                                    <span className="score-weight">{s.weight}</span>
                                    <span className="score-desc">{s.desc}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tiers */}
                    <section className="about-section">
                        <h2>Tier System</h2>
                        <div className="tier-table">
                            {tiers.map(t => (
                                <div key={t.tier} className="tier-row">
                                    <span className={`tier-badge tier-badge-${t.tier.toLowerCase()}`}>{t.tier}</span>
                                    <span className="tier-range">{t.range}</span>
                                    <span className="tier-desc">{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Source */}
                    <section className="about-section">
                        <h2>Data Source</h2>
                        <p>
                            All model data is sourced from <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">Hugging Face</a>.
                            We respect rate limits and their terms of service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
