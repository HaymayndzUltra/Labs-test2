"""Pydantic schemas for users"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: UserRole = UserRole.ORG_ADMIN
    org_id: Optional[int] = None
    is_active: bool = True


class UserCreate(UserBase):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    org_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserInDB(UserRead):
    hashed_password: str
