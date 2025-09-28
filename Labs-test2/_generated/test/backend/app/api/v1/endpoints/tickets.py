"""Maintenance ticket endpoints"""
import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.TicketRead])
def list_tickets(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> List[schemas.TicketRead]:
    return (
        db.query(models.Ticket)
        .filter(models.Ticket.org_id == org_id)
        .order_by(models.Ticket.created_at.desc())
        .all()
    )


@router.get("/{ticket_id}", response_model=schemas.TicketRead)
def get_ticket(
    ticket_id: int = Path(..., gt=0),
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> schemas.TicketRead:
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id, models.Ticket.org_id == org_id)
        .first()
    )
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket


@router.post("", response_model=schemas.TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: schemas.TicketCreate,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> schemas.TicketRead:
    ticket = models.Ticket(
        org_id=org_id,
        tenant_id=ticket_in.tenant_id,
        title=ticket_in.title,
        description=ticket_in.description,
        priority=ticket_in.priority,
        status=ticket_in.status,
        assigned_vendor=ticket_in.assigned_vendor,
    )
    db.add(ticket)
    db.add(
        models.AuditLog(
            org_id=org_id,
            user_id=current_user.id,
            entity="ticket",
            action="create",
            payload=json.dumps({"title": ticket_in.title, "priority": ticket_in.priority.value}),
        )
    )
    db.commit()
    db.refresh(ticket)
    return ticket


@router.patch("/{ticket_id}", response_model=schemas.TicketRead)
def update_ticket(
    ticket_update: schemas.TicketUpdate,
    ticket_id: int = Path(..., gt=0),
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> schemas.TicketRead:
    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id, models.Ticket.org_id == org_id)
        .first()
    )
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    update_data = ticket_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)
    db.add(ticket)
    db.add(
        models.AuditLog(
            org_id=org_id,
            user_id=current_user.id,
            entity="ticket",
            action="update",
            payload=json.dumps({"ticket_id": ticket_id, "fields": list(update_data.keys())}),
        )
    )
    db.commit()
    db.refresh(ticket)
    return ticket
