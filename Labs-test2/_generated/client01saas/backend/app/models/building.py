"""Building model"""
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True)
    org_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="buildings")
    units = relationship("Unit", back_populates="building", cascade="all, delete-orphan")
