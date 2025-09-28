"""Dashboard data aggregation services"""
from __future__ import annotations

from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import List

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Payment, PaymentStatus, Tenant, Ticket, TicketStatus, Unit
from app.schemas.dashboard import (
    AutomationPanel,
    DashboardTrends,
    KPIResponse,
    RatePoint,
    StudentActivityHeatmap,
    StudentActivityPoint,
    TrendPoint,
)

FIXTURES_ROOT = Path(__file__).resolve().parent.parent / "fixtures"


def compute_kpis(db: Session, org_id: int) -> KPIResponse:
    total_tenants = db.query(func.count(Tenant.id)).filter(Tenant.org_id == org_id).scalar() or 0
    occupied_units = (
        db.query(func.count(Unit.id))
        .filter(Unit.org_id == org_id, func.lower(Unit.status) == "occupied")
        .scalar()
        or 0
    )
    overdue_payments = (
        db.query(func.count(Payment.id))
        .filter(Payment.org_id == org_id, Payment.status == PaymentStatus.OVERDUE)
        .scalar()
        or 0
    )
    open_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.org_id == org_id, Ticket.status != TicketStatus.CLOSED)
        .scalar()
        or 0
    )
    return KPIResponse(
        total_tenants=total_tenants,
        occupied_units=occupied_units,
        overdue_payments=overdue_payments,
        open_tickets=open_tickets,
    )


def _month_key(dt) -> date:
    return date(dt.year, dt.month, 1)


def compute_trends(db: Session, org_id: int) -> DashboardTrends:
    rent_totals: defaultdict[date, float] = defaultdict(float)
    for payment in db.query(Payment).filter(Payment.org_id == org_id).all():
        period = _month_key(payment.due_date.date()) if hasattr(payment.due_date, "date") else _month_key(payment.due_date)
        if payment.status == PaymentStatus.PAID and payment.paid_at:
            rent_totals[period] += float(payment.amount)
    rent_series = [TrendPoint(period=period, value=value) for period, value in sorted(rent_totals.items())]

    closure_totals: defaultdict[date, List[int]] = defaultdict(list)
    for ticket in db.query(Ticket).filter(Ticket.org_id == org_id).all():
        period = _month_key(ticket.created_at.date()) if hasattr(ticket.created_at, "date") else _month_key(ticket.created_at)
        closure_totals[period].append(1 if ticket.status == TicketStatus.CLOSED else 0)
    rate_series = [
        RatePoint(period=period, rate=sum(values) / len(values) if values else 0.0)
        for period, values in sorted(closure_totals.items())
    ]

    return DashboardTrends(rent_collection=rent_series, ticket_closure_rate=rate_series)


def load_student_activity(org_id: int) -> StudentActivityHeatmap:
    fixture = FIXTURES_ROOT / "analytics" / "student_activity.json"
    if not fixture.exists():
        return StudentActivityHeatmap(points=[])
    data = fixture.read_text(encoding="utf-8")
    import json

    payload = json.loads(data)
    points = [
        StudentActivityPoint(building=item.get("building", ""), activity_index=float(item.get("activity_index", 0.0)))
        for item in payload.get("points", [])
    ]
    return StudentActivityHeatmap(points=points)


def automation_panel(db: Session, org_id: int) -> AutomationPanel:
    overdue = (
        db.query(func.count(Payment.id))
        .filter(Payment.org_id == org_id, Payment.status == PaymentStatus.OVERDUE)
        .scalar()
        or 0
    )
    pending_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.org_id == org_id, Ticket.status != TicketStatus.CLOSED)
        .scalar()
        or 0
    )
    recommendations: List[str] = []
    if overdue:
        recommendations.append("Send payment reminders to tenants with overdue balances.")
    if pending_tickets:
        recommendations.append("Prioritize high priority maintenance tickets for this week.")
    if not recommendations:
        recommendations.append("All clear! Continue monitoring dashboards for anomalies.")
    return AutomationPanel(
        overdue_payments=overdue,
        pending_tickets=pending_tickets,
        recommendations=recommendations,
    )
