"""Billing endpoints"""
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/subscription", response_model=schemas.Subscription)
def get_subscription(
    *,
    db: Session = Depends(deps.get_db),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
    current_user: models.User = Depends(deps.get_current_tenant_admin),
) -> Any:
    """Return subscription details for the current tenant."""
    subscription = crud.subscription.get_by_tenant(db, tenant_id=current_tenant.id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription


@router.post("/subscription", response_model=schemas.Subscription)
def update_subscription(
    *,
    db: Session = Depends(deps.get_db),
    payload: schemas.SubscriptionUpdate,
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
    current_user: models.User = Depends(deps.get_current_tenant_admin),
) -> Any:
    """Update subscription plan or metadata."""
    subscription = crud.subscription.upsert(
        db, tenant_id=current_tenant.id, obj_in=payload
    )
    return subscription


@router.post("/subscription/cancel", response_model=schemas.Subscription)
def cancel_subscription(
    *,
    db: Session = Depends(deps.get_db),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
    current_user: models.User = Depends(deps.get_current_tenant_admin),
) -> Any:
    """Cancel the current tenant subscription."""
    subscription = crud.subscription.cancel(db, tenant_id=current_tenant.id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription


@router.post("/subscription/resume", response_model=schemas.Subscription)
def resume_subscription(
    *,
    db: Session = Depends(deps.get_db),
    current_tenant: models.Tenant = Depends(deps.get_current_tenant),
    current_user: models.User = Depends(deps.get_current_tenant_admin),
) -> Any:
    """Resume a previously cancelled subscription."""
    subscription = crud.subscription.resume(db, tenant_id=current_tenant.id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription
