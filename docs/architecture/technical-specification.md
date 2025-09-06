---
title: "AI Governor Framework — Technical Specification"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## 1. Purpose & Scope

This specification documents the internal workings, data flow, and integration mechanisms of the AI Governor Framework. It is designed for external AI systems and orchestrators to understand, interoperate, and extend the framework without direct access to implementation code.

## 2. System Architecture (Overview)

Layers:
- Governance Rules: `.cursor/rules/**` (master/common/project-specific; security overlay)
- Dev-Workflow: `.cursor/dev-workflow/**` (router, policy DSL, CI gates, schemas, protocols)
- Background Agents: `.cursor/background-agents/**` (prompts, launch, scripts)
- Architecture Docs: `docs/architecture/**` (contracts and specs)

Key Components:
- Context BIOS (rule discovery & announcement)
- Governance Precedence (conflict resolution ordering)
- Collaboration Kernel (planning, tool usage, todos, comms)
- Modification Safety, Code Quality, Complex Feature Preservation, Documentation Sync
- F8 Security & Compliance Overlay
- Decision Router (policy evaluation and routing log emission)
- Policy DSL (control plane, schema-validated JSON)
- CI Gates (evidence enforcement)

## 3. Data Model & Contracts

### 3.1 Routing Log (required fields stable)
Path: `.cursor/dev-workflow/schemas/routing_log.json`
Fields:
- `session_id:string` — UUID
- `timestamp:string` — RFC3339
- `decision:string`
- `confidence:number` (optional)
- `rules_considered:string[]`
- `winning_rule:string`
- `override_reason:string|null` (optional)
- `approver:string|null` (optional)
- `snapshot_id:string|null` (optional)

### 3.2 Policy DSL
Path: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
Fields:
- `name:string`, `scope:string`, `priority:int>=0`, `actions:string[]`
- Optional: `conditions:string[]`, `waiver_allowed:boolean`, `precedence_tag:string`

### 3.3 CI Gates Config (YAML)
Path: `.cursor/dev-workflow/ci/gates_config.yaml`
Defines:
- `paths:` manifest/digest locations per framework
- `checks:` list of gates (`schema_lint`, `rule_hygiene`, `routing_log_schema_check`, `f8_waiver_check`, `security_critical_zero`, etc.)
- `enforcement:` blocking behavior

### 3.4 Reports & Evidence
- Audit/Validation: `reports/audit-*.md`, `reports/validation-*.md`
- Snapshots: JSON with `{ snapshot_id, git_commit, rules_manifest[] }`

## 4. Internal Workings

### 4.1 Context Discovery (BIOS)
Algorithm:
1. Inventory `.cursor/rules/{master-rules,common-rules,project-rules}` (and `.ai-governor/rules/**` if present).
2. Gather operational context: current scope path, user intent keywords, operation type.
3. Find nearest `README.md` chain from scope to root; load if not cached.
4. Rank rules: `alwaysApply:true` → `SCOPE` exact match → `TRIGGERS` keyword match → `TAGS` concept match.
5. Select subset and announce loaded rules.
Optimizations: do not re-read unchanged docs; re-run on context shifts.

### 4.2 Governance Precedence
Ordering (highest → lowest): F8 → Auditor/Validator → Modification Safety → Code Quality → Complex Feature → Collaboration → Documentation → Workflow Router → Project-rules.
Resolution:
- Higher priority wins; equal priority mergeable → compose; equal conflict → clarify/waiver and log override.

### 4.3 Collaboration Kernel
Behaviors:
- Plan-first; `[PROPOSED PLAN]` approval; tool-first execution; todos with in-progress/complete; concise status tags.
- Always read scope `README.md` on new requests. Apply standard communication tags.

### 4.4 Modification Safety, Quality, Complex Feature, Documentation
- Modification Safety: pre-analysis, multi-feature detection, dependency/use mapping, risk-based strategy (low/medium/high), surgical changes, post-validation, rollback protocol.
- Code Quality: enforce error handling, input validation, naming, nesting, plus project-specific rules.
- Complex Feature: detect signals, create context snapshot, identify immutables, defensive/incremental changes, rollback plan, proactive communication.
- Documentation Integrity: pre-code doc analysis for patterns; post-change doc audit and diff proposals; complex service local README first.

### 4.5 F8 Security & Compliance Overlay
- Always-on checks: secret scanning, SBOM on release, block critical CVEs (waiver with approver), threat modeling, input/output validation, authz, transport/storage security, privacy, audit, CI gates, IR.

### 4.6 Decision Router
Location: `.cursor/dev-workflow/router/router.py`
Flow:
1. Load precedence file; build rank map.
2. Load policies from `policy-dsl/*.json`; validate JSON parse (lenient).
3. Normalize context map to a lowercase string; select policies whose `conditions[]` substrings are all present.
4. Sort by `priority` desc; tie-break with `precedence_tag` per precedence order.
5. Build routing log; write to `.cursor/dev-workflow/routing_logs/<session_id>.json`; return same JSON to stdout.
Failure Modes: missing precedence → decision:"none"; invalid policy skipped; log write failure → fatal.

### 4.7 CI Gates Execution
Runner: `.cursor/dev-workflow/ci/run_gates.py`
Inputs: manifests/digests from `/frameworks/**`, snapshots, routing logs, waiver files.
Outcome: pass/fail per gate with blocking per `enforcement`.

## 5. Data Flow

### 5.1 Orchestrated Build (Nominal)
1. Snapshot generated → `snapshot_id` shared to agents/CI.
2. Policies authored/updated → linter passes.
3. Router invoked with `git_commit`, `snapshot_id`, context tokens → routing log emitted.
4. Background agents and pipelines consume `decision`/`actions`; produce artifacts.
5. CI gates validate artifacts (schemas, hygiene, security, waivers, logs); publish evidence.

### 5.2 Background Agent Swarm
1. Integration branch prepared; phase-based agent launches using prompts.
2. Agents generate contracts-first artifacts; open PRs with routing logs.
3. Handoffs between phases validated by gates; convergence across frameworks.

### 5.3 Security-Gated Release
1. F8 checks execute; SBOM produced.
2. Criticals require waivers with `approver`/`override_reason` → recorded in routing logs and PR.
3. Releases proceed only when gates pass or waivers approved.

## 6. Integration Mechanisms

### 6.1 Filesystem + CLI (Primary)
- Router:
  - `python3 .cursor/dev-workflow/router/router.py <git_commit>`
  - Context map provided via environment or wrapper; result written to routing logs and stdout.
- Policies:
  - Write JSON files under `.cursor/dev-workflow/policy-dsl/`; lint with `lint_policy.py`.
- CI Gates:
  - `python3 .cursor/dev-workflow/ci/run_gates.py` with repo-mounted artifacts.
- Background Agents:
  - Use `.cursor/background-agents/prompts/*.md` and launch guides; commit artifacts and logs via PRs.

### 6.2 Optional HTTP Wrapper
Endpoints:
- `POST /governor/router/run` → runs router; returns routing log JSON (contract-stable fields).
- `PUT /governor/policies/{name}` → writes/updates a policy; returns status.
- `POST /governor/ci/run` → runs gates; returns pass/fail with details.
Security: mTLS + service JWT scopes (`governor.router`, `governor.policy`, `governor.ci`).

### 6.3 AI System Adapters
See `docs/architecture/ai-integration.md`:
- LLM Inference/Streaming (JSON/SSE), Embeddings, Vector Store, Tool Calling, File Storage.
- Adapters normalize provider differences, implement retries, rate limits, and cost metrics.

## 7. Operational Policies

- Precedence is canonical; all overrides logged with `override_reason`, `approver`, `snapshot_id`.
- Routing logs retained as build artifacts; privacy redaction applied where needed.
- No secrets in code; config via secret managers; enforce SCA/SAST; generate SBOM on releases.
- Documentation kept in sync with code; retrospectives improve rules and protocols.

## 8. Compatibility & Versioning

- Stable required fields: routing log; policy DSL keys; snapshot structure.
- Contracts may add optional fields; consumers must ignore unknown keys.
- `.cursor/` directory layout stable; protocol docs authoritative.

## 9. Minimal Integration Checklist

- Mount repo and honor `.cursor/**` layout.
- Provide `snapshot_id` through orchestration.
- Author policies per schema; run linter; set `precedence_tag` where tie-breaks matter.
- Invoke router; persist routing log; propagate `decision` to automation.
- Produce artifacts required by gates; run gates; address failures or attach waivers.
- Apply F8 overlay requirements; keep evidence for audit.

