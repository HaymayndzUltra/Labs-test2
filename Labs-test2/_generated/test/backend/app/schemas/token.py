"""Token schemas"""
from typing import Optional

from pydantic import BaseModel

from app.models.user import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
    expires_in: Optional[int] = None


class TokenPayload(BaseModel):
    sub: Optional[int] = None
    org_id: Optional[int] = None
    role: Optional[UserRole] = None
    type: Optional[str] = "access"
