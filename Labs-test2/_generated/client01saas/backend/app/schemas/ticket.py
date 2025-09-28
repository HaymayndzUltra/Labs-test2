"""Ticket schemas"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.ticket import TicketPriority, TicketStatus


class TicketBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TicketPriority = TicketPriority.MEDIUM
    status: TicketStatus = TicketStatus.OPEN
    assigned_vendor: Optional[str] = None
    tenant_id: Optional[int] = None


class TicketCreate(TicketBase):
    org_id: Optional[int] = None


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    assigned_vendor: Optional[str] = None


class TicketRead(TicketBase):
    id: int
    org_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
