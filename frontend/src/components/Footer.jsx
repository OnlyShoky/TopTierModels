import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-inner">
                    <div className="footer-left">
                        <Link to="/" className="footer-logo">
                            <span className="logo-mark">T</span>
                            <span>TopTierModels</span>
                        </Link>
                        <p className="footer-tagline">
                            AI model rankings and analysis
                        </p>
                    </div>

                    <nav className="footer-nav">
                        <Link to="/">Models</Link>
                        <Link to="/tierlist">Tierlist</Link>
                        <Link to="/about">About</Link>
                        <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">
                            Hugging Face
                        </a>
                    </nav>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} TopTierModels</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
