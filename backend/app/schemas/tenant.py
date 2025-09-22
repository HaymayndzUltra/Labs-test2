"""Tenant schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from .subscription import Subscription


class TenantBase(BaseModel):
    name: str
    billing_email: EmailStr
    slug: Optional[str] = None
    is_active: Optional[bool] = True


class TenantCreate(TenantBase):
    plan: str = Field(default="starter", description="Requested plan identifier")
    seats: int = Field(default=5, ge=1)


class TenantUpdate(BaseModel):
    name: Optional[str] = None
    billing_email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class TenantInDBBase(TenantBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class Tenant(TenantInDBBase):
    subscription: Optional[Subscription] = None


class TenantInDB(TenantInDBBase):
    pass


class TenantSignup(BaseModel):
    tenant: TenantCreate
    owner_email: EmailStr
    owner_password: str = Field(min_length=8)
    owner_full_name: Optional[str] = None
