"""AI summary endpoint"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.ai import SummaryRequest, SummaryResponse
from app.services import monthly_summary

router = APIRouter()


@router.post("/monthly-summary", response_model=SummaryResponse)
def get_monthly_summary(
    payload: SummaryRequest,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
    org_id: int = Depends(deps.get_request_org_id),
) -> SummaryResponse:
    return monthly_summary(db, org_id, payload.month)
