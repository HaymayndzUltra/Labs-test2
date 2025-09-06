# AI Governor Framework: System Architecture & Integration Guide

This document explains the full architecture, components, workflows, and integration mechanisms of the AI Governor Framework. It is designed for authors of AI systems (agents, IDE assistants, orchestration frameworks, CI bots) who want to operate in a governed, high-quality, and safe way.

---

## 1. Executive Summary

The AI Governor Framework transforms a generic AI into a reliable, context-aware engineering partner through two pillars:

- Governance Engine (rules): Passive rules that the agent auto-loads to enforce collaboration, quality, safety, and documentation integrity.
- Operator's Playbook (dev-workflow): Active protocols that humans or automations invoke to plan, execute, and audit work.

Agents integrate by implementing a context discovery protocol, routing workflow commands, enforcing master rules during execution, and producing audit/validation artifacts.

---

## 2. High-Level Architecture

```
AI Governor Framework
├─ Governance Engine (rules/)
│  ├─ Master Rules (foundational protocols)
│  └─ Common Rules (specialized domains)
└─ Operator's Playbook (dev-workflow/)
   ├─ Protocol 0: Bootstrap (Project Context)
   ├─ Protocol 1: PRD (Requirements)
   ├─ Protocol 2: Plan (Tasks)
   ├─ Protocol 3: Implement (Controlled Execution)
   └─ Protocol 4: Improve (Retrospective & Audit)
```

Directory expectations:
- `.cursor/rules/` (Cursor-compatible rules location)
- `.ai-governor/rules/` (canonical framework location)
- `docs/` (system and integration documentation)

---

## 3. Components

### 3.1 Governance Engine (rules)

- Master Rules (non-negotiable foundations):
  - Rule 1: Context Discovery (BIOS)
  - Rule 2: AI Collaboration Guidelines
  - Rule 3: Code Quality Checklist
  - Rule 4: Code Modification Safety Protocol
  - Rule 5: Documentation Context Integrity
  - Rule 6: Complex Feature Context Preservation
- Common Rules (domain expertise): UI foundations, interaction/a11y/perf, premium brand & enterprise gating, etc.
- Rule files use Markdown with YAML frontmatter metadata for discoverability:

```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: keyword1,keyword2 | SCOPE: scope | DESCRIPTION: One-sentence summary."
alwaysApply: false
---
```

- Governance precedence (highest → lowest):
  1) Security & Compliance overlays (e.g., F8)
  2) Auditor/Validator protocol
  3) Code Modification Safety protocol
  4) Code Quality checklist
  5) Complex Feature Context Preservation
  6) AI Collaboration Guidelines
  7) Documentation Context Integrity
  8) Dev-Workflow Router
  9) Project-level rules

### 3.2 Operator's Playbook (dev-workflow)

- Protocol 0: Bootstrap & Context Engineering
- Protocol 1: Requirements (PRD)
- Protocol 2: Technical Planning (Tasks)
- Protocol 3: Controlled Execution (Implementation)
- Protocol 4: Continuous Improvement (Retrospective & Audit)

Outputs include PRDs, task plans, execution reports, retrospectives, and audit/validation artifacts.

---

## 4. Core Workflows

### 4.1 Bootstrap (Protocol 0)
Purpose: Transform AI into project-specific expert via codebase analysis and rule activation.
- Configure rule directories (`.cursor/rules/`, `.ai-governor/rules/`).
- Map codebase, analyze architecture, generate project READMEs.
- Create project rules where needed.
- Activate Context Discovery (Rule 1).

### 4.2 PRD Creation (Protocol 1)
Purpose: Produce a comprehensive product requirements document with architectural placement.
- Interview for needs and constraints, pick target layers and comms patterns.
- Respect loaded rules (collaboration, context discovery).

### 4.3 Technical Planning (Protocol 2)
Purpose: Convert PRD into actionable, layered tasks.
- Generate task files, propose plan for approval.
- Apply Code Quality Checklist (Rule 3) to ensure quality gates are planned.

### 4.4 Controlled Execution (Protocol 3)
Purpose: Execute tasks safely and predictably.
- One parent task per session; clear progress signals.
- Strictly follow Code Modification Safety (Rule 4) and Documentation Integrity (Rule 5).
- Validate imports, signatures, and lint after edits.

### 4.5 Retrospective & Audit (Protocol 4)
Purpose: Improve code and process; produce audits.
- Self-review against loaded rules; gather improvements.
- Generate audit report artifacts; re-validate after fixes.

---

## 5. Integration Mechanisms for External AI Systems

External frameworks integrate by implementing the following protocols and interfaces. Names are descriptive; actual APIs depend on platform.

### 5.1 Context Discovery Protocol (Mandatory)
This is the core handshake before any action.

1) Rule Inventory
- Search `.cursor/rules/` and `.ai-governor/rules/` for `master-rules/` and `common-rules/` with `.md/.mdc`.
- Inventory paths only at this phase.

2) Operational Context Gathering
- Determine current working directory and project scope.
- Parse the user request for `TRIGGERS` keywords and intent.
- Identify operation type (create/modify/debug/deploy).
- Detect concerned files to infer tech stack.
- README discovery: from each concerned file upward, load nearest `README.md` files.

3) Relevance Evaluation & Selection
- Auto-select any rule with `alwaysApply: true`.
- Always load `2-master-rule-ai-collaboration-guidelines` when present.
- Prioritize by SCOPE → TRIGGERS → TAGS.
- If metadata missing, read ~15 lines only; discard if ambiguous.

4) Rule Announcement (Required Output)
- Announce loaded rules in one sentence before any other action.

Example:
"I have loaded the `2-master-rule-ai-collaboration-guidelines` and `4-master-rule-code-modification-safety-protocol` rules, which cover collaboration and safe edits for your request. I am ready to begin."

### 5.2 Dev-Workflow Command Router
Agents MUST support routing commands to protocol docs (usually under `/.cursor/dev-workflow`):
- analyze → `0-bootstrap-your-project.md`
- bootstrap/setup/initialize → `0-bootstrap-your-project.md`
- master plan/framework ecosystem/parallel development/background agents → `0-master-planner.md`
- prd/requirements/feature planning/product spec → `1-create-prd.md`
- task generation/technical planning/implementation plan → `2-generate-tasks.md`
- execute/implement/process tasks/development → `3-process-tasks.md`
- retrospective/review/improvement/post-implementation → `4-implementation-retrospective.md`
- parallel execution/coordination/multi-agent/background agents → `5-background-agent-coordination.md`

Behavior:
- Announce: `Applying Dev-Workflow: {protocol-file}` before following steps.

### 5.3 Auditor → Validator Sessions
Commands and outputs:
- `audit {framework} @ {commit|HEAD}`
  - Output: `reports/audit-{framework}-{YYYYMMDD-HHMM}.md` (Scope & Inputs, Traceability, Completeness, Risk Register, Score 0–100, GO/NO-GO, Auditor-Signoff)
- `validate {framework} using {audit_report}`
  - Output: `reports/validation-{framework}-{YYYYMMDD-HHMM}.md` (Agreement Matrix, Delta Requests, Decision, Blocking List, Validator-Signoff)
- Convergence: proceed only when Validator = GO and no disagreements remain.

### 5.4 Required Capabilities (Interfaces)
- Filesystem I/O (read/write/create).
- Markdown + YAML frontmatter parsing.
- Rule discovery (recursive search with include/exclude globs).
- Semantic search and literal grep.
- Structured edit application (diff-based preferred over raw dumps).
- Todo/task management with states (pending/in_progress/completed/cancelled).
- Lint/build diagnostics; non-interactive command execution.
- Background job orchestration; status reporting.
- Context window management; propose resets on major shifts.
- Standardized announcement hooks before protocol execution.

### 5.5 Extension Points
- New Rules: add `.md/.mdc` under `master-rules/`, `common-rules/`, or `project-rules/` with complete metadata.
- Security Overlays: add organizational overlays that outrank lower rules.
- Workflow Extensions: add domain-specific routers mapped to protocol docs.
- External Knowledge: pair in-repo governance with RAG/MCP connectors for external docs; ensure citation and provenance.
- Auditor/Validator Templates: add framework-specific report sections/criteria.

### 5.6 Minimal Integration Checklist
- [ ] Implement Context Discovery (inventory → context → selection → announcement)
- [ ] Enforce Rules 2–5 during execution (collab, quality, safety, docs)
- [ ] Support Dev-Workflow routing and announcements
- [ ] Support Auditor/Validator commands and I/O contracts
- [ ] Provide interfaces listed in 5.4
- [ ] Apply governance precedence and conflict handling

Smoke tests:
- Small code edit → safety protocol steps observed → docs synced → lints clean
- `audit sample@HEAD` → report created; `validate sample using {audit}` → validation report created

---

## 6. Operational Conventions

- File Types: `.md` and `.mdc` supported for rules; YAML frontmatter is mandatory for discovery.
- Readme Policy: Read nearest `README.md` files when scope changes; do not re-read if unchanged.
- Communication: Use structured prefixes when applicable (e.g., `[PROPOSED PLAN]`, `[TASK COMPLETED]`).
- Safety Escalation: Use the escalation/rollback directives from the Safety Protocol (Rule 4) on anomalies.

---

## 7. Example End-to-End Flows

### 7.1 Feature Delivery (Happy Path)
1) Load and announce rules.
2) Present plan → convert to todos → start first item.
3) Perform safe edits; validate imports/signatures/lint.
4) Sync documentation; mark tasks complete; summarize changes.

### 7.2 Release Gate (Audit → Validate)
1) `audit webapp@HEAD` → publish audit report.
2) Apply remediations → optionally re-run `audit`.
3) `validate webapp using reports/audit-webapp-*.md` → proceed only if GO.

---

## 8. References

- Root overview: `README.md`
- Rules overview: `RULES_DOCUMENTATION.md`
- Development workflow overview: `DEV_WORKFLOW_DOCUMENTATION.md`
- Consolidated documentation: `CONSOLIDATED_DOCUMENTATION.md`
- External integration details: `docs/external-frameworks-integration.md`

---

## 9. Glossary

- Agent: An AI system (assistant, bot, or service) executing governed tasks.
- Rule: A governance directive with metadata used for discovery and enforcement.
- Protocol: A step-by-step operational document in the dev-workflow.
- Overlay: A higher-priority governance layer (e.g., security & compliance) that overrides lower rules.