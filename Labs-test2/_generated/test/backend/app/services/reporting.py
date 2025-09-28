"""Reporting utilities"""
from __future__ import annotations

from pathlib import Path
from typing import Optional

from sqlalchemy.orm import Session

from app.models import Organization
from app.schemas.dashboard import AutomationPanel, KPIResponse, DashboardTrends

TEMPLATE_ROOT = Path(__file__).resolve().parent.parent / "templates"


def render_template(org: str, month: str, kpis: KPIResponse, automation: AutomationPanel, trends: DashboardTrends) -> str:
    template_path = TEMPLATE_ROOT / "org_summary.md"
    if template_path.exists():
        content = template_path.read_text(encoding="utf-8")
    else:
        content = (
            "# Monthly Summary\n\n"
            "Organization: {{organization}}\n\n"
            "## Highlights\n"
            "- Total tenants: {{total_tenants}}\n"
            "- Occupied units: {{occupied_units}}\n"
            "- Open tickets: {{open_tickets}}\n"
            "- Overdue payments: {{overdue_payments}}\n"
        )
    replacements = {
        "{{organization}}": org,
        "{{month}}": month,
        "{{total_tenants}}": str(kpis.total_tenants),
        "{{occupied_units}}": str(kpis.occupied_units),
        "{{open_tickets}}": str(kpis.open_tickets),
        "{{overdue_payments}}": str(kpis.overdue_payments),
        "{{automation_recommendations}}": "\n".join(f"- {rec}" for rec in automation.recommendations),
    }
    for key, value in replacements.items():
        content = content.replace(key, value)
    return content


def _escape_pdf_text(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def simple_pdf(content: str) -> bytes:
    lines = content.splitlines()
    y = 770
    stream_lines = ["BT", "/F1 12 Tf"]
    for line in lines:
        stream_lines.append(f"1 0 0 1 50 {y} Tm ({_escape_pdf_text(line)}) Tj")
        y -= 18
    stream_lines.append("ET")
    stream = "\n".join(stream_lines).encode("latin-1", "replace")

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = []

    def add_object(data: bytes) -> None:
        offsets.append(len(pdf))
        pdf.extend(data)

    add_object(b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n")
    add_object(b"2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n")
    add_object(
        b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R "
        b"/Resources << /Font << /F1 5 0 R >> >> >> endobj\n"
    )
    add_object(
        b"4 0 obj << /Length "
        + str(len(stream)).encode("ascii")
        + b" >> stream\n"
        + stream
        + b"\nendstream\nendobj\n"
    )
    add_object(b"5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n")

    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(offsets) + 1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets:
        pdf.extend(f"{offset:010} 00000 n \n".encode("ascii"))
    pdf.extend(
        f"trailer << /Size {len(offsets) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF".encode("ascii")
    )
    return bytes(pdf)


def build_org_report(
    db: Session,
    org_id: int,
    month: str,
    *,
    kpis: KPIResponse,
    automation: AutomationPanel,
    trends: DashboardTrends,
) -> bytes:
    org = db.query(Organization).filter(Organization.id == org_id).first()
    org_name = org.name if org else "Unknown"
    content = render_template(org_name, month, kpis, automation, trends)
    return simple_pdf(content)
