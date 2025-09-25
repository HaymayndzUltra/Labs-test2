#!/usr/bin/env python3
"""Pre-lifecycle roadmap generator with dynamic gating and validation."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Optional, Sequence, Tuple


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from project_generator.core.brief_parser import BriefParser, ScaffoldSpec  # type: ignore[misc]

from scripts.lifecycle_tasks import build_plan


# ---------------------------------------------------------------------------
# Dataclasses and helpers


Status = str


@dataclass
class PlanContext:
    name: str
    config: Dict
    spec: ScaffoldSpec
    brief_path: Path
    output_root: Path
    project_dir: Path
    root: Path = ROOT

    def script_path(self, *parts: str) -> Path:
        return self.root / "scripts" / Path(*parts)

    def display_path(self, path: Path) -> str:
        try:
            return str(path.relative_to(self.root))
        except ValueError:
            return str(path)

    # Capability flags -----------------------------------------------------
    @property
    def has_frontend(self) -> bool:
        return (self.config.get("frontend") or self.spec.frontend) not in {None, "", "none"}

    @property
    def has_backend(self) -> bool:
        return (self.config.get("backend") or self.spec.backend) not in {None, "", "none"}

    @property
    def has_database(self) -> bool:
        return (self.config.get("database") or self.spec.database) not in {None, "", "none"}

    @property
    def requires_auth(self) -> bool:
        return (self.config.get("auth") or self.spec.auth) not in {None, "", "none"}

    @property
    def compliance_labels(self) -> List[str]:
        compliance = self.config.get("compliance", self.spec.compliance)
        if isinstance(compliance, str):
            return [c.strip().lower() for c in compliance.split(",") if c.strip()]
        return [str(c).strip().lower() for c in compliance or []]

    @property
    def requires_compliance(self) -> bool:
        return bool(self.compliance_labels)

    @property
    def deploy_target(self) -> str:
        deploy = self.config.get("deploy", self.spec.deploy)
        if isinstance(deploy, str):
            return deploy.lower()
        return str(deploy).lower()

    @property
    def requires_deploy(self) -> bool:
        return self.deploy_target not in {"", "n/a", "none"}


ArtifactProvider = Callable[[PlanContext], Path]
Condition = Callable[[PlanContext], bool]


@dataclass
class PlanItem:
    description: str
    command: Optional[str] = None
    artifacts: Sequence[ArtifactProvider] = ()
    condition: Optional[Condition] = None

    def is_active(self, ctx: PlanContext) -> bool:
        return self.condition(ctx) if self.condition else True

    def evaluate(self, ctx: PlanContext, execute: bool) -> Tuple[Status, str]:
        missing: List[Path] = []
        for artifact_fn in self.artifacts:
            path = artifact_fn(ctx)
            if not path.exists():
                missing.append(path)

        if missing:
            missing_paths = ", ".join(ctx.display_path(p) for p in missing)
            return "error", f"{self.description} [missing: {missing_paths}]"

        if execute and self.command:
            proc = subprocess.run(self.command, shell=True, cwd=ctx.root)
            status: Status = "ok" if proc.returncode == 0 else "error"
            detail = "succeeded" if status == "ok" else f"failed (exit {proc.returncode})"
            return status, f"{self.description} [command {detail}]"

        if self.command:
            return "pending", f"{self.description}"

        return "info", self.description


@dataclass
class PlanStep:
    title: str
    items: List[PlanItem]
    condition: Optional[Condition] = None

    def is_active(self, ctx: PlanContext) -> bool:
        return self.condition(ctx) if self.condition else True


def _artifact(path: Path) -> ArtifactProvider:
    return lambda ctx, p=path: p


# ---------------------------------------------------------------------------
# Stage builders


def environment_stage(ctx: PlanContext) -> PlanStep:
    return PlanStep(
        title="Environment & Inputs",
        items=[
            PlanItem(
                "Install prerequisites: Python ≥3.11, Node.js ≥18, Docker, jq, rsync, sha256sum, git.",
            ),
            PlanItem(
                f"Confirm brief exists at {ctx.display_path(ctx.brief_path)}.",
                artifacts=[_artifact(ctx.brief_path)],
            ),
            PlanItem(
                "Verify workflow.config.json values "
                f"(industry={ctx.config.get('industry', ctx.spec.industry)}, "
                f"project_type={ctx.config.get('project_type', ctx.spec.project_type)}, "
                f"frontend={ctx.config.get('frontend', ctx.spec.frontend)}, "
                f"backend={ctx.config.get('backend', ctx.spec.backend)}, "
                f"database={ctx.config.get('database', ctx.spec.database)}, "
                f"auth={ctx.config.get('auth', ctx.spec.auth)}, "
                f"deploy={ctx.config.get('deploy', ctx.spec.deploy)}, "
                f"compliance={ctx.config.get('compliance', ctx.spec.compliance)}).",
            ),
            PlanItem(
                "Export automation variables before running lifecycle: "
                f"NAME={ctx.name} INDUSTRY={ctx.spec.industry} PROJECT_TYPE={ctx.spec.project_type} "
                f"FE={ctx.spec.frontend} BE={ctx.spec.backend} DB={ctx.spec.database} OUTPUT_ROOT={ctx.output_root} "
                "Optional: AUTH, DEPLOY, COMPLIANCE, NESTJS_ORM, FORCE_OUTPUT=1.",
            ),
        ],
    )


def planning_stage(ctx: PlanContext) -> PlanStep:
    plan_script = ctx.script_path("plan_from_brief.py")
    validator_script = ctx.script_path("validate_tasks.py")
    return PlanStep(
        title="Planning & Alignment",
        items=[
            PlanItem(
                "Review brief acceptance criteria, compliance asks, and stakeholder priorities.",
            ),
            PlanItem(
                "Generate planning artifacts (dry run ok here): "
                f"python {ctx.display_path(plan_script)} --brief '{ctx.display_path(ctx.brief_path)}' "
                f"--out '{ctx.display_path(ctx.project_dir / 'PLAN.md')}'.",
                command=(
                    f"python {ctx.display_path(plan_script)} --brief '{ctx.brief_path}' "
                    f"--out '{ctx.project_dir / 'PLAN.md'}'"
                ),
                artifacts=[_artifact(plan_script)],
            ),
            PlanItem(
                "Validate DAG topology prior to generation:",
                command=(
                    f"python {ctx.display_path(validator_script)} --input "
                    f"'{ctx.project_dir / 'PLAN.tasks.json'}'"
                ),
                artifacts=[_artifact(validator_script)],
            ),
            PlanItem(
                "Inspect PLAN.md lanes and resolve dependencies/blocked tasks before coding.",
            ),
        ],
    )


def stack_preflight_stage(ctx: PlanContext) -> PlanStep:
    doctor_script = ctx.script_path("doctor.py")
    generator_script = ctx.script_path("generate_client_project.py")
    selector_script = ctx.script_path("select_stacks.py")
    compliance_flag = ctx.config.get("compliance") or ""
    auth_flag = ctx.config.get("auth") or ctx.spec.auth
    deploy_flag = ctx.config.get("deploy") or ctx.spec.deploy
    return PlanStep(
        title="Stack Preflight & Generation Prep",
        items=[
            PlanItem(
                "Tooling doctor & template discovery: "
                f"python {ctx.display_path(doctor_script)} --strict && "
                f"./{ctx.display_path(generator_script)} --list-templates --name \"$NAME\" "
                "--industry \"$INDUSTRY\" --project-type \"$PROJECT_TYPE\".",
                command=(
                    f"python {doctor_script} --strict && "
                    f"{generator_script} --list-templates --name '{ctx.name}' "
                    f"--industry '{ctx.spec.industry}' --project-type '{ctx.spec.project_type}'"
                ),
                artifacts=[_artifact(doctor_script), _artifact(generator_script)],
            ),
            PlanItem(
                "Preflight stack selection and capture evidence: "
                f"python {ctx.display_path(selector_script)} --industry '{ctx.spec.industry}' "
                f"--project-type '{ctx.spec.project_type}' --frontend '{ctx.spec.frontend}' "
                f"--backend '{ctx.spec.backend}' --database '{ctx.spec.database}' "
                f"--output '{ctx.display_path(ctx.project_dir / 'selection.json')}' "
                f"--summary '{ctx.display_path(ctx.project_dir / 'evidence' / 'stack-selection.md')}' "
                f"{('--compliance ' + compliance_flag) if compliance_flag else ''}".strip(),
                command=(
                    f"python {selector_script} --industry '{ctx.spec.industry}' "
                    f"--project-type '{ctx.spec.project_type}' --frontend '{ctx.spec.frontend}' "
                    f"--backend '{ctx.spec.backend}' --database '{ctx.spec.database}' "
                    f"--output '{ctx.project_dir / 'selection.json'}' "
                    f"--summary '{ctx.project_dir / 'evidence' / 'stack-selection.md'}' "
                    f"{('--compliance ' + compliance_flag) if compliance_flag else ''}".strip()
                ),
                artifacts=[_artifact(selector_script)],
            ),
            PlanItem(
                "If select_stacks exits with code 3, resolve engine version mismatches before continuing.",
            ),
            PlanItem(
                "Preview scaffold (no writes): "
                f"./{ctx.display_path(generator_script)} --dry-run --workers 8 --yes --name '{ctx.name}' "
                f"--industry '{ctx.spec.industry}' --project-type '{ctx.spec.project_type}' "
                f"--frontend '{ctx.spec.frontend}' --backend '{ctx.spec.backend}' --database '{ctx.spec.database}' "
                f"{('--auth ' + auth_flag) if ctx.requires_auth else ''} "
                f"{('--deploy ' + deploy_flag) if ctx.requires_deploy else ''} "
                f"{('--compliance ' + compliance_flag) if ctx.requires_compliance else ''} "
                f"--output-dir '{ctx.output_root}'",
                command=(
                    f"{generator_script} --dry-run --workers 8 --yes --name '{ctx.name}' "
                    f"--industry '{ctx.spec.industry}' --project-type '{ctx.spec.project_type}' "
                    f"--frontend '{ctx.spec.frontend}' --backend '{ctx.spec.backend}' --database '{ctx.spec.database}' "
                    f"{('--auth ' + auth_flag) if ctx.requires_auth else ''} "
                    f"{('--deploy ' + deploy_flag) if ctx.requires_deploy else ''} "
                    f"{('--compliance ' + compliance_flag) if ctx.requires_compliance else ''} "
                    f"--output-dir '{ctx.output_root}'"
                ),
                artifacts=[_artifact(generator_script)],
            ),
        ],
    )


def generation_stage(ctx: PlanContext) -> PlanStep:
    generator_script = ctx.script_path("generate_client_project.py")
    return PlanStep(
        title="Full Scaffold Generation & Bootstrap (queued automation)",
        items=[
            PlanItem(
                "When ready, run the one-shot generator (stops on any failure): "
                f"NAME={ctx.name} INDUSTRY={ctx.spec.industry} PROJECT_TYPE={ctx.spec.project_type} "
                f"FE={ctx.spec.frontend} BE={ctx.spec.backend} DB={ctx.spec.database} OUTPUT_ROOT={ctx.output_root} make lifecycle",
            ),
            PlanItem(
                f"Inspect generated project at {ctx.display_path(ctx.project_dir)}; confirm evidence/, PLAN.*, tasks.json, dist/ artifacts exist.",
            ),
            PlanItem(
                "Capture any generator logs or selection evidence for audit.",
            ),
            PlanItem(
                "Validate that scaffold output exists before continuing.",
                artifacts=[_artifact(ctx.project_dir)],
            ),
        ],
    )


def artifact_validation_stage(ctx: PlanContext) -> PlanStep:
    return PlanStep(
        title="Generated Artifact Verification",
        items=[
            PlanItem(
                "Ensure PLAN.md and PLAN.tasks.json exist in the generated project.",
                artifacts=[
                    _artifact(ctx.project_dir / "PLAN.md"),
                    _artifact(ctx.project_dir / "PLAN.tasks.json"),
                ],
            ),
            PlanItem(
                "Ensure evidence/stack-selection.md is captured for compliance traceability.",
                artifacts=[_artifact(ctx.project_dir / "evidence" / "stack-selection.md")],
            ),
            PlanItem(
                "Confirm dist/ and reports/ directories were emitted by the lifecycle generator.",
                artifacts=[
                    _artifact(ctx.project_dir / "dist"),
                    _artifact(ctx.project_dir / "reports"),
                ],
            ),
        ],
        condition=lambda c: c.project_dir.exists(),
    )


def frontend_stage(ctx: PlanContext, frontend_lane: Iterable[str]) -> PlanStep:
    return PlanStep(
        title="Frontend Implementation Sequence (execute in project workspace)",
        items=[
            PlanItem(
                f"Work inside {ctx.display_path(ctx.project_dir / 'frontend')} following tasks in order:",
            ),
            *[PlanItem(task) for task in frontend_lane],
        ],
        condition=lambda c: c.has_frontend,
    )


def backend_stage(ctx: PlanContext, backend_lane: Iterable[str]) -> PlanStep:
    return PlanStep(
        title="Backend & Data Implementation Sequence",
        items=[
            PlanItem(
                f"Work inside {ctx.display_path(ctx.project_dir / 'backend')} (and database/ if emitted) following tasks in order:",
            ),
            *[PlanItem(task) for task in backend_lane],
        ],
        condition=lambda c: c.has_backend,
    )


def integration_stage(ctx: PlanContext) -> PlanStep:
    return PlanStep(
        title="Integration, Migrations, and Data Validation",
        items=[
            PlanItem(
                "Create/adjust migrations, run upgrades, and reseed sample data (aligns with BE-SCH/BE-SEED/BE-MDL).",
                condition=lambda c: c.has_database,
            ),
            PlanItem(
                "Expose OpenAPI / typed clients once API endpoints are live; regenerate frontend types as needed.",
                condition=lambda c: c.has_backend or c.has_frontend,
            ),
            PlanItem(
                "Update MSW/Prism mocks to match live responses (FE-MOCKS).",
                condition=lambda c: c.has_frontend,
            ),
            PlanItem(
                "Run smoke flows across dashboards/endpoints to confirm parity with PLAN acceptance.",
            ),
        ],
        condition=lambda c: c.has_backend or c.has_frontend,
    )


def quality_stage(ctx: PlanContext) -> PlanStep:
    install_script = ctx.script_path("install_and_test.sh")
    collect_script = ctx.script_path("collect_coverage.py")
    enforce_script = ctx.script_path("enforce_gates.py")
    return PlanStep(
        title="Quality Automation & Gates",
        items=[
            PlanItem(
                "Frontend lint & formatting: cd frontend && npm run lint && npx prettier --check 'src/**/*.{ts,tsx,js,jsx,css,scss}'.",
                condition=lambda c: c.has_frontend,
            ),
            PlanItem(
                "Frontend type check & unit tests: cd frontend && npx tsc --noEmit && npm test -- --ci --coverage.",
                condition=lambda c: c.has_frontend,
            ),
            PlanItem(
                "Backend quality: cd backend && black --check . && flake8 (Python) and/or ESLint for Node backends; run mypy when enabled.",
                condition=lambda c: c.has_backend,
            ),
            PlanItem(
                "Backend tests & coverage: cd backend && pytest --cov=app --cov-report=xml:../coverage/backend-coverage.xml.",
                condition=lambda c: c.has_backend,
            ),
            PlanItem(
                f"Aggregate stack-aware tests: PROJECT_ROOT={ctx.display_path(ctx.project_dir)} {ctx.display_path(install_script)}",
                command=f"PROJECT_ROOT={ctx.project_dir} {install_script}",
                artifacts=[_artifact(install_script)],
            ),
            PlanItem(
                f"Collect metrics: PROJECT_ROOT={ctx.display_path(ctx.project_dir)} python {ctx.display_path(collect_script)}",
                command=f"PROJECT_ROOT={ctx.project_dir} python {collect_script}",
                artifacts=[_artifact(collect_script)],
            ),
            PlanItem(
                f"Enforce gates: PROJECT_ROOT={ctx.display_path(ctx.project_dir)} python {ctx.display_path(enforce_script)}",
                command=f"PROJECT_ROOT={ctx.project_dir} python {enforce_script}",
                artifacts=[_artifact(enforce_script)],
            ),
        ],
    )


def developer_experience_stage(ctx: PlanContext) -> PlanStep:
    return PlanStep(
        title="Local Verification & Developer Experience",
        items=[
            PlanItem(
                "Run dev servers for experiential QA: cd frontend && npm run dev; cd backend && uvicorn app.main:app --reload (or generated entrypoint).",
                condition=lambda c: c.has_frontend or c.has_backend,
            ),
            PlanItem(
                "Execute API/UI smoke via Postman/Newman or Playwright as applicable.",
            ),
            PlanItem(
                "Run make pipeline-validate ENV=local FRONTEND_URL=http://localhost:3000 API_URL=http://localhost:8000/health DB_URL=http://localhost:8000/health/db once health endpoints exist.",
                condition=lambda c: c.has_frontend or c.has_backend,
            ),
        ],
    )


def compliance_stage(ctx: PlanContext) -> PlanStep:
    package_script = ctx.script_path("build_submission_pack.sh")
    validate_script = ctx.script_path("validate_compliance_assets.py")
    doc_scan_script = ctx.script_path("check_compliance_docs.py")
    return PlanStep(
        title="Compliance, Evidence, and Packaging",
        items=[
            PlanItem(
                f"Package deliverables: PROJECT_ROOT={ctx.display_path(ctx.project_dir)} NAME={ctx.name} {ctx.display_path(package_script)}",
                command=f"PROJECT_ROOT={ctx.project_dir} NAME={ctx.name} {package_script}",
                artifacts=[_artifact(package_script)],
            ),
            PlanItem(
                f"Validate compliance assets: PROJECT_ROOT={ctx.display_path(ctx.project_dir)} python {ctx.display_path(validate_script)}",
                command=f"PROJECT_ROOT={ctx.project_dir} python {validate_script}",
                artifacts=[_artifact(validate_script)],
            ),
            PlanItem(
                f"Optional doc scan: PROJECT_ROOT={ctx.display_path(ctx.project_dir)} python {ctx.display_path(doc_scan_script)}",
                command=f"PROJECT_ROOT={ctx.project_dir} python {doc_scan_script}",
                artifacts=[_artifact(doc_scan_script)],
            ),
            PlanItem(
                "Archive evidence/, dist/, coverage/, reports/ for hand-off.",
            ),
        ],
        condition=lambda c: c.requires_compliance,
    )


def cicd_stage(ctx: PlanContext) -> PlanStep:
    return PlanStep(
        title="CI/CD Enablement",
        items=[
            PlanItem(
                "Populate GitHub secrets/vars required by .github/workflows/ci-secrets-preflight.yml:",
            ),
            PlanItem(
                "   secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ECS_EXECUTION_ROLE_ARN, AWS_ECS_TASK_ROLE_ARN.",
                condition=lambda c: c.requires_deploy,
            ),
            PlanItem(
                "   vars: AWS_REGION, APP_NAME, ECS_CLUSTER_NAME, ECS_SERVICE_NAME, ECS_DESIRED_COUNT, FRONTEND_URL_STAGING, API_URL_STAGING, DB_URL_STAGING, FRONTEND_URL_PRODUCTION, API_URL_PRODUCTION, DB_URL_PRODUCTION.",
                condition=lambda c: c.requires_deploy,
            ),
            PlanItem(
                "Enforce production environment protection/approvals in GitHub.",
                condition=lambda c: c.requires_deploy,
            ),
            PlanItem(
                "Trigger ci-secrets-preflight (push/pr/dispatch) and resolve any missing configuration.",
                condition=lambda c: c.requires_deploy,
            ),
            PlanItem(
                "Review ci-lint/ci-test/ci-nox outputs to ensure repo-level checks pass.",
            ),
        ],
        condition=lambda c: c.requires_deploy,
    )


def deploy_stage(ctx: PlanContext) -> PlanStep:
    health_script = ctx.script_path("health") / "check_deployment.py"
    return PlanStep(
        title="Deploy & Promote",
        items=[
            PlanItem(
                "Staging: push to main to invoke .github/workflows/ci-deploy.yml (environment resolves to staging).",
            ),
            PlanItem(
                "Review staging artifact outputs, ECS & Vercel deploys, and health verification.",
            ),
            PlanItem(
                f"Run health verification: python {ctx.display_path(health_script)} --environment staging ...",
                command=f"python {health_script} --environment staging",
                artifacts=[_artifact(health_script)],
            ),
            PlanItem(
                "Production: run GitHub Actions → “Promote to Production”, ensure approvals granted, wait for verify-and-gate + deploy-production jobs.",
            ),
            PlanItem(
                "Post deploy: download reports/production-pipeline-validation.json and confirm smoke + newman tests passed.",
            ),
            PlanItem(
                "If failures occur, use scripts/rollback_backend.sh and scripts/rollback_frontend.sh via the rollback job or manually.",
            ),
        ],
        condition=lambda c: c.requires_deploy,
    )


def observability_stage(ctx: PlanContext) -> PlanStep:
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
    return PlanStep(
        title="Observability & Continuous Ops",
        items=[
            PlanItem(
                "Schedule/monitor nightly-observability workflow; ensure staging/production URL vars stay current.",
            ),
            PlanItem(
                f"Use make pipeline-validate ENV=staging FRONTEND_URL={staging_urls['frontend']} API_URL={staging_urls['api']} DB_URL={staging_urls['db']} for ad-hoc validation.",
                condition=lambda c: c.requires_deploy,
            ),
            PlanItem(
                f"Use make pipeline-validate ENV=production FRONTEND_URL={prod_urls['frontend']} API_URL={prod_urls['api']} DB_URL={prod_urls['db']} post-promotion.",
                condition=lambda c: c.requires_deploy,
            ),
            PlanItem(
                "Feed reports/ and evidence/ into dashboards or MCP tools for ongoing compliance.",
                condition=lambda c: c.requires_compliance,
            ),
        ],
        condition=lambda c: c.requires_deploy or c.requires_compliance,
    )


def final_delivery_stage(ctx: PlanContext) -> PlanStep:
    return PlanStep(
        title="Final Delivery & Retrospective",
        items=[
            PlanItem(
                f"Hand off dist/{ctx.name}-submission, PLAN.md, PLAN.tasks.json, selection.json, and compliance logs.",
                artifacts=[
                    _artifact(ctx.project_dir / "dist" / f"{ctx.name}-submission"),
                    _artifact(ctx.project_dir / "PLAN.md"),
                    _artifact(ctx.project_dir / "PLAN.tasks.json"),
                ],
                condition=lambda c: c.project_dir.exists(),
            ),
            PlanItem(
                f"Document residual risks or follow-ups in {ctx.display_path(ctx.project_dir / 'reports')} or IMPLEMENTATION_SUMMARY.md.",
            ),
            PlanItem(
                "Capture implementation retrospective and update workflow.config.json/workflow docs for future engagements.",
            ),
        ],
    )


def build_steps(ctx: PlanContext, frontend_lane: Iterable[str], backend_lane: Iterable[str]) -> List[PlanStep]:
    return [
        environment_stage(ctx),
        planning_stage(ctx),
        stack_preflight_stage(ctx),
        generation_stage(ctx),
        artifact_validation_stage(ctx),
        frontend_stage(ctx, frontend_lane),
        backend_stage(ctx, backend_lane),
        integration_stage(ctx),
        quality_stage(ctx),
        developer_experience_stage(ctx),
        compliance_stage(ctx),
        cicd_stage(ctx),
        deploy_stage(ctx),
        observability_stage(ctx),
        final_delivery_stage(ctx),
    ]


# ---------------------------------------------------------------------------
# CLI implementation


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Print pre-lifecycle execution plan.")
    ap.add_argument("--name", help="Client/project name override")
    ap.add_argument("--config", default="workflow.config.json")
    ap.add_argument("--output-root", default="../_generated")
    ap.add_argument("--execute", action="store_true", help="Execute commands and report statuses")
    return ap.parse_args()


def load_config(path: Path) -> Dict:
    if not path.exists():
        raise FileNotFoundError(f"config not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def ensure_brief_exists(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"brief not found: {path}")


def format_lane(lane: List[Dict]) -> List[str]:
    entries = []
    for idx, t in enumerate(lane, 1):
        blockers = ", ".join(t["blocked_by"]) if t.get("blocked_by") else "none"
        acceptance = ", ".join(t.get("acceptance", [])) if t.get("acceptance") else "see acceptance criteria"
        entries.append(
            f"{t['id']}: {t['title']} (blocked_by: {blockers}; acceptance: {acceptance})"
        )
    return entries


def print_steps(steps: List[PlanStep], ctx: PlanContext, execute: bool) -> int:
    exit_code = 0
    summary: List[Tuple[str, Status]] = []
    step_counter = 0
    for step in steps:
        if not step.is_active(ctx):
            continue
        step_counter += 1
        print(f"{step_counter}. {step.title}")
        item_counter = 0
        for item in step.items:
            if not item.is_active(ctx):
                continue
            item_counter += 1
            status, message = item.evaluate(ctx, execute)
            if status == "error":
                exit_code = 1
            summary.append((message, status))
            prefix = {
                "ok": "[OK] ",
                "error": "[!!] ",
                "pending": "[cmd] ",
                "info": "     ",
            }.get(status, "     ")
            print(f"   {step_counter}.{item_counter} {prefix}{message}")
        print()

    if execute and summary:
        print("Command summary:")
        for message, status in summary:
            if status in {"ok", "error", "pending"}:
                print(f" - {status.upper():7} {message}")
        print()

    return exit_code


def main() -> int:
    args = parse_args()

    cfg_path = ROOT / args.config
    try:
        cfg = load_config(cfg_path)
    except FileNotFoundError as exc:
        print(f"[plan] {exc}", file=sys.stderr)
        return 2

    name = args.name or os.environ.get("NAME") or cfg.get("name")
    if not name:
        print("[plan] NAME is required (pass --name, export NAME, or set workflow.config.json)", file=sys.stderr)
        return 2

    brief_path = ROOT / "docs" / "briefs" / name / "brief.md"
    try:
        ensure_brief_exists(brief_path)
    except FileNotFoundError as exc:
        print(f"[plan] {exc}", file=sys.stderr)
        return 2

    spec = BriefParser(str(brief_path)).parse()
    lanes = build_plan(spec, cfg)

    output_root = Path(args.output_root)
    project_dir = (output_root / name).resolve()

    frontend_lane = format_lane(lanes.get("frontend", []))
    backend_lane = format_lane(lanes.get("backend", []))

    ctx = PlanContext(
        name=name,
        config=cfg,
        spec=spec,
        brief_path=brief_path,
        output_root=output_root,
        project_dir=project_dir,
    )

    steps = build_steps(ctx, frontend_lane, backend_lane)
    return print_steps(steps, ctx, args.execute)


if __name__ == "__main__":
    raise SystemExit(main())

