"""
Preview router - API endpoints for local preview functionality.
"""

from fastapi import APIRouter, HTTPException
from typing import List

from ..database import (
    get_preview,
    save_preview,
    list_previews,
    delete_preview,
    update_preview_status
)
from ..models import PreviewSession, PublishRequest, PublishResponse


router = APIRouter()


@router.get("/previews")
async def get_all_previews():
    """List all preview sessions."""
    previews = await list_previews()
    return {"previews": previews}


@router.get("/preview/{preview_id}")
async def get_preview_data(preview_id: str):
    """Get a specific preview session."""
    preview = await get_preview(preview_id)
    if not preview:
        raise HTTPException(status_code=404, detail="Preview not found")
    return preview


@router.post("/preview")
async def create_preview(session: PreviewSession):
    """Create or update a preview session."""
    success = await save_preview(
        preview_id=session.preview_id,
        model_data=session.model_data.model_dump(),
        article_data=session.article_data.model_dump(),
        linkedin_data=session.linkedin_data.model_dump(),
        scores_data=session.scores_data.model_dump(),
        images=session.images
    )
    if success:
        return {"message": "Preview saved successfully", "preview_id": session.preview_id}
    raise HTTPException(status_code=500, detail="Failed to save preview")


@router.delete("/preview/{preview_id}")
async def remove_preview(preview_id: str):
    """Delete a preview session."""
    success = await delete_preview(preview_id)
    if success:
        return {"message": "Preview deleted successfully"}
    raise HTTPException(status_code=404, detail="Preview not found")


@router.post("/publish", response_model=PublishResponse)
async def publish_preview(request: PublishRequest):
    """Publish a preview to Supabase."""
    preview = await get_preview(request.preview_id)
    if not preview:
        raise HTTPException(status_code=404, detail="Preview not found")
    
    # Update status to pending
    await update_preview_status(request.preview_id, "pending")
    
    try:
        # Import uploader here to avoid circular imports
        from ..services.uploader import upload_to_supabase
        
        result = await upload_to_supabase(
            preview_id=request.preview_id,
            model_data=preview["model_data"],
            article_data=preview["article_data"],
            linkedin_data=preview["linkedin_data"],
            scores_data=preview["scores_data"],
            images=preview["images"]
        )
        
        # Also publish to LinkedIn if configured
        # Also publish to LinkedIn if configured and enabled
        linkedin_result = None
        from ..config import settings
        
        if settings.enable_linkedin_publishing:
            try:
                from ..services.linkedin_publisher import publish_to_linkedin
                linkedin_content = preview["linkedin_data"].get("content", "")
                if linkedin_content:
                    linkedin_result = await publish_to_linkedin(linkedin_content)
            except Exception as linkedin_error:
                # Don't fail the whole publish if LinkedIn fails
                linkedin_result = {"success": False, "error": str(linkedin_error)}
        else:
             linkedin_result = {"success": False, "message": "Skipped (ENABLE_LINKEDIN_PUBLISHING=False)"}
        
        # Update status to published
        await update_preview_status(
            request.preview_id, 
            "published",
            {
                "model_id": result.get("model_id"),
                "article_id": result.get("article_id"),
                "linkedin_post": linkedin_result
            }
        )
        
        # Trigger Netlify rebuild if requested
        if request.trigger_netlify_rebuild:
            from ..services.uploader import trigger_netlify_rebuild
            await trigger_netlify_rebuild()
        
        return PublishResponse(
            success=True,
            message="Published successfully" + (" (LinkedIn: " + str(linkedin_result.get("success", False)) + ")" if linkedin_result else ""),
            live_url=result.get("live_url"),
            model_id=result.get("model_id"),
            article_id=result.get("article_id")
        )
        
    except Exception as e:
        import traceback
        print(f"❌ Error publishing: {e}")
        traceback.print_exc()
        await update_preview_status(request.preview_id, "failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/regenerate/{preview_id}/{section}")
async def regenerate_section(preview_id: str, section: str):
    """Regenerate a specific section of the preview."""
    preview = await get_preview(preview_id)
    if not preview:
        raise HTTPException(status_code=404, detail="Preview not found")
    
    # Import LLM processor
    from ..services.llm_processor import regenerate_content
    
    try:
        updated_content = await regenerate_content(
            section=section,
            model_data=preview["model_data"],
            current_article=preview["article_data"],
            current_linkedin=preview["linkedin_data"]
        )
        
        # Update the preview with regenerated content
        if section == "article":
            preview["article_data"] = updated_content
        elif section == "linkedin":
            preview["linkedin_data"] = updated_content
        elif section == "scores":
            preview["scores_data"] = updated_content
        
        await save_preview(
            preview_id=preview_id,
            model_data=preview["model_data"],
            article_data=preview["article_data"],
            linkedin_data=preview["linkedin_data"],
            scores_data=preview["scores_data"],
            images=preview["images"]
        )
        
        return {"message": f"Section '{section}' regenerated successfully", "content": updated_content}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# LinkedIn OAuth Endpoints

@router.get("/linkedin/auth")
async def linkedin_auth():
    """Start LinkedIn OAuth flow - returns authorization URL."""
    # Import here to avoid circular dependencies if any
    from ..services.linkedin_publisher import get_oauth_authorize_url
    from ..config import settings
    
    redirect_uri = f"http://{settings.local_server_host}:{settings.local_server_port}/api/linkedin/callback"
    auth_url = get_oauth_authorize_url(redirect_uri)
    
    if not auth_url:
        raise HTTPException(status_code=500, detail="LinkedIn client ID not configured")
        
    return {"url": auth_url}


@router.get("/linkedin/callback")
async def linkedin_callback(code: str, state: str = None):
    """Handle LinkedIn OAuth callback and exchange code for token."""
    from fastapi.responses import HTMLResponse
    from ..services.linkedin_publisher import exchange_code_for_token
    from ..config import settings
    
    # This must match the redirect_uri used in auth
    redirect_uri = f"http://{settings.local_server_host}:{settings.local_server_port}/api/linkedin/callback"
    
    result = await exchange_code_for_token(code, redirect_uri)
    
    if result.get("success"):
        token = result.get("access_token")
        # Update settings in memory for this session
        settings.linkedin_access_token = token
        
        # Persist to .env file
        try:
            from pathlib import Path
            import re
            
            # Find .env file (try current dir, then parent, then explicit project root if known)
            env_path = Path(".env")
            if not env_path.exists():
                env_path = Path("../.env")
            
            if env_path.exists():
                content = env_path.read_text("utf-8")
                
                # Check if LINKEDIN_ACCESS_TOKEN exists
                if "LINKEDIN_ACCESS_TOKEN=" in content:
                    # Replace existing
                    content = re.sub(
                        r"LINKEDIN_ACCESS_TOKEN=.*", 
                        f"LINKEDIN_ACCESS_TOKEN={token}", 
                        content
                    )
                else:
                    # Append new
                    if not content.endswith("\n"):
                        content += "\n"
                    content += f"LINKEDIN_ACCESS_TOKEN={token}\n"
                
                env_path.write_text(content, "utf-8")
                print(f"✅ Saved LinkedIn token to {env_path}")
        except Exception as e:
            print(f"⚠️ Failed to save token to .env: {e}")
        
        # Return HTML that passes the token back to the main window and closes the popup
        html_content = f"""
        <html>
            <head>
                <title>LinkedIn Connected</title>
                <style>
                    body {{ font-family: sans-serif; text-align: center; padding: 50px; }}
                    .success {{ color: green; font-size: 20px; }}
                </style>
            </head>
            <body>
                <h2 class="success">✅ LinkedIn Connected Successfully!</h2>
                <p>You can close this window now.</p>
                <script>
                    // Send token to parent window
                    if (window.opener) {{
                        window.opener.postMessage({{ 
                            type: 'LINKEDIN_CONNECTED', 
                            token: '{token}' 
                        }}, '*');
                    }}
                    // Close after a brief delay
                    setTimeout(() => window.close(), 1500);
                </script>
            </body>
        </html>
        """
        return HTMLResponse(content=html_content)
    else:
        return HTMLResponse(content=f"<html><body><h2 style='color:red'>Error: {result.get('error')}</h2></body></html>", status_code=400)


@router.get("/linkedin/status")
async def linkedin_status():
    """Check if LinkedIn is connected."""
    from ..config import settings
    from ..services.linkedin_publisher import get_linkedin_profile_id
    
    token = settings.linkedin_access_token
    if not token:
        return {"connected": False}
    
    # Verify token is still valid
    profile_id = await get_linkedin_profile_id(token)
    return {"connected": bool(profile_id), "profile_id": profile_id}

