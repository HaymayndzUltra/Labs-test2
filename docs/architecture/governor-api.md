---
title: "AI Governor Framework — API-style Reference"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Overview

This reference defines API-style contracts for the AI Governor Framework. Each component specifies inputs, outputs, trigger conditions, and expected behaviors. Transport is file-system + CLI by default, with optional wrappers for HTTP/agents.

## Conventions

- `MUST`, `SHOULD`, `MAY` follow RFC 2119 semantics.
- Paths are relative to repository root unless otherwise noted.

## Components

### 1) Context Discovery (BIOS)
- Location: `.cursor/rules/master-rules/1-master-rule-context-discovery.mdc`
- Triggers:
  - Start of any new task/session
  - Detected context shift (domain/location change)
- Input:
  - `scope_path` (string): path of concerned file or directory (optional)
  - `intent_keywords` (string[]): tokens from user request
  - `operation_type` (string): e.g., "create", "modify", "debug"
- Output:
  - `loaded_rules` (string[]): selected rule filenames
  - `readmes_loaded` (string[]): README paths consulted
  - `announcement` (string): normalized loaded-rules message
- Behavior:
  - Inventory `/.cursor/rules/**` (and `.ai-governor/rules/**` if present)
  - Rank by `alwaysApply` → `SCOPE` match → `TRIGGERS` → `TAGS`
  - Load nearest README chain upwards from `scope_path`
  - Emit announcement; cache to avoid re-reading unchanged files

### 2) Governance Precedence
- Location: `.cursor/rules/master-rules/9-governance-precedence.mdc`
- Triggers:
  - Any rule/policy conflict; router tie-breaks
- Input:
  - `rules_considered` (string[]): rules/policies being applied
  - `actions` (object[]): candidate actions per rule/policy
- Output:
  - `winning_rule` (string)
  - `composed_actions` (object[]): merged actions if non-conflicting
  - `require_clarification` (boolean)
- Behavior:
  - Apply fixed priority list; compose equal-priority mergeables
  - On conflict at equal priority, require clarification/waiver and log

### 3) Collaboration Guidelines
- Location: `.cursor/rules/master-rules/2-master-rule-ai-collaboration-guidelines.mdc`
- Triggers:
  - Unstructured multi-step tasks; start of protocols; tool usage decisions
- Input:
  - `request` (string)
  - `tools_available` (string[]): discovered tools
  - `plan_required` (boolean)
- Output:
  - `proposed_plan` (markdown)
  - `todo_items` (array)
  - `status_updates` (string[]): standardized updates
- Behavior:
  - Produce `[PROPOSED PLAN]`, await approval; prefer tool-first execution
  - Manage todos; announce progress via fixed-tag messages

### 4) Code Modification Safety
- Location: `.cursor/rules/master-rules/4-master-rule-code-modification-safety-protocol.mdc`
- Triggers:
  - Any code edit, especially multi-feature files
- Input:
  - `target_files` (string[])
  - `feature_signals` (object): size, handlers, routes
  - `dependencies` (string[]): discovered dependents/usages
- Output:
  - `impact_analysis` (object)
  - `risk_level` (LOW|MEDIUM|HIGH)
  - `validation_report` (markdown)
- Behavior:
  - Pre-analysis; dependency/use mapping; risk strategy; surgical changes
  - Post checks: imports/signatures/lint; multi-feature checklist; rollback on anomaly

### 5) Code Quality Checklist
- Location: `.cursor/rules/master-rules/3-master-rule-code-quality-checklist.mdc`
- Triggers:
  - Before finalizing any new/modified code
- Input:
  - `changed_files` (string[])
  - `language` (string)
- Output:
  - `quality_findings` (array)
  - `pass` (boolean)
- Behavior:
  - Enforce error handling, input validation, naming, nesting; complement with project rules

### 6) Complex Feature Context Preservation
- Location: `.cursor/rules/master-rules/6-master-rule-complex-feature-context-preservation.mdc`
- Triggers:
  - Complexity signals (algorithms, state machines, >500 LOC, deep integrations)
- Input:
  - `signals` (array)
  - `related_files` (string[])
- Output:
  - `context_snapshot` (markdown)
  - `preservation_plan` (markdown)
- Behavior:
  - Snapshot context; identify points of no return; cross-validate; defensive, incremental approach; rollback plan

### 7) Documentation & Context Integrity
- Location: `.cursor/rules/master-rules/5-master-rule-documentation-and-context-guidelines.mdc`
- Triggers:
  - After major work package; when integrating complex external services
- Input:
  - `modified_scope` (string[])
  - `nearest_docs` (string[])
- Output:
  - `doc_diffs` (array)
  - `sync_required` (boolean)
- Behavior:
  - Analyze similar docs; for complex services create local README; audit and propose diffs

### 8) Auditor & Validator
- Location: `.cursor/rules/master-rules/8-auditor-validator-protocol.mdc`
- Triggers:
  - Audit/validation commands; release candidates
- Input:
  - `framework` (string)
  - `commit` (string)
  - `audit_report` (path, for validator)
- Output:
  - `reports/audit-*.md`, `reports/validation-*.md`
  - `decision` (GO|NO-GO)
- Behavior:
  - Auditor produces scope/traceability/risks/score; Validator reconciles to decision; iterate ≤3

### 9) F8 Security & Compliance Overlay
- Location: `.cursor/rules/master-rules/F8-security-and-compliance-overlay.mdc`
- Triggers:
  - Always-on; mandatory on releases/security-affecting changes
- Input:
  - `change_set` (string[])
  - `release` (boolean)
- Output:
  - `security_findings` (array)
  - `block` (boolean)
  - `waiver_required` (boolean)
- Behavior:
  - Secret scan; SBOM on release; block on critical CVEs unless waived; evidence annotations

### 10) Rule Creation (Meta)
- Location: `.cursor/rules/master-rules/0-how-to-create-effective-rules.mdc`
- Triggers:
  - Creating/modifying rules
- Input:
  - `rule_draft` (markdown)
- Output:
  - `rule_final` (markdown with frontmatter)
- Behavior:
  - Enforce minimal frontmatter, persona, principle, strict/guideline prefixes, ✅/❌ examples

### 11) Dev-Workflow Router
- Location: `.cursor/dev-workflow/router/router.py`
- Triggers:
  - External orchestrators calling the router
- Input (CLI/FS):
  - `git_commit` (string)
  - `snapshot_id` (string|null)
  - `context` (map): values containing substrings like `framework:react`, `risk:high`
- Output:
  - `/.cursor/dev-workflow/routing_logs/<session_id>.json` per `schemas/routing_log.json`
  - `decision` (string), `rules_considered` (array), `winning_rule` (string)
- Behavior:
  - Load precedence; parse policies from `policy-dsl/*.json`; match on substring conditions; priority sort; tie-break with `precedence_tag`; emit log

### 12) Policy DSL
- Location: `.cursor/dev-workflow/policy-dsl/_schema/schema.json`
- Triggers:
  - Policy creation/update; router evaluation
- Input:
  - `policy.json` with keys: `name`, `scope`, `priority`, `actions`, optional `conditions[]`, `waiver_allowed`, `precedence_tag`
- Output:
  - Validated policy files; linter diagnostics
- Behavior:
  - Lint and load; router matches via substring search across context

### 13) Routing Log Schema
- Location: `.cursor/dev-workflow/schemas/routing_log.json`
- Triggers:
  - Router emission; CI validation
- Input:
  - JSON log from router
- Output:
  - Validation result
- Behavior:
  - Require `session_id`, `timestamp`, `decision`, `rules_considered[]`, `winning_rule`

### 14) CI Gates
- Location: `.cursor/dev-workflow/ci/gates_config.yaml`
- Triggers:
  - CI pipeline execution
- Input:
  - Manifests/digests under `/frameworks/**` and snapshot markers
- Output:
  - Pass/fail per check; blocking behavior per `enforcement`
- Behavior:
  - Run checks: `schema_lint`, `rule_hygiene`, `ui_schema_checks`, `routing_log_schema_check`, `f8_waiver_check`, `security_critical_zero`, etc.

### 15) Workflow Protocols (0–5)
- Location: `.cursor/dev-workflow/*.md`
- Triggers:
  - Routed intents or user invocation
- Input:
  - Protocol-specific context (PRD file, tasks file, framework scope)
- Output:
  - Generated artifacts (READMEs, rules, PRDs, tasks, reports)
- Behavior:
  - Follow protocol steps; enforce approvals and communication tags

## Error Handling

- Missing precedence file: Router returns `decision: "none"`; callers may enrich context and retry.
- Invalid policy JSON: Skipped by router; linter/CI fail the run.
- Log write failure: Fatal; callers must retry/halt.

## Security

- Apply F8 overlay across all flows; record waivers with approver and reason; preserve routing logs.

