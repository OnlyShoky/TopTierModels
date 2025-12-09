import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Layout
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import HomePage from './pages/HomePage'
import TierlistPage from './pages/TierlistPage'
import ArticlePage from './pages/ArticlePage'
import PreviewPage from './pages/PreviewPage'
import AboutPage from './pages/AboutPage'

function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <div className="app">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tierlist" element={<TierlistPage />} />
                    <Route path="/article/:slug" element={<ArticlePage />} />
                    <Route path="/preview/:previewId" element={<PreviewPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
