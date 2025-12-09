import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header({ theme, toggleTheme }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { path: '/', label: 'Models' },
        { path: '/tierlist', label: 'Tierlist' },
        { path: '/about', label: 'About' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <header className="header">
            <div className="container">
                <div className="header-inner">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-mark">T</span>
                        <span className="logo-text">TopTierModels</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="nav hide-mobile">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="header-actions">
                        {/* Theme Toggle */}
                        <button
                            className="icon-btn"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 1zm0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                    <path d="M13.5 8a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1h1zm-10 0a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1h1zm8.36-4.95a.5.5 0 0 1 0 .7l-.7.71a.5.5 0 1 1-.71-.71l.7-.7a.5.5 0 0 1 .71 0zm-8.49 8.49a.5.5 0 0 1 0 .7l-.7.71a.5.5 0 1 1-.71-.71l.7-.7a.5.5 0 0 1 .71 0zm8.49 0a.5.5 0 0 1 .7 0l.71.7a.5.5 0 1 1-.71.71l-.7-.7a.5.5 0 0 1 0-.71zm-8.49-8.49a.5.5 0 0 1 .7 0l.71.7a.5.5 0 1 1-.71.71l-.7-.7a.5.5 0 0 1 0-.71zM8 13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 13z" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                                </svg>
                            )}
                        </button>

                        {/* Mobile Menu */}
                        <button
                            className="icon-btn hide-desktop"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                {menuOpen ? (
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                ) : (
                                    <path d="M1 3.5A.5.5 0 0 1 1.5 3h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0 4A.5.5 0 0 1 1.5 7h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {menuOpen && (
                    <nav className="nav-mobile hide-desktop">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    )
}

export default Header
