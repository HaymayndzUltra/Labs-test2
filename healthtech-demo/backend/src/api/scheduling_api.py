from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import logging

from app.database import get_db
from app.models import SchedulingModel
from app.schemas import SchedulingCreate, SchedulingUpdate, SchedulingResponse
from app.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/schedulings", tags=["schedulings"])

@router.get("/", response_model=List[SchedulingResponse])
async def list_schedulings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all schedulings with pagination
    """
    try:
        items = db.query(SchedulingModel).offset(skip).limit(limit).all()
        return items
    except Exception as e:
        logger.error(f"Error listing schedulings: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{scheduling_id}", response_model=SchedulingResponse)
async def get_scheduling(
    scheduling_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific scheduling by ID
    """
    item = db.query(SchedulingModel).filter(
        SchedulingModel.id == scheduling_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Scheduling not found")
    
    return item

@router.post("/", response_model=SchedulingResponse, status_code=201)
async def create_scheduling(
    scheduling: SchedulingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new scheduling
    """
    try:
        db_item = SchedulingModel(
            **scheduling.dict(),
            created_by=current_user.id,
            created_at=datetime.utcnow()
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        logger.info(f"Scheduling created with ID: {db_item.id}")
        return db_item
    except Exception as e:
        logger.error(f"Error creating scheduling: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{scheduling_id}", response_model=SchedulingResponse)
async def update_scheduling(
    scheduling_id: int,
    scheduling: SchedulingUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing scheduling
    """
    db_item = db.query(SchedulingModel).filter(
        SchedulingModel.id == scheduling_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Scheduling not found")
    
    try:
        update_data = scheduling.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)
        
        db_item.updated_at = datetime.utcnow()
        db_item.updated_by = current_user.id
        
        db.commit()
        db.refresh(db_item)
        
        logger.info(f"Scheduling updated with ID: {db_item.id}")
        return db_item
    except Exception as e:
        logger.error(f"Error updating scheduling: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{scheduling_id}", status_code=204)
async def delete_scheduling(
    scheduling_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a scheduling
    """
    db_item = db.query(SchedulingModel).filter(
        SchedulingModel.id == scheduling_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Scheduling not found")
    
    try:
        db.delete(db_item)
        db.commit()
        
        logger.info(f"Scheduling deleted with ID: {scheduling_id}")
        return None
    except Exception as e:
        logger.error(f"Error deleting scheduling: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Industry-specific endpoints for healthcare
# Add HIPAA-compliant audit logging


