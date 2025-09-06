---
title: "External Frameworks Integration Guide — AI Governor"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Audience & Goal

This guide explains how external AI frameworks (agents, orchestrators, CI bots, model gateways) integrate with the AI Governor system. It lists required protocols, interfaces, and extension points, with practical steps and contracts.

## Prerequisites

- Access to the repository containing `.cursor/` and `docs/architecture/**`.
- Ability to mount the repo (preferred) or call optional HTTP wrappers.
- Service identity for CI/orchestrators (mTLS + service JWT if using HTTP).

## Integration Surfaces (What to Implement/Use)

1. Router Interface (decisioning)
2. Policy Management (control)
3. CI Gates & Artifacts (evidence)
4. Background Agent Orchestration (execution)
5. Adapters: LLM / Tools / Vector / File (data & compute)

## Quickstart Checklist

1) Mount the repo and read:
   - `docs/architecture/technical-specification.md`
   - `docs/architecture/governor-api.md`
   - `docs/architecture/communication-protocol.md`
2) Create/validate policies in `.cursor/dev-workflow/policy-dsl/`.
3) Generate a snapshot and store `snapshot_id`.
4) Invoke the router, persist routing logs.
5) Produce artifacts per CI gates; run gates; address failures/waivers.

## Protocols & Interfaces

### A. Router (Required)

- CLI: `python3 .cursor/dev-workflow/router/router.py [git_commit]`
- Input context (examples):
  ```json
  {
    "git_commit": "abc123",
    "snapshot_id": "snap-xyz",
    "context": {
      "tokens": ["framework:react", "contracts-first", "risk:low"]
    }
  }
  ```
- Output: routing log JSON saved to `.cursor/dev-workflow/routing_logs/<session_id>.json`
- Contract: `.cursor/dev-workflow/schemas/routing_log.json`
- Notes: On `decision: "none"`, enrich context or review policies.

### B. Policy DSL (Required for customization)

- Files: `.cursor/dev-workflow/policy-dsl/*.json`
- Schema: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- Example policy:
  ```json
  {
    "name": "prefer-contracts-first",
    "scope": "global",
    "priority": 10,
    "conditions": ["contracts-first"],
    "actions": ["require:openapi_v1", "require:tokens_v1"],
    "precedence_tag": "3-master-rule-code-quality-checklist",
    "waiver_allowed": false
  }
  ```

### C. CI Gates (Recommended)

- Config: `.cursor/dev-workflow/ci/gates_config.yaml`
- Runner: `python3 .cursor/dev-workflow/ci/run_gates.py`
- Inputs: manifests/digests under `/frameworks/**`, routing logs, waivers
- Outcome: pass/fail per `enforcement: block_on_fail`

### D. Background Agents (Optional for parallelization)

- Prompts: `.cursor/background-agents/prompts/*.md`
- Launch: `.cursor/background-agents/launch-*.md`
- Handoffs: Phase 1 → Phase 2 → Phase 3 per guide
- Outputs: PRs to `integration` with artifacts + routing log references

### E. Adapters (If extending data/compute plane)

- Refer to `docs/architecture/ai-integration.md` for contracts:
  - LLM Inference & Streaming (JSON/SSE)
  - Embeddings API
  - Vector Store CRUD/Query
  - Tool Calling registry (JSON Schema)
  - File/Object Storage (S3-compatible)
- Security: mTLS + service JWT; per-tenant scoping.

## Extension Points

1) New Policy Types
   - Add JSON policies with new `actions`; downstream automation interprets.
   - Use `precedence_tag` to influence tie-breaks deterministically.

2) Provider Adapters
   - Implement `LlmAdapter`-style interface (see AI Integration doc) and register via DI.
   - Normalize usage/cost; implement retries/backoff; respect rate limits.

3) Vector Store Backends
   - Implement collection CRUD and ANN query interface; bind via config.

4) Tool Registry
   - Publish tool JSON Schemas and endpoints under a registry service; ensure auth scopes exist.

5) CI Gates & Checks
   - Extend gates by adding checks to `gates_config.yaml` and providing check runners.

6) HTTP Wrapper
   - Provide `/governor/router/run`, `/governor/policies/{name}`, `/governor/ci/run` endpoints that forward to CLI.
   - Enforce mTLS and service JWT scopes.

## End-to-End Integration Flow

1. Prepare: mount repo; read specs; configure creds.
2. Author policies; run linter; open PR.
3. Generate snapshot; store `snapshot_id`.
4. Invoke router; persist routing log; parse `decision`/`actions`.
5. Execute actions (contracts-first artifacts, tokens, schemas).
6. Run CI gates; fix failures or attach waivers (record `approver`, `override_reason`).
7. Merge PRs to `integration`; promote per gates.

## Security & Compliance

- Apply F8 overlay; block critical findings unless waived.
- Do not commit secrets; use secret manager; redact logs.
- Retain routing logs; attach evidence in PRs.

## Troubleshooting

- `decision: "none"`: add more context tokens; verify precedence/policies.
- CI gate failures: inspect `checks` in `gates_config.yaml`; verify artifact paths/checksums.
- Policy tie-break surprises: ensure `precedence_tag` matches precedence file identifiers.

