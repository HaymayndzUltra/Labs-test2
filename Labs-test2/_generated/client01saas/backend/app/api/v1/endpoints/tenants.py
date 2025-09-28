"""Tenant management endpoints"""
from typing import List
import json

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.TenantRead])
def list_tenants(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> List[schemas.TenantRead]:
    tenants = db.query(models.Tenant).filter(models.Tenant.org_id == org_id).order_by(models.Tenant.created_at.desc()).all()
    return tenants


@router.post("", response_model=schemas.TenantRead, status_code=status.HTTP_201_CREATED)
def create_tenant(
    tenant_in: schemas.TenantCreate,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> schemas.TenantRead:
    tenant = models.Tenant(
        org_id=org_id,
        name=tenant_in.name,
        email=tenant_in.email,
        phone=tenant_in.phone,
        unit_id=tenant_in.unit_id,
    )
    db.add(tenant)
    db.add(
        models.AuditLog(
            org_id=org_id,
            user_id=current_user.id,
            entity="tenant",
            action="create",
            payload=json.dumps({"tenant": tenant_in.email}),
        )
    )
    db.commit()
    db.refresh(tenant)
    return tenant
