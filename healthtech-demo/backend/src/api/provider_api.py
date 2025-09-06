from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import logging

from app.database import get_db
from app.models import ProviderModel
from app.schemas import ProviderCreate, ProviderUpdate, ProviderResponse
from app.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/providers", tags=["providers"])

@router.get("/", response_model=List[ProviderResponse])
async def list_providers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all providers with pagination
    """
    try:
        items = db.query(ProviderModel).offset(skip).limit(limit).all()
        return items
    except Exception as e:
        logger.error(f"Error listing providers: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{provider_id}", response_model=ProviderResponse)
async def get_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific provider by ID
    """
    item = db.query(ProviderModel).filter(
        ProviderModel.id == provider_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    return item

@router.post("/", response_model=ProviderResponse, status_code=201)
async def create_provider(
    provider: ProviderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new provider
    """
    try:
        db_item = ProviderModel(
            **provider.dict(),
            created_by=current_user.id,
            created_at=datetime.utcnow()
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        logger.info(f"Provider created with ID: {db_item.id}")
        return db_item
    except Exception as e:
        logger.error(f"Error creating provider: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{provider_id}", response_model=ProviderResponse)
async def update_provider(
    provider_id: int,
    provider: ProviderUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing provider
    """
    db_item = db.query(ProviderModel).filter(
        ProviderModel.id == provider_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    try:
        update_data = provider.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)
        
        db_item.updated_at = datetime.utcnow()
        db_item.updated_by = current_user.id
        
        db.commit()
        db.refresh(db_item)
        
        logger.info(f"Provider updated with ID: {db_item.id}")
        return db_item
    except Exception as e:
        logger.error(f"Error updating provider: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{provider_id}", status_code=204)
async def delete_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a provider
    """
    db_item = db.query(ProviderModel).filter(
        ProviderModel.id == provider_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    try:
        db.delete(db_item)
        db.commit()
        
        logger.info(f"Provider deleted with ID: {provider_id}")
        return None
    except Exception as e:
        logger.error(f"Error deleting provider: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Industry-specific endpoints for healthcare
# Add HIPAA-compliant audit logging


