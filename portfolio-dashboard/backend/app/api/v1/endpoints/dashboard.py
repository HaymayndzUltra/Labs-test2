"""Dashboard endpoints exposing portfolio insights."""
from fastapi import APIRouter

from app.schemas.dashboard import (
    KPIResponse,
    RemindersResponse,
    TasksResponse,
    TeamResponse,
    WeeklyAnalyticsResponse,
)
from app.services.dashboard import DashboardService

router = APIRouter()


@router.get("/kpis", response_model=KPIResponse, summary="Portfolio KPI overview")
async def read_kpis() -> KPIResponse:
    """Return the core KPI metrics displayed on the dashboard."""

    return DashboardService.get_kpis()


@router.get(
    "/weekly-analytics",
    response_model=WeeklyAnalyticsResponse,
    summary="Weekly analytics trend data",
)
async def read_weekly_analytics() -> WeeklyAnalyticsResponse:
    """Return seven-day analytics for the chart widget."""

    return DashboardService.get_weekly_analytics()


@router.get("/reminders", response_model=RemindersResponse, summary="Active reminders")
async def read_reminders() -> RemindersResponse:
    """Return reminders and notifications."""

    return DashboardService.get_reminders()


@router.get("/team", response_model=TeamResponse, summary="Team roster")
async def read_team() -> TeamResponse:
    """Return team collaboration data."""

    return DashboardService.get_team()


@router.get("/tasks", response_model=TasksResponse, summary="Task board snapshot")
async def read_tasks() -> TasksResponse:
    """Return highlighted tasks for the dashboard."""

    return DashboardService.get_tasks()
