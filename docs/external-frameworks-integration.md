# External Framework Integration Guide

This guide explains how external AI frameworks, agents, or IDE assistants can integrate with the AI Governor system. It specifies the protocols to implement, the interfaces to honor, and the extension points you can use to extend or customize governance.

Audience: builders of AI assistants, orchestration frameworks, IDE extensions, background agents, or CI bots that want to run governed development sessions.

---

## 1. Architectural Overview

The AI Governor has two complementary parts you must support:

- Governance Engine (`rules`): passive, always-on rules automatically discovered and applied by the agent.
- Operator's Playbook (`dev-workflow`): active, user-invoked protocols for planning, execution, and auditing.

Your integration MUST implement discovery and execution for both parts.

---

## 2. Directory Layout & Rule Discovery Interface

An agent MUST search for rule files in these locations (in order):

1. Project-local rules for Cursor compatibility: `.cursor/rules/`
2. Canonical framework location: `.ai-governor/rules/`

Within each location, look for these subfolders and file types:

- `master-rules/`, `common-rules/`, and optional `project-rules/`
- File extensions: `.md` or `.mdc`

A rule file MUST include YAML frontmatter with a compact description header:

```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: keyword1,keyword2 | SCOPE: scope | DESCRIPTION: One-sentence purpose."
alwaysApply: false
---
```

Interpretation requirements:
- alwaysApply: if true, auto-load the rule.
- TRIGGERS: keywords to match against the user request.
- SCOPE: use to prioritize rules for the active project area.
- TAGS: fuzzy intent matching, lower priority than TRIGGERS.

---

## 3. Context Discovery Protocol (Mandatory)

External systems MUST implement this four-step protocol before acting. It is the core handshake between your agent and the Governor.

1) Rule Inventory
- Search `.cursor/rules/` and `.ai-governor/rules/` for `master-rules/` and `common-rules/` files with `.md/.mdc`.
- Do not read contents yet; only inventory paths.

2) Operational Context Gathering
- Identify current working directory (to infer scope).
- Parse the user's request for keywords and intent.
- Detect operation type (create/modify/debug/deploy).
- Determine concerned files (if any) and infer tech stack.
- README discovery: from each concerned file upward, load nearest `README.md` files.

3) Relevance Evaluation & Selection
- Auto-select any rule with `alwaysApply: true`.
- Always select `2-master-rule-ai-collaboration-guidelines` if present.
- Prefer rules with matching SCOPE; then TRIGGERS; then TAGS.
- If metadata missing, read ~15 lines for title/intro only; discard if ambiguous.

4) Rule Announcement (Required Output)
- The agent MUST announce which rules were loaded, in one concise sentence, before any other action.

Example announcement:
"I have loaded the `2-master-rule-ai-collaboration-guidelines` and `4-master-rule-code-modification-safety-protocol` rules, which cover collaboration and safe edits for your request. I am ready to begin."

---

## 4. Operator's Playbook Protocols

### 4.1 Dev-Workflow Command Router
Agents MUST support routing the following commands to the corresponding protocol documents stored under `/.cursor/dev-workflow` (or the equivalent location in your environment):

- analyze → `0-bootstrap-your-project.md`
- bootstrap/setup/initialize → `0-bootstrap-your-project.md`
- master plan/framework ecosystem/parallel development/background agents → `0-master-planner.md`
- prd/requirements/feature planning/product spec → `1-create-prd.md`
- task generation/technical planning/implementation plan → `2-generate-tasks.md`
- execute/implement/process tasks/development → `3-process-tasks.md`
- retrospective/review/improvement/post-implementation → `4-implementation-retrospective.md`
- parallel execution/coordination/multi-agent/background agents → `5-background-agent-coordination.md`

Required behavior:
- Announce: `Applying Dev-Workflow: {protocol-file}` before following the protocol steps.

See also: `DEV_WORKFLOW_DOCUMENTATION.md` in this repository for a consolidated overview.

### 4.2 Auditor → Validator Protocol
Agents SHOULD implement Auditor/Validator commands and outputs:
- `audit {framework} @ {commit|HEAD}`
  - Output: `reports/audit-{framework}-{YYYYMMDD-HHMM}.md` with sections: Scope & Inputs (files + commit SHA), Traceability, Completeness, Risk Register, Score (0–100), Recommendation (GO/NO-GO), and `Auditor-Signoff` footer.
- `validate {framework} using {audit_report}`
  - Output: `reports/validation-{framework}-{YYYYMMDD-HHMM}.md` with: Agreement Matrix, Delta Requests, Decision (GO/NO-GO), Blocking List (if NO-GO), and `Validator-Signoff` footer.
- Convergence: proceed only when Validator = GO and no disagreements remain.

---

## 5. Code-Side Protocols to Enforce

External frameworks MUST enforce these master rules during execution:

- Code Modification Safety Protocol (`4-master-rule-code-modification-safety-protocol`)
  - Pre-mod analysis (target validation, dependency mapping, multi-feature detection)
  - Impact/risk assessment and strategy selection
  - Backward-compatible, surgical edits; multi-feature validations
  - Post-mod validation: imports, signatures, linting

- Code Quality Checklist (`3-master-rule-code-quality-checklist`)
  - Robust error handling and input validation
  - Clear naming and SRP orientation

- Documentation Context Integrity (`5-master-rule-documentation-and-context-guidelines`)
  - Pre-change doc analysis when patterns exist
  - Local setup READMEs for complex services
  - Post-change doc sync with diffs

- AI Collaboration Guidelines (`2-master-rule-ai-collaboration-guidelines`)
  - Plan-first, concise communication, tool-usage protocol
  - Task breakdown, progress updates, and completion signals

---

## 6. Required Capabilities (Interfaces)

Your integration MUST provide the following capabilities. Names are illustrative; exact APIs are platform-specific.

- Filesystem I/O: read, write, create files and directories.
- Markdown + YAML frontmatter parsing.
- Rule discovery: recursive file search with include/exclude globs.
- Semantic code search and literal grep.
- Structured edit application: diff-based edits preferred over raw dumps.
- Task/Todo tracking: create/update items with states (pending/in_progress/completed/cancelled).
- Lint and build diagnostics: read and act on linter/compiler output.
- Terminal/command execution: support non-interactive flags; stream or capture output.
- Background agent orchestration: run long tasks and report status.
- Context window management: propose resets for major context shifts.
- Announcement hooks: emit standardized announcements before protocol execution.

---

## 7. Extension Points

- New Rules: add `.md/.mdc` files with proper frontmatter under `master-rules/`, `common-rules/`, or `project-rules/`.
- Triggers/Tags: extend discoverability by refining `TRIGGERS` and `TAGS` metadata.
- Security Overlay: integrate organizational overlays (e.g., F8 security/compliance) that take precedence.
- Workflow Commands: add domain-specific routers and map them to protocol documents.
- External Knowledge: pair in-repo governance with a RAG/MCP connector to fetch external API docs on demand (e.g., Context7-style servers). Ensure citations are preserved.
- Auditor/Validator: add framework-specific audit templates and validation matrices.

---

## 8. Governance Precedence & Conflict Handling

When rules conflict, apply this precedence (highest → lowest):
1) Security & Compliance overlays (e.g., F8)
2) Auditor/Validator protocol
3) Code Modification Safety protocol
4) Code Quality checklist
5) Complex Feature Context Preservation
6) AI Collaboration Guidelines
7) Documentation Context Integrity
8) Dev-Workflow Router
9) Project-level rules

If irreconcilable, ask for human guidance using a standardized conflict message and pause execution.

---

## 9. Minimal Integration Checklist

- [ ] Implement the Context Discovery Protocol (inventory → context → selection → announcement)
- [ ] Load and enforce the four master rules listed in Section 5
- [ ] Implement Dev-Workflow routing announcements and steps
- [ ] Support Auditor/Validator commands and output contracts
- [ ] Provide the capabilities listed in Section 6
- [ ] Respect governance precedence and conflict resolution

Smoke tests:
- Run a small code edit task; verify safety protocol steps and doc sync occur.
- Run `audit sample@HEAD` then `validate sample using {latest_audit}`; verify both reports are produced.

---

## 10. Example Session Flows

Feature implementation (happy path):
1) Agent announces loaded rules.
2) Presents plan, converts to todos, starts first item.
3) Performs safe edits, validates imports/lint, updates docs.
4) Marks tasks complete; summarizes changes.

Audit/validation (release gate):
1) Run `audit webapp@HEAD`; publish audit report.
2) Apply remediations; re-run audit if needed.
3) Run `validate webapp using {audit_report}`; proceed only if GO.

---

## 11. References

- Root overview: `README.md`
- Rules overview: `RULES_DOCUMENTATION.md`
- Dev workflow overview: `DEV_WORKFLOW_DOCUMENTATION.md`
- Consolidated documentation: `CONSOLIDATED_DOCUMENTATION.md`