import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">🏆</span>
                            <span>TopTierModels</span>
                        </Link>
                        <p className="footer-description">
                            Discover, analyze, and rank the best AI models from Hugging Face.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Navigation</h4>
                            <Link to="/">Home</Link>
                            <Link to="/tierlist">Tierlist</Link>
                            <Link to="/about">About</Link>
                        </div>

                        <div className="footer-section">
                            <h4>Resources</h4>
                            <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">
                                Hugging Face
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-attribution">
                        Data powered by <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">Hugging Face</a>
                    </p>
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} TopTierModels. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
