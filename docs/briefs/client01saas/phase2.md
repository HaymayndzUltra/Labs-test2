# Phase 2 — PropWise Generation, Verification & Compliance Handoff

## Boundary Rationale
Phase 2 begins after the dry-run approval (Lifecycle Step 7 onward). Activities here create, validate, and package tangible project assets, culminating in compliance-ready deliverables and acceptance evidence.

## Goals
- Generate the PropWise scaffold with all required modules, seeds, and configuration.
- Install dependencies, execute automated tests, and sync task artifacts with generated code.
- Collect metrics, enforce governance gates, build submission packs, and validate compliance outputs per PropWise success criteria.

## Inputs
- Approved Phase 1 evidence: `PLAN.md`, `PLAN.tasks.json`, `PRD.md`, `ARCHITECTURE.md`, `selection.json`, `stack-selection.md`, dry-run review notes.
- PropWise brief metadata for routes, data bindings, seeds, env vars, acceptance tests, coverage/performance/security targets.
- Provisioned `${PROJECT_DIR}` from Phase 1 with environment variables still set (`NAME`, `INDUSTRY`, `PROJECT_TYPE`, `FE`, `BE`, `DB`, `AUTH`, `DEPLOY`, `OUTPUT_ROOT`).
- Required runtimes and services (Python 3.11+, Node.js 18+, Docker, Postgres container, etc.).

## Expected Outputs
- Generated PropWise project under `${OUTPUT_ROOT}/${NAME}` with frontend, backend, database, auth, audit trail, AI summary stubs, PDF template, seeds, and env files.
- Installation and test logs indicating pass/fail for each workspace (Next.js, FastAPI) and seeded data verification.
- Updated `tasks.json` aligned with generated assets and validation logs proving DAG integrity post-generation.
- Metrics artifacts (`metrics/perf.json`, coverage reports, dependency scan results) satisfying thresholds (coverage ≥ 80%, p95 ≤ 300 ms, zero critical/high vulnerabilities).
- Workflow automation evidence from `make workflow-automation` run.
- Submission pack in `${PROJECT_DIR}/dist/` containing evidence, metrics, manifests, and documentation.
- Compliance validation logs confirming audit trail, RLS enforcement, PRD.md & ARCHITECTURE.md presence, env configuration, and PropWise acceptance tests readiness.

## Step-by-Step Actions
1. **Generate the Project (Lifecycle Step 7)**
   - Run `./scripts/generate_client_project.py --name $NAME --industry $INDUSTRY --project-type $PROJECT_TYPE --frontend $FE --backend $BE --database $DB --auth ${AUTH:-} --deploy ${DEPLOY:-} --workers 8 --output-dir $OUTPUT_ROOT --yes ${FORCE_OUTPUT:+--force}`.
   - Confirm created directories reflect PropWise layout (Next.js pages, FastAPI routers, Postgres migrations with RLS, audit log models, AI monthly summary endpoint, PDF report template, seed fixtures, `.env.example`).
2. **Install Dependencies & Run Tests (Step 8)**
   - Execute `PROJECT_ROOT="$PROJECT_DIR" ./scripts/install_and_test.sh`.
   - Verify logs for successful installs, seeded data, unit/integration test results covering tenants, payments, tickets, AI summary stub, and JWT auth flows.
   - Remediate failures before proceeding; rerun until exit code is zero.
3. **Sync Tasks and Revalidate (Step 9)**
   - Run `python scripts/sync_from_scaffold.py --input ${PROJECT_DIR}/PLAN.tasks.json --root $PROJECT_DIR`.
   - Apply updates with `python scripts/sync_from_scaffold.py --input ${PROJECT_DIR}/PLAN.tasks.json --root $PROJECT_DIR --output ${PROJECT_DIR}/tasks.json --apply`.
   - Validate with `python scripts/validate_tasks.py --input ${PROJECT_DIR}/tasks.json` to ensure the generated assets maintain dependency fidelity.
4. **Collect Metrics & Enforce Gates (Step 10)**
   - Execute sequentially:
     - `PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_coverage.py || true`
     - `PROJECT_ROOT="$PROJECT_DIR" python scripts/collect_perf.py`
     - `PROJECT_ROOT="$PROJECT_DIR" python scripts/scan_deps.py || true`
     - `PROJECT_ROOT="$PROJECT_DIR" python scripts/enforce_gates.py`
   - Confirm metrics meet PropWise thresholds: line coverage ≥ 0.80, performance P95 ≤ 300 ms (`metrics/perf.json`), zero high/critical vulnerabilities.
   - Run consolidated automation: `PROJECT_ROOT="$PROJECT_DIR" make workflow-automation CONFIG=workflow/gate_controller.yaml` to capture orchestrated evidence.
5. **Build Submission Pack (Step 11)**
   - Execute `PROJECT_ROOT="$PROJECT_DIR" NAME="$NAME" ./scripts/build_submission_pack.sh`.
   - Ensure `${PROJECT_DIR}/dist/` contains evidence bundles, metrics, manifests, and PropWise documentation (PRD, ARCHITECTURE, gates reports).
6. **Validate Compliance Assets (Step 12)**
   - Run `python scripts/validate_compliance_assets.py | tee ${PROJECT_DIR}/evidence/validate_compliance_assets.log`.
   - Execute `python scripts/check_compliance_docs.py || true` to review documentation completeness.
   - Confirm compliance outputs support PropWise acceptance criteria: audit trail, RLS isolation, AI summary readiness, notifications stub documentation, Docker deployment readiness.

## Acceptance Criteria
- Generated codebase matches PropWise functional requirements (dashboard routes/cards, tenants/units/payments/tickets modules, AI summary endpoint, audit trail models, seeds, env vars).
- `install_and_test.sh` completes successfully, demonstrating seeded data accessibility and smoke tests for login, tenant CRUD, ticket creation, and AI summary endpoint.
- `tasks.json` sync reflects generated scaffold with validated dependencies and no graph errors.
- Coverage, performance, and dependency scans meet thresholds; enforcement script exits zero; workflow automation run captures required JSON evidence.
- Submission pack assembled in `dist/` with logs, metrics, manifests, PRD, ARCHITECTURE, and compliance artifacts ready for handoff.
- Compliance validation logs show no blocking gaps; PropWise acceptance tests (login→dashboard, tenant scope, ticket visibility, AI summary JSON, RLS isolation) are supported by evidence.
- Phase 2 sign-off indicates the PropWise scaffold is production-ready for deployment and auditing.
