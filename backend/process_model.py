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
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from app.config import settings
from app.database import init_database, save_preview
from app.services.scraper import scrape_model, validate_huggingface_url
from app.services.llm_processor import generate_article, generate_linkedin_post
from app.services.scoring_engine import calculate_scores, classify_category


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
    
    # Step 6: Generate LinkedIn post
    print("6. Generating LinkedIn post... ", end="", flush=True)
    linkedin_post = await generate_linkedin_post(model_data, article, category.value)
    print(f"✓ ({linkedin_post.character_count} chars)")
    
    # Step 7: Calculate scores
    print("7. Calculating scores... ", end="", flush=True)
    scores = calculate_scores(model_data, category.value)
    print(f"✓ ({scores.overall_score}/100 - {scores.tier.value} Tier)")
    
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
    
    await save_preview(
        preview_id=preview_id,
        model_data=model_dict,
        article_data=article.model_dump(),
        linkedin_data=linkedin_post.model_dump(),
        scores_data=scores.model_dump(),
        images=local_images
    )
    print("✓")
    
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


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="TopTierModels - Process Hugging Face model URLs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python process_model.py --url https://huggingface.co/Tongyi-MAI/Z-Image-Turbo
  python process_model.py --url https://huggingface.co/meta-llama/Llama-2-7b
        """
    )
    
    parser.add_argument(
        "--url",
        type=str,
        required=True,
        help="Hugging Face model URL to process"
    )
    
    parser.add_argument(
        "--no-server",
        action="store_true",
        help="Process only, don't start preview server"
    )
    
    args = parser.parse_args()
    
    try:
        # Run processing
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
        raise


if __name__ == "__main__":
    main()
