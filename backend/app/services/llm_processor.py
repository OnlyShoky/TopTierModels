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
    # Try direct JSON parse first (for clean JSON responses)
    response_stripped = response.strip()
    if response_stripped.startswith('{'):
        try:
            return json.loads(response_stripped, strict=False)
        except json.JSONDecodeError:
            pass
    
    # Try to extract JSON from markdown code fence
    patterns = [
        (r'```json\s*([\s\S]*?)\s*```', 1),  # ```json ... ```
        (r'```\s*([\s\S]*?)\s*```', 1),       # ``` ... ```
        (r'(\{[\s\S]*\})', 1)                 # Raw JSON object (with capture group)
    ]
    
    for pattern, group_idx in patterns:
        match = re.search(pattern, response)
        if match:
            try:
                json_str = match.group(group_idx).strip()
                return json.loads(json_str, strict=False)
            except (json.JSONDecodeError, IndexError):
                continue
    
    return None


# Prompt templates
# Prompt templates
ARTICLE_PROMPT_TEMPLATE = """You are an expert AI technical writer with an opinionated, editorial voice. Generate a concise blog article about the following AI model from Hugging Face.

## Model Information:
- Name: {model_name}
- Organization: {organization}
- Category: {category}
- Description: {description}
- License: {license}

## README Content:
{readme_content}

## Requirements:
1. Write a punchy, opinionated article (~400-500 words, 4-6 minute read).
2. Use this EXACT structure:
   - **Opening Hook** (1-2 sentences establishing significance/personality)
   - **Key Features and Innovations** (3-5 bullet points with brief explanations)
   - **Performance Analysis** (1-2 paragraphs with editorial perspective)
   - **Scoring Breakdown** (Always include with explanations)
   - **Use Cases** (3-5 practical applications as bullet list)
3. Write with personality and conviction - use phrases like "The New Standard", "Pure Excellence", "The Future of...", etc.
4. Be technically informed but highly readable - more editorial than academic.
5. Include code examples ONLY if they are simple and essential (prefer to omit).

## STRICT RULES:
1. You MUST only use information that appears in the README content provided.  
   - No external facts, assumptions, or invented details.
   - Rephrase but do not add new information.

2. AVOID overly technical architecture details - focus on capabilities and impact.

3. LENGTH LIMIT: 400-500 words maximum. Be ruthlessly concise.

## SCORING INSTRUCTIONS:
You MUST generate three scores (0-100) based ONLY on the information in the README:

### Quality Score (0-100):
- Measures output quality: accuracy, realism, coherence, task success.
- Look for: benchmark results, evaluation metrics, comparisons to other models.
- If no quality info: default to 60.

### Speed Score (0-100):
- Measures inference speed from the user's perspective.
- Look for: time to first token, generation time, latency metrics, words like "fast", "turbo", "efficient".
- If no speed info: default to 60.

### Freedom Score (0-100):
- Measures openness and accessibility.
- Based on:
  - License type: MIT/Apache/BSD = 90+, CC-BY = 75, GPL = 65, Non-commercial = 50, Unknown = 40
  - Source: Open Source/Open Weights = +10, Closed = -20
  - Cost: Free = +10, Freemium = 0, Paid = -15
- If available on Hugging Face: +10

**IMPORTANT**: Always include the scoring breakdown in the article content with this format:
```
### Scoring Breakdown
*   **Quality (XX/100)**: [Brief explanation]
*   **Speed (XX/100)**: [Brief explanation]
*   **Freedom (XX/100)**: [Brief explanation]
```

## METADATA EXTRACTION:
Extract the following if present in the README:
- safetensors: true/false (whether safetensors format is mentioned)
- model_size: string like "7B params", "685B params", etc.
- tensor_types: array like ["BF16", "F8_E4M3", "FP32"]

## SEO KEYWORDS RULE:
Include ONLY keywords that appear in the provided information:
- Model category (one from standard list)
- Source type: Open Source, Open Weights, Free, Freemium, Paid, etc.
- License in format: license:MIT, license:Apache-2.0, etc.

## WRITING STYLE GUIDELINES:
- Use strong opening hooks: "The New Standard", "Redefining Excellence", "The [Category] King", etc.
- Be opinionated but fair: "While quality is undeniable, it comes at a cost..."
- Use conversational shorthand: "It's fast. Really fast." or "This changes everything."
- Focus on impact over implementation: What does this mean for users?
- Keep paragraphs short (2-4 sentences max)
- Use bullet points for features and use cases

## Output Format:
Return a JSON object with:
- title: Compelling, personality-driven title (not generic)
- slug: URL-friendly slug (lowercase, hyphens)
- excerpt: 150-200 character summary with hook
- content: Full article in Markdown format (400-500 words)
- seo_keywords: Array of SEO keywords (follow rules above)
- read_time_minutes: Estimated read time (4-6 minutes)
- quality_score: integer 0-100
- speed_score: integer 0-100
- freedom_score: integer 0-100
- safetensors: boolean or null
- model_size: string or null
- tensor_types: array of strings or empty array

Return ONLY valid JSON, no additional text."""


LINKEDIN_PROMPT_TEMPLATE = """Create an elegant, organic, and human LinkedIn post announcing a new AI model article.

## Model: {model_name}
## Article Title: {article_title}
## Article Excerpt: {article_excerpt}
## Category: {category}
## Scores: Overall: {overall_score}/100, Quality: {quality_score}, Speed: {speed_score}, Freedom: {freedom_score}

## CRITICAL FORMATTING RULES:
1. Do NOT use Markdown (no *, **, #, __)
2. Use ONLY Unicode styled characters for emphasis:
   - Bold: Use 𝗯𝗼𝗹𝗱 Unicode characters for **single important words only**, not phrases.
     (Use mathematical bold characters: a→𝗮, b→𝗯, c→𝗰, etc.)
3. Use emoji as bullet points: ✅, 🔥, 🚀, 💡, ⚡
4. Keep natural line breaks
5. Professional, human-sounding tone

## STYLE & TONE GOALS:
- Write for a general audience that may not understand advanced AI.
- Highlight the potential and real-world power of the model in simple terms.
- Avoid long technical explanations.
- Do NOT oversell — keep it authentic and insightful.
- The post must feel original and personal.

## STRUCTURE:
- Hook: 1 compelling and human opening line that sparks curiosity.
- Light intro: Mention the overall score briefly and naturally.
- Key points: 3–4 bullet points with emoji.
  - Include Quality, Speed, and Freedom scores in a simple, accessible way.
  - Use Unicode bold only for specific technical keywords or model strengths.
- Personal insight: 1–2 elegant sentences about why the model caught your attention.
- Call to action: Encourage readers to explore the full article and visit my profile.
- Hashtags: 3–5 relevant hashtags (without # symbol).

## Example output style:

New analysis dropped on my 𝗧𝗼𝗽𝗧𝗶𝗲𝗿𝗠𝗼𝗱𝗲𝗹𝘀 website. DeepSeek-V3.2 has earned an 𝗦-𝗥𝗮𝗻𝗸 — here’s why:

DeepSeek-V3.2 is truly advancing AI with its blend of power and precision:

Overall score: 87/100

✅ 𝗤𝘂𝗮𝗹𝗶𝘁𝘆: 85 – Sharp, consistent, and reliable results  
⚡ 𝗦𝗽𝗲𝗲𝗱: 92 – Fast generation that feels instant  
🔓 𝗙𝗿𝗲𝗲𝗱𝗼𝗺: 84 – Open weights and flexible usage rights  

What stands out most to me is how DeepSeek-V3.2 blends powerful performance with meaningful real-world application. It feels less like a tool and more like an evolving intelligence ready to elevate our creativity and productivity.

For a deeper dive into how DeepSeek-V3.2 is shaping the future of AI, read the full article → [link]

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
        GeneratedArticle with all content including scores and metadata
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
                    hero_image_url=model.featured_image_url,
                    quality_score=data.get('quality_score', 60),
                    speed_score=data.get('speed_score', 60),
                    freedom_score=data.get('freedom_score', 60),
                    safetensors=data.get('safetensors'),
                    model_size=data.get('model_size'),
                    tensor_types=data.get('tensor_types', [])
                )
    
    prompt = ARTICLE_PROMPT_TEMPLATE.format(
        model_name=model.display_name,
        organization=model.organization or "Unknown",
        category=category,
        description=model.description or "No description available",
        license=model.license or "Unknown",
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
            hero_image_url=model.featured_image_url,
            quality_score=float(data.get('quality_score', 60)),
            speed_score=float(data.get('speed_score', 60)),
            freedom_score=float(data.get('freedom_score', 60)),
            safetensors=data.get('safetensors'),
            model_size=data.get('model_size'),
            tensor_types=data.get('tensor_types', [])
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
            hero_image_url=model.featured_image_url,
            quality_score=60,
            speed_score=60,
            freedom_score=60,
            safetensors=None,
            model_size=None,
            tensor_types=[]
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
