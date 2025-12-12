import './AboutPage.css'

function AboutPage() {
    const scores = [
        { name: 'Quality', weight: '33.3%', desc: 'Accuracy, realism, coherence, task success' },
        { name: 'Speed', weight: '33.3%', desc: 'Inference speed, latency, generation time' },
        { name: 'Freedom', weight: '33.3%', desc: 'Openness, licensing, accessibility, cost' },
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
                    <h1>About Our Ranking System</h1>
                    <p className="text-secondary">How we analyze and rank AI models</p>
                </header>

                <div className="about-grid">
                    {/* Mission */}
                    <section className="about-section">
                        <h2>Mission</h2>
                        <p>
                            We believe in <strong>freedom first</strong>. Our ranking system deliberately prioritizes
                            accessible, open-source models over proprietary "walled gardens." While models like GPT-5
                            may have superior quality, they receive severe penalties for being closed, expensive,
                            and censored—reflecting their real-world usability limitations.
                        </p>

                        <p className="mt-3">
                            <strong>Why this matters:</strong> Open models can be run locally, fine-tuned for specific
                            needs, and used commercially without restrictions—making them more valuable despite
                            slightly lower benchmark scores.
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
                        <h2>Analysis Methodology</h2>
                        <p>
                            We aggregate data from multiple public sources:
                        </p>
                        <ul>
                            <li><strong>Technical Papers & Benchmarks:</strong> MLPerf, HELM, academic publications</li>
                            <li><strong>Community Benchmarks:</strong> Open LLM Leaderboard, Arena rankings</li>
                            <li><strong>Real-World Testing:</strong> Inference speed tests, API response times</li>
                            <li><strong>Licensing Analysis:</strong> Software licenses, usage restrictions, cost structures</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
