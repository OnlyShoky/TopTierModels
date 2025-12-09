"""
Scoring Engine Module - Calculates model scores and tier assignments.

Uses a weighted algorithm based on:
- Performance (30%)
- Usability (25%)
- Innovation (20%)
- Adoption (15%)
- Production (10%)
"""

from typing import Dict, Any, Optional
from ..models import ScrapedModel, ModelScores, TierLevel, ModelCategory


# Scoring weights
WEIGHTS = {
    'performance': 0.30,
    'usability': 0.25,
    'innovation': 0.20,
    'adoption': 0.15,
    'production': 0.10
}

# Tier thresholds
TIER_THRESHOLDS = {
    'S': 90,
    'A': 80,
    'B': 70,
    'C': 60,
    'D': 0
}


def calculate_scores(model: ScrapedModel, category: str = "Other") -> ModelScores:
    """
    Calculate comprehensive scores for a model.
    
    Args:
        model: Scraped model data
        category: Model category for context
        
    Returns:
        ModelScores with all metrics
    """
    # Calculate individual component scores
    performance_score = _calculate_performance_score(model, category)
    usability_score = _calculate_usability_score(model)
    innovation_score = _calculate_innovation_score(model, category)
    adoption_score = _calculate_adoption_score(model)
    production_score = _calculate_production_score(model)
    
    # Calculate weighted overall score
    overall_score = (
        performance_score * WEIGHTS['performance'] +
        usability_score * WEIGHTS['usability'] +
        innovation_score * WEIGHTS['innovation'] +
        adoption_score * WEIGHTS['adoption'] +
        production_score * WEIGHTS['production']
    )
    
    # Determine tier
    tier = _assign_tier(overall_score)
    
    return ModelScores(
        overall_score=round(overall_score, 2),
        tier=tier,
        performance_score=round(performance_score, 2),
        usability_score=round(usability_score, 2),
        innovation_score=round(innovation_score, 2),
        adoption_score=round(adoption_score, 2),
        production_score=round(production_score, 2),
        benchmarks=_extract_benchmarks(model),
        scoring_methodology=_get_methodology_description()
    )


def _calculate_performance_score(model: ScrapedModel, category: str) -> float:
    """
    Calculate performance score based on benchmarks and metrics.
    
    Factors:
    - Benchmark results (if available in metadata)
    - Speed/efficiency indicators
    - Quality metrics
    """
    score = 70.0  # Base score
    metadata = model.model_metadata
    
    # Check for benchmark data
    if metadata.get('benchmark_score'):
        score = min(100, metadata['benchmark_score'])
    
    # Adjust based on model size efficiency
    if 'parameters' in metadata:
        params = metadata['parameters']
        if isinstance(params, str):
            # Parse parameter count (e.g., "7B" -> 7 billion)
            if 'B' in params.upper():
                param_count = float(params.upper().replace('B', ''))
                # Smaller efficient models score higher
                if param_count < 3:
                    score += 5
                elif param_count < 10:
                    score += 2
    
    # Boost for "turbo" or "fast" in name (indicates optimization)
    if any(x in model.model_name.lower() for x in ['turbo', 'fast', 'efficient']):
        score += 5
    
    return min(100, max(0, score))


def _calculate_usability_score(model: ScrapedModel) -> float:
    """
    Calculate usability score based on documentation quality.
    
    Factors:
    - README length and completeness
    - Code examples presence
    - Clear description
    """
    score = 60.0  # Base score
    
    # README quality
    if model.readme_content:
        content_length = len(model.readme_content)
        if content_length > 5000:
            score += 15
        elif content_length > 2000:
            score += 10
        elif content_length > 500:
            score += 5
    
    # Code examples
    if model.code_snippets:
        score += min(15, len(model.code_snippets) * 5)
    
    # Description quality
    if model.description:
        if len(model.description) > 200:
            score += 5
        if len(model.description) > 100:
            score += 3
    
    # Tags indicate good categorization
    if model.tags and len(model.tags) > 3:
        score += 5
    
    return min(100, max(0, score))


def _calculate_innovation_score(model: ScrapedModel, category: str) -> float:
    """
    Calculate innovation score based on novelty.
    
    Factors:
    - Novel architecture mentions
    - Research citations
    - Unique capabilities
    """
    score = 65.0  # Base score
    
    readme_lower = (model.readme_content or '').lower()
    description_lower = (model.description or '').lower()
    combined = readme_lower + description_lower
    
    # Innovation keywords
    innovation_keywords = [
        'novel', 'state-of-the-art', 'sota', 'breakthrough',
        'first', 'new approach', 'groundbreaking', 'innovative',
        'outperforms', 'surpasses', 'leading'
    ]
    
    keyword_matches = sum(1 for kw in innovation_keywords if kw in combined)
    score += min(20, keyword_matches * 4)
    
    # Research paper reference
    if 'arxiv' in combined or 'paper' in combined:
        score += 10
    
    # Award or recognition
    if any(x in combined for x in ['award', 'winner', 'best']):
        score += 5
    
    return min(100, max(0, score))


def _calculate_adoption_score(model: ScrapedModel) -> float:
    """
    Calculate adoption score based on community metrics.
    
    Factors:
    - Download count
    - Likes/stars
    - Community presence
    """
    score = 50.0  # Base score
    
    # Downloads (logarithmic scaling)
    if model.downloads > 0:
        from math import log10
        download_factor = min(40, log10(model.downloads + 1) * 8)
        score += download_factor
    
    # Likes
    if model.likes > 0:
        from math import log10
        like_factor = min(15, log10(model.likes + 1) * 5)
        score += like_factor
    
    # Organization presence (known orgs get boost)
    known_orgs = ['google', 'meta', 'openai', 'microsoft', 'huggingface', 'stability']
    if model.organization:
        org_lower = model.organization.lower()
        if any(org in org_lower for org in known_orgs):
            score += 10
    
    return min(100, max(0, score))


def _calculate_production_score(model: ScrapedModel) -> float:
    """
    Calculate production readiness score.
    
    Factors:
    - License type
    - Documentation completeness
    - Version stability
    """
    score = 60.0  # Base score
    
    # License (permissive licenses score higher)
    permissive_licenses = ['mit', 'apache', 'bsd', 'unlicense', 'cc0']
    if model.license:
        license_lower = model.license.lower()
        if any(lic in license_lower for lic in permissive_licenses):
            score += 15
        elif 'commercial' in license_lower:
            score += 10
    
    # Documentation completeness
    if model.readme_content and len(model.readme_content) > 1000:
        score += 10
    
    # Code snippets for implementation
    if model.code_snippets and len(model.code_snippets) >= 2:
        score += 10
    
    # Multiple images suggest good presentation
    if model.images and len(model.images) >= 2:
        score += 5
    
    return min(100, max(0, score))


def _assign_tier(score: float) -> TierLevel:
    """Assign tier based on overall score."""
    for tier, threshold in TIER_THRESHOLDS.items():
        if score >= threshold:
            return TierLevel(tier)
    return TierLevel.D


def _extract_benchmarks(model: ScrapedModel) -> Dict[str, Any]:
    """Extract any benchmark data from model metadata."""
    benchmarks = {}
    
    # Look for common benchmark keys in metadata
    benchmark_keys = [
        'accuracy', 'f1', 'bleu', 'rouge', 'perplexity',
        'fid', 'inception_score', 'clip_score'
    ]
    
    for key in benchmark_keys:
        if key in model.model_metadata:
            benchmarks[key] = model.model_metadata[key]
    
    return benchmarks


def _get_methodology_description() -> str:
    """Return description of the scoring methodology."""
    return """
    Overall Score = (Performance × 0.30) + (Usability × 0.25) + 
                    (Innovation × 0.20) + (Adoption × 0.15) + (Production × 0.10)
    
    Tier Assignment:
    - S Tier: 90-100 (Exceptional, industry-leading)
    - A Tier: 80-89 (Excellent, highly recommended)
    - B Tier: 70-79 (Good, solid choice)
    - C Tier: 60-69 (Adequate, situational use)
    - D Tier: 0-59 (Limited, not recommended)
    """


def classify_category(model: ScrapedModel) -> ModelCategory:
    """
    Automatically classify model into a category based on tags and description.
    
    Args:
        model: Scraped model data
        
    Returns:
        Classified ModelCategory
    """
    tags_lower = [t.lower() for t in model.tags]
    description_lower = (model.description or '').lower()
    name_lower = model.model_name.lower()
    combined = ' '.join(tags_lower) + ' ' + description_lower + ' ' + name_lower
    
    # Category detection rules
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
