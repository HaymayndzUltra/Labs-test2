---
title: "AI Governor — Communication & Integration Protocol"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Purpose

Define the end-to-end communication protocol for integrating the AI Governor Framework with external AI systems (agents, orchestrators, CI bots, LLM providers). Covers data formats, APIs, message flows, and handoff procedures.

## Integration Surfaces

1) Router Interface (decisioning and audit)
2) Policy Management (control plane)
3) Artifacts & CI Gates (evidence plane)
4) Background Agent Orchestration (execution plane)
5) LLM/Tool/Vector/File Adapters (data/compute plane)

## Transport & Addressing

- Primary transport: local filesystem + CLI within the repo workspace.
- Optional wrapper: HTTP endpoints that proxy CLI and file operations.
- Address all paths relative to repo root; preserve `.cursor/` structure.

## Data Formats

- JSON
  - Policies: `.cursor/dev-workflow/policy-dsl/*.json` (validated via `_schema/schema.json`)
  - Routing logs: `.cursor/dev-workflow/routing_logs/*.json` (per `schemas/routing_log.json`)
  - Optional: run metadata envelopes for HTTP wrappers
- Markdown
  - Reports: `reports/audit-*.md`, `reports/validation-*.md`
  - Protocols and rule files for human/AI consumption
- YAML
  - CI gates config: `.cursor/dev-workflow/ci/gates_config.yaml`

## Core Interfaces

### A. Router Protocol

- Invocation (CLI):
  - `python3 .cursor/dev-workflow/router/router.py [git_commit]`
- Inputs (Context Map):
  - `git_commit` (string), `snapshot_id` (string|null)
  - Context tokens embedded in values (e.g., `framework:react`, `risk:high`)
- Outputs:
  - JSON log file at `.cursor/dev-workflow/routing_logs/<session_id>.json`
  - Stdout mirrors the JSON
- Contract: `.cursor/dev-workflow/schemas/routing_log.json`
- Handoff:
  - External orchestrators MUST persist the routing log as a build artifact and reference it in PR descriptions or pipeline notes.

### B. Policy Management Protocol

- Filesystem API: write policy JSON to `.cursor/dev-workflow/policy-dsl/*.json`
- Schema: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- Linter: `python3 .cursor/dev-workflow/policy-dsl/lint_policy.py`
- Handoff:
  - Policies are reviewed via PR; once merged, router consumes immediately in subsequent runs.
  - Tie-breaks use `precedence_tag` matched against `master-rules/9-governance-precedence.mdc`.

### C. Snapshot & Evidence Protocol

- Snapshot generator (example): `python3 .cursor/dev-workflow/snapshots/generate_snapshot.py`
- Snapshot content (JSON): `{ snapshot_id, git_commit, rules_manifest[] }`
- Evidence artifacts:
  - Routing logs, audits, validations, manifests, digests
- Handoff:
  - Orchestrators propagate `snapshot_id` to all background agents and CI jobs; CI validates snapshot consistency.

### D. CI Gates Protocol

- Config: `.cursor/dev-workflow/ci/gates_config.yaml`
- Runner: `python3 .cursor/dev-workflow/ci/run_gates.py`
- Input artifacts: manifests/digests from `/frameworks/**`, routing logs, waivers
- Outcome: blocking/non-blocking per `enforcement`

### E. Background Agent Protocol

- Prompts: `.cursor/background-agents/prompts/*.md`
- Launch guidance: `.cursor/background-agents/launch-*.md`
- Handoff sequence (recommended):
  - Phase 1: Discovery, Planning, UX
  - Phase 2: Architecture, Implementation (FE/BE), Data/ML
  - Phase 3: QA, Security, Release, Observability
- Outputs: PRs targeting `integration` branch; attach routing logs and artifacts.

### F. LLM/Tool/Vector/File Integration

- See `docs/architecture/ai-integration.md` for adapter contracts.
- Required behaviors:
  - Normalize provider outputs (token usage, costs, latency)
  - SSE for streaming; JSON for non-stream
  - Tool calling via JSON Schema; service JWT and mTLS for internal calls

## Message & Handoff Flows

### Flow 1: Orchestrator-Driven Decisioning
1. Generate snapshot → capture `snapshot_id`.
2. Author/update policies → lint.
3. Invoke router with `git_commit`, `snapshot_id`, and context tokens.
4. Persist routing log; parse `decision` and `actions` to drive next steps.
5. Run CI gates; publish evidence; attach artifacts to PRs.

### Flow 2: Background Agent Swarm
1. Prepare `integration` branch and prompts.
2. Launch Phase 1 agents; collect outputs.
3. Invoke router per handoff; store logs.
4. Launch Phase 2/3; repeat; ensure artifacts meet gates.

### Flow 3: Security-Gated Release
1. Run F8 checks (secrets, SCA/SAST); generate SBOM.
2. If criticals found → require waiver with `approver` and justification.
3. Record in routing log and PR; block until resolved or waived.

## HTTP Wrapper (Optional)

To integrate with remote systems without filesystem mounts, provide thin HTTP endpoints that call the underlying CLI/filesystem APIs. Example endpoints:

- `POST /governor/router/run`
  - Body: `{ "git_commit": "...", "snapshot_id": "...", "context": { "tokens": ["framework:react", "risk:high"] } }`
  - Response: routing log JSON (same contract)

- `PUT /governor/policies/{name}`
  - Body: policy JSON (schema-compliant)
  - Response: `{ "status": "ok" }`

- `POST /governor/ci/run`
  - Body: `{ "gates_config": ".cursor/dev-workflow/ci/gates_config.yaml" }`
  - Response: `{ "status": "pass|fail", "details": [...] }`

Security:
- mTLS between services; service JWT scopes: `governor.router`, `governor.policy`, `governor.ci`.

## Contracts Summary

- Routing Log JSON: `.cursor/dev-workflow/schemas/routing_log.json`
- Policy DSL JSON: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- CI Gates YAML: `.cursor/dev-workflow/ci/gates_config.yaml`
- Audit/Validation Markdown: `reports/audit-*.md`, `reports/validation-*.md`

## Operational Requirements

- Persist all routing logs as build artifacts with retention.
- Reference `snapshot_id` and routing log in PRs.
- Prohibit secrets in code; prefer secret managers.
- Enforce precedence and record overrides with `override_reason`, `approver`.

## Compatibility Guarantees

- Routing log required fields are stable.
- Policy DSL required fields are stable; optional fields may expand.
- File layout under `.cursor/` is stable for integrations.

