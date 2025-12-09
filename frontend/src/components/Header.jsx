import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SearchOverlay from './SearchOverlay'
import './Header.css'

function Header({ theme, toggleTheme }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/tierlist', label: 'Tierlist' },
        { path: '/about', label: 'About' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        {/* Logo */}
                        <Link to="/" className="logo">
                            <span className="logo-icon">🏆</span>
                            <span className="logo-text">TopTierModels</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="nav-desktop hide-mobile">
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
                            <button
                                className="icon-btn"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>

                            <button
                                className="icon-btn"
                                onClick={toggleTheme}
                                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                    </svg>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                className="icon-btn hide-desktop"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Menu"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {menuOpen ? (
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    ) : (
                                        <path d="M3 12h18M3 6h18M3 18h18" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
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

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    )
}

export default Header
