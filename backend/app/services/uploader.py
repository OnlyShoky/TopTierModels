"""
Supabase Uploader Module - Uploads local data to production Supabase.

Handles image upload, database insertion, and Netlify rebuild triggers.
"""

import os
import httpx
from typing import Dict, Any, List, Optional
from pathlib import Path
from supabase import create_client, Client

from ..config import settings


def get_supabase_client() -> Client:
    """Create Supabase client with service role key."""
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key
    )


async def upload_to_supabase(
    preview_id: str,
    model_data: Dict[str, Any],
    article_data: Dict[str, Any],
    linkedin_data: Dict[str, Any],
    scores_data: Dict[str, Any],
    images: List[str]
) -> Dict[str, Any]:
    """
    Upload all preview data to Supabase.
    
    Args:
        preview_id: Local preview session ID
        model_data: Model information
        article_data: Generated article
        linkedin_data: LinkedIn post
        scores_data: Model scores
        images: List of local image paths
        
    Returns:
        Dictionary with created IDs and live URL
    """
    client = get_supabase_client()
    
    # Check if Supabase is configured
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise ValueError("Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
    
    # Step 1: Upload images to storage
    image_urls = await _upload_images(client, images, preview_id)
    
    # Step 2: Insert model record
    model_record = {
        'huggingface_url': model_data.get('huggingface_url'),
        'model_name': model_data.get('model_name'),
        'display_name': model_data.get('display_name'),
        'organization': model_data.get('organization'),
        'category': model_data.get('category', 'Other'),
        'description': model_data.get('description'),
        'readme_content': model_data.get('readme_content'),
        'license': model_data.get('license'),
        'tags': model_data.get('tags', []),
        'model_metadata': model_data.get('model_metadata', {}),
        'featured_image_url': image_urls[0] if image_urls else None,
        'downloads': model_data.get('downloads', 0),
        'likes': model_data.get('likes', 0),
        'status': 'active'
    }
    
    model_result = client.table('models').insert(model_record).execute()
    model_id = model_result.data[0]['id']
    
    # Step 3: Insert article record
    article_record = {
        'model_id': model_id,
        'title': article_data.get('title'),
        'slug': article_data.get('slug'),
        'excerpt': article_data.get('excerpt'),
        'content': article_data.get('content'),
        'hero_image_url': image_urls[0] if image_urls else None,
        'read_time_minutes': article_data.get('read_time_minutes', 5),
        'author': article_data.get('author', 'TopTierModels AI'),
        'seo_keywords': article_data.get('seo_keywords', []),
        'published': True
    }
    
    article_result = client.table('articles').insert(article_record).execute()
    article_id = article_result.data[0]['id']
    article_slug = article_result.data[0]['slug']
    
    # Step 4: Insert LinkedIn post
    linkedin_record = {
        'article_id': article_id,
        'model_id': model_id,
        'content': linkedin_data.get('content'),
        'hook': linkedin_data.get('hook'),
        'key_points': linkedin_data.get('key_points', []),
        'call_to_action': linkedin_data.get('call_to_action'),
        'hashtags': linkedin_data.get('hashtags', []),
        'character_count': linkedin_data.get('character_count', 0)
    }
    
    client.table('simplified_articles').insert(linkedin_record).execute()
    
    # Step 5: Insert model scores
    scores_record = {
        'model_id': model_id,
        'overall_score': scores_data.get('overall_score'),
        'tier': scores_data.get('tier'),
        'quality_score': scores_data.get('quality_score'),
        'speed_score': scores_data.get('speed_score'),
        'freedom_score': scores_data.get('freedom_score'),
        'benchmarks': scores_data.get('benchmarks', {}),
        'scoring_methodology': scores_data.get('scoring_methodology')
    }
    
    client.table('model_scores').insert(scores_record).execute()
    
    # Step 6: Insert image records
    for i, url in enumerate(image_urls):
        image_record = {
            'model_id': model_id,
            'article_id': article_id,
            'source_url': images[i] if i < len(images) else url,
            'storage_path': f"models/{model_id}/image_{i}.webp",
            'public_url': url,
            'alt_text': f"{model_data.get('display_name')} - Image {i+1}"
        }
        client.table('images').insert(image_record).execute()
    
    # Step 7: Update tierlist model count
    category = model_data.get('category', 'Other')
    client.rpc('increment_tierlist_count', {'cat': category}).execute()
    
    # Step 8: Insert code snippets if present
    code_snippets = model_data.get('code_snippets', [])
    for i, snippet in enumerate(code_snippets):
        snippet_record = {
            'model_id': model_id,
            'title': snippet.get('title', f'Example {i+1}'),
            'description': snippet.get('description'),
            'language': snippet.get('language', 'python'),
            'code': snippet.get('code'),
            'snippet_type': snippet.get('type', 'basic_usage'),
            'order': i
        }
        client.table('code_snippets').insert(snippet_record).execute()
    
    return {
        'model_id': model_id,
        'article_id': article_id,
        'live_url': f"https://toptiermodels.com/article/{article_slug}"
    }


async def _upload_images(
    client: Client,
    image_paths: List[str],
    preview_id: str
) -> List[str]:
    """
    Upload local images to Supabase Storage.
    
    Args:
        client: Supabase client
        image_paths: Local file paths
        preview_id: Session ID for folder organization
        
    Returns:
        List of public URLs
    """
    public_urls = []
    
    for i, path in enumerate(image_paths):
        if not os.path.exists(path):
            continue
            
        # Read file
        with open(path, 'rb') as f:
            file_data = f.read()
        
        # Determine storage path
        filename = f"image_{i}.webp"
        storage_path = f"models/{preview_id}/{filename}"
        
        # Upload to storage
        client.storage.from_('model-images').upload(
            storage_path,
            file_data,
            {'content-type': 'image/webp'}
        )
        
        # Get public URL
        public_url = client.storage.from_('model-images').get_public_url(storage_path)
        public_urls.append(public_url)
    
    return public_urls


async def trigger_netlify_rebuild():
    """Trigger a Netlify rebuild via build hook."""
    if not settings.netlify_build_hook_url:
        return False
        
    async with httpx.AsyncClient() as client:
        response = await client.post(settings.netlify_build_hook_url)
        return response.status_code == 200
