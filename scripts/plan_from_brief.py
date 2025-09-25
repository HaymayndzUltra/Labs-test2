#!/usr/bin/env python3
"""
Generate PLAN.md and tasks.json from a brief.md.
No deploy. No code edits. Outputs are artifacts only.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass, field
from pathlib import Path
import re
from typing import Dict, Iterable, List, Optional

from project_generator.core.brief_parser import BriefParser


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate FE/BE plan artifacts from brief.md")
    p.add_argument("--brief", required=True, help="Path to brief.md")
    p.add_argument(
        "--out",
        default="PLAN.md",
        help="Path to write PLAN.md (tasks.json will be co-located)",
    )
    p.add_argument(
        "--config",
        help="Optional workflow.config.json to merge capability flags with the parsed brief",
    )
    return p.parse_args()


@dataclass
class Task:
    id: str
    title: str
    area: str
    blocked_by: Iterable[str] = field(default_factory=list)
    labels: Iterable[str] = field(default_factory=list)
    estimate: str = "1d"
    acceptance: Iterable[str] = field(default_factory=list)
    dod: Iterable[str] = field(default_factory=list)

    def as_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "area": self.area,
            "estimate": self.estimate,
            "blocked_by": list(self.blocked_by),
            "labels": list(self.labels),
            "acceptance": list(self.acceptance),
            "dod": list(self.dod),
            "state": "pending",
        }


def _slugify(prefix: str, value: str, max_tokens: int = 3) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    tokens = [tok for tok in slug.split("-") if tok]
    if not tokens:
        tokens = ["feature"]
    tokens = tokens[:max_tokens]
    joined = "-".join(tok.upper() for tok in tokens)
    return f"{prefix}-{joined}"


def _feature_area(feature: str, project_type: str, frontend: str, backend: str) -> str:
    backend_signals = {
        "api",
        "service",
        "checkout",
        "payment",
        "billing",
        "analytics",
        "report",
        "data",
        "inventory",
        "integration",
        "workflow",
        "automation",
    }
    frontend_signals = {
        "page",
        "dashboard",
        "ui",
        "layout",
        "portal",
        "form",
        "component",
        "screen",
    }
    feature_lower = feature.lower()
    if backend != "none" and (
        project_type in {"api", "microservices"}
        or any(sig in feature_lower for sig in backend_signals)
    ):
        return "backend"
    if frontend != "none" and any(sig in feature_lower for sig in frontend_signals):
        return "frontend"
    # Default to backend for data-heavy features, frontend otherwise
    return "backend" if backend != "none" else "frontend"


def _feature_tasks(
    features: Iterable[str],
    project_type: str,
    frontend: str,
    backend: str,
) -> Dict[str, List[Task]]:
    buckets: Dict[str, List[Task]] = {"backend": [], "frontend": []}
    for feature in features:
        area = _feature_area(feature, project_type, frontend, backend)
        task_id = _slugify("BE-FTR" if area == "backend" else "FE-FTR", feature)
        title = f"Implement feature: {feature}"
        acceptance = ["acceptance criteria captured from brief"]
        if area == "backend":
            acceptance.append("API contract documented")
        else:
            acceptance.append("UI reviewed with design requirements")
        buckets[area].append(
            Task(
                id=task_id,
                title=title,
                area=area,
                acceptance=acceptance,
                labels=["feature"],
            )
        )
    return buckets


def _normalize_compliance(values: Optional[Iterable[str]]) -> List[str]:
    if not values:
        return []
    if isinstance(values, str):  # type: ignore[arg-type]
        return [v.strip().lower() for v in values.split(",") if v.strip()]
    return [str(v).strip().lower() for v in values if str(v).strip()]


def _compliance_tasks(compliance: Iterable[str], area: str) -> List[Task]:
    tasks: List[Task] = []
    for item in compliance:
        label = item.upper()
        if label == "":
            continue
        prefix = "BE" if area == "backend" else "FE"
        task_id = f"{prefix}-COMP-{label.replace('-', '_')}"
        title = f"Ensure {item.upper()} controls ({area})"
        acceptance = [f"{item.upper()} requirements validated"]
        tasks.append(
            Task(
                id=task_id,
                title=title,
                area=area,
                acceptance=acceptance,
                labels=["compliance"],
            )
        )
    return tasks


def _backend_core_tasks(spec, workflow: Optional[Dict]) -> List[Task]:
    if spec.backend == "none":
        return []

    capabilities = workflow or {}
    database_enabled = spec.database != "none"
    auth_enabled = (spec.auth != "none") or bool(capabilities.get("auth"))
    observability_required = capabilities.get("observability", True)

    tasks: List[Task] = []
    if database_enabled:
        tasks.append(
            Task(
                id="BE-SCHEMA",
                title="Design and document database schema",
                area="backend",
                acceptance=["ERD drafted", "tables + relationships defined"],
            )
        )
        tasks.append(
            Task(
                id="BE-SEED",
                title="Create seed loaders / fixtures",
                area="backend",
                blocked_by=["BE-SCHEMA"],
                acceptance=["seed scripts execute", "sample data available"],
            )
        )

    if spec.project_type in {"api", "fullstack", "microservices"}:
        tasks.append(
            Task(
                id="BE-DOMAIN",
                title="Model domain services & aggregates",
                area="backend",
                blocked_by=["BE-SEED"] if database_enabled else [],
                acceptance=["domain models stable", "business invariants captured"],
            )
        )
        tasks.append(
            Task(
                id="BE-API-CONTRACT",
                title="Define API contract & versioning strategy",
                area="backend",
                blocked_by=["BE-DOMAIN"],
                acceptance=["OpenAPI drafted", "error models documented"],
            )
        )

    if auth_enabled:
        tasks.append(
            Task(
                id="BE-AUTH",
                title=f"Implement auth integration ({spec.auth})",
                area="backend",
                acceptance=["role policies enforced", "token validation in place"],
                labels=["security"],
            )
        )

    if observability_required:
        tasks.append(
            Task(
                id="BE-OBS",
                title="Instrument logging/metrics/tracing",
                area="backend",
                acceptance=["structured logs", "trace ids propagated"],
                labels=["observability"],
            )
        )

    tasks.append(
        Task(
            id="BE-TESTS",
            title="Unit/integration test suite",
            area="backend",
            acceptance=["tests passing", "coverage threshold met"],
            labels=["testing"],
        )
    )
    return tasks


def _frontend_core_tasks(spec, workflow: Optional[Dict]) -> List[Task]:
    if spec.frontend == "none":
        return []

    capabilities = workflow or {}
    design_system_required = capabilities.get("design_system", True)
    accessibility_required = capabilities.get("accessibility", True)

    tasks: List[Task] = [
        Task(
            id="FE-SCAFFOLD",
            title="Bootstrap routing/layout",
            area="frontend",
            acceptance=["routes wired", "shared layout established"],
        ),
        Task(
            id="FE-DATA",
            title="Configure API client / data layer",
            area="frontend",
            blocked_by=["FE-SCAFFOLD"],
            acceptance=["client typed", "error states handled"],
        ),
    ]

    if design_system_required:
        tasks.append(
            Task(
                id="FE-DESIGN",
                title="Apply design system & theming",
                area="frontend",
                blocked_by=["FE-SCAFFOLD"],
                acceptance=["base styles applied", "token usage documented"],
            )
        )

    if accessibility_required:
        tasks.append(
            Task(
                id="FE-A11Y",
                title="Accessibility + performance audit",
                area="frontend",
                acceptance=["WCAG AA checklist", "lighthouse ≥ 90"],
                labels=["a11y", "performance"],
            )
        )

    tasks.append(
        Task(
            id="FE-TESTS",
            title="Component/e2e smoke tests",
            area="frontend",
            blocked_by=["FE-DATA"],
            acceptance=["tests passing"],
            labels=["testing"],
        )
    )
    return tasks


def build_plan(spec, workflow_config: Optional[Dict] = None) -> Dict[str, List[Dict]]:
    """Build a plan that adapts to the parsed brief and workflow flags."""

    workflow_config = workflow_config or {}
    backend_lane: List[Task] = _backend_core_tasks(spec, workflow_config)
    frontend_lane: List[Task] = _frontend_core_tasks(spec, workflow_config)

    feature_tasks = _feature_tasks(spec.features, spec.project_type, spec.frontend, spec.backend)
    backend_lane.extend(feature_tasks["backend"])
    frontend_lane.extend(feature_tasks["frontend"])

    compliance_sources = _normalize_compliance(workflow_config.get("compliance"))
    if not compliance_sources:
        compliance_sources = _normalize_compliance(spec.compliance)
    if spec.backend != "none":
        backend_lane.extend(_compliance_tasks(compliance_sources, "backend"))
    if spec.frontend != "none":
        frontend_lane.extend(_compliance_tasks(compliance_sources, "frontend"))

    plan = {
        "backend": [task.as_dict() for task in backend_lane],
        "frontend": [task.as_dict() for task in frontend_lane],
    }

    # Ensure empty lanes are represented for downstream consumers
    if not plan["backend"]:
        plan["backend"] = []
    if not plan["frontend"]:
        plan["frontend"] = []

    return plan


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
    workflow_config = None
    if args.config:
        config_path = Path(args.config)
        if config_path.exists():
            workflow_config = json.loads(config_path.read_text(encoding="utf-8"))
        else:
            print(f"[plan_from_brief] config not found: {config_path}")
    plan = build_plan(spec, workflow_config)

    # Write tasks.json
    tasks_json_path = Path(args.out).with_suffix(".tasks.json")
    tasks_json_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")

    # Write PLAN.md
    plan_md = render_plan_md(spec, plan)
    Path(args.out).write_text(plan_md, encoding="utf-8")

    print(f"Wrote {args.out} and {tasks_json_path}")


if __name__ == "__main__":
    main()
