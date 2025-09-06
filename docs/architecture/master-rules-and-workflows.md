---
title: "Master Rules & Workflow Protocols — Logic Flows and Decision Trees"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Scope

This document explains each master rule and workflow protocol found under `.cursor/rules/master-rules` and `.cursor/dev-workflow/*`. It details activation triggers, reasoning, logic flow, decision trees, and interactions. It is designed for external AIs to operate correctly without repository access.

## Global Interaction Model

1) Context BIOS runs first and announces loaded rules.
2) Governance Precedence orders conflict resolution.
3) Collaboration Guidelines standardize planning, tool usage, todos, and progress updates.
4) Safety and Quality overlays enforce modification safety, code quality, complex-feature preservation, documentation sync, and security (F8).
5) Dev-Workflow Router maps user intents to protocol docs; protocols (0–5) orchestrate the lifecycle.

## Decision Trees by Master Rule

### 1. Context Discovery Protocol (The BIOS)
- Activation:
  - Always at task start; whenever a domain/location pivot occurs; before audits/retros.
- Reasoning:
  - Quality and safety depend on correct initial context; reduce wrong assumptions.
- Logic Flow:
  - Inventory rules in `.cursor/rules/` (+ `.ai-governor/rules/` if present).
  - Identify concerned files and upward `README.md` chain; load only if not already cached.
  - Rank rules: alwaysApply → scope match → triggers → tags; select.
  - Announce: "I have loaded ... I am ready to begin."
- Interactions:
  - Precedes all other rules; feeds Dev-Workflow Router and all protocols with selected rules.

Decision Tree:
```
Start → New task? yes → Inventory rules → Find READMEs → Select rules → Announce → proceed
                           ↘ context shift? yes → re-run BIOS
```

### 2. Governance Precedence
- Activation:
  - On any rule conflict or tie-break across policies/actions.
- Reasoning:
  - Deterministic, auditable conflict resolution.
- Logic Flow:
  - Apply priority stack: F8 → 8-Auditor/Validator → 4-Modification Safety → 3-Quality → 6-Complex Feature → 2-Collab → 5-Docs → 7-Workflow Router → project-rules.
  - If same priority and mergeable → compose; if conflicting → require clarification/waiver; log overrides.
- Interactions:
  - Consumed by router and any automation making composite decisions.

Decision Tree:
```
Conflict? → yes → Compare priority → higher wins
                          ↘ equal & mergeable → compose
                          ↘ equal & conflict → clarify/waiver + log
```

### 3. AI Collaboration Guidelines
- Activation:
  - Any multi-step or unstructured request; new session planning; tool usage.
- Reasoning:
  - Ensures crisp plans, explicit approvals, and consistent tool usage.
- Logic Flow:
  - Plan-first; present `[PROPOSED PLAN]`; await approval.
  - Use available tools first; manage todos; progress updates with fixed tags.
  - Always read scope `README.md` on new requests.
- Interactions:
  - Orchestrates how other rules are applied and communicated; escalations and conflicts must follow this.

Decision Tree:
```
Unstructured task? → yes → Draft plan → Present → Approved? → yes → Create todos → Execute with tool-first
                                                      ↘ no → revise/clarify
```

### 4. Code Modification Safety Protocol
- Activation:
  - On any code change, especially multi-feature files or risky areas.
- Reasoning:
  - Prevent regressions; maintain behavior; be surgical.
- Logic Flow:
  - Pre-analysis: confirm target, validate placement, read latest, load project-rules.
  - Detect multi-feature files; map dependencies, usages, tests.
  - Impact analysis → choose LOW/MEDIUM/HIGH strategy; escalate on triggers.
  - Implement with backward compatibility; incremental, defensive patterns.
  - Post-validation: imports, signatures, lint, multi-feature checklist, integration checks.
  - Reporting: validation plan, modification report; rollback on anomaly.
- Interactions:
  - Composes with Complex Feature rule; superseded by F8 on security.

Decision Tree:
```
Change requested → Pre-analysis → Multi-feature? → yes → inventory + risk assess → Risk: LOW/MEDIUM/HIGH
                                                              ↘ HIGH → refuse & escalate
Implement (surgical) → Validate (checklist) → Report → Done/rollback
```

### 5. Code Quality Checklist
- Activation:
  - For any new/modified code prior to completion.
- Reasoning:
  - Enforce robust handling, clarity, and standards.
- Logic Flow:
  - Error handling, input validation, naming, nesting; complement with project-rules.
- Interactions:
  - Runs alongside Modification Safety; F8 can override for security concerns.

Decision Tree:
```
Code produced? → yes → Validate against checklist → Issues? → fix → re-validate → pass
```

### 6. Complex Feature Context Preservation
- Activation:
  - When complexity signals present (long functions, algorithms, state machines, external API integration, >500 LOC, etc.).
- Reasoning:
  - Preserve critical logic and institutional knowledge; avoid context loss.
- Logic Flow:
  - Create context snapshot; identify “points of no return”.
  - Cross-validate all related files and flows; document constraints/edge cases.
  - Defensive changes; incremental enhancements; rollback plan.
  - Communicate detection, risk, and validation requests.
- Interactions:
  - Augments Modification Safety; still subject to F8 and Precedence.

Decision Tree:
```
Complexity signals? → yes → Snapshot + constraints → Cross-validate → Defensive strategy → Communicate → Proceed
```

### 7. Documentation & Context Integrity
- Activation:
  - After major work package completion, before finalization; when integrating complex external services.
- Reasoning:
  - Keep docs in lockstep with code; prevent drift.
- Logic Flow:
  - Pre-code: analyze similar docs; for complex services create local README first.
  - Post-change: locate nearest docs; audit vs changes; propose diffs if divergence.
- Interactions:
  - Triggered from Execution/Retrospective; subject to Collaboration comms.

Decision Tree:
```
Major change complete? → yes → Identify relevant docs → Compare → Divergence? → yes → propose update → get approval → apply
```

### 8. Auditor & Validator Protocols
- Activation:
  - On demand for audits or before releases; when governance requires independent review.
- Reasoning:
  - Independent, reproducible assurance with evidence.
- Logic Flow:
  - Auditor: generate `reports/audit-*` with scope, traceability, risks, score, GO/NO-GO.
  - Validator: consume audit + planner; generate `reports/validation-*` with agreement matrix and decision.
  - Converge: iterate until GO; escalate after 3 cycles; record signoffs.
- Interactions:
  - Integrated with Router, CI gates, and F8 overlay; logs routed via routing logs.

Decision Tree:
```
Need audit? → run Auditor → run Validator → GO? yes → proceed
                                     ↘ NO-GO → iterate (≤3) → escalate
```

### 9. F8 Security & Compliance Overlay
- Activation:
  - Always-on overlay; mandatory on releases and security-touching changes.
- Reasoning:
  - Enforce secrets hygiene, dependency safety, authz, privacy, audit.
- Logic Flow:
  - Secrets scan → SBOM on release → block on critical CVEs unless waiver → annotate evidence → apply security protocols (threat modeling, input validation, authz, TLS, privacy, audit, CI gates, IR).
- Interactions:
  - Highest precedence; can block or require waivers; interacts with all other rules.

Decision Tree:
```
Security touchpoints? → yes → Apply F8 checks → Critical finding? → yes → block/waiver → log → re-validate
```

### 10. How to Create Effective Rules (Meta)
- Activation:
  - When creating/modifying rules.
- Reasoning:
  - Ensure rules are structured, discoverable, precise, and exemplified.
- Logic Flow:
  - Place correctly; add minimal frontmatter; define persona and core principle; prefix directives; include ✅/❌ examples; run final checklist.
- Interactions:
  - Influences all rule authoring; consumed by contributors and automation.

Decision Tree:
```
New/changed rule? → structure + metadata → persona + principle → protocols with STRICT/GUIDELINE → examples → checklist → publish
```

## Dev-Workflow Protocols (0–5)

### Protocol 0: Project Bootstrap & Context Engineering
- Activation: project start or initial framework setup.
- Flow: configure rules (Cursor vs .ai-governor), map repo, validate key files with user, deep semantic analysis, synthesize principles, validate with user, generate READMEs and project-rules iteratively.
- Interactions: leverages BIOS; outputs docs and rules for subsequent protocols.

### Protocol 0: Master Planner & Background Agent Orchestration
- Activation: large-scale, parallel ecosystem builds.
- Flow: confirm scope of 10 frameworks; generate 3 strategies; craft prompts; create schedule; present comparison and recommendation.
- Interactions: feeds PRDs (Protocol 1), tasks (Protocol 2), and execution.

### Protocol 1: Unified PRD Creation
- Activation: when defining feature requirements.
- Flow: interview; detect layer; validate placement; produce PRD with architecture summary.
- Interactions: requires reading master README; feeds Protocol 2.

### Protocol 2: Technical Task Generation
- Activation: after PRD approval.
- Flow: run BIOS; analyze PRD; identify model personas; detect layers; propose branch; generate high-level → await “Go” → decompose per layer → save tasks file.
- Interactions: drives Protocol 3; references project-rules.

### Protocol 3: Controlled Task Execution
- Activation: when executing a tasks file.
- Flow: per-parent-task focus; announce loaded rules; pre-flight model check; strict execution loop; platform research; update task file; compliance check; gated commit proposal; pause-and-wait.
- Interactions: triggers Retrospective (Protocol 4) after each parent task; applies F8, Safety, Quality, Docs rules.

### Protocol 4: Implementation Retrospective
- Activation: after completing all tasks for a parent task or feature.
- Flow: run BIOS; review convo; audit code vs rules; synthesize findings; interview; propose improvements.
- Interactions: may update rules/docs; inputs future cycles.

### Protocol 5: Background Agent Coordination
- Activation: parallel framework execution.
- Flow: launch agents by phases; manage handoffs; validate gates; integrate; monitor; resolve conflicts; finalize ecosystem.
- Interactions: integrated with Router, gates, waivers, snapshots.

## Cross-Rule Interaction Matrix (Summary)

- Precedence: F8 > Auditor/Validator > Safety > Quality > Complex > Collaboration > Docs > Workflow Router > Project-rules.
- BIOS precedes all and refreshes on context shifts.
- Protocols consume rules; Router/CI enforce precedence and logging.

## Minimal Operational Checklist (for external AIs)

- Always run BIOS and announce loaded rules.
- Respect Governance Precedence; log overrides with reason and approver.
- Use Collaboration formats; plan first, tool-first, todos.
- Apply Safety, Quality, Complex, Docs, and F8 overlays as applicable.
- Route intents to protocols 0–5; follow each protocol strictly.
- Emit/consume routing logs and policies when integrating automation.

