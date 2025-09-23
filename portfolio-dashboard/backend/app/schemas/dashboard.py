"""Pydantic schemas for dashboard endpoints."""
from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class Trend(str, Enum):
    """Represents the trend direction for a metric."""

    UP = "up"
    DOWN = "down"
    STEADY = "steady"


class KPIDelta(BaseModel):
    """Change indicator for KPI metrics."""

    value: float = Field(..., description="Magnitude of change compared to the previous period")
    trend: Trend = Field(..., description="Direction of change")
    description: str = Field(..., description="Human-readable summary of the change")


class KPIResponse(BaseModel):
    """KPI summary response."""

    total: int = Field(..., description="Total number of projects")
    completed: int = Field(..., description="Number of completed projects")
    active: int = Field(..., description="Number of active projects")
    pending: int = Field(..., description="Number of pending projects")
    deltas: Dict[str, KPIDelta] = Field(
        default_factory=dict,
        description="Change metadata keyed by KPI identifier",
    )
    progress: "ProgressSummary" = Field(..., description="Overall portfolio progress overview")
    highlights: List["AnalyticsHighlight"] = Field(
        default_factory=list,
        description="Contextual insights that power the analytics widget",
    )


class ProgressSummary(BaseModel):
    """Project progress indicator used for the radial chart."""

    percentage: int = Field(..., ge=0, le=100, description="Percent completion towards the current milestone")
    status: str = Field(..., description="Short descriptor of the current progress state")
    goal: str = Field(..., description="Active project milestone or goal")
    updated_at: datetime = Field(..., description="Timestamp for when the progress metric was last refreshed")


class AnalyticsHighlight(BaseModel):
    """Quick statistic shown alongside the analytics chart."""

    id: str
    label: str
    value: str
    context: str


class WeeklyActivity(BaseModel):
    """Represents a single day's analytics."""

    date: date
    label: str
    projects: int = Field(..., description="Total projects touched on the day")
    completed: int = Field(..., description="Projects completed on the day")
    change: float = Field(..., description="Percent change compared to the previous day")


class WeeklyAnalyticsResponse(BaseModel):
    """Weekly analytics response payload."""

    days: List[WeeklyActivity]
    summary: str = Field(..., description="Overall interpretation of the week's performance")


class Reminder(BaseModel):
    """Reminder or notification payload."""

    id: str
    title: str
    type: Literal["meeting", "deadline", "alert", "task"]
    due_date: datetime
    description: str
    cta_label: Optional[str] = Field(None, description="Call-to-action label for the reminder")
    cta_link: Optional[str] = Field(None, description="Optional link associated with the reminder")


class RemindersResponse(BaseModel):
    """Reminder collection response."""

    reminders: List[Reminder]


class TeamMember(BaseModel):
    """Team member entry shown in the collaboration widget."""

    id: str
    name: str
    role: str
    status: str
    focus: str = Field(..., description="Primary focus or project the member is handling")
    avatar_color: str = Field(
        ...,
        pattern=r"^#([A-Fa-f0-9]{6})$",
        description="Hex color used for avatar fallback",
    )
    productivity: int = Field(..., ge=0, le=100, description="Percent productivity score")
    tasks_completed: int
    tasks_total: int


class TeamResponse(BaseModel):
    """Team list response."""

    members: List[TeamMember]


class Task(BaseModel):
    """Task entry used by the task management widget."""

    id: str
    title: str
    project: str
    due_date: datetime
    priority: Literal["High", "Medium", "Low"]
    status: str
    assignee: str


class TasksResponse(BaseModel):
    """Task collection response."""

    tasks: List[Task]


KPIResponse.model_rebuild()
ProgressSummary.model_rebuild()
AnalyticsHighlight.model_rebuild()
WeeklyAnalyticsResponse.model_rebuild()
RemindersResponse.model_rebuild()
TeamResponse.model_rebuild()
TasksResponse.model_rebuild()
