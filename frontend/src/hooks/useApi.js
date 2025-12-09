import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for data fetching with caching and loading states
 */
export function useFetch(url, options = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const cache = useRef({})

    const fetchData = useCallback(async () => {
        // Check cache first
        if (cache.current[url] && !options.skipCache) {
            setData(cache.current[url])
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(url, options)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            cache.current[url] = result
            setData(result)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [url, options.skipCache])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const refetch = useCallback(() => {
        delete cache.current[url]
        fetchData()
    }, [url, fetchData])

    return { data, loading, error, refetch }
}

/**
 * Debounce hook for search inputs
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

/**
 * Local storage hook with SSR safety
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error('localStorage error:', error)
        }
    }, [key, storedValue])

    return [storedValue, setValue]
}

/**
 * Intersection observer hook for lazy loading
 */
export function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, {
            threshold: 0.1,
            ...options
        })

        observer.observe(element)
        return () => observer.disconnect()
    }, [options.threshold, options.root, options.rootMargin])

    return [ref, isIntersecting]
}

export default { useFetch, useDebounce, useLocalStorage, useIntersectionObserver }
