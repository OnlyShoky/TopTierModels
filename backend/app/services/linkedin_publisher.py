"""
LinkedIn Publishing Service - OAuth 2.0 integration.

Handles authentication and publishing posts to LinkedIn.
"""

import httpx
from typing import Optional, Dict, Any
from ..config import settings


LINKEDIN_API_BASE = "https://api.linkedin.com/v2"
LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"


async def get_linkedin_profile_id(access_token: str) -> Optional[str]:
    """Get the authenticated user's LinkedIn profile ID (URN)."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{LINKEDIN_API_BASE}/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("sub")  # This is the member URN
        return None


async def publish_to_linkedin(
    content: str,
    access_token: str = None
) -> Dict[str, Any]:
    """
    Publish a post to LinkedIn.
    
    Args:
        content: The post text content
        access_token: OAuth access token (uses settings if not provided)
        
    Returns:
        Dict with success status and response data
    """
    token = access_token or settings.linkedin_access_token
    
    if not token:
        return {
            "success": False,
            "error": "No LinkedIn access token configured. Set LINKEDIN_ACCESS_TOKEN in .env"
        }
    
    # Get user profile ID
    profile_id = await get_linkedin_profile_id(token)
    if not profile_id:
        return {
            "success": False,
            "error": "Could not retrieve LinkedIn profile. Token may be expired."
        }
    
    # Prepare the post payload
    # Using UGC Post API (recommended for member posts)
    payload = {
        "author": f"urn:li:person:{profile_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": content
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{LINKEDIN_API_BASE}/ugcPosts",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0"
            }
        )
        
        if response.status_code in [200, 201]:
            return {
                "success": True,
                "message": "Post published to LinkedIn!",
                "post_id": response.headers.get("x-restli-id")
            }
        else:
            return {
                "success": False,
                "error": f"LinkedIn API error: {response.status_code}",
                "details": response.text
            }


def get_oauth_authorize_url(redirect_uri: str, state: str = "random_state") -> str:
    """
    Generate the LinkedIn OAuth authorization URL.
    
    User should visit this URL to authorize the app.
    """
    if not settings.linkedin_client_id:
        return None
    
    params = {
        "response_type": "code",
        "client_id": settings.linkedin_client_id,
        "redirect_uri": redirect_uri,
        "state": state,
        "scope": "openid profile w_member_social"
    }
    
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{LINKEDIN_AUTH_URL}?{query}"


async def exchange_code_for_token(code: str, redirect_uri: str) -> Dict[str, Any]:
    """
    Exchange authorization code for access token.
    
    Args:
        code: The authorization code from OAuth callback
        redirect_uri: The same redirect URI used in authorize URL
        
    Returns:
        Dict with access_token or error
    """
    if not settings.linkedin_client_id or not settings.linkedin_client_secret:
        return {"error": "LinkedIn client credentials not configured"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            LINKEDIN_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": settings.linkedin_client_id,
                "client_secret": settings.linkedin_client_secret
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "success": True,
                "access_token": data.get("access_token"),
                "expires_in": data.get("expires_in")
            }
        else:
            return {
                "success": False,
                "error": response.text
            }
