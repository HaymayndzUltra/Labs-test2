# External AI Integration Specification — AI Governor

## Purpose
Define the protocols, data structures, and communication mechanisms for external AI systems (agents, orchestrators, CI bots) to integrate with the AI Governor Framework.

---

## Integration Overview
External systems integrate via three primary surfaces:
1) Router Invocation: obtain decisions and audit logs
2) Policy Management: author/update policies controlling decisions
3) CI & Artifacts: provide evidences, snapshots, waivers, and consume routing logs

---

## Protocols

### 1. Router Protocol
- Endpoint (CLI): `python3 .cursor/dev-workflow/router/router.py [git_commit]`
- Inputs (Context Map):
  - `git_commit` (string): commit SHA or build identifier
  - `snapshot_id` (string|null): active snapshot identifier
  - Additional context keys SHOULD be embedded into policy conditions via strings such as "framework:<name>", "contracts-first", "risk:high". The router evaluates substrings across context values.
- Outputs:
  - Routing log JSON written to `.cursor/dev-workflow/routing_logs/<session_id>.json`
  - Stdout: same JSON content
- Contract: `.cursor/dev-workflow/schemas/routing_log.json`
  - Required: `session_id`, `timestamp`, `decision`, `rules_considered[]`, `winning_rule`
  - Optional: `confidence`, `override_reason`, `approver`, `snapshot_id`

Usage Pattern:
```bash
SNAP=$(python3 .cursor/dev-workflow/snapshots/generate_snapshot.py | tail -n1)
python3 .cursor/dev-workflow/router/router.py $GIT_COMMIT | tee /tmp/routing_log.json
```

Reliability:
- External callers MUST store the emitted routing log as a build artifact.
- On `decision: "none"`, callers MAY re-run with enriched context.

### 2. Policy Management Protocol
- Filesystem API: `.cursor/dev-workflow/policy-dsl/*.json`
- Schema: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- Linter: `python3 .cursor/dev-workflow/policy-dsl/lint_policy.py`

Policy JSON (required keys):
```json
{
  "name": "<unique-name>",
  "scope": "<scope-string>",
  "priority": 0,
  "actions": ["require:tokens_v1"],
  "conditions": ["framework:react"],
  "waiver_allowed": false
}
```

Conventions:
- `conditions[]` are evaluated as substring matches against a context value map.
- `actions{}` are opaque to the router; downstream automation interprets them.

### 3. Snapshot Protocol
- Generator: `python3 .cursor/dev-workflow/snapshots/generate_snapshot.py`
- Output: file path on stdout and a JSON file containing `snapshot_id`, `git_commit`, and `rules_manifest[]` (path, sha1).
- External orchestrators MUST pass `snapshot_id` forward to background agents and CI jobs and set `frameworks/.snapshot_rev` where required by gates.

### 4. Waiver Protocol
- Filesystem API: `.cursor/dev-workflow/waivers/`
- Process:
  - Create a waiver file from `waiver_template.md` with justification and approver.
  - Reference the waiver in job notes; upon approval, gates allow override.
- Router/CI MUST record `override_reason` and `approver` in routing logs when an override is applied.

### 5. CI Gates Protocol
- Config file: `.cursor/dev-workflow/ci/gates_config.yaml`
- Runner: `python3 .cursor/dev-workflow/ci/run_gates.py`
- Inputs: manifests/digests referenced by config and `frameworks/.snapshot_rev`.
- Outputs: stdout diagnostics and non-zero exit on failure.

---

## Data Structures

### Routing Log (JSON)
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

### Policy (JSON)
```json
{
  "name": "string",
  "scope": "string",
  "priority": 10,
  "conditions": ["key:value"],
  "actions": ["require:artifact_a", "require:artifact_b"],
  "waiver_allowed": true
}
```

### Snapshot (JSON)
```json
{
  "snapshot_id": "snap-abc12345",
  "git_commit": "abcdef...",
  "rules_manifest": [
    {"path": ".cursor/rules/master-rules/9-governance-precedence.mdc", "sha1": "..."}
  ]
}
```

---

## Communication Mechanisms

### Invocation and Transport
- Primary transport is filesystem + CLI in the repository workspace.
- Containerized or remote agents MUST mount the repo and preserve `.cursor/` paths.
- Alternative transports (HTTP) can be implemented by wrapping CLI entrypoints and forwarding outputs; contracts remain identical.

### Context Passing
- Embed decision context as strings that policies match (`framework:react`, `contracts-first`, `risk:high`).
- Provide `snapshot_id` whenever background or parallel execution is involved.

### Artifact Exchange
- External AI systems SHOULD write artifacts (schemas, tokens, manifests) to repo paths referenced in gates config.
- Checksums MUST match manifest entries; otherwise `checksums_present` fails.

---

## Security & Compliance
- Do not commit secrets; follow `security-compliance-overlay.mdc` principles.
- Enforce `security_critical_zero` in CI; use waivers only with explicit approval.
- Retain routing logs per retention policy and store in encrypted artifact storage when exported.

---

## Reference Flows

### A. Orchestrator-Driven Build
1. Generate snapshot → capture `snapshot_id`.
2. Write/adjust policy JSONs → run policy linter.
3. Invoke router with `git_commit`, `snapshot_id`, and framework context.
4. Store routing log artifact.
5. Execute tasks dictated by the chosen policy actions.
6. Run CI gates and publish evidence manifests/digests.

### B. Background Agents
1. Receive `snapshot_id` and context (framework markers).
2. Use prompts to produce contracts-first artifacts.
3. Open PRs to `integration` with artifacts and routing log reference.

---

## Error Handling & Edge Cases
- Missing precedence file: router returns `decision: "none"`; external caller may fall back to defaults.
- Invalid policy JSON: linter and router skip invalid policies; CI should fail on lint errors.
- Log write failure: treat as fatal; retry or halt execution.
- Snapshot inconsistency: CI `snapshot_consistency` fails; regenerate snapshot or align manifests.

---

## Compatibility Guarantees
- Backwards compatibility for `routing_log.json` required fields.
- Policy DSL may add optional fields; required fields remain stable.
- Snapshot structure (`snapshot_id`, `git_commit`, `rules_manifest[]`) remains stable.