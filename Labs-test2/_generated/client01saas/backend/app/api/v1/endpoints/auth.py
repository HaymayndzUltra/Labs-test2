"""Authentication endpoints"""
from datetime import timedelta
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.config import settings
from app.core import security

router = APIRouter()


@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = crud.user.authenticate(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    if not crud.user.is_active(user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id,
        org_id=user.org_id,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
        expires_delta=expires_delta,
    )
    refresh_token = security.create_refresh_token(
        user.id,
        org_id=user.org_id,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
    )
    return schemas.Token(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        expires_in=int(expires_delta.total_seconds()),
    )


@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> schemas.UserRead:
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Open user registration is forbidden on this server",
        )
    existing = crud.user.get_by_email(db, email=user_in.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    user = crud.user.create(db, obj_in=user_in)
    return schemas.UserRead.model_validate(user)


@router.get("/me", response_model=schemas.UserRead)
def read_users_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> models.User:
    return current_user
