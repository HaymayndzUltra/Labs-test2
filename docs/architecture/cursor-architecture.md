---
title: ".cursor Architecture and Logic Flow"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Purpose

This document describes the complete architecture and logic flow of the `.cursor` directory so that an external AI system can integrate with and operate it without codebase access. It covers components, relationships, data contracts, and operational sequences.

## Top-Level Structure

- `.cursor/rules/`
  - `master-rules/`: global governance rules (BIOS, collaboration, quality, modification safety, precedence, auditor, documentation)
  - `common-rules/`: cross-domain conventions (UI, monorepo, interaction)
  - `project-rules/`: technology-specific guidance (React, Django, Terraform, etc.)
  - `security-compliance-overlay.mdc`: global security overlay
- `.cursor/dev-workflow/`
  - `README.md`: operator workflow guide
  - `router/`: policy-based decision router (`router.py`)
  - `policy-dsl/`: policy JSON + schema and linter
  - `ci/`: CI gates configuration and runners
  - `docs/`: router contract, external integration, onboarding
  - `schemas/`: JSON schemas (e.g., `routing_log.json`)
  - `routing_logs/`: emitted routing decisions (JSON)
  - `snapshots/`, `tests/`, `tools/`, `waivers/`: auxiliary surfaces for enforcement and overrides
- `.cursor/background-agents/`
  - Orchestration prompts and checklists for multi-agent runs

## Core Responsibilities

- Rules (governance): Define discovery, precedence, safety, collaboration protocol, and security overlay.
- Dev Workflow: Route decisions, enforce policies and gates, record evidence.
- Background Agents: Provide execution prompts, sequencing, and handoffs.

## Activation and Discovery Flow

1. Context Discovery (BIOS): `1-master-rule-context-discovery.mdc` mandates initial rule inventory, README discovery, and rule selection. Always announce loaded rules.
2. Governance Precedence: `9-governance-precedence.mdc` defines the canonical priority order for conflict resolution.
3. Collaboration Kernel: `2-master-rule-ai-collaboration-guidelines.mdc` governs planning, tool usage, task tracking, and progress reporting.
4. Security Overlay: `security-compliance-overlay.mdc` applies mandatory security/compliance checks across all flows.

## Decision Router

Location: `.cursor/dev-workflow/router/router.py`

Function: Select a policy based on context and precedence; emit an auditable routing log.

Inputs (Context Map):
- `git_commit` (string)
- `snapshot_id` (string|null)
- Arbitrary context markers (strings), e.g., `framework:react`, `contracts-first`, `risk:high`.

Process:
1. Load precedence from `master-rules/9-governance-precedence.mdc`.
2. Load and JSON-parse policies from `policy-dsl/*.json`.
3. Normalize `context` values to a single lowercase string; select policies where all `conditions[]` substrings match.
4. Sort matches by `priority` desc; tie-break using `precedence_tag` order from the precedence file.
5. Build routing log with required fields and persist to `dev-workflow/routing_logs/<session_id>.json`.

Outputs:
- Routing log JSON (see `schemas/routing_log.json`): required `session_id`, `timestamp`, `decision`, `rules_considered[]`, `winning_rule`; optional `confidence`, `override_reason`, `approver`, `snapshot_id`.

Reliability:
- If no policy matches, `decision: "none"` is returned; callers may retry with richer context.

## Policy DSL

Schema: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`

Required fields:
- `name` (string), `scope` (string), `priority` (integer ≥ 0), `actions` (string array)

Optional fields:
- `conditions` (string array), evaluated as substrings against the context
- `waiver_allowed` (boolean)
- `precedence_tag` (string) used for tie-breaking

Linting: `policy-dsl/lint_policy.py` validates policy JSON files against the schema.

## CI Gates

Config: `.cursor/dev-workflow/ci/gates_config.yaml`

Checks (examples): `schema_lint`, `rule_hygiene`, `ui_schema_checks`, `routing_log_schema_check`, `f8_waiver_check`, `security_critical_zero`, `snapshot_consistency`, `evidence_present`.

Artifacts referenced via `paths:` manifest/digest files in `/frameworks/**` must exist and be consistent. Failing checks block merges when `enforcement: block_on_fail`.

## Background Agents

Prompts package enables phased multi-agent execution (Discovery → Planning → UX → Architecture → Implementation → QA → Security → Release → Observability). Launch sequence and handoffs are defined in `launch-*.md` and `prompts/*.md`.

## Data Contracts

1) Routing Log (`schemas/routing_log.json`):
```json
{
  "session_id": "uuid",
  "timestamp": "RFC3339",
  "decision": "string",
  "confidence": 0.0,
  "rules_considered": ["name"],
  "winning_rule": "name",
  "override_reason": null,
  "approver": null,
  "snapshot_id": "snap-..."
}
```

2) Policy (`policy-dsl/_schema/schema.json`):
```json
{
  "name": "string",
  "scope": "string",
  "priority": 10,
  "conditions": ["key:value"],
  "actions": ["require:artifact"],
  "waiver_allowed": true,
  "precedence_tag": "F8"
}
```

## Integration Points (for External AI)

- Invoke Router: `python3 .cursor/dev-workflow/router/router.py [git_commit]` while setting a `snapshot_id` and embedding context markers.
- Manage Policies: write JSON files under `policy-dsl/` and run the linter; use `precedence_tag` for deterministic tie-break.
- Write Artifacts: produce manifests/digests under `frameworks/**` as required by `gates_config.yaml`.
- Record Evidence: store routing logs as build artifacts; reference in PRs.
- Waivers: create files under `dev-workflow/waivers/` with approver and reason; ensure logs capture `override_reason` and `approver`.

## Security & Compliance

Global overlay applies: encryption, access control, no hardcoded secrets, dependency scanning, audit logging, incident response readiness.

## End-to-End Flows

### A. Policy-Driven Decision
1. Generate snapshot → `snapshot_id`.
2. Author/validate policy JSONs.
3. Invoke router with `git_commit`, `snapshot_id`, and context markers.
4. Persist routing log; downstream automation reads `decision` and `actions` per winning policy to drive execution.
5. Run CI gates; publish evidence.

### B. Background Agent Swarm
1. Prepare integration branch; launch agents per prompts.
2. Agents produce contracts (OpenAPI, tokens, schemas) and PRs.
3. Router logs decisions; CI validates artifacts and compliance.
4. Waivers documented for any F8-critical overrides.

## Compatibility & Versioning

- Routing log schema: backwards compatible required fields.
- Policy DSL: stable required keys; optional keys may expand.
- Precedence file is canonical; routers must load and apply before tie-breaking.

