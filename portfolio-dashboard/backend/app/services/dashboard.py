"""Service layer for the portfolio dashboard endpoints."""
from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Dict, List

from app.schemas.dashboard import (
    AnalyticsHighlight,
    KPIResponse,
    KPIDelta,
    ProgressSummary,
    Reminder,
    RemindersResponse,
    TasksResponse,
    Task,
    TeamMember,
    TeamResponse,
    Trend,
    WeeklyActivity,
    WeeklyAnalyticsResponse,
)


class DashboardService:
    """Encapsulates dashboard data retrieval logic."""

    _KPI_TOTAL = 24
    _KPI_COMPLETED = 10
    _KPI_ACTIVE = 12
    _KPI_PENDING = 2

    @classmethod
    def get_kpis(cls) -> KPIResponse:
        """Return static KPI metrics for the dashboard."""

        deltas: Dict[str, KPIDelta] = {
            "total": KPIDelta(value=12.0, trend=Trend.UP, description="Increased vs. last quarter"),
            "completed": KPIDelta(value=8.0, trend=Trend.UP, description="3 more completions than last week"),
            "active": KPIDelta(value=2.0, trend=Trend.STEADY, description="Stable sprint load"),
            "pending": KPIDelta(value=-1.0, trend=Trend.DOWN, description="Reduced backlog by one project"),
        }

        progress = ProgressSummary(
            percentage=41,
            status="On track",
            goal="Q2 Delivery Targets",
            updated_at=datetime.utcnow().replace(microsecond=0),
        )

        highlights: List[AnalyticsHighlight] = [
            AnalyticsHighlight(
                id="efficiency",
                label="Delivery Efficiency",
                value="91%",
                context="Velocity improvement over the last 14 days",
            ),
            AnalyticsHighlight(
                id="collaboration",
                label="Collaboration",
                value="18 active handoffs",
                context="Across design, engineering, and QA squads",
            ),
        ]

        return KPIResponse(
            total=cls._KPI_TOTAL,
            completed=cls._KPI_COMPLETED,
            active=cls._KPI_ACTIVE,
            pending=cls._KPI_PENDING,
            deltas=deltas,
            progress=progress,
            highlights=highlights,
        )

    @staticmethod
    def get_weekly_analytics() -> WeeklyAnalyticsResponse:
        """Build the seven-day analytics view."""

        today = date.today()
        base_counts = [4, 5, 3, 6, 7, 5, 4]
        completed_counts = [2, 3, 2, 4, 5, 4, 3]
        days: List[WeeklyActivity] = []
        previous_total = None
        for idx, (total, completed) in enumerate(zip(base_counts, completed_counts)):
            current_date = today - timedelta(days=6 - idx)
            change = 0.0
            if previous_total is not None and previous_total:
                change = round(((total - previous_total) / previous_total) * 100, 1)
            days.append(
                WeeklyActivity(
                    date=current_date,
                    label=current_date.strftime("%a"),
                    projects=total,
                    completed=completed,
                    change=change,
                )
            )
            previous_total = total

        summary = (
            "Engagement continues to climb with a 14% uptick in mid-week activity "
            "and consistent completion rates across core projects."
        )
        return WeeklyAnalyticsResponse(days=days, summary=summary)

    @staticmethod
    def get_reminders() -> RemindersResponse:
        """Return reminders and notifications."""

        base = datetime.utcnow().replace(hour=9, minute=30, second=0, microsecond=0)
        reminders = [
            Reminder(
                id="meeting-arc",
                title="Meeting with Arc Company",
                type="meeting",
                due_date=base,
                description="Finalize scope for analytics rollout and confirm sprint timelines.",
                cta_label="Start Meeting",
                cta_link="https://meet.example.com/arc",
            ),
            Reminder(
                id="handoff-design",
                title="Design handoff for Mobile Dashboard",
                type="deadline",
                due_date=base + timedelta(hours=5),
                description="Review the Figma boards before 2:00 PM to unblock development.",
                cta_label="View Brief",
                cta_link="https://figma.example.com/mobile-dashboard",
            ),
            Reminder(
                id="retro",
                title="Sprint Retro Insights",
                type="alert",
                due_date=base + timedelta(days=1),
                description="Share highlights and blockers ahead of tomorrow's async retro.",
            ),
        ]
        return RemindersResponse(reminders=reminders)

    @staticmethod
    def get_team() -> TeamResponse:
        """Return current collaboration roster."""

        members = [
            TeamMember(
                id="ray-quizon",
                name="Ray Quizon",
                role="Product Lead",
                status="In Review",
                focus="Meeting with Arc Company",
                avatar_color="#0AA27B",
                productivity=92,
                tasks_completed=18,
                tasks_total=21,
            ),
            TeamMember(
                id="adeleine-ahn",
                name="Adeleine Ahn",
                role="UI Designer",
                status="Completed",
                focus="Mobile app marketing screens",
                avatar_color="#3B82F6",
                productivity=88,
                tasks_completed=14,
                tasks_total=16,
            ),
            TeamMember(
                id="edwin-alejo",
                name="Edwin Alejo",
                role="Backend Engineer",
                status="In Progress",
                focus="Deploy Arc integrations",
                avatar_color="#F97316",
                productivity=84,
                tasks_completed=11,
                tasks_total=15,
            ),
            TeamMember(
                id="david-choi",
                name="David Choi",
                role="QA Analyst",
                status="Pending QA",
                focus="Cross-browser testing",
                avatar_color="#6366F1",
                productivity=79,
                tasks_completed=9,
                tasks_total=13,
            ),
        ]
        return TeamResponse(members=members)

    @staticmethod
    def get_tasks() -> TasksResponse:
        """Return curated task list for the dashboard view."""

        base = datetime.utcnow().date()
        tasks = [
            Task(
                id="optimize-api",
                title="Optimize Page Load",
                project="Website Redesign",
                due_date=datetime.combine(base, datetime.min.time()) + timedelta(days=1),
                priority="High",
                status="In Progress",
                assignee="Ray Quizon",
            ),
            Task(
                id="design-system",
                title="Finalize Design System",
                project="Design System Refresh",
                due_date=datetime.combine(base, datetime.min.time()) + timedelta(days=2),
                priority="Medium",
                status="Awaiting Review",
                assignee="Adeleine Ahn",
            ),
            Task(
                id="arc-integration",
                title="Meeting with Arc Company",
                project="Arc Onboarding",
                due_date=datetime.combine(base, datetime.min.time()),
                priority="High",
                status="Ready",
                assignee="Edwin Alejo",
            ),
            Task(
                id="cross-browser",
                title="Cross-browser Testing",
                project="QA Cycle",
                due_date=datetime.combine(base, datetime.min.time()) + timedelta(days=3),
                priority="Low",
                status="Pending",
                assignee="David Choi",
            ),
        ]
        return TasksResponse(tasks=tasks)
