"""Building and unit endpoints"""
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.BuildingRead])
def list_buildings(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> List[schemas.BuildingRead]:
    buildings = (
        db.query(models.Building)
        .filter(models.Building.org_id == org_id)
        .order_by(models.Building.created_at.desc())
        .all()
    )
    # Eager load units to satisfy Pydantic serialization without lazy loading after session close
    for building in buildings:
        _ = building.units  # trigger load
    return buildings
