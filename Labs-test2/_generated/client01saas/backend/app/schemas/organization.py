"""Organization schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class OrganizationBase(BaseModel):
    name: str


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationRead(OrganizationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
