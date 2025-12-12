import { Link } from 'react-router-dom'
import './Footer.css'
import logo from '../assets/logo.png';


// Icons
const Github = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
)

const Twitter = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
)

const Linkedin = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
)

const Globe = ({ size = 16 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
)

const Mail = ({ size = 16 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)

const t = {
    footer_desc: "Discover, analyze, and compare the best open-source AI models. Helping you make informed decisions for your next project.",
    quick_links: "Quick Links",
    home: "Home",
    top_ingredients: "Tier List",
    favorites: "Models",
    about: "About",
    connect: "Connect",
    portfolio: "Portfolio",
    contact_us: "Contact Us",
    footer_text: "TopTierModels. All rights reserved.",
    footer_disclaimer: "Not affiliated with Hugging Face."
}

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col">
                        <Link to="/" className="footer-logo">
                            <img src={logo} alt="TopTierModels Logo" className="logo-img" />

                            <span>TopTierModels</span>
                        </Link>
                        <p className="footer-desc">
                            {t.footer_desc}
                        </p>
                        <div className="footer-social">
                            <a href="https://github.com/OnlyShoky" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Github size={18} />
                            </a>
                            <a href="https://x.com/onlyshoky" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/mohamed-el-mourabit-agharbi/" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h3 className="footer-heading">
                            {t.quick_links}
                        </h3>
                        <ul className="footer-links">
                            <li><Link to="/" className="footer-link"><span>•</span> {t.home}</Link></li>
                            <li><Link to="/tierlist" className="footer-link"><span>•</span> {t.top_ingredients}</Link></li>
                            <li><Link to="/" className="footer-link"><span>•</span> {t.favorites}</Link></li>
                            <li><Link to="/about" className="footer-link"><span>•</span> {t.about}</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="footer-col">
                        <h3 className="footer-heading">
                            {t.connect}
                        </h3>
                        <ul className="footer-links">
                            <li>
                                <a href="https://mohamed-elmourabit.netlify.app" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    <Globe size={16} /> {t.portfolio}
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/mohamed-el-mourabit-agharbi/" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    <Linkedin size={16} /> LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="mailto:mohamed.elmoag+toptiermodels@gmail.com" className="footer-link">
                                    <Mail size={16} /> {t.contact_us}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copy">&copy; {new Date().getFullYear()} {t.footer_text}</p>
                    <p className="footer-disclaimer">{t.footer_disclaimer}</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
