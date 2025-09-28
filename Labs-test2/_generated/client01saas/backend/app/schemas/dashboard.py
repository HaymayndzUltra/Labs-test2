"""Dashboard schemas"""
from datetime import date
from typing import List

from pydantic import BaseModel


class KPIResponse(BaseModel):
    total_tenants: int
    occupied_units: int
    overdue_payments: int
    open_tickets: int


class TrendPoint(BaseModel):
    period: date
    value: float


class RatePoint(BaseModel):
    period: date
    rate: float


class DashboardTrends(BaseModel):
    rent_collection: List[TrendPoint]
    ticket_closure_rate: List[RatePoint]


class AutomationPanel(BaseModel):
    overdue_payments: int
    pending_tickets: int
    recommendations: List[str]


class StudentActivityPoint(BaseModel):
    building: str
    activity_index: float


class StudentActivityHeatmap(BaseModel):
    points: List[StudentActivityPoint]
