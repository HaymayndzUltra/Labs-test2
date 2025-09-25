#!/usr/bin/env python3
"""Pre-lifecycle roadmap generator with validation and adaptive sequencing."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Iterable, List, Sequence

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from project_generator.core.brief_parser import BriefParser, ScaffoldSpec  # type: ignore[misc]

from scripts.plan_from_brief import build_plan  # noqa: E402


# ---------------------------------------------------------------------------
# Dataclasses modelling the checklist + validation metadata


@dataclass
class Check:
    description: str
    validator: Callable[[], bool]
    failure_message: str


@dataclass
class Command:
    description: str
    args: Sequence[str]


@dataclass
class ChecklistStep:
    title: str
    items: List[str]
    checks: List[Check] = field(default_factory=list)
    commands: List[Command] = field(default_factory=list)


@dataclass
class ChecklistContext:
    spec: ScaffoldSpec
    config: dict
    brief_path: Path
    project_dir: Path
    output_root: Path
    lanes: dict

    @property
    def has_frontend(self) -> bool:
        return bool(self.lanes.get("frontend"))

    @property
    def has_backend(self) -> bool:
        return bool(self.lanes.get("backend"))

    @property
    def has_database(self) -> bool:
        return self.spec.database != "none"

    @property
    def has_deploy(self) -> bool:
        deploy = (self.config.get("deploy") or self.spec.deploy or "").lower()
        return deploy not in {"", "n/a", "none"}

    @property
    def compliance_flags(self) -> List[str]:
        compliance = self.config.get("compliance") or self.spec.compliance
        if isinstance(compliance, str):
            compliance = [c.strip() for c in compliance.split(",") if c.strip()]
        return [c.lower() for c in compliance]


# ---------------------------------------------------------------------------
# Script discovery helpers


def resolve_script(script_name: str) -> Path:
    base = ROOT / "scripts"
    candidate = base / script_name
    if candidate.exists():
        return candidate
    matches = list(base.rglob(script_name))
    if not matches:
        raise FileNotFoundError(f"Unable to locate script '{script_name}' under {base}")
    return matches[0]


def _format_lane(lane: Iterable[dict]) -> List[str]:
    formatted: List[str] = []
    for task in lane:
        blockers = ", ".join(task["blocked_by"]) if task.get("blocked_by") else "none"
        acceptance = ", ".join(task.get("acceptance") or []) or "see acceptance criteria"
        formatted.append(
            f"{task['id']}: {task['title']} (blocked_by: {blockers}; acceptance: {acceptance})"
        )
    return formatted


# ---------------------------------------------------------------------------
# Checklist builder


class ChecklistBuilder:
    def __init__(self, ctx: ChecklistContext) -> None:
        self.ctx = ctx

    def build(self) -> List[ChecklistStep]:
        steps: List[ChecklistStep] = []
        steps.append(self._environment_inputs())
        steps.append(self._planning_alignment())
        steps.append(self._stack_preflight())
        steps.append(self._generation())

        if self.ctx.has_frontend:
            steps.append(self._frontend_lane())
        if self.ctx.has_backend:
            steps.append(self._backend_lane())
        if self.ctx.has_backend or self.ctx.has_database:
            integration = self._integration_stage()
            if integration:
                steps.append(integration)

        quality = self._quality_stage()
        if quality:
            steps.append(quality)

        local = self._local_verification()
        if local:
            steps.append(local)

        packaging = self._packaging_stage()
        if packaging:
            steps.append(packaging)

        steps.append(self._ci_stage())

        if self.ctx.has_deploy:
            steps.append(self._deploy_stage())
            steps.append(self._observability_stage())

        steps.append(self._final_delivery())
        return steps

    # ---- stage builders ----

    def _environment_inputs(self) -> ChecklistStep:
        cfg = self.ctx.config
        spec = self.ctx.spec
        return ChecklistStep(
            title="Environment & Inputs",
            items=[
                "Install prerequisites: Python ≥3.11, Node.js ≥18, Docker, jq, rsync, sha256sum, git.",
                f"Confirm brief exists at {self.ctx.brief_path}.",
                (
                    "Verify workflow.config.json values "
                    f"(industry={spec.industry}, project_type={spec.project_type}, frontend={spec.frontend}, "
                    f"backend={spec.backend}, database={spec.database}, auth={spec.auth}, "
                    f"deploy={cfg.get('deploy') or spec.deploy}, compliance={self.ctx.compliance_flags or ['none']})."
                ),
                (
                    "Export automation variables before running lifecycle: "
                    f"NAME={spec.name} INDUSTRY={spec.industry} PROJECT_TYPE={spec.project_type} "
                    f"FE={spec.frontend} BE={spec.backend} DB={spec.database} OUTPUT_ROOT={self.ctx.output_root}\n"
                    "   Optional: AUTH, DEPLOY, COMPLIANCE, NESTJS_ORM, FORCE_OUTPUT=1."
                ),
            ],
            checks=[
                Check(
                    description="workflow.config.json present",
                    validator=lambda cfg_path=ROOT
                    / "workflow.config.json": cfg_path.exists(),
                    failure_message="Expected workflow.config.json at repo root.",
                ),
                Check(
                    description="brief.md present",
                    validator=lambda brief=self.ctx.brief_path: brief.exists(),
                    failure_message=f"Brief missing at {self.ctx.brief_path}",
                ),
            ],
        )

    def _planning_alignment(self) -> ChecklistStep:
        project_dir = self.ctx.project_dir
        plan_md = project_dir / "PLAN.md"
        plan_tasks = project_dir / "PLAN.tasks.json"
        plan_script = resolve_script("plan_from_brief.py")
        validate_tasks = resolve_script("validate_tasks.py")

        return ChecklistStep(
            title="Planning & Alignment",
            items=[
                "Review brief acceptance criteria, compliance asks, and stakeholder priorities.",
                (
                    "Generate planning artifacts for reference (dry run here only): "
                    f"python {plan_script} --brief '{self.ctx.brief_path}' --out '{plan_md}'."
                ),
        
                (
                    "Validate DAG topology prior to generation: python "
                    f"{validate_tasks} --input '{plan_tasks}'."
                ),
                "Inspect PLAN.md lanes and resolve dependencies/blocked tasks before coding.",
            ],
            checks=[
                Check(
                    description="PLAN.tasks.json available",
                    validator=lambda path=plan_tasks: path.exists(),
                    failure_message=f"Run plan_from_brief.py to generate {plan_tasks} before validating tasks.",
                )
            ],
            commands=[
                Command(
                    description="plan_from_brief --help",
                    args=[sys.executable, str(plan_script), "--help"],
                ),
            ],
        )

    def _stack_preflight(self) -> ChecklistStep:
        spec = self.ctx.spec
        project_dir = self.ctx.project_dir
        doctor = resolve_script("doctor.py")
        generator = resolve_script("generate_client_project.py")
        select_stacks = resolve_script("select_stacks.py")

        evidence_summary = project_dir / "evidence" / "stack-selection.md"
        selection_json = project_dir / "selection.json"

        base_command = (
            f"NAME={spec.name} INDUSTRY={spec.industry} PROJECT_TYPE={spec.project_type} "
            f"FE={spec.frontend} BE={spec.backend} DB={spec.database} OUTPUT_ROOT={self.ctx.output_root}"
        )

        select_args = [
            sys.executable,
            str(select_stacks),
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
            str(selection_json),
            "--summary",
            str(evidence_summary),
        ]

        compliance_flags = [c for c in self.ctx.compliance_flags if c != "none"]
        for flag in compliance_flags:
            select_args.extend(["--compliance", flag])

        if spec.auth and spec.auth != "none":
            select_args.extend(["--auth", spec.auth])

        return ChecklistStep(
            title="Stack Preflight & Generation Prep",
            items=[
                f"Tooling doctor & template discovery: python {doctor} --strict",
                (
                    "Preflight stack selection and capture evidence: "
                    + " ".join(map(str, select_args))
                ),
                "If select_stacks exits with code 3, resolve engine version mismatches before continuing.",
                (
                    "Preview scaffold (no writes): "
                    f"python {generator} --dry-run --workers 8 --yes --name '{spec.name}' "
                    f"--industry '{spec.industry}' --project-type '{spec.project_type}' "
                    f"--frontend '{spec.frontend}' --backend '{spec.backend}' --database '{spec.database}' "
                    + (
                        f"--auth '{spec.auth}' "
                        if spec.auth and spec.auth != "none"
                        else ""
                    )
                    + (
                        f"--deploy '{self.ctx.config.get('deploy') or spec.deploy}' "
                        if self.ctx.has_deploy
                        else ""
                    )
                    + (
                        " " + " ".join(f"--compliance '{flag}'" for flag in compliance_flags)
                        if compliance_flags
                        else ""
                    )
                    + f" --output-dir '{self.ctx.output_root}'"
                ),
            ],
            checks=[
                Check(
                    description="stack selection evidence exists",
                    validator=lambda path=evidence_summary: path.exists(),
                    failure_message=(
                        f"Expected stack selection summary at {evidence_summary}. Run select_stacks.py first."
                    ),
                ),
            ],
            commands=[
                Command(
                    description="doctor --help",
                    args=[sys.executable, str(doctor), "--help"],
                ),
                Command(description="select_stacks --help", args=[sys.executable, str(select_stacks), "--help"]),
            ],
        )

    def _generation(self) -> ChecklistStep:
        spec = self.ctx.spec
        project_dir = self.ctx.project_dir
        checks = [
            Check(
                description="Generated project directory exists",
                validator=lambda path=project_dir: path.exists(),
                failure_message=f"Run make lifecycle to generate {project_dir}.",
            ),
            Check(
                description="PLAN.md emitted",
                validator=lambda path=project_dir / "PLAN.md": path.exists(),
                failure_message=f"Expected PLAN.md in {project_dir}.",
            ),
            Check(
                description="tasks.json emitted",
                validator=lambda path=project_dir / "PLAN.tasks.json": path.exists(),
                failure_message=f"Expected PLAN.tasks.json in {project_dir}.",
            ),
        ]

        evidence_dir = project_dir / "evidence"
        checks.append(
            Check(
                description="Evidence directory present",
                validator=lambda path=evidence_dir: path.exists(),
                failure_message=f"Generator did not create {evidence_dir}.",
            )
        )

        items = [
            (
                "When ready, run the one-shot generator (stops on any failure): "
                f"NAME={spec.name} INDUSTRY={spec.industry} PROJECT_TYPE={spec.project_type} "
                f"FE={spec.frontend} BE={spec.backend} DB={spec.database} OUTPUT_ROOT={self.ctx.output_root} make lifecycle"
            ),
            f"Inspect generated project at {project_dir}; confirm evidence/, PLAN.*, tasks.json, dist/ artifacts exist.",
            "Capture any generator logs or selection evidence for audit.",
        ]

        return ChecklistStep(
            title="Full Scaffold Generation & Bootstrap (queued automation)",
            items=items,
            checks=checks,
        )

    def _frontend_lane(self) -> ChecklistStep:
        lane_entries = _format_lane(self.ctx.lanes.get("frontend", []))
        project_dir = self.ctx.project_dir / "frontend"
        checks = [
            Check(
                description="Frontend workspace exists",
                validator=lambda path=project_dir: path.exists(),
                failure_message=f"Expected frontend workspace at {project_dir}",
            )
        ]
        return ChecklistStep(
            title="Frontend Implementation Sequence (execute in project workspace)",
            items=[f"Work inside {project_dir} following tasks in order:"] + lane_entries,
            checks=checks,
        )

    def _backend_lane(self) -> ChecklistStep:
        lane_entries = _format_lane(self.ctx.lanes.get("backend", []))
        project_dir = self.ctx.project_dir / "backend"
        checks = [
            Check(
                description="Backend workspace exists",
                validator=lambda path=project_dir: path.exists(),
                failure_message=f"Expected backend workspace at {project_dir}",
            )
        ]
        return ChecklistStep(
            title="Backend & Data Implementation Sequence",
            items=[f"Work inside {project_dir} following tasks in order:"] + lane_entries,
            checks=checks,
        )

    def _integration_stage(self) -> ChecklistStep | None:
        items: List[str] = []

        if self.ctx.has_database:
            items.append(
                "Create/adjust migrations, apply upgrades, and reseed sample data (aligns with data modelling tasks)."
            )
        if self.ctx.has_backend:
            items.append(
                "Expose OpenAPI / typed clients once API endpoints are live; regenerate frontend types as needed."
            )
        if self.ctx.has_frontend:
            items.append("Update MSW/Prism mocks to match live responses.")
        if not items:
            return None

        items.append("Run smoke flows across dashboards/endpoints to confirm parity with PLAN acceptance.")

        return ChecklistStep(
            title="Integration, Data Validation, and Contracts",
            items=items,
        )

    def _quality_stage(self) -> ChecklistStep | None:
        items: List[str] = []
        project_dir = self.ctx.project_dir

        if self.ctx.has_frontend:
            items.extend(
                [
                    "Frontend lint & formatting: `cd frontend && npm run lint && npx prettier --check \"src/**/*.{ts,tsx,js,jsx,css,scss}\"`.",
                    "Frontend type check & unit tests: `cd frontend && npx tsc --noEmit && npm test -- --ci --coverage`.",
                ]
            )

        if self.ctx.has_backend:
            items.extend(
                [
                    "Backend quality: `cd backend && black --check . && flake8` (adjust for generated stack).",
                    "Backend tests & coverage: `cd backend && pytest --cov=app --cov-report=xml:../coverage/backend-coverage.xml`.",
                ]
            )

        if not items:
            return None

        items.extend(
            [
                f"Aggregate stack-aware tests: `PROJECT_ROOT={project_dir} ./scripts/install_and_test.sh`.",
                f"Collect metrics: `PROJECT_ROOT={project_dir} python ./scripts/collect_coverage.py`, `collect_perf.py`, `scan_deps.py`.",
                f"Enforce gates: `PROJECT_ROOT={project_dir} python ./scripts/enforce_gates.py`.",
            ]
        )

        return ChecklistStep(title="Quality Automation & Gates", items=items)

    def _local_verification(self) -> ChecklistStep | None:
        project_dir = self.ctx.project_dir
        items: List[str] = []

        if self.ctx.has_frontend:
            items.append(
                "Run dev server: `cd frontend && npm run dev` for experiential QA."
            )
        if self.ctx.has_backend:
            items.append(
                "Backend dev server: `cd backend && uvicorn app.main:app --reload` (or generated entrypoint)."
            )
        if not items:
            return None

        items.append(
            "Execute API/UI smoke tests via Postman/Newman or Playwright as applicable."
        )
        items.append(
            "Run `make pipeline-validate ENV=local FRONTEND_URL=http://localhost:3000 API_URL=http://localhost:8000/health DB_URL=http://localhost:8000/health/db` once health endpoints exist."
        )

        return ChecklistStep(title="Local Verification & Developer Experience", items=items)

    def _packaging_stage(self) -> ChecklistStep | None:
        project_dir = self.ctx.project_dir
        compliance_flags = [c for c in self.ctx.compliance_flags if c != "none"]

        items = [
            f"Package deliverables: `PROJECT_ROOT={project_dir} NAME={self.ctx.spec.name} ./scripts/build_submission_pack.sh`.",
            "Archive evidence/, dist/, coverage/, reports/ for hand-off.",
        ]

        if compliance_flags:
            validate_compliance = resolve_script("validate_compliance_assets.py")
            check_docs = resolve_script("check_compliance_docs.py")
            items.insert(
                1,
                f"Validate compliance assets: `PROJECT_ROOT={project_dir} python {validate_compliance}`.",
            )
            items.insert(
                2,
                f"Optional doc scan: `PROJECT_ROOT={project_dir} python {check_docs}`.",
            )
            title = "Compliance, Evidence, and Packaging"
        else:
            title = "Packaging & Evidence"

        return ChecklistStep(title=title, items=items)

    def _ci_stage(self) -> ChecklistStep:
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

        return ChecklistStep(
            title="CI/CD Enablement",
            items=[
                "Populate GitHub secrets/vars required by .github/workflows/ci-secrets-preflight.yml:",
                "   secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ECS_EXECUTION_ROLE_ARN, AWS_ECS_TASK_ROLE_ARN.",
                "   vars: AWS_REGION, APP_NAME, ECS_CLUSTER_NAME, ECS_SERVICE_NAME, ECS_DESIRED_COUNT, FRONTEND_URL_STAGING, API_URL_STAGING, DB_URL_STAGING, FRONTEND_URL_PRODUCTION, API_URL_PRODUCTION, DB_URL_PRODUCTION.",
                "Enforce production environment protection/approvals in GitHub.",
                "Trigger ci-secrets-preflight (push/pr/dispatch) and resolve any missing configuration.",
                "Review ci-lint/ci-test/ci-nox outputs to ensure repo-level checks pass.",
                f"Record validation URLs: staging={staging_urls}, production={prod_urls}.",
            ],
        )

    def _deploy_stage(self) -> ChecklistStep:
        check_deployment = resolve_script("health/check_deployment.py")
        rollback_backend = resolve_script("rollback_backend.sh")
        rollback_frontend = resolve_script("rollback_frontend.sh")

        return ChecklistStep(
            title="Deploy & Promote",
            items=[
                "Staging: push to main to invoke .github/workflows/ci-deploy.yml (environment resolves to staging).",
                "Review staging artifact outputs, ECS & Vercel deploys, and health verification "
                f"(`python {check_deployment} --environment staging ...`).",
                "Production: run GitHub Actions → “Promote to Production”, ensure approvals granted, wait for verify-and-gate + deploy-production jobs.",
                "Post deploy: download reports/production-pipeline-validation.json and confirm smoke + newman tests passed.",
                f"If failures occur, use {rollback_backend} and {rollback_frontend} via the rollback job or manually.",
            ],
        )

    def _observability_stage(self) -> ChecklistStep:
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
        return ChecklistStep(
            title="Observability & Continuous Ops",
            items=[
                "Schedule/monitor nightly-observability workflow; ensure staging/production URL vars stay current.",
                f"Use `make pipeline-validate ENV=staging FRONTEND_URL={staging_urls['frontend']} API_URL={staging_urls['api']} DB_URL={staging_urls['db']}` for ad-hoc validation.",
                f"Use `make pipeline-validate ENV=production FRONTEND_URL={prod_urls['frontend']} API_URL={prod_urls['api']} DB_URL={prod_urls['db']}` post-promotion.",
                "Feed reports/ and evidence/ into dashboards or MCP tools for ongoing compliance.",
            ],
        )

    def _final_delivery(self) -> ChecklistStep:
        project_dir = self.ctx.project_dir
        return ChecklistStep(
            title="Final Delivery & Retrospective",
            items=[
                f"Hand off dist/{self.ctx.spec.name}-submission, PLAN.md, PLAN.tasks.json, selection.json, and compliance logs.",
                f"Document residual risks or follow-ups in {project_dir}/reports/ or IMPLEMENTATION_SUMMARY.md.",
                "Capture implementation retrospective and update workflow.config.json/workflow docs for future engagements.",
            ],
        )


# ---------------------------------------------------------------------------
# CLI + verification harness


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Print pre-lifecycle execution plan.")
    ap.add_argument("--name", help="Client/project name override")
    ap.add_argument("--config", default="workflow.config.json")
    ap.add_argument("--output-root", default="../_generated")
    ap.add_argument("--verify", action="store_true", help="Run artifact checks and report summary")
    ap.add_argument(
        "--execute",
        action="store_true",
        help="Run artifact checks and lightweight --help commands for referenced scripts",
    )
    return ap.parse_args()


def _load_config(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"[plan] config not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def _resolve_name(cfg: dict, override: str | None) -> str:
    name = override or os.environ.get("NAME") or cfg.get("name")
    if not name:
        raise ValueError("[plan] NAME is required (pass --name, export NAME, or set workflow.config.json)")
    return str(name)


def _parse_brief(path: Path) -> ScaffoldSpec:
    if not path.exists():
        raise FileNotFoundError(f"[plan] brief not found: {path}")
    return BriefParser(str(path)).parse()


def _normalize_output_root(output_root: str) -> Path:
    return Path(output_root).resolve()


@dataclass
class CheckResult:
    description: str
    passed: bool
    message: str


@dataclass
class CommandResult:
    description: str
    returncode: int
    stderr: str


def run_checks(steps: Sequence[ChecklistStep]) -> List[CheckResult]:
    results: List[CheckResult] = []
    for step in steps:
        for check in step.checks:
            try:
                passed = bool(check.validator())
            except Exception as exc:  # pragma: no cover - defensive
                passed = False
                message = f"check raised {exc}"
            else:
                message = "" if passed else check.failure_message
            results.append(CheckResult(description=f"{step.title}: {check.description}", passed=passed, message=message))
    return results


def run_commands(steps: Sequence[ChecklistStep]) -> List[CommandResult]:
    results: List[CommandResult] = []
    for step in steps:
        for command in step.commands:
            completed = subprocess.run(command.args, capture_output=True, text=True)
            stderr = completed.stderr.strip()
            results.append(
                CommandResult(
                    description=f"{step.title}: {command.description}",
                    returncode=completed.returncode,
                    stderr=stderr,
                )
            )
    return results


def print_steps(steps: Sequence[ChecklistStep]) -> None:
    for idx, step in enumerate(steps, 1):
        print(f"{idx}. {step.title}")
        for item_idx, item in enumerate(step.items, 1):
            print(f"   {idx}.{item_idx} {item}")
        print()


def summarize(results: Sequence[CheckResult | CommandResult]) -> int:
    exit_code = 0
    if not results:
        return exit_code

    print("Verification Summary:")
    for result in results:
        if isinstance(result, CheckResult):
            status = "PASS" if result.passed else "FAIL"
            print(f" - [{status}] {result.description}")
            if not result.passed and result.message:
                print(f"     → {result.message}")
            if not result.passed:
                exit_code = 1
        else:
            status = "PASS" if result.returncode == 0 else "FAIL"
            print(f" - [{status}] {result.description}")
            if result.stderr:
                print(f"     → {result.stderr}")
            if result.returncode != 0:
                exit_code = 1
    print()
    return exit_code


def main() -> int:
    args = parse_args()

    try:
        cfg = _load_config(ROOT / args.config)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2

    try:
        name = _resolve_name(cfg, args.name)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    brief_path = ROOT / "docs" / "briefs" / name / "brief.md"
    try:
        spec = _parse_brief(brief_path)
    except FileNotFoundError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    output_root = _normalize_output_root(args.output_root)
    project_dir = (output_root / name).resolve()

    lanes = build_plan(spec)

    ctx = ChecklistContext(
        spec=spec,
        config=cfg,
        brief_path=brief_path,
        project_dir=project_dir,
        output_root=output_root,
        lanes=lanes,
    )

    steps = ChecklistBuilder(ctx).build()
    print_steps(steps)

    exit_code = 0
    if args.verify or args.execute:
        check_results = run_checks(steps)
        command_results: List[CommandResult] = []
        if args.execute:
            command_results = run_commands(steps)
        exit_code = summarize([*check_results, *command_results])

    return exit_code


if __name__ == "__main__":  # pragma: no cover - CLI entrypoint
    raise SystemExit(main())

