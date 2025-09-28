"""Payments endpoints"""
from typing import List
import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.PaymentRead])
def list_payments(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> List[schemas.PaymentRead]:
    return (
        db.query(models.Payment)
        .filter(models.Payment.org_id == org_id)
        .order_by(models.Payment.due_date.desc())
        .all()
    )


@router.post("", response_model=schemas.PaymentRead, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment_in: schemas.PaymentCreate,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> schemas.PaymentRead:
    tenant = db.query(models.Tenant).filter(models.Tenant.id == payment_in.tenant_id, models.Tenant.org_id == org_id).first()
    if tenant is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tenant not found in organization scope")
    payment = models.Payment(
        org_id=org_id,
        tenant_id=payment_in.tenant_id,
        amount=payment_in.amount,
        due_date=payment_in.due_date,
        status=payment_in.status,
        paid_at=payment_in.paid_at,
    )
    db.add(payment)
    db.add(
        models.AuditLog(
            org_id=org_id,
            user_id=current_user.id,
            entity="payment",
            action="create",
            payload=json.dumps({"tenant": tenant.email, "amount": payment_in.amount}),
        )
    )
    db.commit()
    db.refresh(payment)
    return payment
