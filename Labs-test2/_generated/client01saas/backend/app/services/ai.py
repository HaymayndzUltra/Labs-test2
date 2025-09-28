"""Rule-based AI summary service"""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models import Organization
from app.services.dashboard import compute_kpis, compute_trends
from app.schemas.ai import SummaryResponse


def monthly_summary(db: Session, org_id: int, month_label: str) -> SummaryResponse:
    org = db.query(Organization).filter(Organization.id == org_id).first()
    org_name = org.name if org else "Unknown"
    kpis = compute_kpis(db, org_id)
    trends = compute_trends(db, org_id)

    rent_growth = 0.0
    if len(trends.rent_collection) >= 2:
        rent_growth = trends.rent_collection[-1].value - trends.rent_collection[-2].value

    ticket_rate = trends.ticket_closure_rate[-1].rate if trends.ticket_closure_rate else 0.0

    highlights = [
        f"Total tenants: {kpis.total_tenants}",
        f"Occupied units: {kpis.occupied_units}",
        f"Open tickets: {kpis.open_tickets}",
    ]

    summary_parts = [
        f"{org_name} closed {ticket_rate:.0%} of maintenance tickets in {month_label}.",
    ]
    if rent_growth > 0:
        summary_parts.append(f"Rent collection increased by ${rent_growth:,.0f} compared to the prior month.")
    elif rent_growth < 0:
        summary_parts.append(f"Rent collection dipped by ${abs(rent_growth):,.0f}; follow up with overdue tenants.")
    else:
        summary_parts.append("Rent collection held steady month-over-month.")

    if kpis.overdue_payments:
        summary_parts.append(
            f"There are {kpis.overdue_payments} overdue payments. Consider sending reminders or enabling auto-pay nudges."
        )
    else:
        summary_parts.append("No overdue payments recorded—great job!")

    if kpis.open_tickets:
        summary_parts.append(
            f"{kpis.open_tickets} maintenance requests remain open. Prioritize those to keep residents happy."
        )

    return SummaryResponse(
        organization=org_name,
        month=month_label,
        summary=" ".join(summary_parts),
        highlights=highlights,
    )
