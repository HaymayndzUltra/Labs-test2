# Framework Integration Guide — AI Governor

## Purpose
Define extension points, contracts, and protocols to onboard new frameworks (e.g., React, Rails, Terraform) into the AI Governor Framework with consistent governance, CI gating, and agent orchestration.

---

## Required Artifacts (per new framework)
- Background Agent Prompt: `.cursor/background-agents/prompts/<NN>-<framework>.md`
- Planning Manifests & Digests (if using gates):
  - `frameworks/planning-<fw>/manifests/<cycle>/handoff_manifest.yaml`
  - `frameworks/planning-<fw>/digests/<cycle>-digest.md`
- Evidence Manifests (optional but recommended):
  - Include relevant artifacts (schemas, OpenAPI, tokens, ADRs) with `sha256` checksums
- Snapshot Rev Pin:
  - `frameworks/.snapshot_rev` updated to the active snapshot id for consistency gates

---

## Governance & Rules Requirements
- Add/Update project rules in `.cursor/rules/project-rules/` when framework-specific conventions are needed.
  - Frontmatter required: `description` in standard format; `alwaysApply` boolean.
  - Scope should be `project-rules` or `stack:<framework>`.
- Ensure compatibility with precedence ordering (`master-rules/9-governance-precedence.mdc`).
  - Avoid duplicating master/common responsibilities; specialize instead.

---

## Background Agent Protocol
- Prompts must follow plan-first, contracts-first approach:
  1) Tokens v1 (design/UX),
  2) OpenAPI/GraphQL schema v1 (if applicable),
  3) Data contracts/schemas v1,
  before implementation tasks.
- Status reporting format:
  - `date`, `phase`, `artifacts_updated`, `risks`, `blockers`, `next`.
- Branching:
  - Create PRs targeting `integration` branch. Use `scripts/prepare_integration_branch.sh` if needed.
- Inputs required by agents:
  - Active snapshot id (from `.cursor/dev-workflow/snapshots/*.json`).
  - Clear entrypoint tasks aligned to policy decisions.

---

## Policy DSL Integration
- Add or update Policy JSONs in `.cursor/dev-workflow/policy-dsl/` to recognize the framework.
  - Required fields: `name`, `scope`, `priority`, `actions`.
  - Use `conditions` that match context keys set by callers (e.g., "framework:react").
- Validate policies:
  - `python3 .cursor/dev-workflow/policy-dsl/lint_policy.py`
- Example policy snippet:
```json
{
  "name": "fw-react-plan-first",
  "scope": "framework:react",
  "priority": 80,
  "conditions": ["framework:react", "contracts-first"],
  "actions": {"require": ["tokens_v1", "interaction_specs", "openapi_v1"]}
}
```

---

## Router Interface (Caller Responsibilities)
- Invoke the router with context providing at least:
  - `git_commit` (string)
  - `snapshot_id` (string|null)
  - Framework indicator(s), e.g., include "framework:<name>" in context or in policy conditions.
- Router output contract:
  - Emits routing log JSON to `.cursor/dev-workflow/routing_logs/` per `schemas/routing_log.json`.
  - Callers must persist or attach this log to job artifacts.

---

## CI Gates Integration
- Update `.cursor/dev-workflow/ci/gates_config.yaml` to reference framework manifests/digests.
- Required checks (as applicable):
  - `evidence_present`, `checksums_present`, `routing_log_schema_check`, `policy_dsl_lint`,
    `snapshot_consistency`, `context_snapshot_check`, `security_critical_zero`, `rule_hygiene`, `ui_schema_checks`.
- Manifests must list artifacts with absolute or repo-relative paths and `sha256` hashes.

---

## Interfaces & Protocols Summary
- Inputs to Router:
  - Context map (keys as strings), including framework hints and snapshot id.
- Policy Interface:
  - `conditions[]` evaluated as substring matches over context values.
  - `actions{}` are opaque to the router; downstream tools interpret.
- Routing Log Schema:
  - Fields: `session_id`, `timestamp`, `decision`, `rules_considered[]`, `winning_rule`, optional `confidence`, `override_reason`, `approver`, `snapshot_id`.
- Snapshot Contract:
  - `snapshot_id`, `git_commit`, `rules_manifest[]` (path, sha1) — must be stable across run.
- Waiver Protocol:
  - Place approved waivers under `.cursor/dev-workflow/waivers/`; ensure routing logs include `override_reason` and `approver` when applicable.

---

## Framework-Specific Conventions (Examples)
- UI frameworks (React/NextJS): require `docs/design/tokens.json` and `docs/interaction/*.json` before feature PRs; enforce `ui_schema_checks`.
- API frameworks (FastAPI/Spring): require OpenAPI v1 checked-in before server endpoints; policies gate `implementation` pending spec.
- Infra frameworks (Terraform/K8s): require environment manifests and policy bundles; enforce plan/apply diff artifacts with checksums.

---

## Onboarding Checklist (New Framework)
1. Add prompt: `.cursor/background-agents/prompts/<NN>-<framework>.md`.
2. Add/update project rules in `.cursor/rules/project-rules/` with normalized frontmatter.
3. Add policies in `.cursor/dev-workflow/policy-dsl/` and run linter.
4. Create planning/evidence manifests under `frameworks/planning-<fw>/` and digests.
5. Generate snapshot; update `frameworks/.snapshot_rev` and propagate `snapshot_id` to agents.
6. Ensure CI gates reference new manifests and pass checks.
7. Run background agent(s) against `integration` and review PRs.

---

## Minimal Example (React)
- Files:
  - `.cursor/background-agents/prompts/06-react.md`
  - `.cursor/rules/project-rules/react.mdc`
  - `.cursor/dev-workflow/policy-dsl/fw-react.json`
  - `frameworks/planning-react/manifests/2025-09-02/handoff_manifest.yaml`
- Policy (`fw-react.json`):
```json
{
  "name": "fw-react-plan-first",
  "scope": "framework:react",
  "priority": 80,
  "conditions": ["framework:react"],
  "actions": {"require": ["tokens_v1", "interaction_specs"]}
}
```
- Expected: Router chooses `fw-react-plan-first` when context includes `framework:react`; CI requires tokens and interactions present before merge.