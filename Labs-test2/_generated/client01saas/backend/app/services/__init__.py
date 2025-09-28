"""Service layer exports"""
from .dashboard import compute_kpis, compute_trends, load_student_activity, automation_panel
from .ai import monthly_summary
from .notifications import send_email_stub
from .reporting import build_org_report

__all__ = [
    "compute_kpis",
    "compute_trends",
    "load_student_activity",
    "automation_panel",
    "monthly_summary",
    "send_email_stub",
    "build_org_report",
]
