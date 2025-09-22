"""Subscription schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.tenant import SubscriptionStatus


class SubscriptionBase(BaseModel):
    plan: Optional[str] = Field(default=None, description="Subscription plan identifier")
    status: Optional[SubscriptionStatus] = None
    seats: Optional[int] = Field(default=None, ge=1)
    payment_provider: Optional[str] = None
    customer_id: Optional[str] = None
    current_period_end: Optional[datetime] = None


class SubscriptionCreate(SubscriptionBase):
    tenant_id: int
    plan: str = "starter"
    status: SubscriptionStatus = SubscriptionStatus.TRIALING
    seats: int = 5


class SubscriptionUpdate(SubscriptionBase):
    pass


class SubscriptionInDBBase(SubscriptionBase):
    id: Optional[int] = None
    tenant_id: Optional[int] = None
    current_period_start: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class Subscription(SubscriptionInDBBase):
    pass


class SubscriptionInDB(SubscriptionInDBBase):
    pass
