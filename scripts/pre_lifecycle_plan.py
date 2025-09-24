#!/usr/bin/env python3
"""
Pre-lifecycle roadmap generator.

Reads workflow.config.json (or overrides) and the corresponding docs/briefs/<NAME>/brief.md,
recreates the ordered task lanes, then prints a sequential, human-readable checklist that
extends the lifecycle automation with the manual quality, deploy, and observability work.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from project_generator.core.brief_parser import BriefParser  # type: ignore[misc]


def build_plan(spec) -> Dict[str, List[Dict]]:
    """Replica of scripts/plan_from_brief.build_plan to reuse lane ordering."""
    def task(id_, title, area, blocked_by=None, labels=None, estimate="1d",
             acceptance=None, dod=None):
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

    be: List[Dict] = []
    fe: List[Dict] = []

    be.append(task("BE-SCH", "Design DB schema", "backend",
                   acceptance=["ERD drafted", "tables defined", "naming conventions applied"]))
    be.append(task("BE-SEED", "Seed loaders (CSV/mock)", "backend", blocked_by=["BE-SCH"],
                   acceptance=["seed scripts run", "sample rows present"]))
    be.append(task("BE-MDL", "Aggregates/MatViews (funnel, revenue, etc.)", "backend",
                   blocked_by=["BE-SEED"],
                   acceptance=["views created", "query p95 < 400ms (seed)"]))
    be += [
        task("BE-API-KPI", "GET /api/v1/kpis", "backend", blocked_by=["BE-MDL"],
             acceptance=["returns totals/deltas", "OpenAPI updated"]),
        task("BE-API-REV", "GET /api/v1/revenue", "backend", blocked_by=["BE-MDL"],
             acceptance=["time series ok", "OpenAPI updated"]),
        task("BE-API-CAT", "GET /api/v1/categories", "backend", blocked_by=["BE-MDL"]),
        task("BE-API-PLT", "GET /api/v1/platforms", "backend", blocked_by=["BE-MDL"]),
        task("BE-API-CUS", "GET /api/v1/customers/insights", "backend", blocked_by=["BE-MDL"]),
        task("BE-API-FDB", "GET /api/v1/feedback", "backend", blocked_by=["BE-MDL"]),
        task("BE-EXP", "GET /api/v1/export/csv", "backend",
             blocked_by=["BE-API-KPI", "BE-API-REV", "BE-API-CAT",
                         "BE-API-PLT", "BE-API-CUS", "BE-API-FDB"]),
    ]
    be.append(task("BE-AUTH", "Auth0/RBAC skeleton", "backend",
                   labels=["security"], acceptance=["role checks present"]))
    be.append(task("BE-OBS", "Structured logs + correlation IDs", "backend",
                   labels=["observability"], acceptance=["request id on logs"]))
    be.append(task("BE-TST", "Unit+Integration tests (Testcontainers)", "backend",
                   blocked_by=["BE-API-KPI", "BE-API-REV"],
                   acceptance=["pytest green", ">= minimal coverage"]))

    fe.append(task("FE-DSN", "Shell/Layout/Routes", "frontend",
                   acceptance=["routes wired", "base theme applied"]))
    fe.append(task("FE-TYPES", "openapi-typescript client", "frontend",
                   acceptance=["types.ts generated", "typed client compiles"]))
    fe.append(task("FE-MOCKS", "MSW/Prism mocks", "frontend",
                   acceptance=["mocks respond", "dev proxy configured"]))
    fe += [
        task("FE-KPI", "KPI cards + filters", "frontend",
             blocked_by=["FE-DSN", "FE-TYPES"], acceptance=["renders", "no console errors"]),
        task("FE-REV", "Revenue chart + range selectors", "frontend",
             blocked_by=["FE-DSN", "FE-TYPES"], acceptance=["renders", "no console errors"]),
        task("FE-PLT", "Platform distribution (bars)", "frontend",
             blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-CAT", "Category ranks (bars)", "frontend",
             blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-CUS", "Customer insights panel", "frontend",
             blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-FDB", "Feedback timeline", "frontend",
             blocked_by=["FE-DSN", "FE-TYPES"]),
        task("FE-EXP", "Exports (CSV/PNG)", "frontend",
             blocked_by=["FE-KPI", "FE-REV", "FE-PLT", "FE-CAT", "FE-CUS", "FE-FDB"],
             acceptance=["CSV downloads"]),
    ]
    fe.append(task("FE-A11Y-PERF", "WCAG AA + code-split/memoize", "frontend",
                   labels=["a11y", "performance"]))
    fe.append(task("FE-TST", "Component + E2E smoke", "frontend",
                   blocked_by=["FE-KPI", "FE-REV"], acceptance=["tests green"]))

    return {"backend": be, "frontend": fe}


def format_lane(lane: List[Dict]) -> List[str]:
    entries = []
    for idx, t in enumerate(lane, 1):
        blockers = ", ".join(t["blocked_by"]) if t["blocked_by"] else "none"
        acceptance = ", ".join(t["acceptance"]) if t["acceptance"] else "see acceptance criteria"
        entries.append(
            f"{t['id']}: {t['title']} (blocked_by: {blockers}; acceptance: {acceptance})"
        )
    return entries


def main() -> int:
    ap = argparse.ArgumentParser(description="Print pre-lifecycle execution plan.")
    ap.add_argument("--name", help="Client/project name override")
    ap.add_argument("--config", default="workflow.config.json")
    ap.add_argument("--output-root", default="../_generated")
    args = ap.parse_args()

    cfg_path = ROOT / args.config
    if not cfg_path.exists():
        print(f"[plan] config not found: {cfg_path}", file=sys.stderr)
        return 2

    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))

    name = args.name or os.environ.get("NAME") or cfg.get("name")
    if not name:
        print("[plan] NAME is required (pass --name, export NAME, or set workflow.config.json)", file=sys.stderr)
        return 2

    industry = cfg.get("industry", "<unspecified>")
    project_type = cfg.get("project_type", "<unspecified>")
    frontend = cfg.get("frontend", "<unspecified>")
    backend = cfg.get("backend", "<unspecified>")
    database = cfg.get("database", "<unspecified>")
    auth = cfg.get("auth") or "none"
    deploy = cfg.get("deploy") or "n/a"
    compliance = cfg.get("compliance") or "none"

    brief_path = ROOT / "docs" / "briefs" / name / "brief.md"
    if not brief_path.exists():
        print(f"[plan] brief not found: {brief_path}", file=sys.stderr)
        return 2

    spec = BriefParser(str(brief_path)).parse()
    lanes = build_plan(spec)

    output_root = Path(args.output_root)
    project_dir = (output_root / name).resolve()

    frontend_lane = format_lane(lanes["frontend"])
    backend_lane = format_lane(lanes["backend"])

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

    steps: List[Dict[str, List[str]]] = [
        {
            "title": "Environment & Inputs",
            "items": [
                "Install prerequisites: Python ≥3.11, Node.js ≥18, Docker, jq, rsync, sha256sum, git.",
                f"Confirm brief exists at {brief_path}.",
                (
                    "Verify workflow.config.json values "
                    f"(industry={industry}, project_type={project_type}, frontend={frontend}, "
                    f"backend={backend}, database={database}, auth={auth}, deploy={deploy}, compliance={compliance})."
                ),
                (
                    "Export automation variables before running lifecycle: "
                    f"NAME={name} INDUSTRY={industry} PROJECT_TYPE={project_type} "
                    f"FE={frontend} BE={backend} DB={database} OUTPUT_ROOT={output_root}\n"
                    "   Optional: AUTH, DEPLOY, COMPLIANCE, NESTJS_ORM, FORCE_OUTPUT=1."
                ),
            ],
        },
        {
            "title": "Planning & Alignment",
            "items": [
                "Review brief acceptance criteria, compliance asks, and stakeholder priorities.",
                f"Generate planning artifacts for reference (dry run here only): "
                f"python scripts/plan_from_brief.py --brief '{brief_path}' --out '{project_dir}/PLAN.md'.",
                f"Validate DAG topology prior to generation: python scripts/validate_tasks.py "
                f"--input '{project_dir}/PLAN.tasks.json'.",
                "Inspect PLAN.md lanes and resolve dependencies/blocked tasks before coding.",
            ],
        },
        {
            "title": "Stack Preflight & Generation Prep",
            "items": [
                "Tooling doctor & template discovery: python scripts/doctor.py --strict "
                "&& ./scripts/generate_client_project.py --list-templates --name \"$NAME\" --industry \"$INDUSTRY\" --project-type \"$PROJECT_TYPE\".",
                (
                    "Preflight stack selection and capture evidence: "
                    "python scripts/select_stacks.py "
                    f"--industry '{industry}' --project-type '{project_type}' "
                    f"--frontend '{frontend}' --backend '{backend}' --database '{database}' "
                    f"--output '{project_dir}/selection.json' --summary '{project_dir}/evidence/stack-selection.md' "
                    f"{'--compliance ' + compliance if compliance != 'none' else ''}"
                ),
                "If select_stacks exits with code 3, resolve engine version mismatches before continuing.",
                (
                    "Preview scaffold (no writes): ./scripts/generate_client_project.py "
                    "--dry-run --workers 8 --yes "
                    f"--name '{name}' --industry '{industry}' --project-type '{project_type}' "
                    f"--frontend '{frontend}' --backend '{backend}' --database '{database}' "
                    f"{'--auth ' + auth if auth != 'none' else ''} "
                    f"{'--deploy ' + deploy if deploy != 'n/a' else ''} "
                    f"{'--compliance ' + compliance if compliance != 'none' else ''} "
                    f"--output-dir '{output_root}'"
                ),
            ],
        },
        {
            "title": "Full Scaffold Generation & Bootstrap (queued automation)",
            "items": [
                (
                    "When ready, run the one-shot generator (stops on any failure): "
                    f"NAME={name} INDUSTRY={industry} PROJECT_TYPE={project_type} "
                    f"FE={frontend} BE={backend} DB={database} OUTPUT_ROOT={output_root} make lifecycle"
                ),
                f"Inspect generated project at {project_dir}; confirm evidence/, PLAN.*, tasks.json, dist/ artifacts exist.",
                "Capture any generator logs or selection evidence for audit.",
            ],
        },
        {
            "title": "Frontend Implementation Sequence (execute in project workspace)",
            "items": [
                f"Work inside {project_dir}/frontend following tasks in order:"
            ] + frontend_lane,
        },
        {
            "title": "Backend & Data Implementation Sequence",
            "items": [
                f"Work inside {project_dir}/backend (and database/ if emitted) following tasks in order:"
            ] + backend_lane,
        },
        {
            "title": "Integration, Migrations, and Data Validation",
            "items": [
                "Create/adjust Alembic migrations, run `alembic upgrade head`, and reseed sample data (aligns with BE-SCH/BE-SEED/BE-MDL).",
                "Expose OpenAPI / typed clients once API endpoints are live; regenerate frontend types with `npx openapi-typescript` as needed.",
                "Update MSW/Prism mocks to match live responses (FE-MOCKS).",
                "Run smoke flows across dashboards/endpoints to confirm parity with PLAN acceptance.",
            ],
        },
        {
            "title": "Quality Automation & Gates",
            "items": [
                "Frontend lint & formatting: `cd frontend && npm run lint && npx prettier --check \"src/**/*.{ts,tsx,js,jsx,css,scss}\"`.",
                "Frontend type check & unit tests: `cd frontend && npx tsc --noEmit && npm test -- --ci --coverage`.",
                (
                    "Backend quality: `cd backend && black --check . && flake8` "
                    "(Python) and/or ESLint for Node backends; run `mypy app` when mypy is enabled."
                ),
                "Backend tests & coverage: `cd backend && pytest --cov=app --cov-report=xml:../coverage/backend-coverage.xml`.",
                f"Aggregate stack-aware tests: `PROJECT_ROOT={project_dir} ./scripts/install_and_test.sh` (already done by lifecycle but rerun after local changes).",
                f"Collect metrics: `PROJECT_ROOT={project_dir} python scripts/collect_coverage.py`, `collect_perf.py`, `scan_deps.py`.",
                f"Enforce gates: `PROJECT_ROOT={project_dir} python scripts/enforce_gates.py` (blocks if thresholds in gates_config.yaml are missed).",
            ],
        },
        {
            "title": "Local Verification & Developer Experience",
            "items": [
                "Run dev servers for experiential QA: `cd frontend && npm run dev`; `cd backend && uvicorn app.main:app --reload` (or generated entrypoint).",
                "Execute API/UI smoke via Postman/Newman or Playwright as applicable.",
                f"Run `make pipeline-validate ENV=local FRONTEND_URL=http://localhost:3000 API_URL=http://localhost:8000/health DB_URL=http://localhost:8000/health/db` once health endpoints exist.",
            ],
        },
        {
            "title": "Compliance, Evidence, and Packaging",
            "items": [
                f"Package deliverables: `PROJECT_ROOT={project_dir} NAME={name} ./scripts/build_submission_pack.sh`.",
                f"Validate compliance assets: `PROJECT_ROOT={project_dir} python scripts/validate_compliance_assets.py`.",
                f"Optional doc scan: `PROJECT_ROOT={project_dir} python scripts/check_compliance_docs.py`.",
                "Archive evidence/, dist/, coverage/, reports/ for hand-off.",
            ],
        },
        {
            "title": "CI/CD Enablement",
            "items": [
                "Populate GitHub secrets/vars required by .github/workflows/ci-secrets-preflight.yml:",
                "   secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ECS_EXECUTION_ROLE_ARN, AWS_ECS_TASK_ROLE_ARN.",
                "   vars: AWS_REGION, APP_NAME, ECS_CLUSTER_NAME, ECS_SERVICE_NAME, ECS_DESIRED_COUNT, FRONTEND_URL_STAGING, API_URL_STAGING, DB_URL_STAGING, FRONTEND_URL_PRODUCTION, API_URL_PRODUCTION, DB_URL_PRODUCTION.",
                "Enforce production environment protection/approvals in GitHub.",
                "Trigger ci-secrets-preflight (push/pr/dispatch) and resolve any missing configuration.",
                "Review ci-lint/ci-test/ci-nox outputs to ensure repo-level checks pass.",
            ],
        },
        {
            "title": "Deploy & Promote",
            "items": [
                "Staging: push to main to invoke .github/workflows/ci-deploy.yml (environment resolves to staging).",
                "Review staging artifact outputs, ECS & Vercel deploys, and health verification (`python scripts/health/check_deployment.py --environment staging ...`).",
                "Production: run GitHub Actions → “Promote to Production”, ensure approvals granted, wait for verify-and-gate + deploy-production jobs.",
                f"Post deploy: download reports/production-pipeline-validation.json and confirm smoke + newman tests passed.",
                "If failures occur, use scripts/rollback_backend.sh and scripts/rollback_frontend.sh via the rollback job or manually.",
            ],
        },
        {
            "title": "Observability & Continuous Ops",
            "items": [
                "Schedule/monitor nightly-observability workflow; ensure staging/production URL vars stay current.",
                f"Use `make pipeline-validate ENV=staging FRONTEND_URL={staging_urls['frontend']} API_URL={staging_urls['api']} DB_URL={staging_urls['db']}` for ad-hoc validation.",
                f"Use `make pipeline-validate ENV=production FRONTEND_URL={prod_urls['frontend']} API_URL={prod_urls['api']} DB_URL={prod_urls['db']}` post-promotion.",
                "Feed reports/ and evidence/ into dashboards or MCP tools for ongoing compliance.",
            ],
        },
        {
            "title": "Final Delivery & Retrospective",
            "items": [
                f"Hand off dist/{name}-submission, PLAN.md, PLAN.tasks.json, selection.json, and compliance logs.",
                f"Document residual risks or follow-ups in {project_dir}/reports/ or IMPLEMENTATION_SUMMARY.md.",
                "Capture implementation retrospective and update workflow.config.json/workflow docs for future engagements.",
            ],
        },
    ]



    for step_idx, step in enumerate(steps, 1):
        print(f"{step_idx}. {step['title']}")
        for item_idx, item in enumerate(step["items"], 1):
            print(f"   {step_idx}.{item_idx} {item}")
        print()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
