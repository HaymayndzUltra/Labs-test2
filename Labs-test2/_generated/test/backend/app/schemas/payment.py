"""Payment schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.payment import PaymentStatus


class PaymentBase(BaseModel):
    tenant_id: int
    amount: float
    due_date: datetime
    status: PaymentStatus = PaymentStatus.PENDING
    paid_at: Optional[datetime] = None


class PaymentCreate(PaymentBase):
    org_id: Optional[int] = None


class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    due_date: Optional[datetime] = None
    status: Optional[PaymentStatus] = None
    paid_at: Optional[datetime] = None


class PaymentRead(PaymentBase):
    id: int
    org_id: int
    created_at: datetime

    class Config:
        from_attributes = True
