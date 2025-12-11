"""
Scoring Engine Module - Calculates model scores and tier assignments.

New Metrics System:
- Quality Score (33.3%): Output quality, accuracy, realism
- Speed Score (33.3%): Inference speed and efficiency  
- Freedom Score (33.4%): Licensing, cost, accessibility

Visual Subtags:
- Open Source (#28a745), Open Weights (#7ed957)
- Free (#007bff), Freemium (#66b2ff)
- Closed/Paid (#dc3545)
"""

from typing import Dict, Any, List
from ..models import ScrapedModel, ModelScores, TierLevel, ModelCategory
from ..models.schemas import ModelTag


# Scoring weights (equal distribution)
WEIGHTS = {
    'quality': 0.333,
    'speed': 0.333,
    'freedom': 0.334
}

# Tier thresholds
TIER_THRESHOLDS = {
    'S': 90,
    'A': 80,
    'B': 70,
    'C': 60,
    'D': 0
}

# Tag definitions
TAG_DEFINITIONS = {
    'open_source': ModelTag(
        tag_name="Open Source",
        color_hex="#28a745",
        description="Full source code available"
    ),
    'open_weights': ModelTag(
        tag_name="Open Weights",
        color_hex="#7ed957",
        description="Model weights available for download"
    ),
    'free': ModelTag(
        tag_name="Free",
        color_hex="#007bff",
        description="Free to use without cost"
    ),
    'freemium': ModelTag(
        tag_name="Freemium",
        color_hex="#66b2ff",
        description="Free tier with paid options"
    ),
    'closed_paid': ModelTag(
        tag_name="Closed / Paid",
        color_hex="#dc3545",
        description="Requires payment or restricted access"
    )
}


def calculate_scores(
    model: ScrapedModel, 
    category: str = "Other",
    quality_score: float = None,
    speed_score: float = None,
    freedom_score: float = None
) -> ModelScores:
    """
    Calculate comprehensive scores for a model.
    Prioritizes LLM-generated scores if available.
    
    Args:
        model: Scraped model data
        category: Model category for context
        quality_score: Optional LLM-generated quality score
        speed_score: Optional LLM-generated speed score
        freedom_score: Optional LLM-generated freedom score
        
    Returns:
        ModelScores with Quality, Speed, Freedom metrics and tags
    """
    # Use LLM scores if provided, otherwise fall back to heuristic (not strictly recommended but safe)
    # If no LLM scores and we removed heuristic logic, we can default to 60 or implement a simpler safe heuristic.
    

    # We will trust the passed scores or default to heuristics that DO NOT use deleted fields
    q_score = quality_score if quality_score is not None else _calculate_quality_score(model, category)
    s_score = speed_score if speed_score is not None else _calculate_speed_score(model)
    f_score = freedom_score if freedom_score is not None else _calculate_freedom_score(model)

    if q_score is None or s_score is None or f_score is None:
        raise print("Error: Missing scores")
    
    # Calculate weighted overall score
    overall_score = (
        q_score * WEIGHTS['quality'] +
        s_score * WEIGHTS['speed'] +
        f_score * WEIGHTS['freedom']
    )
    
    # Determine tier
    tier = _assign_tier(overall_score)
    
    # Assign visual tags
    tags = _assign_tags(model)
    
    return ModelScores(
        overall_score=round(overall_score, 2),
        tier=tier,
        quality_score=round(q_score, 2),
        speed_score=round(s_score, 2),
        freedom_score=round(f_score, 2),
        tags=tags,
        benchmarks=_extract_benchmarks(model),
        scoring_methodology=_get_methodology_description()
    )


def _calculate_quality_score(model: ScrapedModel, category: str) -> float:
    """
    Calculate Quality Score (0-100).
    
    Measures output quality: accuracy, realism, coherence, task success.
    
    Factors:
    - Benchmark mentions in README
    - Quality keywords (state-of-the-art, best, high-quality)
    - Documentation completeness
    - Community validation (likes)
    """
    score = 60.0  # Base score
    
    readme_lower = (model.readme_content or '').lower()
    description_lower = (model.description or '').lower()
    combined = readme_lower + description_lower
    
    # Quality keywords
    quality_keywords = [
        'state-of-the-art', 'sota', 'best', 'high-quality', 'photorealistic',
        'accurate', 'precise', 'excellent', 'superior', 'outperforms'
    ]
    keyword_matches = sum(1 for kw in quality_keywords if kw in combined)
    score += min(20, keyword_matches * 4)
    
    # Benchmark mentions
    benchmark_keywords = ['benchmark', 'evaluation', 'score', 'fid', 'accuracy', 'bleu']
    benchmark_matches = sum(1 for kw in benchmark_keywords if kw in combined)
    score += min(10, benchmark_matches * 3)
    
    # Removed likes check as the field is deprecated
    
    return min(100, max(0, score))


def _calculate_speed_score(model: ScrapedModel) -> float:
    """
    Calculate Speed Score (0-100).
    
    Measures inference speed from user's perspective.
    
    Factors:
    - Speed keywords (fast, turbo, efficient, quick)
    - Model size (smaller = faster)
    - Optimization mentions
    """
    score = 60.0  # Base score
    
    readme_lower = (model.readme_content or '').lower()
    name_lower = model.model_name.lower()
    combined = readme_lower + name_lower
    
    # Speed keywords in name or content
    speed_keywords = ['turbo', 'fast', 'quick', 'efficient', 'lite', 'mini', 'tiny', 'small']
    for kw in speed_keywords:
        if kw in combined:
            score += 8
    
    # Optimization mentions
    optimization_keywords = ['optimized', 'quantized', 'distilled', 'pruned', 'onnx', 'tensorrt']
    for kw in optimization_keywords:
        if kw in combined:
            score += 5
    
    # Low latency mentions
    latency_keywords = ['sub-second', 'real-time', 'instant', 'low-latency', 'ms']
    for kw in latency_keywords:
        if kw in combined:
            score += 6
    
    return min(100, max(0, score))


def _calculate_freedom_score(model: ScrapedModel) -> float:
    """
    Calculate Freedom Score (0-100).
    
    Measures accessibility: licensing, cost, deployment options.
    
    Factors:
    - License type (permissive = high, restrictive = low)
    - Open source/weights availability
    - Free/paid access
    - Deployment flexibility
    """
    score = 50.0  # Base score
    
    license_lower = (model.license or '').lower()
    tags_lower = [t.lower() for t in model.tags]
    readme_lower = (model.readme_content or '').lower()
    
    # Permissive licenses (high freedom)
    permissive_licenses = ['mit', 'apache', 'bsd', 'unlicense', 'cc0', 'wtfpl']
    for lic in permissive_licenses:
        if lic in license_lower:
            score += 30
            break
    
    # Semi-permissive (medium)
    semi_permissive = ['cc-by', 'lgpl', 'mpl']
    for lic in semi_permissive:
        if lic in license_lower:
            score += 20
            break
    
    # Restrictive licenses (low freedom)
    restrictive = ['gpl', 'agpl', 'cc-by-nc', 'non-commercial']
    for lic in restrictive:
        if lic in license_lower:
            score += 10
            break
    
    # Open weights indicator
    if 'open' in ' '.join(tags_lower) or 'weights' in readme_lower:
        score += 10
    
    # Hugging Face open models get bonus (accessible)
    if model.huggingface_url:
        score += 10
    
    return min(100, max(0, score))


def _assign_tags(model: ScrapedModel) -> List[ModelTag]:
    """
    Assign visual tags based on model licensing, cost, and access.
    
    Returns up to 5 tags for UI display.
    """
    tags = []
    
    license_lower = (model.license or '').lower()
    readme_lower = (model.readme_content or '').lower()
    tags_lower = ' '.join([t.lower() for t in model.tags])
    
    # Open Source check
    open_source_indicators = ['mit', 'apache', 'bsd', 'gpl', 'lgpl', 'unlicense']
    if any(lic in license_lower for lic in open_source_indicators):
        tags.append(TAG_DEFINITIONS['open_source'])
    
    # Open Weights check (Hugging Face models typically have open weights)
    if model.huggingface_url and 'safetensors' in readme_lower:
        tags.append(TAG_DEFINITIONS['open_weights'])
    elif 'weights' in readme_lower or 'checkpoint' in readme_lower:
        tags.append(TAG_DEFINITIONS['open_weights'])
    
    # Free check
    paid_indicators = ['enterprise', 'pricing', 'subscription', 'pro plan', 'paid']
    if not any(p in readme_lower for p in paid_indicators):
        tags.append(TAG_DEFINITIONS['free'])
    elif 'free tier' in readme_lower or 'freemium' in readme_lower:
        tags.append(TAG_DEFINITIONS['freemium'])
    else:
        tags.append(TAG_DEFINITIONS['closed_paid'])
    
    return tags[:5]  # Max 5 tags


def _assign_tier(score: float) -> TierLevel:
    """Assign tier based on overall score."""
    for tier, threshold in TIER_THRESHOLDS.items():
        if score >= threshold:
            return TierLevel(tier)
    return TierLevel.D


def _extract_benchmarks(model: ScrapedModel) -> Dict[str, Any]:
    """Extract any benchmark data from model metadata."""
    benchmarks = {}
    
    benchmark_keys = [
        'accuracy', 'f1', 'bleu', 'rouge', 'perplexity',
        'fid', 'inception_score', 'clip_score'
    ]
    
    for key in benchmark_keys:
        if key in model.model_metadata:
            benchmarks[key] = model.model_metadata[key]
    
    return benchmarks


def _get_methodology_description() -> str:
    """Return description of the new scoring methodology."""
    return """
    Overall Score = (Quality × 0.333) + (Speed × 0.333) + (Freedom × 0.334)
    
    Quality Score (0-100): Output quality, accuracy, realism, coherence
    Speed Score (0-100): Inference speed, efficiency, time-to-result
    Freedom Score (0-100): Licensing openness, cost, deployment flexibility
    
    Visual Tags indicate accessibility:
    - Open Source (green): Full source available
    - Open Weights (light green): Model weights downloadable
    - Free (blue): No cost to use
    - Freemium (light blue): Free tier with paid options
    - Closed/Paid (red): Requires payment
    
    Tier Assignment:
    - S Tier: 90-100 (Exceptional)
    - A Tier: 80-89 (Excellent)
    - B Tier: 70-79 (Good)
    - C Tier: 60-69 (Adequate)
    - D Tier: 0-59 (Limited)
    """


def classify_category(model: ScrapedModel) -> ModelCategory:
    """
    Automatically classify model into a category based on tags and description.
    """
    tags_lower = [t.lower() for t in model.tags]
    description_lower = (model.description or '').lower()
    name_lower = model.model_name.lower()
    combined = ' '.join(tags_lower) + ' ' + description_lower + ' ' + name_lower
    
    category_rules = {
        ModelCategory.IMAGE_GENERATION: [
            'text-to-image', 'image-generation', 'diffusion', 'stable-diffusion',
            'sdxl', 'dall-e', 'midjourney', 'image generation', 'z-image',
            'flux', 'imagen', 'kandinsky', 'pixart', 'image-to-image'
        ],
        ModelCategory.TEXT_GENERATION: [
            'text-generation', 'llm', 'language-model', 'gpt', 'llama',
            'mistral', 'chat', 'instruct', 'causal-lm'
        ],
        ModelCategory.COMPUTER_VISION: [
            'image-classification', 'object-detection', 'segmentation',
            'yolo', 'vision', 'cnn', 'resnet', 'vit'
        ],
        ModelCategory.NLP: [
            'text-classification', 'ner', 'pos', 'sentiment',
            'question-answering', 'summarization', 'translation'
        ],
        ModelCategory.MULTIMODAL: [
            'multimodal', 'vision-language', 'clip', 'image-text',
            'visual-question-answering'
        ],
        ModelCategory.AUDIO: [
            'audio', 'speech', 'asr', 'tts', 'whisper', 'music',
            'voice', 'sound'
        ],
        ModelCategory.VIDEO: [
            'video', 'video-generation', 'video-to-video'
        ],
        ModelCategory.REINFORCEMENT_LEARNING: [
            'reinforcement-learning', 'rl', 'reward-model', 'ppo', 'dqn'
        ]
    }
    
    for category, keywords in category_rules.items():
        if any(kw in combined for kw in keywords):
            return category
    
    return ModelCategory.OTHER
