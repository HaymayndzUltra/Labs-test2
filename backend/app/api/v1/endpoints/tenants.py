"""Tenant endpoints"""
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from .auth import _signup_tenant

router = APIRouter()


@router.get("/me", response_model=schemas.Tenant)
def get_tenant_me(
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
) -> Any:
    """Return the tenant associated with the current context."""
    return current_tenant


@router.put("/me", response_model=schemas.Tenant)
def update_tenant_me(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: schemas.TenantUpdate,
    current_user: models.User = Depends(deps.get_current_tenant_admin),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
) -> Any:
    """Update the active tenant."""
    tenant = crud.tenant.update(db, db_obj=current_tenant, obj_in=tenant_in)
    return tenant


@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_tenant(
    *,
    db: Session = Depends(deps.get_db),
    signup: schemas.TenantSignup,
) -> Any:
    """Self-serve tenant signup that creates the organization and owner user."""
    owner = _signup_tenant(db, signup)
    return owner
