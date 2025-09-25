#!/usr/bin/env python3
"""
Generate PLAN.md and tasks.json from a brief.md.
No deploy. No code edits. Outputs are artifacts only.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import replace
from pathlib import Path
from typing import Any, Dict, Iterable, List, Sequence

from project_generator.core.brief_parser import BriefParser, ScaffoldSpec


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate FE/BE plan artifacts from brief.md")
    p.add_argument("--brief", required=True, help="Path to brief.md")
    p.add_argument("--out", default="PLAN.md", help="Path to write PLAN.md (tasks.json will be co-located)")
    p.add_argument(
        "--config",
        help="Optional workflow.config.json override to align with lifecycle planning",
    )
    return p.parse_args()


Task = Dict[str, Any]


def task(
    id_: str,
    title: str,
    area: str,
    *,
    blocked_by: Sequence[str] | None = None,
    labels: Sequence[str] | None = None,
    estimate: str = "1d",
    acceptance: Sequence[str] | None = None,
    dod: Sequence[str] | None = None,
) -> Task:
    return {
        "id": id_,
        "title": title,
        "area": area,
        "estimate": estimate,
        "blocked_by": list(blocked_by or []),
        "labels": list(labels or []),
        "acceptance": list(acceptance or []),
        "dod": list(dod or []),
        "state": "pending",
    }


def apply_workflow_overrides(spec: ScaffoldSpec, workflow_config: Dict[str, Any] | None) -> ScaffoldSpec:
    if not workflow_config:
        return spec
    overrides: Dict[str, Any] = {}
    scalar_fields = {
        "name",
        "industry",
        "project_type",
        "frontend",
        "backend",
        "database",
        "auth",
        "deploy",
    }
    for field in scalar_fields:
        value = workflow_config.get(field)
        if isinstance(value, str) and value.strip():
            overrides[field] = value.strip().lower()
    if "compliance" in workflow_config:
        comp_val = workflow_config["compliance"]
        if isinstance(comp_val, str):
            overrides["compliance"] = [c.strip().lower() for c in comp_val.split(",") if c.strip()]
        elif isinstance(comp_val, Iterable):
            overrides["compliance"] = [str(c).strip().lower() for c in comp_val if str(c).strip()]
    if "features" in workflow_config:
        feat_val = workflow_config["features"]
        if isinstance(feat_val, str):
            overrides["features"] = [f.strip() for f in feat_val.split(",") if f.strip()]
        elif isinstance(feat_val, Iterable):
            overrides["features"] = [str(f).strip() for f in feat_val if str(f).strip()]
    if not overrides:
        return spec
    return replace(spec, **overrides)


def _backend_core_tasks(spec: ScaffoldSpec) -> List[Task]:
    tasks: List[Task] = []
    if spec.backend == "none":
        return tasks

    if spec.database != "none":
        tasks.extend(
            [
                task(
                    "BE-SCH",
                    f"Design {spec.database} schema",
                    "backend",
                    acceptance=[
                        "ERD drafted",
                        "tables defined",
                        f"naming conventions applied for {spec.database}",
                    ],
                ),
                task(
                    "BE-SEED",
                    "Seed loaders (CSV/mock)",
                    "backend",
                    blocked_by=["BE-SCH"],
                    acceptance=["seed scripts run", "sample rows present"],
                ),
                task(
                    "BE-MDL",
                    "Aggregates/materialized views",
                    "backend",
                    blocked_by=["BE-SEED"],
                    acceptance=["views created", "query p95 < 400ms (seed)"],
                ),
            ]
        )

    feature_endpoints = _select_backend_endpoints(spec)
    for idx, endpoint in enumerate(feature_endpoints, 1):
        deps = ["BE-MDL"] if spec.database != "none" else []
        tasks.append(
            task(
                f"BE-API-{idx:02d}",
                endpoint,
                "backend",
                blocked_by=deps,
                acceptance=["OpenAPI updated", "contract tests pass"],
            )
        )

    if spec.auth != "none":
        tasks.append(
            task(
                "BE-AUTH",
                f"{spec.auth.title()} integration & RBAC",
                "backend",
                labels=["security"],
                acceptance=["role checks present", "token validation tested"],
            )
        )

    tasks.append(
        task(
            "BE-OBS",
            "Structured logs + correlation IDs",
            "backend",
            labels=["observability"],
            acceptance=["request id on logs"],
        )
    )

    tasks.append(
        task(
            "BE-TST",
            "Unit + integration test suite",
            "backend",
            blocked_by=[t["id"] for t in tasks if t["id"].startswith("BE-API-")][:2],
            acceptance=["pytest green", ">= minimal coverage"],
        )
    )

    for compliance_task in _compliance_tasks(spec, area="backend"):
        tasks.append(compliance_task)

    for feature_task in _feature_specific_backend_tasks(spec):
        tasks.append(feature_task)

    return tasks


def _select_backend_endpoints(spec: ScaffoldSpec) -> List[str]:
    if spec.project_type == "api":
        base_endpoints = ["Expose core domain endpoints"]
    else:
        base_endpoints = [
            "GET /api/v1/kpis",
            "GET /api/v1/revenue",
            "GET /api/v1/categories",
            "GET /api/v1/platforms",
            "GET /api/v1/feedback",
        ]

    keywords = {
        "billing": "POST /api/v1/billing/charges",
        "ai": "POST /api/v1/assistant/complete",
        "notifications": "POST /api/v1/notifications",
        "realtime": "WS /events stream",
        "analytics": "GET /api/v1/analytics/summary",
        "reports": "GET /api/v1/reports/export",
    }
    for feature in spec.features:
        normalized = feature.lower()
        for key, endpoint in keywords.items():
            if key in normalized and endpoint not in base_endpoints:
                base_endpoints.append(endpoint)

    if spec.project_type == "api" and len(base_endpoints) == 1:
        base_endpoints.extend(
            [
                "GET /api/v1/health",
                "GET /api/v1/status",
            ]
        )

    return base_endpoints


def _feature_specific_backend_tasks(spec: ScaffoldSpec) -> List[Task]:
    tasks: List[Task] = []
    feature_map = {
        "audit": task(
            "BE-AUDIT",
            "Persistent audit log",
            "backend",
            labels=["compliance"],
            acceptance=["immutable trail", "admin review endpoint"],
        ),
        "realtime": task(
            "BE-REALTIME",
            "Realtime gateway (WebSockets/pub-sub)",
            "backend",
            labels=["performance"],
            acceptance=["fan-out load tested"],
        ),
        "ml": task(
            "BE-ML",
            "Model inference endpoint",
            "backend",
            labels=["ml"],
            acceptance=["latency < 800ms", "fallback path present"],
        ),
    }
    for feature in spec.features:
        key = feature.lower()
        for matcher, ft_task in feature_map.items():
            if matcher in key and ft_task not in tasks:
                tasks.append(ft_task)
    return tasks


def _frontend_core_tasks(spec: ScaffoldSpec) -> List[Task]:
    tasks: List[Task] = []
    if spec.frontend == "none" or spec.project_type == "api":
        return tasks

    tasks.extend(
        [
            task(
                "FE-DSN",
                "Shell/Layout/Routes",
                "frontend",
                acceptance=["routes wired", "base theme applied"],
            ),
            task(
                "FE-TYPES",
                "API client generation",
                "frontend",
                acceptance=["types generated", "typed client compiles"],
            ),
            task(
                "FE-MOCKS",
                "Mock service worker / API mocks",
                "frontend",
                acceptance=["mocks respond", "dev proxy configured"],
            ),
        ]
    )

    analytics_components = [
        ("FE-KPI", "KPI cards + filters"),
        ("FE-REV", "Revenue chart + range selectors"),
        ("FE-PLT", "Platform distribution (bars)"),
        ("FE-CAT", "Category ranks (bars)"),
        ("FE-FDB", "Feedback timeline"),
    ]
    for tid, title in analytics_components:
        tasks.append(
            task(
                tid,
                title,
                "frontend",
                blocked_by=["FE-DSN", "FE-TYPES"],
                acceptance=["renders", "no console errors"],
            )
        )

    if "mobile" in (f.lower() for f in spec.features):
        tasks.append(
            task(
                "FE-RESP",
                "Responsive layout / mobile optimisations",
                "frontend",
                labels=["ux"],
                acceptance=["lighthouse mobile ≥ 80"],
            )
        )

    tasks.append(
        task(
            "FE-EXP",
            "Exports (CSV/PNG)",
            "frontend",
            blocked_by=[t["id"] for t in tasks if t["id"].startswith("FE-") and t["id"] not in {"FE-DSN", "FE-TYPES", "FE-MOCKS"}],
            acceptance=["CSV downloads"],
        )
    )

    tasks.append(
        task(
            "FE-A11Y-PERF",
            "WCAG AA + performance budget",
            "frontend",
            labels=["a11y", "performance"],
        )
    )
    tasks.append(
        task(
            "FE-TST",
            "Component + E2E smoke",
            "frontend",
            blocked_by=["FE-KPI", "FE-REV"],
            acceptance=["tests green"],
        )
    )

    for compliance_task in _compliance_tasks(spec, area="frontend"):
        tasks.append(compliance_task)

    return tasks


def _compliance_tasks(spec: ScaffoldSpec, area: str) -> List[Task]:
    compliance_map = {
        "hipaa": task(
            f"{area.upper()}-HIPAA",
            "HIPAA safeguards implementation",
            area,
            labels=["compliance"],
            acceptance=["logging PHI access", "BAA reviewed"],
        ),
        "pci": task(
            f"{area.upper()}-PCI",
            "PCI DSS controls",
            area,
            labels=["compliance"],
            acceptance=["encryption at rest/in transit verified"],
        ),
        "gdpr": task(
            f"{area.upper()}-GDPR",
            "GDPR data subject workflows",
            area,
            labels=["compliance"],
            acceptance=["erasure + export flows covered"],
        ),
        "soc2": task(
            f"{area.upper()}-SOC2",
            "SOC2 audit evidence",
            area,
            labels=["compliance"],
            acceptance=["controls mapped", "evidence stored"],
        ),
    }
    tasks: List[Task] = []
    for rule in spec.compliance:
        key = rule.lower()
        if key in compliance_map:
            tasks.append(compliance_map[key])
    return tasks


def build_plan(spec: ScaffoldSpec, workflow_config: Dict[str, Any] | None = None) -> Dict[str, List[Task]]:
    effective_spec = apply_workflow_overrides(spec, workflow_config)

    backend_lane = _backend_core_tasks(effective_spec)
    frontend_lane = _frontend_core_tasks(effective_spec)

    lanes = {
        "backend": backend_lane,
        "frontend": frontend_lane,
    }

    # honour workflow config lane disablement
    disabled_lanes = {
        lane
        for lane, enabled in (workflow_config or {}).get("lanes", {}).items()
        if not enabled
    }
    for lane in disabled_lanes:
        if lane in lanes:
            lanes[lane] = []

    return lanes


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
    workflow_cfg: Dict[str, Any] | None = None
    if args.config:
        cfg_path = Path(args.config)
        if not cfg_path.exists():
            raise FileNotFoundError(f"Workflow config not found: {cfg_path}")
        workflow_cfg = json.loads(cfg_path.read_text(encoding="utf-8"))

    plan = build_plan(spec, workflow_cfg)

    # Write tasks.json
    tasks_json_path = Path(args.out).with_suffix(".tasks.json")
    tasks_json_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")

    # Write PLAN.md
    plan_md = render_plan_md(spec, plan)
    Path(args.out).write_text(plan_md, encoding="utf-8")

    print(f"Wrote {args.out} and {tasks_json_path}")


if __name__ == "__main__":
    main()
