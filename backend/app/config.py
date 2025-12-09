"""
Configuration management for TopTierModels backend.
Loads settings from environment variables.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Supabase
    supabase_url: str = Field(default="", env="SUPABASE_URL")
    supabase_anon_key: str = Field(default="", env="SUPABASE_ANON_KEY")
    supabase_service_role_key: str = Field(default="", env="SUPABASE_SERVICE_ROLE_KEY")
    
    # LLM - OpenAI
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4", env="OPENAI_MODEL")

    # LLM - Gemini
    gemini_api_key: Optional[str] = Field(default=None, env="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.0-flash", env="GEMINI_MODEL")
    
    # LLM - Anthropic
    anthropic_api_key: Optional[str] = Field(default=None, env="ANTHROPIC_API_KEY")
    anthropic_model: str = Field(default="claude-3-sonnet-20240229", env="ANTHROPIC_MODEL")
    
    # LLM - Ollama (local)
    ollama_base_url: str = Field(default="http://localhost:11434", env="OLLAMA_BASE_URL")
    ollama_model: str = Field(default="llama2", env="OLLAMA_MODEL")
    
    # Explicit Provider Selection
    llm_provider: Optional[str] = Field(default=None, env="LLM_PROVIDER")

    # Local Server
    local_server_port: int = Field(default=3001, env="LOCAL_SERVER_PORT")
    local_server_host: str = Field(default="127.0.0.1", env="LOCAL_SERVER_HOST")
    
    # Netlify
    netlify_build_hook_url: Optional[str] = Field(default=None, env="NETLIFY_BUILD_HOOK_URL")
    
    # Paths
    data_dir: str = Field(default="data")
    cache_dir: str = Field(default="data/cache")
    sessions_dir: str = Field(default="data/sessions")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


# Global settings instance
settings = Settings()


def get_llm_provider() -> str:
    """Determine which LLM provider to use based on configuration."""
    # 1. Check explicit configuration
    if settings.llm_provider:
        return settings.llm_provider.lower()
        
    # 2. Check available API keys (priority: OpenAI -> Anthropic -> Gemini -> Ollama)
    # We check if keys are not just present but look valid (basic check)
    
    if settings.openai_api_key and not settings.openai_api_key.startswith("your_"):
        return "openai"
    elif settings.anthropic_api_key and not settings.anthropic_api_key.startswith("your_"):
        return "anthropic"
    elif settings.gemini_api_key:
        return "gemini"
    else:
        return "ollama"
