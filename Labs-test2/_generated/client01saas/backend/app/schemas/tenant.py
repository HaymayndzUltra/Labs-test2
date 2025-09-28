"""Tenant schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class TenantBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    unit_id: Optional[int] = None


class TenantCreate(TenantBase):
    org_id: Optional[int] = None


class TenantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    unit_id: Optional[int] = None
    org_id: Optional[int] = None


class TenantRead(TenantBase):
    id: int
    org_id: int
    created_at: datetime

    class Config:
        from_attributes = True
