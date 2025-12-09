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
        
        # Update status to published
        await update_preview_status(
            request.preview_id, 
            "published",
            {
                "model_id": result.get("model_id"),
                "article_id": result.get("article_id")
            }
        )
        
        # Trigger Netlify rebuild if requested
        if request.trigger_netlify_rebuild:
            from ..services.uploader import trigger_netlify_rebuild
            await trigger_netlify_rebuild()
        
        return PublishResponse(
            success=True,
            message="Published successfully",
            live_url=result.get("live_url"),
            model_id=result.get("model_id"),
            article_id=result.get("article_id")
        )
        
    except Exception as e:
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
