import './AboutPage.css'

function AboutPage() {
    return (
        <div className="about-page">
            <div className="container">
                <header className="about-header">
                    <h1>About TopTierModels</h1>
                    <p className="text-secondary">
                        Discover, analyze, and rank the best AI models from Hugging Face
                    </p>
                </header>

                <div className="about-content">
                    <section className="about-section">
                        <h2>🎯 Our Mission</h2>
                        <p>
                            TopTierModels transforms technical AI model documentation into accessible,
                            comprehensive content. We help AI practitioners, researchers, and enthusiasts
                            quickly evaluate and discover the best models for their use cases.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>📊 How It Works</h2>
                        <div className="how-it-works">
                            <div className="step">
                                <span className="step-number">1</span>
                                <h3>Discovery</h3>
                                <p>We scrape and analyze model pages from Hugging Face</p>
                            </div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <h3>Analysis</h3>
                                <p>AI generates comprehensive articles and scores</p>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <h3>Ranking</h3>
                                <p>Models are ranked into tiers: S, A, B, C, D</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>🏆 Tier System</h2>
                        <div className="tier-explanation">
                            <div className="tier-item">
                                <span className="tier-badge tier-badge-s">S</span>
                                <div>
                                    <strong>S Tier (90-100)</strong>
                                    <p>Exceptional, industry-leading models</p>
                                </div>
                            </div>
                            <div className="tier-item">
                                <span className="tier-badge tier-badge-a">A</span>
                                <div>
                                    <strong>A Tier (80-89)</strong>
                                    <p>Excellent, highly recommended</p>
                                </div>
                            </div>
                            <div className="tier-item">
                                <span className="tier-badge tier-badge-b">B</span>
                                <div>
                                    <strong>B Tier (70-79)</strong>
                                    <p>Good, solid choice for most use cases</p>
                                </div>
                            </div>
                            <div className="tier-item">
                                <span className="tier-badge tier-badge-c">C</span>
                                <div>
                                    <strong>C Tier (60-69)</strong>
                                    <p>Adequate, situational use</p>
                                </div>
                            </div>
                            <div className="tier-item">
                                <span className="tier-badge tier-badge-d">D</span>
                                <div>
                                    <strong>D Tier (0-59)</strong>
                                    <p>Limited, not generally recommended</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>📈 Scoring Methodology</h2>
                        <p>Our overall score is calculated using weighted factors:</p>
                        <ul>
                            <li><strong>Performance (30%)</strong> - Accuracy, speed, efficiency</li>
                            <li><strong>Usability (25%)</strong> - Documentation quality, API simplicity</li>
                            <li><strong>Innovation (20%)</strong> - Novelty of approach</li>
                            <li><strong>Adoption (15%)</strong> - Community downloads, likes</li>
                            <li><strong>Production (10%)</strong> - Stability, support readiness</li>
                        </ul>
                    </section>

                    <section className="about-section">
                        <h2>🔗 Data Sources</h2>
                        <p>
                            All model data is sourced from <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">Hugging Face</a>,
                            the leading platform for AI models and datasets. We respect their terms of service
                            and implement rate limiting to ensure responsible data collection.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
