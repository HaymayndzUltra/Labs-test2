---
description: Execution Plan Orchestrator
alwaysApply: false
---

# Execution Plan Orchestrator

## [STRICT] Purpose and Scope
- From a saved client brief: build a dependency-aware plan (DAG), label Blocking vs Independent, split into parallel lanes, detect conflicts, and guide execution via short triggers.
- This rule ENDS at PR evidence. It MUST NOT propose or trigger deployment.

## [STRICT] Inputs
- brief_paths: one or more markdown/text files containing the client brief/requirements.
- context: name, industry, project_type. Optional: frontend, backend, database, auth, compliance, team lanes (Agent A/B/C names).
- policy (optional): selection rules to infer missing stack defaults.

## [STRICT] Outputs (single artifact per run)
- DAG of tasks with fields: id, title, area (backend|frontend|devops|db|qa|docs), estimate, blocked_by[], risks.
- Labels:
  - Blocking: task is on the critical path OR a prerequisite of ≥2 downstream tasks.
  - Independent: zero in-degree AND not on the critical path.
- Lanes:
  - Lane A (Backend), Lane B (Frontend), Lane C (DevOps/Compliance, only if needed).
  - Each lane is topologically ordered and capped at 3 concurrent tasks.
- Conflicts Table:
  - resource/file/port/db → contending tasks → guardrail (lock|sequence|mock|feature-flag).
- Guided Triggers:
  - BR, AP, LA, LB, LC, CS, QA, PR, HP with explicit go-signal rules.

## [STRICT] Initial Cognitive Lock
Before any action:
1) “This rule ends at PR evidence (no deploy).”
2) “I will read the brief(s), build a DAG, label Blocking/Independent, partition lanes, detect conflicts, and emit guided triggers.”

## [STRICT] Plan Construction Steps
1) Read brief_paths and extract:
   - Entities/data → DB schema tasks (design, migrations, seed).
   - Features/flows → endpoints/contracts → UI views/components.
   - Non-functional → security, logging, observability, CI gates.
2) Build edges (dependencies):
   - Schema → Seed → ETL/Tests.
   - Auth/RBAC → Protected endpoints/pages.
   - API contract → UI consumption (OR generate mock-server to decouple).
   - Infra/env pre-reqs → tasks that hit external services.
3) Compute critical path (longest path by estimates) → mark as Blocking.
4) Label Independent = zero in-degree and not on critical path.

## [GUIDELINE] Lane Partitioning
- Lane A (Backend): scaffold → schema → auth/RBAC → endpoints → tests.
- Lane B (Frontend): design system → layout/shell → pages → tests.
- Lane C (DevOps/Compliance, only if required): env/IaC → CI gates (SAST/DAST/SBOM) → observability/logging.
- Keep cross-lane edges intact; cap concurrency per lane at 3.

## [STRICT] Conflict Detection and Guardrails
- DB: migrations vs seed/tests → enforce sequence; recommend “migration lock”.
- Ownership: same file/route/module → branch, feature flag, or mock endpoints.
- Ports: 3000/8000 conflicts → suggest alternate ports; document mapping.
- Secrets/env: NEVER plaintext; env-injection only; BLOCK if .env enters VCS.
- Heavy installs/builds: ONLY in generated or temp dirs; NEVER inside template-packs.

## [STRICT] Trigger Contract (no deploy)
- BR (Brief→Plan Draft):
  - Read brief, build DAG, label Blocking/Independent, create Lanes A/B/(C), detect conflicts.
  - Emit: summary, Blocking list, Independent list, lanes with milestones, conflicts table, “Next: AP”.
- AP (Approve Plan):
  - Freeze plan; lock lanes/ownership; snapshot DAG.
  - Emit: go-signal “Run LA and LB in parallel” (LC only if present).
- LA (Launch Backend):
  - Execute Lane A tasks until first milestone or block.
  - On block: print blocker ids and two choices: (a) continue via unblocked tasks; (b) run CS for mock/guardrail resequence.
  - Emit: next allowed triggers (e.g., LB or CS).
- LB (Launch Frontend):
  - Same semantics as LA for Lane B.
- LC (Launch DevOps) [optional]:
  - Only if plan includes Lane C; same semantics as LA/LB.
- CS (Conflict Scan):
  - Re-scan conflicts and print concrete mitigations and any resequencing deltas.
- QA (Quality Gates):
  - Run tests/coverage/lints for COMPLETED scope only; report pass/fail with next steps.
- PR (PR Evidence):
  - Emit acceptance checks, artifacts summary, changelog points; STOP. NO DEPLOY.
- HP (Help/Status):
  - Print trigger cheat sheet, plan status, current go-signal, and blocked_on.

## [STRICT] Reporting Format (compact)
- Summary (1 short paragraph).
- Blocking tasks (critical path).
- Independent tasks (quick wins).
- Lanes A/B/(C): ordered tasks with milestone markers and blocked_by.
- Conflicts table with guardrails.
- Next Triggers line (e.g., “Next: AP then LA+LB”).

## [STRICT] Safety and Bounds
- MUST NOT propose or run deployment.
- MUST enforce dry-run-first semantics inside plan (design-level only).
- MUST avoid any installs/builds in template-packs.
- MUST show a go-signal after every trigger; user never guesses next step.

## [STRICT] Acceptance
- DAG + labels produced in <2s for typical briefs.
- ≤3 concurrent tasks per lane; parallel lanes where dependencies allow.
- Conflicts printed with at least one concrete mitigation each.
- Guided triggers listed with explicit go-signal; no deploy suggested or implied.