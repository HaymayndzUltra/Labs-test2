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
from typing import Any, Callable, Dict, Iterable, List, Sequence, Union

from project_generator.core.brief_parser import BriefParser
from project_generator.core.brief_parser import ScaffoldSpec


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate FE/BE plan artifacts from brief.md")
    p.add_argument("--brief", required=True, help="Path to brief.md")
    p.add_argument("--out", default="PLAN.md", help="Path to write PLAN.md (tasks.json will be co-located)")
    return p.parse_args()


@dataclass
class TaskTemplate:
    """Structured template that can render a lane task for the supplied spec."""

    id: str
    title: str
    area: str
    blocked_by: Union[Sequence[str], Callable[[ScaffoldSpec], Sequence[str]]] = field(
        default_factory=list
    )
    labels: Sequence[str] = field(default_factory=list)
    estimate: str = "1d"
    acceptance: Sequence[str] = field(default_factory=list)
    dod: Sequence[str] = field(default_factory=list)
    condition: Callable[[ScaffoldSpec], bool] = lambda spec: True

    def render(self, spec: ScaffoldSpec) -> Dict[str, Any]:
        fmt = {"spec": spec}

        def _format(values: Iterable[str]) -> List[str]:
            return [v.format_map(fmt) for v in values]

        blocked_by = self.blocked_by(spec) if callable(self.blocked_by) else self.blocked_by
        return {
            "id": self.id,
            "title": self.title.format_map(fmt),
            "area": self.area,
            "estimate": self.estimate,
            "blocked_by": list(blocked_by),
            "labels": list(self.labels),
            "acceptance": _format(self.acceptance),
            "dod": _format(self.dod),
            "state": "pending",
        }


def _compliance_flags(spec: ScaffoldSpec) -> set[str]:
    return {c.lower() for c in spec.compliance if c}


def _feature_flags(spec: ScaffoldSpec) -> set[str]:
    return {f.lower() for f in spec.features if f}


def _default_backend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "BE-SCH",
            "Design {spec.database} schema",
            "backend",
            acceptance=[
                "ERD drafted",
                "tables defined",
                "naming conventions applied",
            ],
            condition=lambda spec: spec.database != "none",
        ),
        TaskTemplate(
            "BE-SEED",
            "Seed loaders (CSV/mock)",
            "backend",
            blocked_by=["BE-SCH"],
            acceptance=["seed scripts run", "sample rows present"],
            condition=lambda spec: spec.database != "none",
        ),
        TaskTemplate(
            "BE-MDL",
            "Aggregate models aligned to primary KPIs",
            "backend",
            blocked_by=["BE-SEED"],
            acceptance=["views created", "query p95 < 400ms (seed)"],
            condition=lambda spec: spec.project_type != "web",
        ),
        TaskTemplate(
            "BE-API-CORE",
            "Expose {spec.backend} service endpoints",
            "backend",
            blocked_by=lambda spec: ["BE-MDL"]
            if spec.project_type != "web" and spec.database != "none"
            else [],
            acceptance=[
                "core endpoints implemented",
                "OpenAPI updated",
            ],
        ),
        TaskTemplate(
            "BE-AUTH",
            "Integrate {spec.auth} auth provider",
            "backend",
            labels=["security"],
            acceptance=["role checks present"],
            condition=lambda spec: spec.auth != "none",
        ),
        TaskTemplate(
            "BE-OBS",
            "Structured logs + correlation IDs",
            "backend",
            labels=["observability"],
            acceptance=["request id on logs"],
        ),
        TaskTemplate(
            "BE-TST",
            "Unit + integration tests",
            "backend",
            blocked_by=["BE-API-CORE"],
            acceptance=["pytest green", ">= minimal coverage"],
        ),
    ]


def _api_backend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "BE-DOMAIN",
            "Model domain objects and validation schemas",
            "backend",
            acceptance=["pydantic/domain schemas captured", "error responses documented"],
        ),
        TaskTemplate(
            "BE-RATE-LIMIT",
            "Add rate limiting and observability for {spec.backend} APIs",
            "backend",
            blocked_by=["BE-DOMAIN"],
            labels=["security"],
            acceptance=["throttling enforced", "metrics exported"],
        ),
        TaskTemplate(
            "BE-AUTH",
            "Integrate {spec.auth} auth provider",
            "backend",
            labels=["security"],
            acceptance=["role checks present"],
            condition=lambda spec: spec.auth != "none",
        ),
        TaskTemplate(
            "BE-DOCS",
            "Publish OpenAPI and postman collection",
            "backend",
            blocked_by=["BE-RATE-LIMIT"],
            acceptance=["OpenAPI committed", "client sdk generated"],
        ),
        TaskTemplate(
            "BE-TST",
            "Contract + integration tests",
            "backend",
            blocked_by=["BE-DOCS"],
            acceptance=["tests green", "newman suite recorded"],
        ),
    ]


def _compliance_backend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "BE-HIPAA",
            "HIPAA logging and PHI safeguards",
            "backend",
            labels=["compliance"],
            acceptance=["audit log enabled", "PHI masked in logs"],
            condition=lambda spec: "hipaa" in _compliance_flags(spec),
        ),
        TaskTemplate(
            "BE-PCI",
            "PCI DSS encryption + key rotation",
            "backend",
            labels=["compliance"],
            acceptance=["card data encrypted", "rotation policy documented"],
            condition=lambda spec: "pci" in _compliance_flags(spec),
        ),
        TaskTemplate(
            "BE-GDPR",
            "GDPR data export/delete flows",
            "backend",
            labels=["compliance"],
            acceptance=["export endpoint present", "delete workflow documented"],
            condition=lambda spec: "gdpr" in _compliance_flags(spec),
        ),
    ]


def _feature_backend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "BE-ML",
            "Serve machine learning predictions",
            "backend",
            labels=["ml"],
            acceptance=["model artifact versioned", "latency within SLA"],
            condition=lambda spec: "ml" in _feature_flags(spec),
        ),
        TaskTemplate(
            "BE-WORKFLOW",
            "Orchestrate workflow automation jobs",
            "backend",
            labels=["workflow"],
            acceptance=["scheduler configured", "idempotent runs"],
            condition=lambda spec: "workflow" in _feature_flags(spec),
        ),
    ]


def _default_frontend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "FE-DSN",
            "Shell/Layout/Routes for {spec.frontend}",
            "frontend",
            acceptance=["routes wired", "base theme applied"],
        ),
        TaskTemplate(
            "FE-TYPES",
            "Generate typed client from OpenAPI",
            "frontend",
            acceptance=["types.ts generated", "typed client compiles"],
        ),
        TaskTemplate(
            "FE-MOCKS",
            "MSW/Prism mocks",
            "frontend",
            acceptance=["mocks respond", "dev proxy configured"],
        ),
        TaskTemplate(
            "FE-DASH",
            "Implement analytics dashboards",
            "frontend",
            blocked_by=["FE-DSN", "FE-TYPES"],
            acceptance=["renders", "no console errors"],
        ),
        TaskTemplate(
            "FE-EXPORT",
            "Exports (CSV/PNG)",
            "frontend",
            blocked_by=["FE-DASH"],
            acceptance=["download works"],
        ),
        TaskTemplate(
            "FE-A11Y",
            "WCAG AA hardening",
            "frontend",
            labels=["a11y"],
        ),
        TaskTemplate(
            "FE-TST",
            "Component + E2E smoke",
            "frontend",
            blocked_by=["FE-DASH"],
            acceptance=["tests green"],
        ),
    ]


def _mobile_frontend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "FE-MOB-SHELL",
            "Mobile navigation + routing",
            "frontend",
            acceptance=["navigation flows connected", "deep link configured"],
        ),
        TaskTemplate(
            "FE-MOB-AUTH",
            "Wire {spec.auth} auth into mobile client",
            "frontend",
            acceptance=["login succeeds", "tokens persisted securely"],
            condition=lambda spec: spec.auth != "none",
        ),
        TaskTemplate(
            "FE-MOB-OFFLINE",
            "Offline persistence + sync",
            "frontend",
            acceptance=["cache seeded", "sync retries"],
            condition=lambda spec: "offline" in _feature_flags(spec),
        ),
        TaskTemplate(
            "FE-MOB-TST",
            "Device + integration tests",
            "frontend",
            acceptance=["tests green"],
        ),
    ]


def _feature_frontend_templates() -> List[TaskTemplate]:
    return [
        TaskTemplate(
            "FE-REPORTS",
            "Interactive reporting widgets",
            "frontend",
            blocked_by=["FE-DSN", "FE-TYPES"],
            acceptance=["filters persist", "downloads available"],
            condition=lambda spec: "reporting" in _feature_flags(spec),
        ),
        TaskTemplate(
            "FE-WORKFLOW",
            "Workflow builder UI",
            "frontend",
            labels=["workflow"],
            blocked_by=["FE-DSN"],
            acceptance=["steps reorderable", "state persisted"],
            condition=lambda spec: "workflow" in _feature_flags(spec),
        ),
    ]


def _render_lane(spec: ScaffoldSpec, templates: List[TaskTemplate]) -> List[Dict[str, Any]]:
    lane: List[Dict[str, Any]] = []
    for template in templates:
        if template.condition(spec):
            lane.append(template.render(spec))
    return lane


def build_plan(spec: ScaffoldSpec) -> Dict[str, List[Dict[str, Any]]]:
    backend_lane: List[Dict[str, Any]]
    if spec.backend == "none":
        backend_lane = []
    elif spec.project_type == "api":
        backend_lane = _render_lane(
            spec,
            _api_backend_templates() + _compliance_backend_templates() + _feature_backend_templates(),
        )
    else:
        backend_lane = _render_lane(
            spec,
            _default_backend_templates() + _compliance_backend_templates() + _feature_backend_templates(),
        )

    frontend_lane: List[Dict[str, Any]]
    if spec.frontend == "none" or spec.project_type == "api":
        frontend_lane = []
    elif spec.project_type == "mobile" or spec.frontend == "expo":
        frontend_lane = _render_lane(
            spec,
            _mobile_frontend_templates() + _feature_frontend_templates(),
        )
    else:
        frontend_lane = _render_lane(
            spec,
            _default_frontend_templates() + _feature_frontend_templates(),
        )

    return {"backend": backend_lane, "frontend": frontend_lane}


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
