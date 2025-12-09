"""
SQLite database management for local preview sessions.
"""

import aiosqlite
import os
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
from pathlib import Path

from .config import settings


DATABASE_PATH = Path(settings.data_dir) / "local.db"


async def init_database():
    """Initialize the local SQLite database with required tables."""
    os.makedirs(settings.data_dir, exist_ok=True)
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Local previews table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS local_previews (
                preview_id TEXT PRIMARY KEY,
                model_data TEXT NOT NULL,
                article_data TEXT NOT NULL,
                linkedin_data TEXT NOT NULL,
                scores_data TEXT NOT NULL,
                images TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_modified TEXT DEFAULT CURRENT_TIMESTAMP,
                publish_status TEXT DEFAULT 'draft',
                supabase_references TEXT
            )
        """)
        
        # Local config table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS local_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                type TEXT DEFAULT 'string',
                last_updated TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        await db.commit()


async def save_preview(
    preview_id: str,
    model_data: Dict[str, Any],
    article_data: Dict[str, Any],
    linkedin_data: Dict[str, Any],
    scores_data: Dict[str, Any],
    images: Optional[List[str]] = None
) -> bool:
    """Save a preview session to the local database."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            INSERT OR REPLACE INTO local_previews 
            (preview_id, model_data, article_data, linkedin_data, scores_data, images, last_modified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            preview_id,
            json.dumps(model_data),
            json.dumps(article_data),
            json.dumps(linkedin_data),
            json.dumps(scores_data),
            json.dumps(images) if images else None,
            datetime.utcnow().isoformat()
        ))
        await db.commit()
        return True


async def get_preview(preview_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a preview session from the local database."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM local_previews WHERE preview_id = ?",
            (preview_id,)
        )
        row = await cursor.fetchone()
        
        if row:
            return {
                "preview_id": row["preview_id"],
                "model_data": json.loads(row["model_data"]),
                "article_data": json.loads(row["article_data"]),
                "linkedin_data": json.loads(row["linkedin_data"]),
                "scores_data": json.loads(row["scores_data"]),
                "images": json.loads(row["images"]) if row["images"] else [],
                "created_at": row["created_at"],
                "last_modified": row["last_modified"],
                "publish_status": row["publish_status"],
                "supabase_references": json.loads(row["supabase_references"]) if row["supabase_references"] else None
            }
        return None


async def update_preview_status(preview_id: str, status: str, supabase_refs: Optional[Dict] = None) -> bool:
    """Update the publish status of a preview."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            UPDATE local_previews 
            SET publish_status = ?, supabase_references = ?, last_modified = ?
            WHERE preview_id = ?
        """, (
            status,
            json.dumps(supabase_refs) if supabase_refs else None,
            datetime.utcnow().isoformat(),
            preview_id
        ))
        await db.commit()
        return True


async def list_previews() -> List[Dict[str, Any]]:
    """List all preview sessions."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT preview_id, created_at, last_modified, publish_status FROM local_previews ORDER BY last_modified DESC"
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def delete_preview(preview_id: str) -> bool:
    """Delete a preview session."""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("DELETE FROM local_previews WHERE preview_id = ?", (preview_id,))
        await db.commit()
        return True
