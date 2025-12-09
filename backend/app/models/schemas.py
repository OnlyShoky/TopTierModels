"""
Pydantic models for TopTierModels data structures.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class TierLevel(str, Enum):
    """Model tier classification."""
    S = "S"
    A = "A"
    B = "B"
    C = "C"
    D = "D"


class ModelCategory(str, Enum):
    """AI model categories."""
    IMAGE_GENERATION = "Image Generation"
    TEXT_GENERATION = "Text Generation"
    COMPUTER_VISION = "Computer Vision"
    NLP = "Natural Language Processing"
    MULTIMODAL = "Multimodal Models"
    AUDIO = "Audio Processing"
    VIDEO = "Video Generation"
    REINFORCEMENT_LEARNING = "Reinforcement Learning"
    OTHER = "Other"


class ScrapedModel(BaseModel):
    """Data scraped from Hugging Face model page."""
    huggingface_url: str
    model_name: str
    display_name: str
    organization: Optional[str] = None
    description: Optional[str] = None
    readme_content: Optional[str] = None
    license: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    model_metadata: Dict[str, Any] = Field(default_factory=dict)
    featured_image_url: Optional[str] = None
    downloads: int = 0
    likes: int = 0
    code_snippets: List[Dict[str, str]] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)


class ModelScores(BaseModel):
    """Scoring data for a model."""
    overall_score: float = Field(ge=0, le=100)
    tier: TierLevel
    performance_score: Optional[float] = Field(default=None, ge=0, le=100)
    usability_score: Optional[float] = Field(default=None, ge=0, le=100)
    innovation_score: Optional[float] = Field(default=None, ge=0, le=100)
    adoption_score: Optional[float] = Field(default=None, ge=0, le=100)
    production_score: Optional[float] = Field(default=None, ge=0, le=100)
    benchmarks: Dict[str, Any] = Field(default_factory=dict)
    scoring_methodology: Optional[str] = None


class GeneratedArticle(BaseModel):
    """LLM-generated blog article."""
    title: str
    slug: str
    excerpt: str = Field(max_length=250)
    content: str
    hero_image_url: Optional[str] = None
    read_time_minutes: int = Field(default=5)
    author: str = "TopTierModels AI"
    seo_keywords: List[str] = Field(default_factory=list)


class LinkedInPost(BaseModel):
    """LLM-generated LinkedIn post."""
    content: str = Field(max_length=3000)
    hook: Optional[str] = None
    key_points: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None
    hashtags: List[str] = Field(default_factory=list, max_length=5)
    character_count: int = 0


class PreviewSession(BaseModel):
    """Complete preview session data."""
    preview_id: str
    model_data: ScrapedModel
    article_data: GeneratedArticle
    linkedin_data: LinkedInPost
    scores_data: ModelScores
    category: ModelCategory = ModelCategory.OTHER
    images: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    publish_status: str = "draft"


class PublishRequest(BaseModel):
    """Request to publish a preview to Supabase."""
    preview_id: str
    trigger_netlify_rebuild: bool = False


class PublishResponse(BaseModel):
    """Response from publish operation."""
    success: bool
    message: str
    live_url: Optional[str] = None
    model_id: Optional[str] = None
    article_id: Optional[str] = None
