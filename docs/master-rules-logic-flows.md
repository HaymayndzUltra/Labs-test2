### Master Rules and Workflow Protocols — Logic Flows, Decision Trees, Activations, and Interactions

This document captures the end‑to‑end logic, decision trees, activation triggers, and interactions for the master rules and workflow protocols that govern development and collaboration.

---

## Global Orchestration & Precedence

- **Governance Precedence (highest → lowest)**
  - **F8 Security & Compliance Overlay** (critical security/compliance)
  - **8 Auditor & Validator Protocol** (audit and validation requirements)
  - **4 Code Modification Safety Protocol** (modification safety)
  - **3 Code Quality Checklist** (quality rules)
  - **6 Complex Feature Context Preservation** (context invariants)
  - **2 AI Collaboration Guidelines** (collaboration behavior)
  - **5 Documentation Context Integrity** (docs sync)
  - **7 Dev‑Workflow Command Router** (workflow routing)
  - Project‑level `project-rules/*` (local guidance)

- **Interaction model**
  - Conflicts are resolved by the precedence above; higher priority overrides lower when directives conflict.
  - Composition is preferred when non‑conflicting (combine actions from multiple rules).
  - On ambiguity or equal priority conflict, prompt for clarification and pause automation.

---

## BIOS: Context Discovery Protocol (The System BIOS)

- **Reasoning**: Good outcomes require correct, minimal context. BIOS initializes rule loading and scopes the environment.
- **Activation**: Mandatory on every new goal or context shift (domain, location, explicit pivot), and before any substantive action.
- **Inputs**: Current working directory, user request keywords/intent, operation type, concerned files.
- **Outputs**: Loaded rule set announcement; scoped `README.md` content; selected applicable rules.
- **Decision Tree**
  1. Inventory rules (root `.cursor/rules/` and `.ai-governor/rules/` → `master-rules/`, `common-rules/`).
  2. From concerned files, search upwards for `project-rules/` and collect candidate rules.
  3. Gather operational context: `pwd`, request intent/keywords, operation type, concerned files, hierarchical `README.md`s.
  4. Select rules by: alwaysApply, scope match, trigger keywords, tags; fallback: skim first lines if malformed.
  5. Announce loaded rules (blocking; must be first output).
  6. Monitor for context shift and re‑run if detected.
- **Interactions**: Precedes all other rules; determines which rules become active. Obeys Governance Precedence when a selected rule conflicts with others.

---

## Governance Precedence

- **Reasoning**: Deterministic conflict resolution and safety‑first governance.
- **Activation**: Always active; invoked on any conflict between rules or directives.
- **Decision Tree**
  1. Compare conflicting directives; choose higher‑priority rule.
  2. If priorities equal and mergeable → compose actions.
  3. If equal and not mergeable → pause and raise clarification; record override reason.
- **Interactions**: Guards all rule interactions; integrates with audit trail and emergency protocols.

---

## F8 Security & Compliance Overlay

- **Reasoning**: Enforce security, privacy, and compliance across data, code, and infrastructure.
- **Activation**: Always considered; mandatory on features touching auth, secrets, PII, networking, infra, or release gates.
- **Checklist Domains**: Data protection, code security, infra security, privacy compliance, audit trail, emergency protocols.
- **Decision Tree**
  1. Does change touch sensitive data/paths? If yes → apply encryption, access controls, sanitization, logging.
  2. Any secrets/credentials present? If yes → remove, rotate, and move to secure storage.
  3. Release/RC or critical path touched? If yes → require audits and validations.
- **Interactions**: Overrides lower rules when security requirements conflict with convenience or speed. Feeds `8 Auditor & Validator` triggers.

---

## 0 How to Create Effective Rules

- **Reasoning**: Ensure rules are discoverable, precise, and maintainable.
- **Activation**: When creating or modifying rules; meta‑governance tasks.
- **Decision Tree**
  1. Place rule in correct directory; name clearly.
  2. Add strict YAML frontmatter (`description`, `alwaysApply` only).
  3. Define persona and core principle; write protocol with `[STRICT]/[GUIDELINE]` prefixes.
  4. Provide DO/DON'T examples.
  5. Validate via final checklist before adoption.
- **Interactions**: Coordinates with BIOS for discoverability and with Governance Precedence for alwaysApply/kernel status.

---

## 2 AI Collaboration Guidelines

- **Reasoning**: Safe, efficient human‑AI collaboration with explicit planning and tooling.
- **Activation**: Any multi‑step or ambiguous request; every new task (read `README.md`).
- **Key Protocols**: Think‑First plan, Tool Usage (discover→execute), Task Planning & Execution (plan→todo→execute→update), Conflict/Doubt resolution, Recommendation self‑validation, Context window management, Governance modification protocol.
- **Decision Tree**
  1. Is task multi‑step? If yes → present plan for approval; else proceed directly.
  2. Are tools available for the action? If yes → use them; else fall back with notice.
  3. Conflict with rules? If yes → pause with `[RULE CONFLICT]` format.
  4. Ambiguity? If yes → ask `[CLARIFICATION QUESTION]`.
  5. After each task step → update todos and announce completion.
- **Interactions**: Precedes modification rules; defers to Precedence and F8; drives workflow with Router when commands present.

---

## 3 Code Quality Checklist

- **Reasoning**: Enforce robustness, clarity, and baseline standards.
- **Activation**: Any code creation/modification.
- **Decision Tree**
  1. Validate error handling for all I/O and parsing paths.
  2. Validate inputs at public boundaries; add guard clauses.
  3. Check naming clarity and reasonable function size/depth.
  4. Ensure project‑specific rules are also loaded (complement, not replace).
- **Interactions**: Works alongside `4 Safety Protocol`; cannot override it. Complements project‑rules.

---

## 4 Code Modification Safety Protocol

- **Reasoning**: Prevent regressions; enforce surgical, reversible changes.
- **Activation**: Any non‑trivial code modification.
- **Decision Tree**
  1. Pre‑analysis: confirm target/goal; verify file placement; read latest; load project rules; detect multi‑feature files; map dependencies/tests.
  2. Impact analysis: classify risk (LOW/MEDIUM/HIGH) and announce.
  3. Strategy: LOW → direct with validation; MEDIUM → surgical + confirmation; HIGH → refuse and escalate.
  4. Implementation: preserve signatures/public interfaces; isolate changes; prefer additive; feature flags/fallbacks; incremental approach.
  5. Post‑validation: imports, signatures, lints, sibling features, edge cases, compilation, tests.
  6. Reporting: validation plan, modification report; rollback if anomalies.
- **Interactions**: Higher precedence than quality/docs; coordinates with `6 Complex Feature` when complexity detected; invokes F8 where security‑touching.

---

## 5 Documentation Context Integrity

- **Reasoning**: Prevent divergence between code and docs.
- **Activation**: End of a major work package; before finalizing significant changes. Also pre‑read similar docs when extending patterns.
- **Decision Tree**
  1. Identify nearest relevant `README.md`/docs.
  2. Audit docs vs code changes (params, APIs, env vars, behaviors).
  3. If divergence → propose updates (as diff) and announce.
  4. Avoid re‑reading unchanged docs per optimization principle.
- **Interactions**: Runs after `4 Safety` validations; does not override higher security or safety directives.

---

## 6 Complex Feature Context Preservation

- **Reasoning**: Protect highly complex or refined features; preserve context.
- **Activation**: Detected complexity signals (large/complex functions, algorithms/state machines, external integrations, multi‑responsibility files, intricate UX) or collaborative refinement indicators.
- **Decision Tree**
  1. Create context snapshot (feature, complexity indicators, data flow, interdependencies, edge cases).
  2. Cross‑validate: read all related files; map entry/exit points; error handling; performance constraints.
  3. Defensive modification: preserve more than necessary; add not replace; maintain fallbacks; document assumptions.
  4. Communication: announce complex feature; confirm preservation constraints.
  5. If overwhelmed → declare complexity overwhelm and recommend human review.
- **Interactions**: Augments `4 Safety`; may gate changes pending confirmation; defers to F8 and Precedence on conflicts.

---

## 7 Dev‑Workflow Command Router

- **Reasoning**: Deterministic routing from commands to workflow protocols.
- **Activation**: When commands like `analyze`, `bootstrap`, `prd`, `task generation`, `execute`, `retrospective`, `parallel execution` are present.
- **Decision Tree**
  1. Map command → protocol under `/.cursor/dev-workflow/`.
  2. Announce `Applying Dev‑Workflow: {protocol-file}`.
  3. Follow the referenced protocol.
  4. If multiple/ambiguous → pick most specific or ask single clarification.
- **Interactions**: Cooperates with Collaboration and BIOS; does not supersede security/safety.

---

## 8 Auditor & Validator Protocol (incl. Auditor → Validator sessions)

- **Reasoning**: Independent, reproducible audits and validations for critical paths and releases.
- **Activation**: Audit/validate commands; critical path changes; release candidates.
- **Decision Tree**
  1. Auditor: `audit {framework}@{rev}` → produce `reports/audit-{framework}-{rev|ts}.md` with scope, traceability, completeness, risk, score, recommendation.
  2. Validator: `validate {framework} using {audit_report}` → produce `reports/validation-{framework}-{ts}.md` with agreement matrix, delta requests, decision.
  3. Convergence: proceed only on GO with no disagreements; otherwise iterate Auditor→Validator up to 3 cycles then escalate.
  4. Signoffs: record signoff lines with timestamp.
- **Interactions**: Integrates with Dev‑Workflow for orchestration; adheres to F8 overlay; may block execution despite lower‑priority approvals.

---

## Cross‑Rule Interaction Matrix (Practical Flow)

- **New multi‑step request**: BIOS → Collaboration (plan, tools, todos) → Router (if command present).
- **Code change**: Safety Protocol → Code Quality → Complex Feature (if triggered) → Docs Integrity → (optional) Auditor/Validator for critical paths.
- **Security‑touching change**: F8 overlay checks wrap the entire flow; may require audit/validation before proceeding.
- **Conflicts at any point**: Apply Governance Precedence; if unresolved and equal priority, ask for clarification and pause.

---

## Quick Decision Trees (Condensed)

- **Collaboration**
  - Multi‑step? → Plan→Approve→Todos→Execute→Update
  - Ambiguity? → Clarify
  - Conflict? → Rule conflict notice
  - Tools available? → Use; else fallback

- **Safety**
  - Multi‑feature/high‑impact? → MED/HIGH risk → Confirm/Refuse
  - Post‑checks failed? → Rollback; report

- **Complex Feature**
  - Complexity signals? → Snapshot→Cross‑validate→Defensive change→Confirm; Overwhelm? → Escalate

- **Docs**
  - Divergence after change? → Update docs with diff

- **Audit/Validate**
  - Critical path/RC? → Audit→Validate→Converge→GO

---

## Notes

- All rules operate under Governance Precedence; security and safety cannot be bypassed.
- BIOS re‑runs on context shifts; Documentation updates are batched at logical milestones.

