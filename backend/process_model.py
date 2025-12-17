#!/usr/bin/env python3

"""
TopTierModels - CLI Processing Script

Main entry point for processing Hugging Face model URLs.
Scrapes content, generates articles, calculates scores, and opens local preview.
"""

import argparse
import asyncio
import uuid
import webbrowser
import uvicorn
import threading
import json
from pathlib import Path

import warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.api_core")


from dotenv import load_dotenv
load_dotenv()

from app.config import settings
from app.database import init_database, save_preview
from app.services.scraper import scrape_model, validate_huggingface_url
from app.services.llm_processor import generate_article, generate_linkedin_post
from app.services.scoring_engine import calculate_scores, classify_category
from app.models import ScrapedModel, GeneratedArticle, LinkedInPost, ModelScores


async def process_model(url: str) -> str:
    """
    Process a Hugging Face model URL through the complete pipeline.
    
    Args:
        url: Valid Hugging Face model URL
        
    Returns:
        Preview session ID
    """
    print(f"\n🚀 Processing: {url}\n")
    
    # Step 1: Validate URL
    print("1. Validating URL... ", end="", flush=True)
    if not validate_huggingface_url(url):
        raise ValueError(f"Invalid Hugging Face URL: {url}")
    print("✓")
    
    # Step 2: Initialize database
    print("2. Initializing database... ", end="", flush=True)
    await init_database()
    print("✓")
    
    # Step 3: Scrape content
    print("3. Scraping content... ", end="", flush=True)
    model_data = await scrape_model(url)
    print(f"✓ ({model_data.display_name})")
    
    # Step 4: Classify category
    print("4. Classifying category... ", end="", flush=True)
    category = classify_category(model_data)
    print(f"✓ ({category.value})")
    
    # Step 5: Generate article
    print("5. Generating article... ", end="", flush=True)
    article = await generate_article(model_data, category.value)
    print(f"✓ ({len(article.content)} chars)")
    
    # Step 6: Calculate scores (using LLM scores from article if available)
    print("6. Calculating scores... ", end="", flush=True)
    scores = calculate_scores(
        model=model_data, 
        category=category.value,
        quality_score=getattr(article, 'quality_score', None),
        speed_score=getattr(article, 'speed_score', None),
        freedom_score=getattr(article, 'freedom_score', None)
    )
    print(f"✓ ({scores.overall_score}/100 - {scores.tier.value} Tier)")
    
    # Step 7: Generate LinkedIn post (OPTIONAL)
    print("7. Generating LinkedIn post... ", end="", flush=True)
    linkedin_post = None
    try:
        scores_dict = {
            'overall_score': scores.overall_score,
            'quality_score': scores.quality_score,
            'speed_score': scores.speed_score,
            'freedom_score': scores.freedom_score
        }
        linkedin_post = await generate_linkedin_post(model_data, article, category.value, scores_dict)
        print(f"✓ ({linkedin_post.character_count} chars)")
        print(f"   Note: This accounts for ~50% of API calls. Frequent use may hit rate limits.")
    except Exception as e:
        print(f"⚠️ Skipped (Error: {str(e)})")
        linkedin_post = None
    
    # Step 8: Images (Using remote URLs)
    print("8. Processing images... ", end="", flush=True)
    preview_id = str(uuid.uuid4())[:8]
    # User requested to skip download and use remote URLs directly
    local_images = model_data.images
    print(f"✓ ({len(local_images)} remote images)")
    
    # Step 9: Save to local database
    print("9. Saving preview... ", end="", flush=True)
    
    # Add category to model data
    model_dict = model_data.model_dump()
    model_dict['category'] = category.value
    
    linkedin_dump = linkedin_post.model_dump() if linkedin_post else None
    
    await save_preview(
        preview_id=preview_id,
        model_data=model_dict,
        article_data=article.model_dump(),
        linkedin_data=linkedin_dump,
        scores_data=scores.model_dump(),
        images=local_images
    )
    print("✓")

    # Step 10: Persist State to JSON
    print("10. Saving JSON output... ", end="", flush=True)
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    
    slug = article.slug or model_data.display_name.lower().replace(" ", "-")
    json_path = output_dir / f"{slug}.json"
    
    full_state = {
        "model_data": model_dict,
        "article_data": article.model_dump(),
        "linkedin_data": linkedin_dump,
        "scores_data": scores.model_dump(),
        "images": local_images,
        "preview_id": preview_id
    }
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(full_state, f, indent=2, ensure_ascii=False)
    
    print(f"✓ ({json_path})")
    
    print(f"\n✅ Processing complete!")
    print(f"📋 Preview ID: {preview_id}")
    
    return preview_id


def start_server(preview_id: str):
    """Start the local preview server and open browser."""
    print(f"\n🌐 Starting local server on port {settings.local_server_port}...")
    
    # Open browser after a short delay
    preview_url = f"http://{settings.local_server_host}:{settings.local_server_port}/preview/{preview_id}"
    print(f"📖 Opening preview: {preview_url}\n")
    
    # Schedule browser open
    # Schedule browser open (using thread to avoid event loop issues)
    threading.Timer(2.0, lambda: webbrowser.open(preview_url)).start()
    
    # Start server (blocking)
    uvicorn.run(
        "app.main:app",
        host=settings.local_server_host,
        port=settings.local_server_port,
        log_level="info"
    )


async def load_preview_from_json(json_path: str) -> str:
    """Load preview state from a JSON file, bypassing scraping/LLM."""
    print(f"\n📂 Loading preview from: {json_path}")
    
    path = Path(json_path)
    if not path.exists():
        raise FileNotFoundError(f"JSON file not found: {json_path}")
        
    with open(path, "r", encoding="utf-8") as f:
        state = json.load(f)
        
    print("1. Hydrating data... ", end="", flush=True)
    
    # Reconstruct data
    model_data = state["model_data"]
    article_data = state["article_data"]
    linkedin_data = state["linkedin_data"]
    scores_data = state["scores_data"]
    images = state["images"]
    
    # Generate NEW session ID for this viewing session
    preview_id = str(uuid.uuid4())[:8] 
    
    print("✓")
    
    print("2. Initializing database... ", end="", flush=True)
    await init_database()
    print("✓")
    
    print("3. Saving to local database... ", end="", flush=True)
    await save_preview(
        preview_id=preview_id,
        model_data=model_data,
        article_data=article_data,
        linkedin_data=linkedin_data,
        scores_data=scores_data,
        images=images
    )
    print("✓")
    
    print(f"\n✅ Load complete!")
    print(f"📋 New Preview ID: {preview_id}")
    
    return preview_id


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="TopTierModels - Process Hugging Face model URLs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python process_model.py --url https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
  python process_model.py --load-preview output/z-image-turbo.json
        """
    )
    
    parser.add_argument(
        "--url",
        type=str,
        help="Hugging Face model URL to process"
    )
    
    parser.add_argument(
        "--load-preview",
        type=str,
        help="Path to existing JSON article file to load (skips scraping/LLM)"
    )
    
    parser.add_argument(
        "--no-server",
        action="store_true",
        help="Process only, don't start preview server"
    )
    
    args = parser.parse_args()
    
    # Validation
    if not args.url and not args.load_preview:
        parser.error("Either --url or --load-preview must be provided.")
        
    try:
        # Run processing
        if args.load_preview:
            preview_id = asyncio.run(load_preview_from_json(args.load_preview))
        else:
            preview_id = asyncio.run(process_model(args.url))
        
        # Start server unless --no-server flag
        if not args.no_server:
            start_server(preview_id)
        else:
            print(f"\n💡 To start server manually, run:")
            print(f"   uvicorn app.main:app --port {settings.local_server_port}")
            
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down...")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        # raise  # Don't crash on known errors if we handled them


if __name__ == "__main__":
    main()

