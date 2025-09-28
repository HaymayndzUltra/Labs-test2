"""Dashboard endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.dashboard import (
    AutomationPanel,
    DashboardTrends,
    KPIResponse,
    StudentActivityHeatmap,
)
from app.services import automation_panel, compute_kpis, compute_trends, load_student_activity

router = APIRouter()


@router.get("/kpis", response_model=KPIResponse)
def get_kpis(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> KPIResponse:
    return compute_kpis(db, org_id)


@router.get("/trends", response_model=DashboardTrends)
def get_trends(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> DashboardTrends:
    return compute_trends(db, org_id)


@router.get("/student-activity", response_model=StudentActivityHeatmap)
def get_heatmap(
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> StudentActivityHeatmap:
    return load_student_activity(org_id)


@router.get("/automation", response_model=AutomationPanel)
def get_automation(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> AutomationPanel:
    return automation_panel(db, org_id)
