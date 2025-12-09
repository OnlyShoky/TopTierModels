import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for WebSocket connection to preview updates
 * @param {string} previewId - The preview session ID
 * @param {boolean} enabled - Whether to enable the connection
 * @returns {{ data: object, isConnected: boolean, sendMessage: function }}
 */
export function usePreviewWebSocket(previewId, enabled = true) {
    const [data, setData] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef(null)
    const reconnectTimeoutRef = useRef(null)

    const connect = useCallback(() => {
        if (!previewId || !enabled) return

        const wsUrl = `ws://${window.location.hostname}:3001/ws/${previewId}`
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            console.log('WebSocket connected')
            setIsConnected(true)
        }

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data)

                if (message.type === 'initial') {
                    setData(message.data)
                } else if (message.type === 'update') {
                    setData(prev => ({ ...prev, ...message.data }))
                } else if (message.type === 'pong') {
                    // Heartbeat response
                }
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e)
            }
        }

        ws.onclose = () => {
            console.log('WebSocket disconnected')
            setIsConnected(false)

            // Auto-reconnect after 3 seconds
            if (enabled) {
                reconnectTimeoutRef.current = setTimeout(connect, 3000)
            }
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        wsRef.current = ws
    }, [previewId, enabled])

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
        }
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    const sendMessage = useCallback((message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(typeof message === 'string' ? message : JSON.stringify(message))
        }
    }, [])

    // Heartbeat to keep connection alive
    useEffect(() => {
        if (!isConnected) return

        const interval = setInterval(() => {
            sendMessage('ping')
        }, 30000)

        return () => clearInterval(interval)
    }, [isConnected, sendMessage])

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        if (enabled && previewId) {
            connect()
        }

        return () => {
            disconnect()
        }
    }, [previewId, enabled, connect, disconnect])

    return { data, isConnected, sendMessage }
}

export default usePreviewWebSocket
