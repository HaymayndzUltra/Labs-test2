#!/usr/bin/env python3
"""Pre-lifecycle roadmap generator with capability-aware branching."""

from __future__ import annotations

import argparse
import json
import os
import shlex
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from project_generator.core.brief_parser import BriefParser, ScaffoldSpec  # type: ignore[misc]
from scripts.plan_from_brief import apply_workflow_overrides, build_plan  # type: ignore[misc]


@dataclass
class ChecklistItem:
    description: str
    command: str | None = None
    requires: Tuple[Path, ...] = ()
    optional: bool = False


@dataclass
class Stage:
    title: str
    items: List[ChecklistItem] = field(default_factory=list)


@dataclass
class CommandResult:
    stage: str
    description: str
    command: str
    returncode: int


class ScriptLocator:
    """Utility to discover scripts relative to the repo root."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self._cache: Dict[str, Path] = {}

    def path(self, name: str) -> Path:
        if name not in self._cache:
            matches = sorted((self.root / "scripts").rglob(name))
            if not matches:
                raise FileNotFoundError(f"Unable to locate script '{name}' under {self.root / 'scripts'}")
            self._cache[name] = matches[0]
        return self._cache[name]

    def rel(self, name: str) -> Path:
        return self.path(name).relative_to(self.root)


def shell_join(parts: Sequence[str]) -> str:
    return " ".join(shlex.quote(str(p)) for p in parts)


def format_lane(lane: List[Dict]) -> List[str]:
    entries: List[str] = []
    for idx, task in enumerate(lane, 1):
        blockers = ", ".join(task["blocked_by"]) if task["blocked_by"] else "none"
        acceptance = ", ".join(task["acceptance"]) if task["acceptance"] else "see acceptance criteria"
        entries.append(
            f"{idx:02d}. {task['id']}: {task['title']} (blocked_by: {blockers}; acceptance: {acceptance})"
        )
    return entries


def artifact_item(description: str, *paths: Path, optional: bool = False) -> ChecklistItem:
    return ChecklistItem(description=description, requires=tuple(paths), optional=optional)


def _build_environment_stage(
    cfg_path: Path,
    brief_path: Path,
    output_root: Path,
    spec: ScaffoldSpec,
) -> Stage:
    exports = shell_join(
        [
            f"NAME={spec.name}",
            f"INDUSTRY={spec.industry}",
            f"PROJECT_TYPE={spec.project_type}",
            f"FE={spec.frontend}",
            f"BE={spec.backend}",
            f"DB={spec.database}",
            f"OUTPUT_ROOT={output_root}",
        ]
    )
    description = (
        "Export automation variables before running lifecycle: "
        f"{exports} [optional: AUTH, DEPLOY, COMPLIANCE, FORCE_OUTPUT=1]"
    )
    return Stage(
        title="Environment & Inputs",
        items=[
            ChecklistItem("Install prerequisites: Python ≥3.11, Node.js ≥18, Docker, jq, rsync, sha256sum, git."),
            artifact_item(f"Confirm workflow config exists at {cfg_path}", cfg_path),
            artifact_item(f"Confirm brief exists at {brief_path}", brief_path),
            ChecklistItem(
                "Verify workflow.config.json values "
                f"(industry={spec.industry}, project_type={spec.project_type}, frontend={spec.frontend}, "
                f"backend={spec.backend}, database={spec.database}, auth={spec.auth}, deploy={spec.deploy}, "
                f"compliance={','.join(spec.compliance) if spec.compliance else 'none'})."
            ),
            ChecklistItem(description),
        ],
    )


def _build_planning_stage(
    locator: ScriptLocator,
    brief_path: Path,
    project_dir: Path,
    plan_path: Path,
    plan_tasks: Path,
    workflow_cfg_path: Path | None,
) -> Stage:
    plan_cmd_parts = ["python", str(locator.rel("plan_from_brief.py")), "--brief", str(brief_path), "--out", str(plan_path)]
    if workflow_cfg_path is not None:
        plan_cmd_parts.extend(["--config", str(workflow_cfg_path)])
    plan_cmd = shell_join(plan_cmd_parts)

    validate_cmd = shell_join([
        "python",
        str(locator.rel("validate_tasks.py")),
        "--input",
        str(plan_tasks),
    ])

    return Stage(
        title="Planning & Alignment",
        items=[
            ChecklistItem("Review brief acceptance criteria, compliance asks, and stakeholder priorities."),
            ChecklistItem(f"Generate planning artifacts: {plan_cmd}", command=plan_cmd),
            artifact_item(f"Ensure PLAN.md exists at {plan_path}", plan_path),
            artifact_item(f"Ensure PLAN.tasks.json exists at {plan_tasks}", plan_tasks),
            ChecklistItem(f"Validate DAG topology: {validate_cmd}", command=validate_cmd, requires=(plan_tasks,)),
        ],
    )


def _build_preflight_stage(
    locator: ScriptLocator,
    spec: ScaffoldSpec,
    project_dir: Path,
    output_root: Path,
    compliance: Sequence[str],
) -> Stage:
    doctor_cmd = shell_join([
        "python",
        str(locator.rel("doctor.py")),
        "--strict",
    ])
    generator = locator.rel("generate_client_project.py")
    list_cmd = shell_join(
        [
            "python",
            str(generator),
            "--list-templates",
            "--name",
            spec.name,
            "--industry",
            spec.industry,
            "--project-type",
            spec.project_type,
        ]
    )

    select_parts = [
        "python",
        str(locator.rel("select_stacks.py")),
        "--industry",
        spec.industry,
        "--project-type",
        spec.project_type,
        "--frontend",
        spec.frontend,
        "--backend",
        spec.backend,
        "--database",
        spec.database,
        "--output",
        str(project_dir / "selection.json"),
        "--summary",
        str(project_dir / "evidence" / "stack-selection.md"),
    ]
    if spec.auth != "none":
        select_parts.extend(["--auth", spec.auth])
    if compliance:
        select_parts.extend(["--compliance", ",".join(compliance)])
    select_cmd = shell_join(select_parts)

    dry_run_parts = [
        "python",
        str(generator),
        "--dry-run",
        "--workers",
        "8",
        "--yes",
        "--name",
        spec.name,
        "--industry",
        spec.industry,
        "--project-type",
        spec.project_type,
        "--frontend",
        spec.frontend,
        "--backend",
        spec.backend,
        "--database",
        spec.database,
        "--output-dir",
        str(output_root),
    ]
    if spec.auth != "none":
        dry_run_parts.extend(["--auth", spec.auth])
    if spec.deploy not in {"n/a", "none"}:
        dry_run_parts.extend(["--deploy", spec.deploy])
    if compliance:
        dry_run_parts.extend(["--compliance", ",".join(compliance)])
    dry_run_cmd = shell_join(dry_run_parts)

    return Stage(
        title="Stack Preflight & Generation Prep",
        items=[
            ChecklistItem(f"Tooling doctor: {doctor_cmd}", command=doctor_cmd),
            ChecklistItem(f"Template discovery: {list_cmd}", command=list_cmd),
            ChecklistItem(
                f"Select stacks and capture evidence: {select_cmd}",
                command=select_cmd,
            ),
            ChecklistItem(
                "If select_stacks exits with code 3, resolve engine version mismatches before continuing."
            ),
            ChecklistItem(f"Preview scaffold (no writes): {dry_run_cmd}", command=dry_run_cmd),
        ],
    )


def _build_generation_stage(spec: ScaffoldSpec, output_root: Path, project_dir: Path) -> Stage:
    exports = [
        f"NAME={spec.name}",
        f"INDUSTRY={spec.industry}",
        f"PROJECT_TYPE={spec.project_type}",
        f"FE={spec.frontend}",
        f"BE={spec.backend}",
        f"DB={spec.database}",
        f"OUTPUT_ROOT={output_root}",
    ]
    if spec.auth != "none":
        exports.append(f"AUTH={spec.auth}")
    if spec.deploy not in {"n/a", "none"}:
        exports.append(f"DEPLOY={spec.deploy}")
    if spec.compliance:
        exports.append(f"COMPLIANCE={','.join(spec.compliance)}")
    lifecycle_cmd = shell_join(exports + ["make", "lifecycle"])

    return Stage(
        title="Full Scaffold Generation & Bootstrap",
        items=[
            ChecklistItem(
                f"Run lifecycle generator (stops on failure): {lifecycle_cmd}",
                command=lifecycle_cmd,
            ),
            artifact_item(f"Inspect generated project at {project_dir}", project_dir),
            artifact_item(
                "Ensure evidence/, PLAN.*, tasks.json, and dist/ artifacts exist",
                project_dir / "evidence",
                project_dir / "PLAN.md",
                project_dir / "PLAN.tasks.json",
                project_dir / "dist",
                optional=False,
            ),
            ChecklistItem("Capture generator logs and stack selection evidence for audit."),
        ],
    )


def _build_lane_stage(title: str, intro: str, lane: List[str]) -> Stage | None:
    if not lane:
        return None
    items = [ChecklistItem(intro)]
    items.extend(ChecklistItem(entry) for entry in lane)
    return Stage(title=title, items=items)


def _build_integration_stage(spec: ScaffoldSpec) -> Stage:
    items: List[ChecklistItem] = []
    if spec.database != "none":
        items.append(
            ChecklistItem(
                "Create/adjust migrations, apply them, and reseed sample data (aligns with BE schema tasks)."
            )
        )
    if spec.backend != "none":
        items.append(
            ChecklistItem(
                "Expose OpenAPI / typed clients once API endpoints are live; regenerate frontend types after changes."
            )
        )
    if spec.frontend != "none" and spec.project_type != "api":
        items.append(ChecklistItem("Update MSW/Prism mocks to match live responses."))
    items.append(ChecklistItem("Run smoke flows across dashboards/endpoints to confirm PLAN acceptance."))
    return Stage(title="Integration, Data, and Contract Validation", items=items)


def _build_quality_stage(
    locator: ScriptLocator,
    project_dir: Path,
    include_frontend: bool,
    include_backend: bool,
) -> Stage:
    items: List[ChecklistItem] = []
    if include_frontend:
        items.extend(
            [
                ChecklistItem(
                    "Frontend lint & formatting: `cd frontend && npm run lint && npx prettier --check`.")
            ,
                ChecklistItem(
                    "Frontend type check & unit tests: `cd frontend && npx tsc --noEmit && npm test -- --ci --coverage`."
                ),
            ]
        )
    if include_backend:
        items.extend(
            [
                ChecklistItem(
                    "Backend quality: run formatter/lint (black, flake8, eslint) appropriate for the generated stack."
                ),
                ChecklistItem(
                    "Backend tests & coverage: `cd backend && pytest --cov=app --cov-report=xml:../coverage/backend-coverage.xml`."
                ),
            ]
        )
    install_and_test = shell_join([
        f"PROJECT_ROOT={project_dir}",
        str(locator.rel("install_and_test.sh")),
    ])
    items.append(ChecklistItem(f"Aggregate stack-aware tests: {install_and_test}", command=install_and_test))
    items.append(
        ChecklistItem(
            f"Collect metrics: PROJECT_ROOT={project_dir} python {locator.rel('collect_coverage.py')} / collect_perf.py / scan_deps.py"
        )
    )
    items.append(
        ChecklistItem(
            f"Enforce gates: PROJECT_ROOT={project_dir} python {locator.rel('enforce_gates.py')}"
        )
    )
    return Stage(title="Quality Automation & Gates", items=items)


def _build_local_verification_stage(project_dir: Path, include_frontend: bool, include_backend: bool) -> Stage:
    items: List[ChecklistItem] = []
    if include_frontend:
        items.append(ChecklistItem("Run `cd frontend && npm run dev` for experiential QA."))
    if include_backend:
        items.append(ChecklistItem("Run backend dev server (uvicorn/stack default) for manual verification."))
    if include_frontend or include_backend:
        items.append(ChecklistItem("Execute API/UI smoke via Postman/Newman or Playwright as applicable."))
    items.append(
        ChecklistItem(
            "Run make pipeline-validate ENV=local once health endpoints exist to assert end-to-end readiness."
        )
    )
    return Stage(title="Local Verification & Developer Experience", items=items)


def _build_compliance_stage(
    locator: ScriptLocator,
    project_dir: Path,
    compliance: Sequence[str],
) -> Stage | None:
    if not compliance:
        return None
    build_pack = shell_join([
        f"PROJECT_ROOT={project_dir}",
        f"NAME={Path(project_dir).name}",
        str(locator.rel("build_submission_pack.sh")),
    ])
    validate_assets = shell_join([
        f"PROJECT_ROOT={project_dir}",
        "python",
        str(locator.rel("validate_compliance_assets.py")),
    ])
    check_docs = shell_join([
        f"PROJECT_ROOT={project_dir}",
        "python",
        str(locator.rel("check_compliance_docs.py")),
    ])
    items = [
        ChecklistItem(f"Package deliverables: {build_pack}", command=build_pack),
        ChecklistItem(f"Validate compliance assets: {validate_assets}", command=validate_assets),
        ChecklistItem(f"Optional doc scan: {check_docs}", command=check_docs, optional=True),
        ChecklistItem("Archive evidence/, dist/, coverage/, and reports/ for hand-off."),
    ]
    return Stage(title="Compliance, Evidence, and Packaging", items=items)


def _build_ci_stage(spec: ScaffoldSpec) -> Stage:
    items = [
        ChecklistItem(
            "Populate GitHub secrets/vars required by CI workflows (see .github/workflows)."
        ),
        ChecklistItem("Enforce production environment protection/approvals in GitHub."),
        ChecklistItem("Trigger ci-secrets-preflight and resolve missing configuration."),
        ChecklistItem("Review ci-lint/ci-test/ci-nox outputs to ensure repo-level checks pass."),
    ]
    return Stage(title="CI/CD Enablement", items=items)


def _build_deploy_stage(locator: ScriptLocator, spec: ScaffoldSpec) -> Stage | None:
    if spec.deploy in {"n/a", "none"}:
        return None
    health_cmd = shell_join([
        "python",
        str(locator.rel("health/check_deployment.py")),
        "--environment",
        "staging",
    ])
    items = [
        ChecklistItem("Staging: push to main to invoke deployment workflow."),
        ChecklistItem(f"Review staging deploy health via {health_cmd}.", command=health_cmd),
        ChecklistItem(
            "Production: trigger promotion workflow, ensure approvals granted, monitor verify-and-gate jobs."
        ),
        ChecklistItem(
            "Post deploy: download production validation reports and confirm smoke + newman tests passed."
        ),
        ChecklistItem(
            "If failures occur, invoke rollback scripts (backend/frontend) via GitHub Actions or manually."
        ),
    ]
    return Stage(title="Deploy & Promote", items=items)


def _build_observability_stage(spec: ScaffoldSpec, staging_urls: Dict[str, str], prod_urls: Dict[str, str]) -> Stage:
    items = [
        ChecklistItem("Schedule and monitor nightly observability workflows; ensure environment URLs stay current."),
    ]
    if spec.deploy not in {"n/a", "none"}:
        items.extend(
            [
                ChecklistItem(
                    f"Validate staging via make pipeline-validate with FRONTEND_URL={staging_urls['frontend']} API_URL={staging_urls['api']}"
                ),
                ChecklistItem(
                    f"Validate production via make pipeline-validate with FRONTEND_URL={prod_urls['frontend']} API_URL={prod_urls['api']}"
                ),
            ]
        )
    items.append(ChecklistItem("Feed reports/ and evidence/ into dashboards or MCP tools for ongoing compliance."))
    return Stage(title="Observability & Continuous Ops", items=items)


def _build_final_stage(project_dir: Path, spec: ScaffoldSpec) -> Stage:
    items = [
        ChecklistItem(
            f"Hand off dist/{spec.name}-submission, PLAN artifacts, selection.json, and compliance logs."
        ),
        ChecklistItem(
            f"Document residual risks or follow-ups in {project_dir / 'reports'} or IMPLEMENTATION_SUMMARY.md."
        ),
        ChecklistItem("Capture implementation retrospective and update workflow config/docs for future engagements."),
    ]
    return Stage(title="Final Delivery & Retrospective", items=items)


def build_stages(
    cfg_path: Path,
    brief_path: Path,
    output_root: Path,
    project_dir: Path,
    spec: ScaffoldSpec,
    workflow_cfg: Dict[str, object],
    lanes: Dict[str, List[Dict]],
) -> List[Stage]:
    locator = ScriptLocator(ROOT)
    plan_path = project_dir / "PLAN.md"
    plan_tasks = project_dir / "PLAN.tasks.json"

    compliance = list(spec.compliance)

    stages: List[Stage] = []
    stages.append(_build_environment_stage(cfg_path, brief_path, output_root, spec))
    stages.append(
        _build_planning_stage(
            locator,
            brief_path,
            project_dir,
            plan_path,
            plan_tasks,
            cfg_path if cfg_path.exists() else None,
        )
    )
    stages.append(
        _build_preflight_stage(locator, spec, project_dir, output_root, compliance)
    )
    stages.append(_build_generation_stage(spec, output_root, project_dir))

    frontend_lane = format_lane(lanes.get("frontend", []))
    backend_lane = format_lane(lanes.get("backend", []))

    frontend_stage = _build_lane_stage(
        "Frontend Implementation Sequence", f"Work inside {project_dir / 'frontend'} following tasks in order:", frontend_lane
    )
    backend_stage = _build_lane_stage(
        "Backend & Data Implementation Sequence",
        f"Work inside {project_dir / 'backend'} (and database/ if emitted) following tasks in order:",
        backend_lane,
    )
    if frontend_stage:
        stages.append(frontend_stage)
    if backend_stage:
        stages.append(backend_stage)

    stages.append(_build_integration_stage(spec))
    stages.append(
        _build_quality_stage(
            locator,
            project_dir,
            include_frontend=bool(frontend_lane),
            include_backend=bool(backend_lane),
        )
    )
    stages.append(
        _build_local_verification_stage(
            project_dir,
            include_frontend=bool(frontend_lane),
            include_backend=bool(backend_lane),
        )
    )
    compliance_stage = _build_compliance_stage(locator, project_dir, compliance)
    if compliance_stage:
        stages.append(compliance_stage)
    stages.append(_build_ci_stage(spec))
    deploy_stage = _build_deploy_stage(locator, spec)
    if deploy_stage:
        stages.append(deploy_stage)

    staging_urls = {
        "frontend": "${vars.FRONTEND_URL_STAGING}",
        "api": "${vars.API_URL_STAGING}",
        "db": "${vars.DB_URL_STAGING}",
    }
    prod_urls = {
        "frontend": "${vars.FRONTEND_URL_PRODUCTION}",
        "api": "${vars.API_URL_PRODUCTION}",
        "db": "${vars.DB_URL_PRODUCTION}",
    }
    stages.append(_build_observability_stage(spec, staging_urls, prod_urls))
    stages.append(_build_final_stage(project_dir, spec))

    return stages


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Print or execute the pre-lifecycle execution plan.")
    ap.add_argument("--name", help="Client/project name override")
    ap.add_argument("--config", default="workflow.config.json")
    ap.add_argument("--output-root", default="../_generated")
    ap.add_argument("--execute", action="store_true", help="Execute commands inline and report status")
    return ap.parse_args()


def main() -> int:
    args = parse_args()

    cfg_path = ROOT / args.config
    if not cfg_path.exists():
        print(f"[plan] config not found: {cfg_path}", file=sys.stderr)
        return 2

    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))

    name = args.name or os.environ.get("NAME") or cfg.get("name")
    if not name:
        print("[plan] NAME is required (pass --name, export NAME, or set workflow.config.json)", file=sys.stderr)
        return 2

    brief_path = ROOT / "docs" / "briefs" / name / "brief.md"
    if not brief_path.exists():
        print(f"[plan] brief not found: {brief_path}", file=sys.stderr)
        return 2

    spec = BriefParser(str(brief_path)).parse()
    effective_spec = apply_workflow_overrides(spec, cfg)
    lanes = build_plan(spec, cfg)

    output_root = (ROOT / args.output_root).resolve()
    project_dir = (output_root / name).resolve()

    stages = build_stages(cfg_path, brief_path, output_root, project_dir, effective_spec, cfg, lanes)

    exit_code = 0
    command_results: List[CommandResult] = []

    for stage_idx, stage in enumerate(stages, 1):
        print(f"{stage_idx}. {stage.title}")
        for item_idx, item in enumerate(stage.items, 1):
            missing = [path for path in item.requires if not path.exists()]
            status = ""
            if missing:
                status = " [MISSING: " + ", ".join(str(p) for p in missing) + "]"
                if not item.optional:
                    exit_code = max(exit_code, 1)
            print(f"   {stage_idx}.{item_idx} {item.description}{status}")
            if item.command:
                print(f"       command: {item.command}")
                if args.execute and not missing:
                    result = subprocess.run(item.command, shell=True, cwd=ROOT)
                    command_results.append(
                        CommandResult(stage.title, item.description, item.command, result.returncode)
                    )
                    if result.returncode != 0:
                        exit_code = max(exit_code, result.returncode)
        print()

    if args.execute and command_results:
        print("Command Summary:")
        for result in command_results:
            emoji = "✅" if result.returncode == 0 else "❌"
            print(f" {emoji} [{result.stage}] {result.description} -> {result.returncode}")
        print()

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
