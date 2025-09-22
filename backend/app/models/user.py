"""User model"""
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

if TYPE_CHECKING:
    from .tenant import Tenant  # noqa: F401


class User(Base):
    __tablename__ = "users"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    tenant_role = Column(String, nullable=False, default="member")
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="SET NULL"), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tenant = relationship("Tenant", back_populates="users")
