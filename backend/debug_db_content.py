import asyncio
import aiosqlite
import json
from pathlib import Path
from app.config import settings

DATABASE_PATH = Path(settings.data_dir) / "local.db"

async def check_db():
    print(f"Connecting to {DATABASE_PATH}")
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT preview_id, article_data FROM local_previews ORDER BY last_modified DESC LIMIT 1")
        row = await cursor.fetchone()
        
        if not row:
            print("No previews found.")
            return

        print(f"Latest Preview ID: {row['preview_id']}")
        article_data = json.loads(row['article_data'])
        content = article_data.get('content', '')
        
        print(f"\nContent Length: {len(content)}")
        
        # Check code fences
        snippet_idx = content.find('```bash')
        if snippet_idx != -1:
            start = max(0, snippet_idx - 10)
            end = min(len(content), snippet_idx + 50)
            print(f"\n--- DB Content Snippet ---")
            print(f"Repr: {repr(content[start:end])}")
        else:
            print("No ```bash found in DB content.")

if __name__ == "__main__":
    asyncio.run(check_db())
