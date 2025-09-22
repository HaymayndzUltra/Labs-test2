"""User endpoints"""
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_tenant_admin),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
) -> Any:
    """Retrieve users for the active tenant."""
    users = crud.user.get_multi_by_tenant(db, tenant_id=current_tenant.id, skip=skip, limit=limit)
    return users


@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_tenant_admin),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
) -> Any:
    """Create a new user inside the current tenant."""
    existing = crud.user.get_by_email(db, email=user_in.email)
    if existing and existing.tenant_id == current_tenant.id:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the tenant.",
        )
    payload = user_in.copy(update={"tenant_id": current_tenant.id})
    user = crud.user.create(db, obj_in=payload)
    return user


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Update own user."""
    current_user_data = jsonable_encoder(current_user)
    user_in = schemas.UserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=schemas.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get current user."""
    return current_user


@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
    db: Session = Depends(deps.get_db),
) -> Any:
    """Get a specific user by id within the tenant."""
    user = crud.user.get(db, id=user_id)
    if not user or user.tenant_id != current_tenant.id:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user or crud.user.is_tenant_admin(current_user):
        return user
    raise HTTPException(status_code=403, detail="Insufficient privileges")


@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_tenant_admin),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
) -> Any:
    """Update a user within the tenant."""
    user = crud.user.get(db, id=user_id)
    if not user or user.tenant_id != current_tenant.id:
        raise HTTPException(
            status_code=404,
            detail="The user does not exist in this tenant",
        )
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user
