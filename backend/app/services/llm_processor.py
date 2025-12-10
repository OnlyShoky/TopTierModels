"""
LLM Processing Module - Generates articles, LinkedIn posts, and content.

Supports OpenAI, Anthropic Claude, and Ollama (local) providers.
"""

import json
from typing import Dict, Any, Optional
from pathlib import Path

from ..config import settings, get_llm_provider
from ..models import ScrapedModel, GeneratedArticle, LinkedInPost, ModelScores
import re


def _parse_json_response(response: str) -> Optional[Dict[str, Any]]:
    """Parse JSON from LLM response, handling markdown code fences."""
    # Try direct JSON parse first
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        pass
    
    # Try to extract JSON from markdown code fence
    patterns = [
        r'```json\s*([\s\S]*?)\s*```',  # ```json ... ```
        r'```\s*([\s\S]*?)\s*```',       # ``` ... ```
        r'\{[\s\S]*\}'                   # Raw JSON object
    ]
    
    for pattern in patterns:
        match = re.search(pattern, response)
        if match:
            try:
                json_str = match.group(1) if '```' in pattern else match.group(0)
                return json.loads(json_str)
            except (json.JSONDecodeError, IndexError):
                continue
    
    return None


# Prompt templates
ARTICLE_PROMPT_TEMPLATE = """You are an expert AI technical writer. Generate a comprehensive blog article about the following AI model from Hugging Face.

## Model Information:
- Name: {model_name}
- Organization: {organization}
- Category: {category}
- Description: {description}

## README Content:
{readme_content}

## Requirements:
1. Write a 800-1500 word technical article
2. Include these sections:
   - Executive Summary (2-3 sentences)
   - Model Architecture Overview
   - Key Features and Innovations
   - Performance Analysis
   - Use Cases and Applications
   - Implementation Guidance
   - Conclusion and Recommendations
3. Be technically accurate but accessible to a broad audience
4. Include specific metrics and benchmarks when available
5. Cite the source (Hugging Face page)

## Output Format:
Return a JSON object with:
- title: Compelling article title
- slug: URL-friendly slug (lowercase, hyphens)
- excerpt: 150-200 character summary
- content: Full article in Markdown format
- seo_keywords: Array of 5-8 SEO keywords
- read_time_minutes: Estimated read time

Return ONLY valid JSON, no additional text."""


LINKEDIN_PROMPT_TEMPLATE = """Create a LinkedIn post about this AI model analysis.

## Model: {model_name}
## Article Title: {article_title}
## Article Excerpt: {article_excerpt}
## Category: {category}
## Scores: Overall: {overall_score}/100, Quality: {quality_score}, Speed: {speed_score}, Freedom: {freedom_score}

## CRITICAL FORMATTING RULES:
1. Do NOT use Markdown (no *, **, #, __)
2. Use ONLY Unicode styled characters for emphasis:
   - Bold: Use 𝗕𝗼𝗹𝗱 Unicode characters for main emphasis (copy these exact characters)
   - For bold text, convert normal letters to mathematical bold: a→𝗮, b→𝗯, etc.
3. Use emoji as bullet points: ✅, 🔥, 🚀, 💡, ⚡
4. Keep natural line breaks
5. Professional, human-sounding tone

## Structure:
- Hook: 1 compelling opening line
- Intro: Brief mention of overall score
- Key points: 3-4 bullet points with emoji (include Quality, Speed, Freedom scores)
- Your impression: 1-2 sentences
- Call to action: Link to full article
- Hashtags: 3-5 relevant hashtags

## Example output style:
𝗭-𝗜𝗺𝗮𝗴𝗲-𝗧𝘂𝗿𝗯𝗼 just scored 87/100 in our latest AI model analysis!

✅ Quality: 85 - Excellent photorealistic outputs
⚡ Speed: 92 - Sub-second generation
🔓 Freedom: 84 - Open weights, free to use

This model is a game-changer for...

Read the full analysis → [link]

#AI #ImageGeneration #OpenSource

## Output Format:
Return a JSON object with:
- content: The complete post text (ready to paste, NO markdown)
- hook: The opening hook sentence
- key_points: Array of bullet point strings
- call_to_action: The CTA text
- hashtags: Array of hashtags (without # symbol)
- character_count: Total character count

Return ONLY valid JSON, no additional text."""


async def generate_article(model: ScrapedModel, category: str = "Other") -> GeneratedArticle:
    """
    Generate a comprehensive technical article about a model.
    
    Args:
        model: Scraped model data
        category: Model category for context
        
    Returns:
        GeneratedArticle with all content
    """
    # Demo mode: use sample data
    if settings.demo_mode:
        sample_path = Path(__file__).parent.parent / "data" / "sample_article.json"
        if sample_path.exists():
            with open(sample_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Customize with actual model name
                data['title'] = data['title'].replace('Z-Image-Turbo', model.display_name)
                data['slug'] = model.display_name.lower().replace(' ', '-').replace('/', '-')
                return GeneratedArticle(
                    title=data.get('title'),
                    slug=data.get('slug'),
                    excerpt=data.get('excerpt'),
                    content=data.get('content'),
                    read_time_minutes=data.get('read_time_minutes', 5),
                    seo_keywords=data.get('seo_keywords', []),
                    hero_image_url=model.featured_image_url
                )
    
    prompt = ARTICLE_PROMPT_TEMPLATE.format(
        model_name=model.display_name,
        organization=model.organization or "Unknown",
        category=category,
        description=model.description or "No description available",
        readme_content=model.readme_content[:8000] if model.readme_content else "No README available"
    )
    
    response = await _call_llm(prompt)
    
    # Parse JSON from response (handling markdown code fences)
    data = _parse_json_response(response)
    
    if data:
        # Ensure excerpt is within limit
        excerpt = data.get('excerpt', model.description[:200] if model.description else '')
        if len(excerpt) > 250:
            excerpt = excerpt[:247] + "..."
            
        return GeneratedArticle(
            title=data.get('title', f"Analysis: {model.display_name}"),
            slug=data.get('slug', model.display_name.lower().replace(' ', '-')),
            excerpt=excerpt,
            content=data.get('content', ''),
            read_time_minutes=data.get('read_time_minutes', 5),
            seo_keywords=data.get('seo_keywords', []),
            hero_image_url=model.featured_image_url
        )
    else:
        # Fallback: treat response as raw content
        excerpt = model.description[:200] if model.description else ''
        if len(excerpt) > 250:
            excerpt = excerpt[:247] + "..."
            
        return GeneratedArticle(
            title=f"Analysis: {model.display_name}",
            slug=model.display_name.lower().replace(' ', '-'),
            excerpt=excerpt,
            content=response,
            read_time_minutes=5,
            seo_keywords=[],
            hero_image_url=model.featured_image_url
        )


async def generate_linkedin_post(
    model: ScrapedModel,
    article: GeneratedArticle,
    category: str = "Other",
    scores: dict = None
) -> LinkedInPost:
    """
    Generate a LinkedIn-optimized post about a model.
    
    Args:
        model: Scraped model data
        article: Generated article for context
        category: Model category
        scores: Optional scores dict with overall_score, quality_score, speed_score, freedom_score
        
    Returns:
        LinkedInPost with formatted content
    """
    # Demo mode: use sample data
    if settings.demo_mode:
        sample_path = Path(__file__).parent.parent / "data" / "sample_linkedin.json"
        if sample_path.exists():
            with open(sample_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                content = data.get('content', '')
                return LinkedInPost(
                    content=content,
                    hook=data.get('hook'),
                    key_points=data.get('key_points', []),
                    call_to_action=data.get('call_to_action'),
                    hashtags=data.get('hashtags', [])[:5],
                    character_count=len(content)
                )
    
    # Default scores if not provided
    if scores is None:
        scores = {'overall_score': 0, 'quality_score': 0, 'speed_score': 0, 'freedom_score': 0}
    
    prompt = LINKEDIN_PROMPT_TEMPLATE.format(
        model_name=model.display_name,
        article_title=article.title,
        article_excerpt=article.excerpt,
        category=category,
        overall_score=scores.get('overall_score', 0),
        quality_score=scores.get('quality_score', 0),
        speed_score=scores.get('speed_score', 0),
        freedom_score=scores.get('freedom_score', 0)
    )
    
    response = await _call_llm(prompt)
    
    # Parse JSON from response
    data = _parse_json_response(response)
    
    if data:
        content = data.get('content', '')
        return LinkedInPost(
            content=content,
            hook=data.get('hook'),
            key_points=data.get('key_points', []),
            call_to_action=data.get('call_to_action'),
            hashtags=data.get('hashtags', [])[:5],
            character_count=len(content)
        )
    else:
        # Fallback
        return LinkedInPost(
            content=response[:3000],
            hook=None,
            key_points=[],
            call_to_action=None,
            hashtags=['AI', 'MachineLearning'],
            character_count=len(response[:3000])
        )


async def regenerate_content(
    section: str,
    model_data: Dict[str, Any],
    current_article: Dict[str, Any],
    current_linkedin: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Regenerate a specific section of content.
    
    Args:
        section: 'article', 'linkedin', or 'scores'
        model_data: Current model data
        current_article: Current article data
        current_linkedin: Current LinkedIn post data
        
    Returns:
        Regenerated content for the section
    """
    model = ScrapedModel(**model_data)
    
    if section == 'article':
        article = await generate_article(model)
        return article.model_dump()
    elif section == 'linkedin':
        article = GeneratedArticle(**current_article)
        linkedin = await generate_linkedin_post(model, article)
        return linkedin.model_dump()
    else:
        raise ValueError(f"Unknown section: {section}")


async def _call_llm(prompt: str) -> str:
    """
    Call the configured LLM provider.
    
    Args:
        prompt: The prompt to send
        
    Returns:
        LLM response text
    """
    provider = get_llm_provider()
    
    if provider == 'openai':
        return await _call_openai(prompt)
    elif provider == 'anthropic':
        return await _call_anthropic(prompt)
    elif provider == 'gemini':
        return await _call_gemini(prompt)
    else:
        return await _call_ollama(prompt)


async def _call_openai(prompt: str) -> str:
    """Call OpenAI API."""
    from openai import AsyncOpenAI
    
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": "You are an expert AI technical writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=4000
    )
    
    return response.choices[0].message.content


async def _call_anthropic(prompt: str) -> str:
    """Call Anthropic Claude API."""
    import anthropic
    
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    
    response = await client.messages.create(
        model=settings.anthropic_model,
        max_tokens=4000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.content[0].text


async def _call_gemini(prompt: str) -> str:
    """Call Google Gemini API."""
    import google.generativeai as genai
    
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)
    
    # Gemini 1.5/2.0 specific configs
    generation_config = genai.types.GenerationConfig(
        candidate_count=1,
        max_output_tokens=8192,
        temperature=0.7,
    )
    
    # Run in executor to avoid blocking event loop (genai is sync by default)
    import asyncio
    from functools import partial
    
    loop = asyncio.get_running_loop()
    
    response = await loop.run_in_executor(
        None,
        partial(
            model.generate_content,
            prompt,
            generation_config=generation_config
        )
    )
    
    return response.text


async def _call_ollama(prompt: str) -> str:
    """Call local Ollama instance."""
    import httpx
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "stream": False
                }
            )
            response.raise_for_status()
            return response.json()['response']
        except Exception:
            # Fallback for chat endpoint
             response = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False
                }
            )
             response.raise_for_status()
             return response.json()['message']['content']
