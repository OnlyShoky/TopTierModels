import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'

// Layout
import Header from './components/Header'
import Footer from './components/Footer'

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const TierlistPage = lazy(() => import('./pages/TierlistPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const PreviewPage = lazy(() => import('./pages/PreviewPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

// Loading fallback
function PageLoader() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: 'var(--color-text-muted)'
        }}>
            Loading...
        </div>
    )
}

function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    const location = useLocation()

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <div className="app">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="main-content">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tierlist" element={<TierlistPage />} />
                        <Route path="/article/:slug" element={<ArticlePage />} />
                        <Route path="/preview/:previewId" element={<PreviewPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}

export default App
