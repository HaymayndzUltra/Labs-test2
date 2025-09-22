"""Tenant and subscription models"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as PgEnum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class SubscriptionStatus(str, Enum):
    """Status for a tenant subscription lifecycle."""

    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"


class Tenant(Base):
    """Represents an organization/tenant that owns resources."""

    __tablename__ = "tenants"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False, unique=True, index=True)
    billing_email = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    users: List["User"] = relationship(
        "User",
        back_populates="tenant",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    subscription: Optional["Subscription"] = relationship(
        "Subscription",
        uselist=False,
        back_populates="tenant",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Subscription(Base):
    """Represents the subscription for a tenant."""

    __tablename__ = "subscriptions"
    __allow_unmapped__ = True
    __table_args__ = (
        UniqueConstraint("tenant_id", name="uq_subscription_tenant"),
    )

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(
        Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False
    )
    plan = Column(String, nullable=False, default="starter")
    status = Column(PgEnum(SubscriptionStatus), nullable=False, default=SubscriptionStatus.TRIALING)
    seats = Column(Integer, nullable=False, default=5)
    payment_provider = Column(String, nullable=True)
    customer_id = Column(String, nullable=True)
    current_period_start = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tenant: Tenant = relationship("Tenant", back_populates="subscription")
