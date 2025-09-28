"""Building and unit schemas"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class UnitRead(BaseModel):
    id: int
    name: str
    status: str
    building_id: int

    class Config:
        from_attributes = True


class BuildingRead(BaseModel):
    id: int
    name: str
    address: Optional[str] = None
    created_at: datetime
    units: List[UnitRead] = Field(default_factory=list)

    class Config:
        from_attributes = True
