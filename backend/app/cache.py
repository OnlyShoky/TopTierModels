"""
Caching module for performance optimization.

Provides in-memory caching with TTL for expensive operations.
"""

import time
import asyncio
from functools import wraps
from typing import Any, Optional, Dict, Callable
import hashlib
import json


class Cache:
    """Simple in-memory cache with TTL support."""
    
    def __init__(self, default_ttl: int = 300):
        """
        Initialize cache.
        
        Args:
            default_ttl: Default time-to-live in seconds (5 minutes)
        """
        self._store: Dict[str, tuple] = {}  # {key: (value, expires_at)}
        self._default_ttl = default_ttl
        self._lock = asyncio.Lock()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired."""
        if key in self._store:
            value, expires_at = self._store[key]
            if time.time() < expires_at:
                return value
            else:
                # Expired, remove it
                async with self._lock:
                    self._store.pop(key, None)
        return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL."""
        ttl = ttl or self._default_ttl
        expires_at = time.time() + ttl
        async with self._lock:
            self._store[key] = (value, expires_at)
    
    async def delete(self, key: str) -> None:
        """Delete key from cache."""
        async with self._lock:
            self._store.pop(key, None)
    
    async def clear(self) -> None:
        """Clear all cached values."""
        async with self._lock:
            self._store.clear()
    
    async def cleanup_expired(self) -> int:
        """Remove all expired entries. Returns count of removed entries."""
        now = time.time()
        removed = 0
        async with self._lock:
            expired_keys = [
                k for k, (_, exp) in self._store.items() 
                if now >= exp
            ]
            for key in expired_keys:
                del self._store[key]
                removed += 1
        return removed
    
    def size(self) -> int:
        """Return current cache size."""
        return len(self._store)


# Global cache instance
cache = Cache(default_ttl=300)  # 5 minute default


def make_cache_key(*args, **kwargs) -> str:
    """Create a cache key from function arguments."""
    key_data = json.dumps({
        'args': [str(a) for a in args],
        'kwargs': {k: str(v) for k, v in sorted(kwargs.items())}
    }, sort_keys=True)
    return hashlib.md5(key_data.encode()).hexdigest()


def cached(ttl: int = 300):
    """
    Decorator for caching async function results.
    
    Args:
        ttl: Time-to-live in seconds
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            key = f"{func.__module__}.{func.__name__}:{make_cache_key(*args, **kwargs)}"
            
            # Try to get from cache
            cached_value = await cache.get(key)
            if cached_value is not None:
                return cached_value
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache.set(key, result, ttl)
            return result
        
        return wrapper
    return decorator


# Background task to periodically clean up expired entries
async def start_cache_cleanup(interval: int = 60):
    """Start background task to clean up expired cache entries."""
    while True:
        await asyncio.sleep(interval)
        removed = await cache.cleanup_expired()
        if removed > 0:
            print(f"Cache cleanup: removed {removed} expired entries")
