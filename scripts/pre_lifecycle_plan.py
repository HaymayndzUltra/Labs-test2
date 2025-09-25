#!/usr/bin/env python3
"""Pre-lifecycle roadmap generator with capability-aware gating."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Optional

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from project_generator.core.brief_parser import BriefParser, ScaffoldSpec  # type: ignore[misc]


def _load_plan_builder() -> Callable:
    plan_module_path = ROOT / "scripts" / "plan_from_brief.py"
    spec = importlib.util.spec_from_file_location("_plan_from_brief", plan_module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load plan_from_brief.py from {plan_module_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)  # type: ignore[misc]
    return module.build_plan  # type: ignore[attr-defined]


build_plan = _load_plan_builder()


@dataclass
class ValidationMessage:
    status: str
    message: str


@dataclass
class ChecklistStage:
    title: str
    items: List[str]


class ScriptResolver:
    """Locate scripts dynamically so references stay accurate if paths change."""

    def __init__(self, scripts_root: Path):
        self.scripts_root = scripts_root
        self._cache: Dict[str, Path] = {}

    def find(self, name: str) -> Optional[Path]:
        if name in self._cache:
            return self._cache[name]
        matches = [p for p in self.scripts_root.rglob(name) if p.is_file()]
        if matches:
            self._cache[name] = matches[0]
            return matches[0]
        return None


@dataclass
class PlannerContext:
    name: str
    config: Dict
    spec: ScaffoldSpec
    brief_path: Path
    output_root: Path
    project_dir: Path
    script_resolver: ScriptResolver
    validations: List[ValidationMessage] = field(default_factory=list)
    exit_code: int = 0
    _resolved_scripts: Dict[str, str] = field(default_factory=dict)

    def record(self, status: str, message: str) -> None:
        self.validations.append(ValidationMessage(status=status, message=message))
        if status.lower() == "error":
            self.exit_code = max(self.exit_code, 1)

    def require_artifact(
        self,
        path: Path,
        description: str,
        required: bool = True,
        remedy: Optional[str] = None,
    ) -> bool:
        exists = path.exists()
        if exists:
            self.record("ok", f"{description} present: {path}")
            return True

        status = "error" if required else "warn"
        msg = f"{description} missing: {path}"
        if remedy:
            msg += f" — {remedy}"
        self.record(status, msg)
        return False

    def resolve_script(self, name: str, required: bool = True) -> str:
        if name in self._resolved_scripts:
            return self._resolved_scripts[name]
        resolved = self.script_resolver.find(name)
        if resolved:
            rel = resolved.relative_to(ROOT)
            self.record("ok", f"Script available: {rel}")
            self._resolved_scripts[name] = rel.as_posix()
            return self._resolved_scripts[name]
        status = "error" if required else "warn"
        self.record(status, f"Script missing: {name}")
        fallback = Path("scripts") / name
        self._resolved_scripts[name] = fallback.as_posix()
        return self._resolved_scripts[name]

    @property
    def compliance(self) -> List[str]:
        cfg_val = self.config.get("compliance")
        if isinstance(cfg_val, str):
            cfg_items = [c.strip().lower() for c in cfg_val.split(",") if c.strip()]
        elif isinstance(cfg_val, Iterable):
            cfg_items = [str(c).strip().lower() for c in cfg_val if str(c).strip()]
        else:
            cfg_items = []
        spec_items = [c.strip().lower() for c in self.spec.compliance if c.strip()]
        merged = list(dict.fromkeys(cfg_items + spec_items))
        return merged


def format_lane(lane: List[Dict]) -> List[str]:
    entries: List[str] = []
    for idx, task in enumerate(lane, 1):
        blockers = ", ".join(task.get("blocked_by", [])) or "none"
        acceptance = ", ".join(task.get("acceptance", [])) or "see acceptance criteria"
        entries.append(
            f"{task['id']}: {task['title']} (blocked_by: {blockers}; acceptance: {acceptance})"
        )
    return entries


def environment_stage(ctx: PlannerContext, cfg_path: Path) -> ChecklistStage:
    industry = ctx.config.get("industry", ctx.spec.industry)
    project_type = ctx.config.get("project_type", ctx.spec.project_type)
    frontend = ctx.config.get("frontend", ctx.spec.frontend)
    backend = ctx.config.get("backend", ctx.spec.backend)
    database = ctx.config.get("database", ctx.spec.database)
    auth = ctx.config.get("auth", ctx.spec.auth)
    deploy = ctx.config.get("deploy", ctx.spec.deploy)

    items = [
        "Install prerequisites: Python ≥3.11, Node.js ≥18, Docker, jq, rsync, sha256sum, git.",
        f"Confirm brief exists at {ctx.brief_path}.",
        (
            "Verify workflow configuration values "
            f"(industry={industry}, project_type={project_type}, frontend={frontend}, "
            f"backend={backend}, database={database}, auth={auth}, deploy={deploy})."
        ),
        (
            "Export automation variables before running lifecycle: "
            f"NAME={ctx.name} INDUSTRY={industry} PROJECT_TYPE={project_type} "
            f"FE={frontend} BE={backend} DB={database} OUTPUT_ROOT={ctx.output_root}\n"
            "   Optional: AUTH, DEPLOY, COMPLIANCE, FORCE_OUTPUT=1."
        ),
    ]

    if ctx.compliance:
        items.append(
            "Confirm compliance checklists are populated and stored under docs/compliance/ for reuse."
        )

    return ChecklistStage(title="Environment & Inputs", items=items)


def planning_stage(ctx: PlannerContext, plan_md: Path, plan_tasks: Path) -> ChecklistStage:
    generator = ctx.resolve_script("plan_from_brief.py")
    validator = ctx.resolve_script("validate_tasks.py")
    items = [
        "Review brief acceptance criteria, compliance asks, and stakeholder priorities.",
        (
            "Generate planning artifacts (dry run supported): "
            f"python {generator} --brief '{ctx.brief_path}' --out '{plan_md}'"
        ),
        (
            "Validate DAG topology prior to generation: "
            f"python {validator} --input '{plan_tasks}'"
        ),
        "Inspect PLAN lanes and resolve dependencies/blocked tasks before coding.",
    ]

    ctx.require_artifact(
        plan_md,
        "PLAN.md artifact",
        required=False,
        remedy="Run plan_from_brief to materialise planning documents.",
    )
    ctx.require_artifact(
        plan_tasks,
        "PLAN.tasks.json artifact",
        required=False,
        remedy="Run plan_from_brief to emit task graph JSON.",
    )

    return ChecklistStage(title="Planning & Alignment", items=items)


def stack_preflight_stage(ctx: PlannerContext) -> ChecklistStage:
    doctor = ctx.resolve_script("doctor.py")
    generator = ctx.resolve_script("generate_client_project.py")
    select = ctx.resolve_script("select_stacks.py")

    industry = ctx.config.get("industry", ctx.spec.industry)
    project_type = ctx.config.get("project_type", ctx.spec.project_type)
    frontend = ctx.config.get("frontend", ctx.spec.frontend)
    backend = ctx.config.get("backend", ctx.spec.backend)
    database = ctx.config.get("database", ctx.spec.database)
    auth = ctx.config.get("auth", ctx.spec.auth)
    deploy = ctx.config.get("deploy", ctx.spec.deploy)

    def flag(name: str, value: str) -> str:
        return f" --{name} '{value}'" if value and value not in {"none", "n/a"} else ""

    select_cmd = (
        f"python {select} --industry '{industry}' --project-type '{project_type}'"
        f"{flag('frontend', frontend)}{flag('backend', backend)}{flag('database', database)}"
        f" --output '{ctx.project_dir}/selection.json'"
        f" --summary '{ctx.project_dir}/evidence/stack-selection.md'"
    )
    if ctx.compliance:
        select_cmd += f" --compliance '{','.join(ctx.compliance)}'"

    preview_cmd = (
        f"{generator} --dry-run --workers 8 --yes --name '{ctx.name}' --industry '{industry}' "
        f"--project-type '{project_type}'{flag('frontend', frontend)}{flag('backend', backend)}"
        f"{flag('database', database)}{flag('auth', auth)}{flag('deploy', deploy)}"
    )
    if ctx.compliance:
        preview_cmd += f" --compliance '{','.join(ctx.compliance)}'"
    preview_cmd += f" --output-dir '{ctx.output_root}'"

    items = [
        f"Tooling doctor & template discovery: python {doctor} --strict",
        f"Preflight stack selection and capture evidence: {select_cmd}",
        "Resolve engine/version mismatches reported by select_stacks before continuing.",
        f"Preview scaffold (no writes): ./{preview_cmd}",
    ]

    return ChecklistStage(title="Stack Preflight & Generation Prep", items=items)


def generation_stage(ctx: PlannerContext) -> ChecklistStage:
    industry = ctx.config.get("industry", ctx.spec.industry)
    project_type = ctx.config.get("project_type", ctx.spec.project_type)
    frontend = ctx.config.get("frontend", ctx.spec.frontend)
    backend = ctx.config.get("backend", ctx.spec.backend)
    database = ctx.config.get("database", ctx.spec.database)

    lifecycle_cmd = (
        "NAME={name} INDUSTRY={industry} PROJECT_TYPE={ptype} FE={fe} BE={be} "
        "DB={db} OUTPUT_ROOT={out} make lifecycle"
    ).format(
        name=ctx.name,
        industry=industry,
        ptype=project_type,
        fe=frontend,
        be=backend,
        db=database,
        out=ctx.output_root,
    )

    items = [
        f"When ready, run the one-shot generator (stops on failure): {lifecycle_cmd}",
        f"Inspect generated project at {ctx.project_dir}; confirm evidence/, PLAN.*, tasks.json, dist/ artifacts exist.",
        "Capture generator logs and stack selection evidence for audit.",
    ]

    ctx.require_artifact(
        ctx.project_dir,
        "Generated project directory",
        required=False,
        remedy="Run make lifecycle to emit the scaffold before continuing.",
    )

    return ChecklistStage(title="Full Scaffold Generation & Bootstrap (queued automation)", items=items)


def frontend_stage(ctx: PlannerContext, frontend_lane: List[str]) -> Optional[ChecklistStage]:
    if not frontend_lane:
        return None
    items = [f"Work inside {ctx.project_dir}/frontend following tasks in order:"] + frontend_lane
    return ChecklistStage(title="Frontend Implementation Sequence", items=items)


def backend_stage(ctx: PlannerContext, backend_lane: List[str]) -> Optional[ChecklistStage]:
    if not backend_lane:
        return None
    items = [f"Work inside {ctx.project_dir}/backend following tasks in order:"] + backend_lane
    if ctx.spec.database == "none":
        items.append("Database migrations skipped (no database configured).")
    return ChecklistStage(title="Backend & Data Implementation Sequence", items=items)


def integration_stage(ctx: PlannerContext) -> Optional[ChecklistStage]:
    if ctx.spec.backend == "none" or ctx.spec.database == "none":
        return None
    return ChecklistStage(
        title="Integration, Migrations, and Data Validation",
        items=[
            "Create/adjust migrations, run upgrades, and reseed sample data (aligns with schema/seed tasks).",
            "Expose OpenAPI / typed clients once API endpoints are live; regenerate frontend types as needed.",
            "Update MSW/Prism mocks to match live responses.",
            "Run smoke flows across dashboards/endpoints to confirm acceptance criteria.",
        ],
    )


def quality_stage(ctx: PlannerContext) -> ChecklistStage:
    install_and_test = ctx.resolve_script("install_and_test.sh")
    collect_cov = ctx.resolve_script("collect_coverage.py")
    collect_perf = ctx.resolve_script("collect_perf.py")
    scan_deps = ctx.resolve_script("scan_deps.py")
    enforce_gates = ctx.resolve_script("enforce_gates.py")

    items = [
        "Frontend lint & formatting: `cd frontend && npm run lint && npx prettier --check \"src/**/*.{ts,tsx,js,jsx,css,scss}\"`.",
        "Frontend type check & unit tests: `cd frontend && npx tsc --noEmit && npm test -- --ci --coverage`.",
        "Backend quality: `cd backend && black --check . && flake8` (or backend-specific linters).",
        "Backend tests & coverage: `cd backend && pytest --cov=app --cov-report=xml:../coverage/backend-coverage.xml`.",
        f"Aggregate stack-aware tests: `PROJECT_ROOT={ctx.project_dir} ./{install_and_test}`.",
        f"Collect metrics: `PROJECT_ROOT={ctx.project_dir} python {collect_cov}`, `python {collect_perf}`, `python {scan_deps}`.",
        f"Enforce gates: `PROJECT_ROOT={ctx.project_dir} python {enforce_gates}`.",
    ]

    return ChecklistStage(title="Quality Automation & Gates", items=items)


def local_verification_stage(ctx: PlannerContext) -> ChecklistStage:
    items = [
        "Run dev servers for experiential QA: `cd frontend && npm run dev`; `cd backend && uvicorn app.main:app --reload` (or generated entrypoint).",
        "Execute API/UI smoke via Postman/Newman or Playwright as applicable.",
    ]
    if ctx.spec.backend != "none" and ctx.spec.frontend != "none":
        items.append(
            "Run `make pipeline-validate ENV=local FRONTEND_URL=http://localhost:3000 API_URL=http://localhost:8000/health DB_URL=http://localhost:8000/health/db` once health endpoints exist."
        )
    return ChecklistStage(title="Local Verification & Developer Experience", items=items)


def compliance_stage(ctx: PlannerContext) -> ChecklistStage:
    build_pack = ctx.resolve_script("build_submission_pack.sh")
    validate_assets = ctx.resolve_script("validate_compliance_assets.py", required=bool(ctx.compliance))
    doc_scan = ctx.resolve_script("check_compliance_docs.py", required=False)

    items = [
        f"Package deliverables: `PROJECT_ROOT={ctx.project_dir} NAME={ctx.name} ./{build_pack}`.",
    ]
    if ctx.compliance:
        items.append(
            f"Validate compliance assets: `PROJECT_ROOT={ctx.project_dir} python {validate_assets}`."
        )
        items.append(
            f"Optional doc scan: `PROJECT_ROOT={ctx.project_dir} python {doc_scan}`."
        )
    items.append("Archive evidence/, dist/, coverage/, reports/ for hand-off.")

    return ChecklistStage(title="Compliance, Evidence, and Packaging", items=items)


def cicd_stage(ctx: PlannerContext) -> Optional[ChecklistStage]:
    if ctx.config.get("deploy", ctx.spec.deploy) in {"n/a", "none", ""}:
        return None
    return ChecklistStage(
        title="CI/CD Enablement",
        items=[
            "Populate GitHub secrets/vars required by CI workflows (deploy + validation).",
            "Enforce production environment protection/approvals in GitHub.",
            "Trigger ci-secrets-preflight and resolve missing configuration.",
            "Review ci-lint/ci-test/ci-nox outputs to ensure repo-level checks pass.",
        ],
    )


def deploy_stage(ctx: PlannerContext) -> Optional[ChecklistStage]:
    if ctx.config.get("deploy", ctx.spec.deploy) in {"n/a", "none", ""}:
        return None
    health_check = ctx.resolve_script("health/check_deployment.py", required=False)
    rollback_backend = ctx.resolve_script("rollback_backend.sh", required=False)
    rollback_frontend = ctx.resolve_script("rollback_frontend.sh", required=False)

    items = [
        "Staging: push to main to invoke deployment workflow (staging environment).",
        f"Review staging outputs and run health verification (`python {health_check} --environment staging ...`).",
        "Production: trigger promote workflow, ensure approvals granted, wait for verify and deploy jobs.",
        "If failures occur, use rollback automation for backend/frontend as appropriate.",
    ]
    return ChecklistStage(title="Deploy & Promote", items=items)


def observability_stage(ctx: PlannerContext) -> Optional[ChecklistStage]:
    if ctx.config.get("deploy", ctx.spec.deploy) in {"n/a", "none", ""}:
        return None
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
    return ChecklistStage(
        title="Observability & Continuous Ops",
        items=[
            "Schedule/monitor nightly observability workflows and ensure environment URLs stay current.",
            f"Use `make pipeline-validate ENV=staging FRONTEND_URL={staging_urls['frontend']} API_URL={staging_urls['api']} DB_URL={staging_urls['db']}` for validation.",
            f"Use `make pipeline-validate ENV=production FRONTEND_URL={prod_urls['frontend']} API_URL={prod_urls['api']} DB_URL={prod_urls['db']}` post-promotion.",
            "Feed reports/ and evidence/ into dashboards or MCP tools for ongoing compliance.",
        ],
    )


def retrospective_stage(ctx: PlannerContext) -> ChecklistStage:
    return ChecklistStage(
        title="Final Delivery & Retrospective",
        items=[
            f"Hand off dist/{ctx.name}-submission, PLAN.md, PLAN.tasks.json, selection.json, and compliance logs.",
            f"Document residual risks or follow-ups in {ctx.project_dir}/reports/ or IMPLEMENTATION_SUMMARY.md.",
            "Capture implementation retrospective and update workflow.config.json/workflow docs for future engagements.",
        ],
    )


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Print pre-lifecycle execution plan.")
    ap.add_argument("--name", help="Client/project name override")
    ap.add_argument("--config", default="workflow.config.json")
    ap.add_argument("--output-root", default="../_generated")
    return ap.parse_args()


def main() -> int:
    args = parse_args()

    cfg_path = ROOT / args.config
    if not cfg_path.exists():
        print(f"[plan] config not found: {cfg_path}", file=sys.stderr)
        return 2

    config = json.loads(cfg_path.read_text(encoding="utf-8"))

    name = args.name or os.environ.get("NAME") or config.get("name")
    if not name:
        print(
            "[plan] NAME is required (pass --name, export NAME, or set workflow.config.json)",
            file=sys.stderr,
        )
        return 2

    brief_path = ROOT / "docs" / "briefs" / name / "brief.md"
    if not brief_path.exists():
        print(f"[plan] brief not found: {brief_path}", file=sys.stderr)
        return 2

    spec = BriefParser(str(brief_path)).parse()
    script_resolver = ScriptResolver(ROOT / "scripts")

    output_root = Path(args.output_root).resolve()
    project_dir = (output_root / name).resolve()

    ctx = PlannerContext(
        name=name,
        config=config,
        spec=spec,
        brief_path=brief_path,
        output_root=output_root,
        project_dir=project_dir,
        script_resolver=script_resolver,
    )

    ctx.require_artifact(cfg_path, "workflow.config.json", required=True)
    ctx.require_artifact(brief_path, "Project brief", required=True)

    plan = build_plan(spec, config)
    frontend_lane = format_lane(plan.get("frontend", []))
    backend_lane = format_lane(plan.get("backend", []))

    plan_md = project_dir / "PLAN.md"
    plan_tasks = project_dir / "PLAN.tasks.json"

    stages: List[ChecklistStage] = []
    stages.append(environment_stage(ctx, cfg_path))
    stages.append(planning_stage(ctx, plan_md, plan_tasks))
    stages.append(stack_preflight_stage(ctx))
    stages.append(generation_stage(ctx))

    fe_stage = frontend_stage(ctx, frontend_lane)
    if fe_stage:
        stages.append(fe_stage)
    be_stage = backend_stage(ctx, backend_lane)
    if be_stage:
        stages.append(be_stage)

    integration = integration_stage(ctx)
    if integration:
        stages.append(integration)

    stages.append(quality_stage(ctx))
    stages.append(local_verification_stage(ctx))
    stages.append(compliance_stage(ctx))

    cicd = cicd_stage(ctx)
    if cicd:
        stages.append(cicd)
    deploy = deploy_stage(ctx)
    if deploy:
        stages.append(deploy)
    observability = observability_stage(ctx)
    if observability:
        stages.append(observability)

    stages.append(retrospective_stage(ctx))

    for step_idx, stage in enumerate(stages, 1):
        print(f"{step_idx}. {stage.title}")
        for item_idx, item in enumerate(stage.items, 1):
            print(f"   {step_idx}.{item_idx} {item}")
        print()

    if ctx.validations:
        print("Validation summary:")
        for validation in ctx.validations:
            prefix = validation.status.upper()
            print(f" - [{prefix}] {validation.message}")

    if ctx.exit_code:
        print("[plan] Completed with blocking issues; address errors above.", file=sys.stderr)

    return ctx.exit_code


if __name__ == "__main__":
    raise SystemExit(main())
