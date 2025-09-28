"""Seed database with PropWise sample data"""
from __future__ import annotations

import datetime
import logging

from sqlalchemy.orm import Session

from app.crud import user as crud_user
from app.database import Base, SessionLocal, engine
from app.models import (
    Building,
    Organization,
    Payment,
    PaymentStatus,
    Tenant,
    Ticket,
    TicketPriority,
    TicketStatus,
    Unit,
    UserRole,
)
from app.schemas.user import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed(session: Session) -> None:
    Base.metadata.create_all(bind=engine)

    orgs = {
        "Acme Realty": Organization(name="Acme Realty"),
        "Skyline Properties": Organization(name="Skyline Properties"),
    }
    for name, org in orgs.items():
        existing = session.query(Organization).filter(Organization.name == name).first()
        if existing:
            orgs[name] = existing
        else:
            session.add(org)
            session.flush()
            orgs[name] = org

    # Buildings & units for Acme Realty
    acme = orgs["Acme Realty"]
    tower_a = session.query(Building).filter(Building.name == "Tower A", Building.org_id == acme.id).first()
    if not tower_a:
        tower_a = Building(org_id=acme.id, name="Tower A", address="123 Main St")
        session.add(tower_a)
        session.flush()
    unit_a101 = session.query(Unit).filter(Unit.name == "A-101", Unit.org_id == acme.id).first()
    if not unit_a101:
        unit_a101 = Unit(org_id=acme.id, building_id=tower_a.id, name="A-101", status="occupied")
        session.add(unit_a101)
        session.flush()

    tenant = session.query(Tenant).filter(Tenant.email == "john@example.com", Tenant.org_id == acme.id).first()
    if not tenant:
        tenant = Tenant(
            org_id=acme.id,
            unit_id=unit_a101.id,
            name="John Doe",
            email="john@example.com",
            phone="555-0100",
        )
        session.add(tenant)
        session.flush()

    payment = (
        session.query(Payment)
        .filter(Payment.tenant_id == tenant.id, Payment.amount == 1200)
        .first()
    )
    if not payment:
        payment = Payment(
            org_id=acme.id,
            tenant_id=tenant.id,
            amount=1200,
            due_date=datetime.datetime(2025, 9, 1),
            paid_at=None,
            status=PaymentStatus.OVERDUE,
        )
        session.add(payment)

    # Additional paid payment for trend generation
    paid_payment = (
        session.query(Payment)
        .filter(Payment.tenant_id == tenant.id, Payment.status == PaymentStatus.PAID)
        .first()
    )
    if not paid_payment:
        session.add(
            Payment(
                org_id=acme.id,
                tenant_id=tenant.id,
                amount=1100,
                due_date=datetime.datetime(2025, 8, 1),
                paid_at=datetime.datetime(2025, 8, 3),
                status=PaymentStatus.PAID,
            )
        )

    ticket = (
        session.query(Ticket)
        .filter(Ticket.title == "Leaky faucet", Ticket.org_id == acme.id)
        .first()
    )
    if not ticket:
        ticket = Ticket(
            org_id=acme.id,
            tenant_id=tenant.id,
            title="Leaky faucet",
            description="Kitchen sink is leaking",
            priority=TicketPriority.HIGH,
            status=TicketStatus.OPEN,
        )
        session.add(ticket)

    # Skyline sample data
    skyline = orgs["Skyline Properties"]
    skyline_building = (
        session.query(Building)
        .filter(Building.name == "Skyline Tower", Building.org_id == skyline.id)
        .first()
    )
    if not skyline_building:
        skyline_building = Building(org_id=skyline.id, name="Skyline Tower", address="77 Skyline Ave")
        session.add(skyline_building)
        session.flush()
    skyline_unit = session.query(Unit).filter(Unit.name == "S-201", Unit.org_id == skyline.id).first()
    if not skyline_unit:
        skyline_unit = Unit(org_id=skyline.id, building_id=skyline_building.id, name="S-201", status="vacant")
        session.add(skyline_unit)

    # Users
    admin_user = crud_user.get_by_email(session, email="admin@acme.io")
    if not admin_user:
        admin_user = crud_user.create(
            session,
            obj_in=UserCreate(
                email="admin@acme.io",
                password="propwise",
                full_name="Acme Admin",
                role=UserRole.ORG_ADMIN,
                org_id=acme.id,
            ),
        )
    tenant_user = crud_user.get_by_email(session, email="tenant1@acme.io")
    if not tenant_user:
        tenant_user = crud_user.create(
            session,
            obj_in=UserCreate(
                email="tenant1@acme.io",
                password="propwise",
                full_name="John Doe",
                role=UserRole.TENANT,
                org_id=acme.id,
            ),
        )

    session.commit()
    logger.info("Seed data applied")


if __name__ == "__main__":
    with SessionLocal() as session:
        seed(session)
