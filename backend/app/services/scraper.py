"""
Web Scraper Module - Scrapes Hugging Face model pages.

This module handles URL validation, content extraction, and image downloading.
"""

import re
import os
import httpx
import asyncio
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional
from pathlib import Path
from urllib.parse import urljoin, urlparse

from ..config import settings
from ..models import ScrapedModel


# Rate limiting: 1 request per second
RATE_LIMIT_DELAY = 1.0
HUGGINGFACE_DOMAIN = "huggingface.co"


def validate_huggingface_url(url: str) -> bool:
    """Validate that URL is a valid Hugging Face model page."""
    try:
        parsed = urlparse(url)
        if parsed.netloc != HUGGINGFACE_DOMAIN:
            return False
        # Model URLs have format: /org/model-name or /model-name
        path_parts = [p for p in parsed.path.split('/') if p]
        if len(path_parts) < 1 or len(path_parts) > 2:
            return False
        return True
    except Exception:
        return False


async def scrape_model(url: str) -> ScrapedModel:
    """
    Scrape a Hugging Face model page and extract all relevant content.
    
    Args:
        url: Valid Hugging Face model URL
        
    Returns:
        ScrapedModel with all extracted data
    """
    if not validate_huggingface_url(url):
        raise ValueError(f"Invalid Hugging Face URL: {url}")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Extract model name from URL
        path_parts = [p for p in urlparse(url).path.split('/') if p]
        if len(path_parts) >= 2:
            organization = path_parts[0]
            model_name = f"{path_parts[0]}/{path_parts[1]}"
        else:
            organization = None
            model_name = path_parts[0]
        
        display_name = path_parts[-1]
        
        # Fetch from Hugging Face API for accurate stats
        api_data = await _fetch_api_data(client, model_name)
        
        # Fetch main page for content
        response = await client.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Extract description
        description = _extract_description(soup) or api_data.get('description', '')
        
        # Extract README content
        readme_content = _extract_readme(soup)
        
        # Extract metadata
        metadata = _extract_metadata(soup)
        
        # Extract tags (prefer API data)
        tags = api_data.get('tags', []) or _extract_tags(soup)
        
        # Extract images
        images = _extract_images(soup, url)
        featured_image = images[0] if images else None
        
        # Extract code snippets
        code_snippets = _extract_code_snippets(soup)
        
        # Get stats and metadata from API (more reliable)
        license_info = api_data.get('license', metadata.get('license'))
        
        # New Metadata Extraction Logic
        safetensors = _extract_safetensors_status(api_data)
        model_size = _extract_model_size(api_data)
        tensor_types = _extract_tensor_types(api_data)
        
        await asyncio.sleep(RATE_LIMIT_DELAY)  # Rate limiting
        
        return ScrapedModel(
            huggingface_url=url,
            model_name=model_name,
            display_name=display_name,
            organization=organization,
            description=description,
            readme_content=readme_content,
            license=license_info,
            tags=tags,
            model_metadata=metadata,
            featured_image_url=featured_image,
            safetensors=safetensors,
            model_size=model_size,
            tensor_types=tensor_types,
            code_snippets=code_snippets,
            images=images
        )


async def _fetch_api_data(client: httpx.AsyncClient, model_id: str) -> dict:
    """Fetch model data from Hugging Face API."""
    try:
        api_url = f"https://huggingface.co/api/models/{model_id}"
        response = await client.get(api_url)
        if response.status_code == 200:
            return response.json()
    except Exception:
        pass
    return {}


def _extract_description(soup: BeautifulSoup) -> Optional[str]:
    """Extract short description from model card."""
    # Try meta description
    meta = soup.find('meta', attrs={'name': 'description'})
    if meta and meta.get('content'):
        return meta['content']
    
    # Try first paragraph of README
    readme = soup.find('div', class_='prose')
    if readme:
        first_p = readme.find('p')
        if first_p:
            return first_p.get_text(strip=True)[:500]
    
    return None


def _extract_readme(soup: BeautifulSoup) -> Optional[str]:
    """Extract full README markdown content."""
    readme_div = soup.find('div', class_='prose')
    if readme_div:
        return readme_div.get_text(separator='\n', strip=True)
    return None


def _extract_metadata(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract model card metadata."""
    metadata = {}
    
    # Look for YAML frontmatter or structured data
    # This is simplified - real implementation would parse model card YAML
    
    # Try to find license
    # Pattern: "licensed under the [Link](MIT License)" or similar
    license_elem = soup.find('a', href=re.compile(r'LICENSE|/license', re.I))
    if license_elem:
         metadata['license'] = license_elem.get_text(strip=True)
         href = license_elem.get('href')
         if href:
             # Ensure absolute URL
             if href.startswith('/'):
                 href = f"https://{HUGGINGFACE_DOMAIN}{href}"
             metadata['license_url'] = href
    else:
        # Text search fallback
        license_text = soup.find(text=re.compile(r'licensed? under the', re.I))
        if license_text:
            next_link = license_text.find_next('a')
            if next_link:
                metadata['license'] = next_link.get_text(strip=True)
                href = next_link.get('href')
                if href:
                    if href.startswith('/'):
                        href = f"https://{HUGGINGFACE_DOMAIN}{href}"
                    metadata['license_url'] = href
    
    return metadata
    
    return metadata


def _extract_tags(soup: BeautifulSoup) -> List[str]:
    """Extract model tags."""
    tags = []
    tag_links = soup.find_all('a', class_=re.compile(r'tag'))
    for tag in tag_links:
        text = tag.get_text(strip=True)
        if text:
            tags.append(text)
    return tags[:20]  # Limit to 20 tags


def _extract_images(soup: BeautifulSoup, base_url: str) -> List[str]:
    """Extract all relevant images from the page."""
    images = []
    
    # Find images in README/prose area
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and not any(x in src for x in ['avatar', 'logo', 'icon']):
            full_url = urljoin(base_url, src)
            images.append(full_url)
    
    return images[:5]  # Limit to 5 images


def _extract_code_snippets(soup: BeautifulSoup) -> List[Dict[str, str]]:
    """Extract code examples from the page."""
    snippets = []
    
    for code_block in soup.find_all('pre'):
        code = code_block.find('code')
        if code:
            text = code.get_text(strip=True)
            if len(text) > 20:  # Filter out very short snippets
                # Try to detect language
                classes = code.get('class', [])
                language = 'python'  # Default
                for cls in classes:
                    if cls.startswith('language-'):
                        language = cls.replace('language-', '')
                        break
                
                snippets.append({
                    'language': language,
                    'code': text,
                    'title': f'{language.capitalize()} Example'
                })
    
    return snippets[:5]  # Limit to 5 snippets





async def download_images(
    image_urls: List[str],
    session_id: str,
    cache_dir: Optional[str] = None
) -> List[str]:
    """
    Download images to local cache.
    
    Args:
        image_urls: List of image URLs to download
        session_id: Unique session ID for organizing cache
        cache_dir: Optional override for cache directory
        
    Returns:
        List of local file paths
    """
    cache_path = Path(cache_dir or settings.cache_dir) / session_id
    cache_path.mkdir(parents=True, exist_ok=True)
    
    local_paths = []
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, url in enumerate(image_urls):
            try:
                response = await client.get(url)
                response.raise_for_status()
                
                # Determine filename
                ext = Path(urlparse(url).path).suffix or '.jpg'
                filename = f"image_{i}{ext}"
                filepath = cache_path / filename
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                local_paths.append(str(filepath))
                
                await asyncio.sleep(RATE_LIMIT_DELAY)
                
            except Exception as e:
                print(f"Failed to download {url}: {e}")
    
    
    return local_paths


def _extract_safetensors_status(api_data: Dict[str, Any]) -> bool:
    """Check if model has safetensors."""
    # Check 'safetensors' property provided by some API responses
    if api_data.get('safetensors') is not None:
        if isinstance(api_data['safetensors'], dict):
            return api_data['safetensors'].get('total') is not None
        return bool(api_data['safetensors'])
    
    # Check siblings/files for .safetensors extension
    siblings = api_data.get('siblings', [])
    for file in siblings:
        if file.get('rfilename', '').endswith('.safetensors'):
            return True
            
    # Check tags
    tags = api_data.get('tags', [])
    return 'safetensors' in tags


def _extract_model_size(api_data: Dict[str, Any]) -> Optional[str]:
    """Extract model parameter count (e.g., 7B, 34B)."""
    tags = api_data.get('tags', [])
    
    # Regex for common size patterns (e.g., 7b, 70b, 1.5b)
    size_pattern = re.compile(r'^(\d+(?:\.\d+)?)[Bb]$')
    
    for tag in tags:
        match = size_pattern.match(tag)
        if match:
            return tag.upper()
            
    # Fallback: check config if available (sometimes in 'config' key)
    # But usually tags are reliable for size (e.g. '7b', '13b')
    
    return None


def _extract_tensor_types(api_data: Dict[str, Any]) -> List[str]:
    """Extract tensor types / precision (e.g., FP16, BF16)."""
    tags = api_data.get('tags', [])
    found_types = []
    
    # Common precision tags
    known_types = {
        'fp16': 'FP16',
        'bf16': 'BF16',
        'fp32': 'FP32',
        'int8': 'INT8',
        'int4': 'INT4',
        '8bit': '8-bit',
        '4bit': '4-bit'
    }
    
    for tag in tags:
        lower_tag = tag.lower()
        if lower_tag in known_types:
            type_str = known_types[lower_tag]
            if type_str not in found_types:
                found_types.append(type_str)
                
    return found_types
