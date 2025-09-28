# Phase 1 — PropWise Planning & Stack Validation

## Boundary Rationale
Phase 1 ends immediately after the dry-run generation (Lifecycle Step 6). Up to this point, all activities prepare or simulate outputs without mutating the project scaffold. This creates a clean decision gate before committing to file generation and downstream automation.

## Goals
- Establish an isolated PropWise project workspace with metadata-driven configuration.
- Validate tooling, plan artifacts, PRD/architecture documentation, task graph integrity, and stack selections without writing generated files.
- Produce reviewed evidence (PLAN documents, validation logs, PRD/ARCHITECTURE drafts, stack selection notes) to authorize full project generation.

## Inputs
- Approved brief: `docs/briefs/client01saas/brief.md` (PropWise metadata, routes, data bindings, env vars, acceptance criteria).
- Baseline configuration: `workflow.config.json` plus any overrides via metadata, CLI, or environment variables (`AUTH`, `DEPLOY`, `COMPLIANCE`, `NESTJS_ORM`).
- Required runtimes and CLIs: Python 3.11+, Node.js 18+, Docker, Git.
- Environment variables: `NAME=client01saas`, `INDUSTRY=saas`, `PROJECT_TYPE=fullstack`, `FE=nextjs`, `BE=fastapi`, `DB=postgres`, optional `AUTH=jwt`, `DEPLOY=docker`, `OUTPUT_ROOT`.

## Expected Outputs
- Provisioned project directory `${OUTPUT_ROOT}/${NAME}` with `evidence/` folder (no generated code yet).
- Health check report from `scripts/doctor.py` and template availability listing.
- `PLAN.md` and `PLAN.tasks.json` tailored to PropWise objectives (multi-tenant dashboard, audit trail, AI summary, PDF report).
- Validation log from `scripts/validate_tasks.py` confirming DAG integrity with PropWise features.
- `PRD.md` and `ARCHITECTURE.md` aligned to PropWise scope, along with validation evidence.
- `selection.json`, `evidence/stack-selection.md`, and (if applicable) `evidence/engine-substitutions.json`.
- Dry-run scaffold listing for stakeholder review.

## Step-by-Step Actions
1. **Provision Isolated Workspace (Lifecycle Step 0)**
   - Export required env vars from the brief metadata (routes, modules, env settings, acceptance criteria).
   - Run provisioning snippet or rely on `scripts/e2e_from_brief.sh` to create `${PROJECT_DIR}` and `evidence/`.
   - If re-running, set `FORCE_OUTPUT=1` to wipe the directory safely.
2. **Bootstrap Tooling (Step 1)**
   - Execute `python scripts/doctor.py --strict || true` to surface missing dependencies.
   - List available templates with `./scripts/generate_client_project.py --list-templates ...` and confirm Next.js + FastAPI support for PropWise.
3. **Plan from the Brief (Step 2)**
   - Run `python scripts/plan_from_brief.py --brief docs/briefs/${NAME}/brief.md --out ${PROJECT_DIR}/PLAN.md`.
   - Ensure the plan reflects PropWise objectives: multi-tenant flows, audit trail, AI monthly summary, PDF report, coverage ≥80%, P95 ≤300 ms, JWT auth.
4. **Validate the Task Graph (Step 3)**
   - Execute `python scripts/validate_tasks.py --input ${PROJECT_DIR}/PLAN.tasks.json` to confirm unique IDs, dependency integrity, and enum validity.
5. **Generate PRD & Architecture Summaries (Step 4)**
   - Run `python scripts/generate_prd_assets.py --name ${NAME} --plan ${PROJECT_DIR}/PLAN.md --tasks ${PROJECT_DIR}/PLAN.tasks.json --output-dir ${PROJECT_DIR} --frontend $FE --backend $BE --database $DB --auth ${AUTH:-} --deploy ${DEPLOY:-} --industry $INDUSTRY --project-type $PROJECT_TYPE`.
   - Validate with `python scripts/validate_prd_gate.py --prd ${PROJECT_DIR}/PRD.md --architecture ${PROJECT_DIR}/ARCHITECTURE.md`, ensuring PropWise routes, APIs, data model, and tenancy controls are captured.
6. **Select and Validate Stacks (Step 5)**
   - Run `python scripts/select_stacks.py --industry $INDUSTRY --project-type $PROJECT_TYPE --frontend $FE --backend $BE --database $DB --output ${PROJECT_DIR}/selection.json --summary ${PROJECT_DIR}/evidence/stack-selection.md`.
   - Apply engine substitutions when required and archive `evidence/engine-substitutions.json`.
   - Review evidence files to confirm they align with PropWise requirements (Next.js dashboard, FastAPI APIs, Postgres tenancy, JWT auth, Docker deploy, observability basics).
7. **Dry-Run Generation (Step 6)**
   - Execute `./scripts/generate_client_project.py ... --dry-run` using PropWise metadata to review the scaffold tree (pages `/dashboard`, `/tenants`, `/payments`, `/tickets`, `/tickets/[id]`, `/login`; AI summary endpoint; audit log tables; PDF report template references; seeds and env variables).
   - Review output listing for alignment with UI layout cards/charts, data bindings, and seeds before approving Phase 2.

## Acceptance Criteria
- Workspace exists with clean state, correct env vars, and no generated artifacts.
- All prerequisites verified; any missing tooling is documented with remediation steps.
- PLAN files capture PropWise scope (multi-tenant dashboard, JWT auth, AI monthly summary, audit trail, PDF report, coverage/perf/security gates) and are stored in `${PROJECT_DIR}`.
- Task graph validation passes with no unresolved dependencies.
- PRD and ARCHITECTURE drafts pass validation and describe PropWise modules, APIs, data model, tenancy, deployment, and observability expectations.
- Stack selection evidence confirms Next.js + FastAPI + Postgres + JWT + Docker profile, with substitutions logged if used.
- Dry-run output matches PropWise routes, components, data bindings, seeds, and env expectations without filesystem writes.
- Phase 1 review sign-off recorded, authorizing progression to Phase 2.
