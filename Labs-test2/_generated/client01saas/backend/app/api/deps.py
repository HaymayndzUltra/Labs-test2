"""API dependencies"""
from __future__ import annotations

from typing import Generator, Optional

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.config import settings
from app.core import security
from app.database import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token"
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _decode_token(token: str) -> schemas.TokenPayload:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        return schemas.TokenPayload(**payload)
    except (JWTError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        ) from exc


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    token_data = _decode_token(token)
    if token_data.sub is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token subject")
    user = crud.user.get(db, user_id=int(token_data.sub))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not crud.user.is_active(user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    scoped_org_id = token_data.org_id or user.org_id
    if user.org_id and token_data.org_id and user.org_id != token_data.org_id:
        # Only super admins can request a different org scope
        if not crud.user.is_super_admin(user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organization scope mismatch")
    setattr(user, "scoped_org_id", scoped_org_id)
    setattr(user, "token_role", token_data.role or (user.role.value if hasattr(user.role, "value") else str(user.role)))
    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    return current_user


def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_super_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


def get_request_org_id(
    current_user: models.User = Depends(get_current_user),
    x_org_id: Optional[int] = Header(default=None),
) -> int:
    """Resolve the organization scope for the current request."""
    if crud.user.is_super_admin(current_user):
        if x_org_id is not None:
            return x_org_id
        scoped = getattr(current_user, "scoped_org_id", None)
        if scoped is not None:
            return scoped
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organization scope required")

    org_id = getattr(current_user, "scoped_org_id", None) or current_user.org_id
    if org_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organization scope required")
    if x_org_id is not None and x_org_id != org_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organization scope mismatch")
    return org_id
