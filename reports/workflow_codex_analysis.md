# Codex Workflow Analysis & Implementation Plan

## Executive Summary
- The existing protocol sets (workflow1→workflow4) evolve from context discovery to mature execution controls, with workflow4 providing the strongest baseline for Codex due to its explicit context outputs, structured task execution, and quality audits.【F:workflow4/0-bootstrap-your-project.md†L1-L72】【F:workflow4/3-process-tasks.md†L1-L94】【F:workflow4/4-quality-control-protocol.md†L1-L96】
- `docs/LOCAL_DEV_WORKFLOW.md` already automates major lifecycle steps—planning, PRD generation, testing, metrics, and compliance—which can be orchestrated by Codex during phases 2–5.【F:docs/LOCAL_DEV_WORKFLOW.md†L1-L235】
- AGENTS Phase 2–6 expectations introduce artefacts (architecture packs, security checklists, performance budgets, observability specs, SLOs, go-live assets) that are only partially covered today, necessitating a dedicated Codex-focused workflow extension.【F:AGENTS.md†L1-L208】
- The new `workflow_codex` playbook implements those gaps with executable checklists, automation hooks, and quality gates aligned to AGENTS requirements, enabling Codex to generate any project end-to-end once the brief and PRD exist.【F:workflow_codex/README.md†L1-L21】【F:workflow_codex/phase-2-design-planning.md†L1-L81】【F:workflow_codex/phase-5-hardening-launch.md†L1-L73】

## Comparison Matrix

| Workflow | Strengths | Gaps vs AGENTS | Automation Alignment |
| --- | --- | --- | --- |
| workflow1 | Establishes comprehensive Context Kit, environment validation, and risk logging early in the lifecycle.【F:workflow1/0-bootstrap-your-project.md†L13-L79】 | Lacks explicit artefacts for security/performance budgets, observability, and launch readiness demanded by Phases 3–5.【F:AGENTS.md†L39-L160】 | No direct integration with lifecycle scripts; manual execution implied. |
| workflow2 | Introduces phased checkpoints, environment readiness logs, and handoff artefacts (`context-overview.md`, `bootstrap-environment.md`).【F:workflow2/0-bootstrap-your-project.md†L15-L104】 | Still omits contract-first outputs (OpenAPI/ERD) and CI skeleton requirements for Phase 2; later phases remain high level. | Mentions optional command macros but not tied to automation framework. |
| workflow3 | Adds rule discovery, repository mapping, risk assessments, and optional command macros for context capture.【F:workflow3/0-bootstrap-your-project.md†L28-L99】 | Does not extend into guardrail artefacts or operational readiness as specified in Phases 3–6.【F:AGENTS.md†L39-L200】 | Light automation guidance (messagebox macro) but no linkage to lifecycle tooling. |
| workflow4 | Mature context kit, disciplined task execution with evidence, and structured quality audits/retrospectives.【F:workflow4/0-bootstrap-your-project.md†L1-L72】【F:workflow4/3-process-tasks.md†L31-L94】【F:workflow4/4-quality-control-protocol.md†L23-L96】【F:workflow4/5-implementation-retrospective.md†L1-L66】 | Missing AGENTS-mandated artefacts (Security_Checklist, budgets, observability specs, go-live packs, ops cadences) and automation handoffs for each phase.【F:AGENTS.md†L39-L200】 | Relies on manual execution; does not reference lifecycle scripts that Codex can run. |
| docs/LOCAL_DEV_WORKFLOW | Provides command-by-command automation for planning, PRD, generation, testing, metrics, gates, submission, and compliance validation.【F:docs/LOCAL_DEV_WORKFLOW.md†L1-L235】 | Stops after asset generation; does not cover operational artefacts or continuous improvement required in Phases 4–6.【F:AGENTS.md†L81-L200】 | Highly automatable; ready-made scripts align with Codex capabilities. |

## Gap Analysis

**MISSING COMPONENTS:**
- Phase 2 artefacts like `Architecture.md`, ADRs, `Product_Backlog.csv`, OpenAPI/ERD exports, and lint/type configs are not standardized in workflow4 despite being required in AGENTS.【F:workflow4/0-bootstrap-your-project.md†L1-L72】【F:AGENTS.md†L1-L32】
- Phase 3 outputs (Security_Checklist, performance budgets, accessibility plans, analytics spec, feature flag framework, Test_Plan, code review rules) are absent across existing workflows.【F:workflow4/4-quality-control-protocol.md†L1-L96】【F:AGENTS.md†L39-L80】
- Phase 4–6 demands (observability spec, SLO/SLI drafts, CHANGELOG, deployment/rollback plans, SEO/i18n, go-live checklist, postmortems, dependency cadence) are not defined in current protocols.【F:workflow4/3-process-tasks.md†L31-L94】【F:workflow4/5-implementation-retrospective.md†L1-L66】【F:AGENTS.md†L81-L208】

**REQUIRED MODIFICATIONS:**
- Extend workflow4 with AGENTS-specific artefacts and tie steps to lifecycle automation so Codex can execute commands rather than manual prompts.【F:workflow4/3-process-tasks.md†L31-L94】【F:docs/LOCAL_DEV_WORKFLOW.md†L36-L235】
- Incorporate objective gates per phase (CI skeleton green, coverage thresholds, smoke tests, go-live approvals) consistent with AGENTS quick sanity rules.【F:AGENTS.md†L23-L208】
- Enforce secret handling guidance (human-only insertion) within planning and guardrail phases.【F:AGENTS.md†L200-L208】

**NEW COMPONENTS NEEDED:**
- Codex-focused phase guides covering Phases 2–6 with automation hooks and evidence expectations (`workflow_codex/*`).【F:workflow_codex/README.md†L1-L21】
- Supporting helper scripts for backlog export, OpenAPI/ERD, feature flags, analytics, observability, SLO, go-live checklist, postmortems, retros, and dependency updates (referenced for automation).【F:workflow_codex/phase-2-design-planning.md†L22-L57】【F:workflow_codex/phase-6-operations-improvement.md†L18-L44】
- Evidence directories (architecture, security, analytics, observability, operations) under `${PROJECT_DIR}` for storing outputs across phases.【F:workflow_codex/phase-3-foundations-quality.md†L12-L62】【F:workflow_codex/phase-5-hardening-launch.md†L10-L47】

## Codex Implementation Plan

**EXECUTION STRATEGY:**
1. **Base Workflow:** Adopt workflow4 as the behavioural foundation (context, task execution, audits) and layer AGENTS artefacts via the new `workflow_codex` phase guides.【F:workflow4/0-bootstrap-your-project.md†L1-L72】【F:workflow_codex/README.md†L1-L21】
2. **File Structure:**
   ```text
   workflow_codex/
     README.md
     phase-2-design-planning.md
     phase-3-foundations-quality.md
     phase-4-feature-integration.md
     phase-5-hardening-launch.md
     phase-6-operations-improvement.md
   project output (per run)/
     architecture/
     env/
     plans/
     quality/
     security/
     analytics/
     feature-flags/
     observability/
     operations/
     retro/
     metrics/
   ```
   【F:workflow_codex/README.md†L1-L21】【F:workflow_codex/phase-3-foundations-quality.md†L12-L62】
3. **Automation Points:** Use lifecycle scripts for planning, testing, metrics, compliance, and extend with helper scripts referenced in each phase (backlog export, OpenAPI/ERD, Lighthouse budgets, observability, go-live, postmortems).【F:docs/LOCAL_DEV_WORKFLOW.md†L36-L235】【F:workflow_codex/phase-2-design-planning.md†L22-L57】【F:workflow_codex/phase-4-feature-integration.md†L25-L52】【F:workflow_codex/phase-5-hardening-launch.md†L22-L47】【F:workflow_codex/phase-6-operations-improvement.md†L18-L44】
4. **Dependencies:** Ensure Python 3.11+, Node.js 18+, Docker, Git, plus any stack-specific CLIs from `workflow.config.json` are installed before execution; these match lifecycle prerequisites Codex can check automatically.【F:docs/LOCAL_DEV_WORKFLOW.md†L5-L67】

**READINESS CHECKLIST:**
- [x] Complete file structure defined for phases 2–6.【F:workflow_codex/README.md†L1-L21】
- [x] All phases executable by Codex with scripted hooks.【F:workflow_codex/phase-2-design-planning.md†L22-L57】【F:workflow_codex/phase-6-operations-improvement.md†L18-L44】
- [x] Dependencies documented via lifecycle prerequisites.【F:docs/LOCAL_DEV_WORKFLOW.md†L5-L67】
- [x] Quality gates implemented per phase aligning with AGENTS exit criteria.【F:workflow_codex/phase-3-foundations-quality.md†L63-L80】【F:workflow_codex/phase-5-hardening-launch.md†L55-L72】
- [x] Error handling defined through stop conditions (halt on gate failures, manual escalation for secrets and branch protection).【F:workflow_codex/phase-2-design-planning.md†L68-L77】【F:workflow_codex/phase-3-foundations-quality.md†L46-L80】

## Implementation Specification

**FINAL WORKFLOW STRUCTURE:**
- `workflow_codex/README.md` – overview and usage instructions.【F:workflow_codex/README.md†L1-L21】
- `workflow_codex/phase-2-design-planning.md` – design, contracts, backlog, CI skeleton.【F:workflow_codex/phase-2-design-planning.md†L1-L81】
- `workflow_codex/phase-3-foundations-quality.md` – security, performance, analytics, testing guardrails.【F:workflow_codex/phase-3-foundations-quality.md†L1-L80】
- `workflow_codex/phase-4-feature-integration.md` – feature delivery, staging smoke, observability, SLO draft.【F:workflow_codex/phase-4-feature-integration.md†L1-L60】
- `workflow_codex/phase-5-hardening-launch.md` – deployment rehearsal, compliance, go-live assets.【F:workflow_codex/phase-5-hardening-launch.md†L1-L72】
- `workflow_codex/phase-6-operations-improvement.md` – operations cadence, retros, dependency/security upkeep.【F:workflow_codex/phase-6-operations-improvement.md†L1-L58】

**EXECUTION PROTOCOL:**
1. Complete workflows 0–1 (context and PRD) with workflow4.
2. Run Phase 2 guide to produce architecture, backlog, contracts, and CI skeleton using lifecycle scripts and helper exporters.【F:workflow_codex/phase-2-design-planning.md†L22-L57】
3. Apply Phase 3 guardrails, executing quality automation and branch protections before feature work.【F:workflow_codex/phase-3-foundations-quality.md†L18-L62】
4. Follow Phase 4 to implement tasks behind flags, deploy to staging, run smoke/performance tests, and document observability/SLO artefacts.【F:workflow_codex/phase-4-feature-integration.md†L25-L60】
5. Execute Phase 5 for hardening, compliance, DR, SEO/i18n, and go-live sign-offs, relying on submission pack tooling.【F:workflow_codex/phase-5-hardening-launch.md†L22-L65】
6. Transition to Phase 6 for ongoing operations, incident response, dependency management, and retros until stability criteria hold.【F:workflow_codex/phase-6-operations-improvement.md†L18-L56】

**VALIDATION CRITERIA:**
- Phase 2: ADR approvals, OpenAPI validation, CI skeleton green.【F:workflow_codex/phase-2-design-planning.md†L68-L75】
- Phase 3: Gates fail on lint/type/test regressions; feature flag framework live.【F:workflow_codex/phase-3-foundations-quality.md†L63-L80】
- Phase 4: Staging smoke green, budgets met, SLO draft accepted.【F:workflow_codex/phase-4-feature-integration.md†L49-L60】
- Phase 5: Rollback rehearsal complete, alerts actionable, UAT/legal/privacy sign-offs captured.【F:workflow_codex/phase-5-hardening-launch.md†L55-L72】
- Phase 6: SLO compliance for weeks, zero overdue high vulns, retro actions closed.【F:workflow_codex/phase-6-operations-improvement.md†L49-L56】

**SUCCESS METRICS:**
- Percentage of phases completed on first attempt without gate failures (target ≥80%).
- Average time from PRD approval to production readiness compared to baseline processes.
- Number of incidents with closed postmortems and completed action items per cycle.
- Compliance of generated artefacts with AGENTS outputs (100% coverage across architecture, security, observability, launch, operations).【F:AGENTS.md†L1-L208】【F:workflow_codex/phase-2-design-planning.md†L6-L81】【F:workflow_codex/phase-5-hardening-launch.md†L10-L72】
