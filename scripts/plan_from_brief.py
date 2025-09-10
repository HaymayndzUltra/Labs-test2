#!/usr/bin/env python3
"""
Generate PLAN.md and tasks.json from a brief.md.
No deploy. No code edits. Outputs are artifacts only.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List

from project_generator.core.brief_parser import BriefParser


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate FE/BE plan artifacts from brief.md")
    p.add_argument("--brief", required=True, help="Path to brief.md")
    p.add_argument("--out", default="PLAN.md", help="Path to write PLAN.md (tasks.json will be co-located)")
    return p.parse_args()


def task(
    id_: str,
    title: str,
    area: str,
    blocked_by: List[str] | None = None,
    labels: List[str] | None = None,
    estimate: str = "1d",
    acceptance: List[str] | None = None,
    dod: List[str] | None = None,
) -> Dict:
    return {
        "id": id_,
        "title": title,
        "area": area,
        "estimate": estimate,
        "blocked_by": blocked_by or [],
        "labels": labels or [],
        "acceptance": acceptance or [],
        "dod": dod or [],
        "state": "pending",
    }


def build_plan(spec) -> Dict[str, List[Dict]]:
    be: List[Dict] = []
    fe: List[Dict] = []

    # Backend lane
    be.append(
        task(
            "BE-SCH",
            "Design DB schema",
            "backend",
            acceptance=["ERD drafted", "tables defined", "naming conventions applied"],
        )
    )
    be.append(
        task(
            "BE-SEED",
            "Seed loaders (CSV/mock)",
            "backend",
            blocked_by=["BE-SCH"],
            acceptance=["seed scripts run", "sample rows present"],
        )
    )
    be.append(
        task(
            "BE-MDL",
            "Aggregates/MatViews (funnel, revenue, etc.)",
            "backend",
            blocked_by=["BE-SEED"],
            acceptance=["views created", "query p95 < 400ms (seed)"],
        )
    )
    be += [
        task(
            "BE-API-KPI",
            "GET /api/v1/kpis",
            "backend",
            blocked_by=["BE-MDL"],
            acceptance=["returns totals/deltas", "OpenAPI updated"],
        ),
        task(
            "BE-API-REV",
            "GET /api/v1/revenue",
            "backend",
            blocked_by=["BE-MDL"],
            acceptance=["time series ok", "OpenAPI updated"],
        ),
        task("BE-API-CAT", "GET /api/v1/categories", "backend", blocked_by=["BE-MDL"]),
        task("BE-API-PLT", "GET /api/v1/platforms", "backend", blocked_by=["BE-MDL"]),
        task("BE-API-CUS", "GET /api/v1/customers/insights", "backend", blocked_by=["BE-MDL"]),
        task("BE-API-FDB", "GET /api/v1/feedback", "backend", blocked_by=["BE-MDL"]),
        task(
            "BE-EXP",
            "GET /api/v1/export/csv",
            "backend",
            blocked_by=[
                "BE-API-KPI",
                "BE-API-REV",
                "BE-API-CAT",
                "BE-API-PLT",
                "BE-API-CUS",
                "BE-API-FDB",
            ],
        ),
    ]
    be.append(
        task(
            "BE-AUTH",
            "Auth0/RBAC skeleton",
            "backend",
            labels=["security"],
            acceptance=["role checks present"],
        )
    )
    be.append(
        task(
            "BE-OBS",
            "Structured logs + correlation IDs",
            "backend",
            labels=["observability"],
            acceptance=["request id on logs"],
        )
    )
    be.append(
        task(
            "BE-TST",
            "Unit+Integration tests (Testcontainers)",
            "backend",
            blocked_by=["BE-API-KPI", "BE-API-REV"],
            acceptance=["pytest green", ">= minimal coverage"],
        )
    )

    # Frontend lane
    fe.append(
        task(
            "FE-DSN",
            "Shell/Layout/Routes",
            "frontend",
            acceptance=["routes wired", "base theme applied"],
        )
    )
    fe.append(
        task(
            "FE-TYPES",
            "openapi-typescript client",
            "frontend",
            acceptance=["types.ts generated", "typed client compiles"],
        )
    )
    fe.append(
        task(
            "FE-MOCKS",
            "MSW/Prism mocks",
            "frontend",
            acceptance=["mocks respond", "dev proxy configured"],
        )
    )
    fe += [
        task(
            "FE-KPI",
            "KPI cards + filters",
            "frontend",
            blocked_by=["FE-DSN", "FE-TYPES"],
            acceptance=["renders", "no console errors"],
        ),
        task(
            "FE-REV",
            "Revenue chart + range selectors",
            "frontend",
            blocked_by=["FE-DSN", "FE-TYPES"],
            acceptance=["renders", "no console errors"],
        ),
        task("FE-PLT", "Platform distribution (bars)", "frontend", blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-CAT", "Category ranks (bars)", "frontend", blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-CUS", "Customer insights panel", "frontend", blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-FDB", "Feedback timeline", "frontend", blocked_by=["FE-DSN", "FE-TYPES"]),
        task(
            "FE-EXP",
            "Exports (CSV/PNG)",
            "frontend",
            blocked_by=[
                "FE-KPI",
                "FE-REV",
                "FE-PLT",
                "FE-CAT",
                "FE-CUS",
                "FE-FDB",
            ],
            acceptance=["CSV downloads"],
        ),
    ]
    fe.append(
        task(
            "FE-A11Y-PERF",
            "WCAG AA + code-split/memoize",
            "frontend",
            labels=["a11y", "performance"],
        )
    )
    fe.append(
        task(
            "FE-TST",
            "Component + E2E smoke",
            "frontend",
            blocked_by=["FE-KPI", "FE-REV"],
            acceptance=["tests green"],
        )
    )

    return {"backend": be, "frontend": fe}


def render_plan_md(spec, plan: Dict[str, List[Dict]]) -> str:
    lines: List[str] = []
    lines.append(f"# PLAN — {spec.name}\n")
    lines.append(
        f"Industry: {spec.industry} | Type: {spec.project_type} | Frontend: {spec.frontend} | Backend: {spec.backend}\n"
    )
    lines.append("## Lanes\n")
    for lane in ("backend", "frontend"):
        lines.append(f"### Lane: {lane}\n")
        for t in plan[lane]:
            bdeps = ", ".join(t["blocked_by"]) if t["blocked_by"] else "-"
            lines.append(f"- [{t['id']}] {t['title']} (blocked_by: {bdeps})")
        lines.append("")
    lines.append("## Conflicts & Guardrails\n")
    lines.append(
        "- Ports: FE 3000, BE 8000 (configurable)\n- Migrations vs seed/tests: lock sequencing\n- Secrets: no plaintext; env-injection only\n"
    )
    lines.append("## Next Triggers\n")
    lines.append(
        "- RUN_BE and RUN_FE in parallel (≤3 concurrent per lane)\n- CSAN if blocked\n- QA for completed scope\n- PR: artifacts + acceptance (STOP, no deploy)\n"
    )
    return "\n".join(lines)


def main() -> None:
    args = parse_args()
    spec = BriefParser(args.brief).parse()
    plan = build_plan(spec)

    # Write tasks.json
    tasks_json_path = Path(args.out).with_suffix(".tasks.json")
    tasks_json_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")

    # Write PLAN.md
    plan_md = render_plan_md(spec, plan)
    Path(args.out).write_text(plan_md, encoding="utf-8")

    print(f"Wrote {args.out} and {tasks_json_path}")


if __name__ == "__main__":
    main()
