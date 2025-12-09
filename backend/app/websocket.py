"""
WebSocket Manager for real-time preview updates.
"""

import asyncio
from typing import Dict, Set
from fastapi import WebSocket, WebSocketDisconnect
import json


class ConnectionManager:
    """Manages WebSocket connections for real-time preview updates."""
    
    def __init__(self):
        # Map of preview_id to set of connected websockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, preview_id: str):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        if preview_id not in self.active_connections:
            self.active_connections[preview_id] = set()
        self.active_connections[preview_id].add(websocket)
    
    def disconnect(self, websocket: WebSocket, preview_id: str):
        """Remove a WebSocket connection."""
        if preview_id in self.active_connections:
            self.active_connections[preview_id].discard(websocket)
            if not self.active_connections[preview_id]:
                del self.active_connections[preview_id]
    
    async def send_update(self, preview_id: str, data: dict):
        """Send an update to all connections for a preview."""
        if preview_id not in self.active_connections:
            return
        
        message = json.dumps(data)
        disconnected = set()
        
        for connection in self.active_connections[preview_id]:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.add(connection)
        
        # Clean up disconnected sockets
        for conn in disconnected:
            self.active_connections[preview_id].discard(conn)
    
    async def broadcast(self, data: dict):
        """Broadcast message to all connected clients."""
        message = json.dumps(data)
        for preview_id in self.active_connections:
            for connection in self.active_connections[preview_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    pass


# Global connection manager instance
manager = ConnectionManager()
