---
title: "Technical Integration Specification — External AI × AI Governor"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Scope

Defines the required protocols, data structures, and communication mechanisms for integrating external AI systems (agents, orchestrators, CI bots) with the AI Governor Framework.

## Integration Model

- Transport: Filesystem + CLI (primary), optional HTTP wrapper.
- Addressing: Paths under `.cursor/**` are canonical.
- Security: mTLS + service JWT for HTTP; internal FS runs inherit CI runner identity.

## Protocols

### 1) Router Protocol

- Invocation (CLI): `python3 .cursor/dev-workflow/router/router.py [git_commit]`
- Inputs:
  - `git_commit` (string)
  - `snapshot_id` (string|null)
  - Context tokens (embedded in values), e.g., `framework:react`, `contracts-first`, `risk:high`
- Outputs:
  - Routing log JSON at `.cursor/dev-workflow/routing_logs/<session_id>.json`
  - Stdout mirrors JSON
- Contract: `.cursor/dev-workflow/schemas/routing_log.json`
- Behavior:
  - Load precedence → parse policies (`policy-dsl/*.json`) → substring match on context → priority sort → precedence tie-break → emit log

### 2) Policy Management

- Files: `.cursor/dev-workflow/policy-dsl/*.json`
- Schema: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- Linter: `python3 .cursor/dev-workflow/policy-dsl/lint_policy.py`
- Semantics:
  - `conditions[]`: substrings matched against concatenated context values
  - `actions[]`: opaque; downstream automation interprets
  - `precedence_tag`: ties resolved per `9-governance-precedence.mdc`

### 3) Snapshot Protocol

- Generator: `python3 .cursor/dev-workflow/snapshots/generate_snapshot.py` (or equivalent)
- Snapshot JSON:
  ```json
  {
    "snapshot_id": "snap-abc123",
    "git_commit": "abcdef...",
    "rules_manifest": [
      {"path": ".cursor/rules/master-rules/9-governance-precedence.mdc", "sha1": "..."}
    ]
  }
  ```
- Usage: persist `snapshot_id` through agent runs and CI; gates validate consistency.

### 4) CI Gates Protocol

- Config: `.cursor/dev-workflow/ci/gates_config.yaml`
- Runner: `python3 .cursor/dev-workflow/ci/run_gates.py`
- Inputs: manifests/digests referenced by `paths:`, routing logs, snapshots, waivers
- Outputs: pass/fail per gate with diagnostics; block per `enforcement`

### 5) Waiver Protocol

- Files: `.cursor/dev-workflow/waivers/*`
- Required: justification, approver, scope; reference in PRs and logs
- Router/gates MUST record `override_reason` and `approver` when applied

## Data Structures

### Routing Log
```json
{
  "session_id": "uuid",
  "timestamp": "RFC3339",
  "decision": "string",
  "confidence": 0.0,
  "rules_considered": ["string"],
  "winning_rule": "string",
  "override_reason": null,
  "approver": null,
  "snapshot_id": "snap-..."
}
```

### Policy
```json
{
  "name": "string",
  "scope": "string",
  "priority": 10,
  "conditions": ["key:value"],
  "actions": ["require:artifact"],
  "waiver_allowed": true,
  "precedence_tag": "F8-security-and-compliance-overlay"
}
```

### Snapshot (see above)

## Communication Mechanisms

Primary (FS/CLI):
- Containerized or remote agents MUST mount the repo and preserve `.cursor/` paths.
- Orchestrators call CLI, read/write JSON/YAML/MD per contracts.

Optional HTTP Wrapper:
- `POST /governor/router/run` → body: `{ git_commit, snapshot_id, context:{ tokens[] } }` → returns routing log JSON
- `PUT /governor/policies/{name}` → body: policy JSON → returns `{ status: "ok" }`
- `POST /governor/ci/run` → body: `{ gates_config }` → returns `{ status: "pass|fail", details: [...] }`
- Security: mTLS + JWT scopes (`governor.router`, `governor.policy`, `governor.ci`)

## Integration Steps

1) Read core specs in `docs/architecture/` (system, API, communication, technical spec).
2) Create policies and lint; set `precedence_tag` for deterministic ties.
3) Generate snapshot; store `snapshot_id` across executions.
4) Invoke router; persist routing log as build artifact; parse `decision`/`actions`.
5) Produce required artifacts (OpenAPI, tokens, manifests); run CI gates.
6) If blocking findings → create waiver with approver; re-run gates.

## Operational & Security Requirements

- Do not commit secrets; use secret managers; redact logs.
- Enforce F8 overlay; generate SBOM for releases; record overrides.
- Retain routing logs per retention and attach to PRs.

## Compatibility

- Routing log required fields are stable and backwards-compatible.
- Policy DSL required keys stable; optional fields may expand.
- `.cursor/` layout and contracts stable for integration.

