"""
TopTierModels - Local Processing Studio FastAPI Server

Main entry point for the local preview server.
Serves the preview interface and handles publication to Supabase.
"""

import os
import webbrowser
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import settings
from .database import init_database, get_preview
from .routers import preview
from .websocket import manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup: Initialize database
    await init_database()
    
    # Create required directories
    os.makedirs(settings.data_dir, exist_ok=True)
    os.makedirs(settings.cache_dir, exist_ok=True)
    os.makedirs(settings.sessions_dir, exist_ok=True)
    
    yield
    
    # Shutdown: Cleanup if needed
    pass


app = FastAPI(
    title="TopTierModels Local Studio",
    description="Local processing and preview server for AI model content generation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(preview.router, prefix="/api", tags=["preview"])


# Serve static files for preview interface (will be built from React)
FRONTEND_BUILD_PATH = Path(__file__).parent.parent.parent / "frontend" / "dist"

if FRONTEND_BUILD_PATH.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_BUILD_PATH / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React frontend for all non-API routes."""
        file_path = FRONTEND_BUILD_PATH / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_BUILD_PATH / "index.html")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}


@app.websocket("/ws/{preview_id}")
async def websocket_endpoint(websocket: WebSocket, preview_id: str):
    """WebSocket endpoint for real-time preview updates."""
    await manager.connect(websocket, preview_id)
    try:
        # Send initial preview data
        preview_data = await get_preview(preview_id)
        if preview_data:
            await websocket.send_json({"type": "initial", "data": preview_data})
        
        # Keep connection alive and handle messages
        while True:
            data = await websocket.receive_text()
            # Echo back or handle specific commands
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket, preview_id)


def open_browser(preview_id: str = None):
    """Open the browser to the preview page."""
    url = f"http://{settings.local_server_host}:{settings.local_server_port}"
    if preview_id:
        url += f"/preview/{preview_id}"
    webbrowser.open(url)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.local_server_host,
        port=settings.local_server_port,
        reload=True
    )
