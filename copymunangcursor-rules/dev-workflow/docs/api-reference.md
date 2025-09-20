# AI Governor Framework — API Reference

## Version
- Spec version: 1.0
- Applies to repository layout with `.cursor/` present

## Overview
The AI Governor Framework standardizes discovery, decisioning, security, and CI enforcement for AI-assisted development. This reference specifies inputs, outputs, trigger conditions, and expected behaviors for each component.

---

## Rules System (Governance Layer)

### Artifacts
- Location: `.cursor/rules/`
  - `master-rules/` (global governance and protocols)
  - `common-rules/` (shared conventions: monorepo, UI foundations, interaction/a11y/perf)
  - `project-rules/` (technology/project-specific guidance)
  - `security-compliance-overlay.mdc` (always-on security/compliance overlay)

### Rule File Frontmatter (Required)
- Keys:
  - `description`: string using strict format
    - Format: `TAGS: [tag1,tag2] | TRIGGERS: a,b | SCOPE: scope | DESCRIPTION: one-line summary`
  - `alwaysApply`: boolean

### Triggers
- Context Discovery protocol activation
- CI rule hygiene checks

### Inputs
- User request context (keywords, intent)
- File scope (paths concerned)
- Repository topology

### Outputs
- Selected rule set for the session (announced by the assistant)
- Precedence constraints applied downstream by the Router and CI

### Expected Behaviors
- Rules tagged `alwaysApply: true` are loaded first
- Precedence defined by `master-rules/9-governance-precedence.mdc` resolves conflicts deterministically
- If metadata is malformed, selection uses limited read (title/first lines) and may discard rule

---

## Governance Precedence (Master Rule)
- Location: `.cursor/rules/master-rules/9-governance-precedence.mdc`
- Ordering (highest → lowest):
  1) F8 security/compliance overlay
  2) Auditor/validator protocol
  3) Code modification safety
  4) Code quality checklist
  5) Complex feature context preservation
  6) AI collaboration guidelines
  7) Documentation & context guidelines
  8) Dev-workflow command router
  9) `project-rules/*`

### Triggers
- Any rule conflict or decisioning

### Expected Behaviors
- Higher priority wins; merge non-conflicting equals; otherwise pause and require clarification or waiver
- Router logs must record `rules_considered` and `winning_rule`

---

## Context Discovery Protocol (BIOS)
- Location: `.cursor/rules/master-rules/1-master-rule-context-discovery.mdc`

### Triggers
- Start of any new task/session or when a context shift is detected

### Inputs
- Codebase structure, rules inventory, nearby `README.md` files

### Outputs
- Announced set of loaded rules

### Expected Behaviors
- Inventory master/common/project rules, evaluate by alwaysApply → scope → triggers → tags
- Do not re-read files already in context unless changed

---

## Security & Compliance Overlay
- Location: `.cursor/rules/security-compliance-overlay.mdc`

### Triggers
- Always active; CI gating

### Inputs
- Repository artifacts, dependency state, security findings (external)

### Outputs
- Compliance checklist expectations; CI `security_critical_zero` gate

### Expected Behaviors
- No hardcoded secrets; encryption, auth, vulnerability scanning, incident response readiness

---

## Dev-Workflow Router
- Location: `.cursor/dev-workflow/router/router.py`

### Purpose
Select an action based on policies and governance precedence; emit auditable routing logs.

### CLI
- Command: `python3 .cursor/dev-workflow/router/router.py [git_commit]`

### Triggers
- Called by CI or agents prior to execution; can be invoked interactively

### Inputs
- Files:
  - Precedence: `.cursor/rules/master-rules/9-governance-precedence.mdc`
  - Policies: `.cursor/dev-workflow/policy-dsl/*.json`
  - Routing log schema: `.cursor/dev-workflow/schemas/routing_log.json`
- Context (dict):
  - `git_commit` (string) — optional CLI arg
  - `snapshot_id` (string|null) — set by caller when snapshot is active
  - Standard context tokens (normalized to lower-case):
    - `framework:<name>`
    - `contracts-first`
    - `risk:<low|med|high>`
    - `stage:<plan|impl|qa|release>`

### Outputs
- Routing log JSON at `.cursor/dev-workflow/routing_logs/<session_id>.json`
  - Must conform to `schemas/routing_log.json`
  - Fields: `session_id`, `timestamp`, `decision`, `rules_considered[]`, `winning_rule`, optional `confidence`, `override_reason`, `approver`, `snapshot_id`
- Stdout: routing log JSON

### Expected Behaviors
- Load precedence order from the file
- List policies, evaluate `conditions` against provided context, sort by `priority`
- Choose `winning_rule` by priority; if none match, `decision: "none"` with `confidence: 0.0`
- Persist log and return its content

### Failure Modes
- Missing precedence file → empty precedence array (non-fatal)
- Invalid policy JSON → policy skipped
- Filesystem errors writing log → non-zero exit (Python exception)

---

## Policy DSL
- Location: `.cursor/dev-workflow/policy-dsl/*.json`
- Linter: `.cursor/dev-workflow/policy-dsl/lint_policy.py`
- Schema: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`

### Triggers
- Router evaluation; CI policy linting

### Policy JSON — Required Keys
- `name` (string)
- `scope` (string)
- `priority` (number)
- `actions` (array<string>) — controlled vocabulary, e.g., `require:tokens_v1`

### Optional Keys
- `conditions` (array<string>) — matched as substrings against context values
- `waiver_allowed` (boolean)

### Linter CLI
- Command: `python3 .cursor/dev-workflow/policy-dsl/lint_policy.py`
- Output: `OK` on success; prints JSON-formatted error list and exits 2 on failure

### Expected Behaviors
- If `jsonschema` is available, enforce full schema; otherwise basic required-key checks

---

## Routing Logs (Schema)
- Location: `.cursor/dev-workflow/schemas/routing_log.json`

### Required Fields
- `session_id` (string)
- `timestamp` (RFC3339 date-time string)
- `decision` (string)
- `rules_considered` (array<string>)
- `winning_rule` (string)

### Optional Fields
- `confidence` (number)
- `override_reason` (string|null)
- `approver` (string|null)
- `snapshot_id` (string|null)

---

## Snapshots
- Generator: `.cursor/dev-workflow/snapshots/generate_snapshot.py`

### Triggers
- Before background/parallel agent runs; prior to CI snapshot consistency checks

### Inputs
- Env: `GIT_COMMIT` (optional)
- Files: scans `.cursor/rules/**/*.mdc`

### Outputs
- File: `.cursor/dev-workflow/snapshots/snap-<id>.json`
  - `snapshot_id` (string)
  - `git_commit` (string)
  - `rules_manifest[]`: `{ path, sha1 }`
- Stdout: absolute path to the generated file

### Expected Behaviors
- Deterministic SHA1 of rule files; creates snapshots directory if missing

---

## CI Gates and Helpers
- Config: `.cursor/dev-workflow/ci/gates_config.yaml`

### run_gates.py
- Location: `.cursor/dev-workflow/ci/run_gates.py`
- Purpose: Validate evidence presence, checksums, security critical zero, and snapshot consistency
- CLI: `python3 .cursor/dev-workflow/ci/run_gates.py`
- Inputs:
  - Config YAML (internal constant path)
  - `frameworks/.snapshot_rev` (text rev)
  - Manifests referenced by config (security, qa, planning, observability)
- Outputs:
  - Stdout lines for each check
  - Exit: `0` on pass, `1` on fail
- Expected behaviors:
  - Report mismatches: `evidence_present`, `checksums_present`, `snapshot_consistency`, `security_critical_zero`

### rule_hygiene.py
- Location: `.cursor/dev-workflow/ci/rule_hygiene.py`
- Purpose: Validate rule frontmatter, metadata hygiene, and UI artifact presence
- CLI: `python3 .cursor/dev-workflow/ci/rule_hygiene.py`
- Inputs:
  - Scans `.cursor/rules/**/*.mdc`
  - UI artifacts: `docs/design/tokens.json`, any `docs/interaction/*.json`
- Outputs:
  - `RULE HYGIENE REPORT` (stdout)
  - JSON report: `.cursor/dev-workflow/ci/rule_hygiene_report.json`
  - Exit: `0` on success (report still lists issues), non-zero on fatal I/O errors
- Checks:
  - Frontmatter presence, `description` format parsing, `alwaysApply` present
  - TRIGGERS deduping suggestion, SCOPE validity
  - UI artifact presence summary

### normalize_project_rules.py
- Location: `.cursor/dev-workflow/ci/normalize_project_rules.py`
- Purpose: Normalize `project-rules` metadata (dedupe TRIGGERS, force SCOPE)
- CLI: `python3 .cursor/dev-workflow/ci/normalize_project_rules.py`
- Inputs: `.cursor/rules/project-rules/**/*.mdc`
- Outputs: In-place edits; stdout summary `Processed <checked> files, modified <changed>`

---

## Waivers
- Location: `.cursor/dev-workflow/waivers/`
- Templates: `waiver_template.md`, examples provided

### Triggers
- F8 (security/compliance) or other critical blocks encountered by CI/router

### Inputs
- Waiver document filled with justification and approver decision

### Outputs
- CI gate allowance when `Decision: approved` and referenced by logs/manifests

### Expected Behaviors
- Routing logs include `override_reason` and `approver` for audit

---

## Background Agents
- Package: `.cursor/background-agents/`
- Prompts: `.cursor/background-agents/prompts/*.md`
- Launch: `launch-checklist.md`, `launch-instructions.md`
- Git helper: `scripts/prepare_integration_branch.sh`

### Triggers
- Parallel framework development; plan-first execution

### Inputs
- Snapshot id passed to agent environments
- Repository snapshot (VM)

### Outputs
- Pull requests targeting `integration` branch
- Structured artifacts (tokens, OpenAPI, schemas) before implementation PRs

### Expected Behaviors
- Contracts-first: design tokens v1, OpenAPI v1, schemas v1 precede code changes
- Status format (date, phase, artifacts updated, risks, blockers, next)

---

## Data Retention & Security
- Routing logs: retain 90 days (hot), archive 2 years (cold)
- Snapshots: retain latest 10 (30-day purge unless referenced)
- Waivers: retain permanently with PR and approver audit trail
- Storage: encrypted, restricted to audit/CI systems

---

## Examples

### Example Policy
```json
{
  "name": "plan-first-ui",
  "scope": "ui",
  "priority": 90,
  "conditions": ["framework:react", "contracts-first"],
  "actions": ["require:tokens_v1", "require:interaction_specs"],
  "waiver_allowed": false
}
```

### Example Router Invocation
```bash
python3 .cursor/dev-workflow/router/router.py a1b2c3d
```

### Example Routing Log (abbrev.)
```json
{
  "session_id": "6f0b...",
  "timestamp": "2025-09-02T12:00:00Z",
  "decision": "plan-first-ui",
  "confidence": 1.0,
  "rules_considered": ["plan-first-ui"],
  "winning_rule": "plan-first-ui",
  "override_reason": null,
  "approver": null,
  "snapshot_id": "snap-b3138a81"
}
```

### Example Snapshot Output
```bash
$ python3 .cursor/dev-workflow/snapshots/generate_snapshot.py
/workspace/.cursor/dev-workflow/snapshots/snap-1a2b3c4d.json
```

---

## Compliance and Expectations Summary
- Load `alwaysApply` rules and announce loaded rules at task start
- Honor precedence ordering during conflicts; pause when unresolved
- Emit routing logs for every decision and validate against schema
- Maintain `security_critical_zero` unless approved waiver is present
- Use snapshots to gate parallelization and ensure artifact consistency

