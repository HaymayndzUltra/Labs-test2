from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import logging

from app.database import get_db
from app.models import PatientModel
from app.schemas import PatientCreate, PatientUpdate, PatientResponse
from app.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/", response_model=List[PatientResponse])
async def list_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all patients with pagination
    """
    try:
        items = db.query(PatientModel).offset(skip).limit(limit).all()
        return items
    except Exception as e:
        logger.error(f"Error listing patients: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific patient by ID
    """
    item = db.query(PatientModel).filter(
        PatientModel.id == patient_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return item

@router.post("/", response_model=PatientResponse, status_code=201)
async def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new patient
    """
    try:
        db_item = PatientModel(
            **patient.dict(),
            created_by=current_user.id,
            created_at=datetime.utcnow()
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        logger.info(f"Patient created with ID: {db_item.id}")
        return db_item
    except Exception as e:
        logger.error(f"Error creating patient: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    patient: PatientUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing patient
    """
    db_item = db.query(PatientModel).filter(
        PatientModel.id == patient_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    try:
        update_data = patient.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)
        
        db_item.updated_at = datetime.utcnow()
        db_item.updated_by = current_user.id
        
        db.commit()
        db.refresh(db_item)
        
        logger.info(f"Patient updated with ID: {db_item.id}")
        return db_item
    except Exception as e:
        logger.error(f"Error updating patient: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{patient_id}", status_code=204)
async def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a patient
    """
    db_item = db.query(PatientModel).filter(
        PatientModel.id == patient_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    try:
        db.delete(db_item)
        db.commit()
        
        logger.info(f"Patient deleted with ID: {patient_id}")
        return None
    except Exception as e:
        logger.error(f"Error deleting patient: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Industry-specific endpoints for healthcare
# Add HIPAA-compliant audit logging


