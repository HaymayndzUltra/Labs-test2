"""Endpoints exposing the enterprise e-commerce dashboard."""
from fastapi import APIRouter

from app.schemas.commerce_dashboard import EcommerceDashboardResponse
from app.services.commerce_dashboard import CommerceDashboardService

router = APIRouter()


@router.get("", response_model=EcommerceDashboardResponse, summary="E-commerce dashboard snapshot")
async def read_commerce_dashboard() -> EcommerceDashboardResponse:
    """Return the data required for the commerce analytics dashboard."""

    return CommerceDashboardService.get_dashboard()
