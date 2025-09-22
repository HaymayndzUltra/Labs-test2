"""API dependencies"""
from typing import Generator, Optional

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.config import settings
from app.core import security
from app.database import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.tenant and not user.tenant.is_active and not user.is_superuser:
        raise HTTPException(status_code=403, detail="Tenant is inactive")
    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user


def get_current_tenant(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
    tenant_header: Optional[int] = Header(None, alias="X-Tenant-ID"),
) -> models.Tenant:
    tenant_id = current_user.tenant_id
    if crud.user.is_superuser(current_user) and tenant_header is not None:
        tenant_id = tenant_header
    if tenant_id is None:
        raise HTTPException(status_code=400, detail="Tenant context is required")
    tenant = crud.tenant.get(db, id=tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    if not tenant.is_active and not crud.user.is_superuser(current_user):
        raise HTTPException(status_code=403, detail="Tenant is inactive")
    if (
        not crud.user.is_superuser(current_user)
        and current_user.tenant_id != tenant.id
    ):
        raise HTTPException(status_code=403, detail="Tenant access denied")
    return tenant


def get_current_tenant_admin(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    if crud.user.is_superuser(current_user):
        return current_user
    if not crud.user.is_tenant_admin(current_user):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
