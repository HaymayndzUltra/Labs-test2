"""Reporting endpoints"""
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.api import deps
from app.services import automation_panel, build_org_report, compute_kpis, compute_trends

router = APIRouter()


@router.post("/org-monthly", response_class=Response)
def generate_org_report(
    month: str,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> Response:
    kpis = compute_kpis(db, org_id)
    automation = automation_panel(db, org_id)
    trends = compute_trends(db, org_id)
    pdf_bytes = build_org_report(db, org_id, month, kpis=kpis, automation=automation, trends=trends)
    headers = {"Content-Disposition": f"attachment; filename=org-summary-{month}.pdf"}
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
