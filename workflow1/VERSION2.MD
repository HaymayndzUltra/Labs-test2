
# Codex Workflow Analysis & Implementation Plan

## Executive Summary
- Workflow version 1 remains the richest source of end-to-end governance assets—context kit creation, PRD alignment, exhaustive task decomposition, execution guardrails, and audit/retro protocols—which map cleanly to the guardrails demanded in Phases 2–6 of the AGENTS charter.【F:workflow1/0-bootstrap-your-project.md†L1-L78】【F:workflow1/1-create-prd.md†L1-L138】【F:workflow1/2-generate-tasks.md†L1-L107】【F:workflow1/3-process-tasks.md†L1-L89】【F:workflow1/4-quality-control-protocol.md†L1-L116】【F:workflow1/5-implementation-retrospective.md†L1-L103】
- Later workflow versions progressively compress instructions: workflows 2–3 simplify deliverable depth while workflow 4 optimizes for brevity. None, however, explicitly generate the architecture, backlog, CI skeleton, OpenAPI assets, or operational hardening artefacts that AGENTS Phase 2–6 mandate.【F:workflow2/2-generate-tasks.md†L1-L151】【F:workflow3/2-generate-tasks.md†L1-L118】【F:workflow4/2-generate-tasks.md†L1-L67】【F:AGENTS.md†L1-L198】
- `docs/LOCAL_DEV_WORKFLOW.md` already automates brief-to-scaffold generation (planning, PRD production, stack selection, validation, gate enforcement), providing the Codex-ready execution backbone we can extend with AGENTS artefact coverage.【F:docs/LOCAL_DEV_WORKFLOW.md†L1-L200】

## Phase 1: Structural Analysis

### Comparison Matrix
| Workflow | Alignment Strengths | Key Gaps vs AGENTS Phase 2–6 | Automation Hooks |
| --- | --- | --- | --- |
| **workflow1** | Full protocol stack (0–5) with detailed phase breakdowns, quality gates, and explicit evidence expectations, matching AGENTS demand for architecture, tasking, execution, QC, and retrospectives.【F:workflow1/0-bootstrap-your-project.md†L1-L78】【F:workflow1/1-create-prd.md†L14-L138】【F:workflow1/2-generate-tasks.md†L14-L107】【F:workflow1/3-process-tasks.md†L14-L88】【F:workflow1/4-quality-control-protocol.md†L14-L116】【F:workflow1/5-implementation-retrospective.md†L14-L103】 | Missing explicit production of C4 diagrams, ADR catalogues, CI skeleton, OpenAPI/ERD artefacts, performance budgets, analytics specs, feature flag frameworks, launch runbooks, and SLO/SLA evidence called out in AGENTS Phases 2–6.【F:AGENTS.md†L9-L160】 | Easily mappable to lifecycle automation because each phase specifies concrete outputs and checkpoints Codex can treat as tasks and validations.【F:workflow1/2-generate-tasks.md†L14-L70】【F:workflow1/3-process-tasks.md†L30-L89】 |
| **workflow2** | Retains protocol coverage but consolidates steps into higher-level guidance with clear severity scales and templates.【F:workflow2/0-bootstrap-your-project.md†L1-L82】【F:workflow2/4-quality-control-protocol.md†L1-L137】 | Further reduces artefact specificity—architecture, testing, and launch deliverables rely on narrative instructions without AGENTS-mandated outputs.【F:workflow2/2-generate-tasks.md†L15-L137】【F:AGENTS.md†L13-L160】 | Optional command macros exist but require manual interpretation; fewer hooks for automated evidence capture.【F:workflow2/2-generate-tasks.md†L129-L151】 |
| **workflow3** | Introduces operational guidelines and macros for automation, keeping quality gates per phase.【F:workflow3/2-generate-tasks.md†L22-L108】【F:workflow3/3-process-tasks.md†L22-L97】 | Drops depth around architecture deliverables, security/performance budgets, and launch readiness artefacts required by AGENTS.【F:workflow3/2-generate-tasks.md†L24-L108】【F:AGENTS.md†L39-L160】 | Messagebox macros hint at automation but still lack explicit file outputs Codex can generate without new specs.【F:workflow3/3-process-tasks.md†L97-L122】 |
| **workflow4** | Streamlined, action-oriented checklists per phase, facilitating quick Codex execution loops.【F:workflow4/0-bootstrap-your-project.md†L1-L71】【F:workflow4/2-generate-tasks.md†L14-L67】【F:workflow4/3-process-tasks.md†L21-L94】 | Omits mandatory artefact inventory (architecture pack, backlog CSV, OpenAPI/ERD, security/perf checklists, launch runbooks) and lacks explicit validation gates demanded in AGENTS.【F:workflow4/4-quality-control-protocol.md†L35-L95】【F:AGENTS.md†L9-L198】 | Minimal automation cues; would need augmentation with scripts/templates to meet Codex-ready standards.【F:workflow4/3-process-tasks.md†L31-L94】 |

### Evolution Observations
- Version progression trends from exhaustive governance (workflow1) to lightweight checklists (workflow4), trading precision for speed. Workflow1 is the only version enumerating cross-functional artefacts per protocol, enabling traceability across phases.【F:workflow1/4-quality-control-protocol.md†L14-L116】【F:workflow4/4-quality-control-protocol.md†L15-L96】
- Local development automation already covers planning, PRD generation, task validation, stack selection, gating, and metrics—capabilities that dovetail with workflow1’s detailed outputs and can be extended to satisfy AGENTS deliverables (e.g., generating Architecture.md, validating tasks, enforcing gates).【F:docs/LOCAL_DEV_WORKFLOW.md†L69-L200】

## Phase 2: Gap Identification

### Missing Components (vs AGENTS Phases 2–6)
- Architecture pack completeness: C4 diagrams, ADR catalog, and repo/branching policy artefacts are not produced in any workflow version.【F:AGENTS.md†L9-L26】
- Contract-first assets: OpenAPI specifications, ERDs, migration plans, and validated mock servers are absent from current protocols.【F:AGENTS.md†L11-L28】
- Quality rails: Security checklist with ASVS mapping, performance/accessibility budgets, analytics specification, feature flag framework, and code review policy outputs are missing.【F:AGENTS.md†L45-L76】
- Integration & launch artefacts: Observability specs, SLO/SLI drafts, CHANGELOG seed, deployment/runbook assets, DR/backup plans, SEO/i18n packs, UAT & legal sign-offs are not explicitly generated.【F:AGENTS.md†L95-L160】
- Post-launch operations: Structured cadence for dependency/security updates, retro log templates tied to action closure, and SLO monitoring loops require codification beyond existing retrospective guidance.【F:AGENTS.md†L166-L194】【F:workflow1/5-implementation-retrospective.md†L14-L103】

### Required Modifications
- Extend workflow1 protocols to include AGENTS-mandated artefact outputs, adding explicit steps for architecture deliverables (C4 set, ADR log updates), repository policy docs, and environment strategy definitions within Protocols 1–2.【F:workflow1/1-create-prd.md†L14-L69】【F:AGENTS.md†L9-L33】
- Expand Protocol 2 (task generation) to produce machine-readable backlog exports (`Product_Backlog.csv`), Sprint-0 plan, and link to CI skeleton creation tasks, ensuring backlog prioritization covers at least two sprints with acceptance criteria.【F:workflow1/2-generate-tasks.md†L14-L70】【F:AGENTS.md†L19-L33】
- Augment Protocol 3 with security, performance, accessibility, analytics, and feature flag guardrails plus automated gates that align with AGENTS Phase 3 outputs.【F:workflow1/3-process-tasks.md†L43-L89】【F:AGENTS.md†L45-L76】
- Update Protocol 4 to enforce staging smoke, observability validation, SLO draft capture, and CHANGELOG initialization to align with Phase 4 deliverables.【F:workflow1/4-quality-control-protocol.md†L14-L116】【F:AGENTS.md†L89-L111】
- Enhance Protocol 5 with deployment runbooks, rollback rehearsal evidence, DR testing, legal/privacy checks, SEO/i18n deliverables, and ongoing operations cadence per AGENTS Phase 5–6.【F:workflow1/5-implementation-retrospective.md†L14-L103】【F:AGENTS.md†L117-L194】

### New Components Needed
- Template pack for architecture artefacts (`Architecture.md`, `C4/<diagram>.md`, `ADRs/ADR-XXXX.md`) and automation hooks to populate them from planning outputs.【F:AGENTS.md†L9-L26】
- Contract-first tooling workflows (`openapi.yaml`, ERD diagrams, migration plans, mock server scripts) integrated with existing automation steps (`plan_from_brief.py`, `generate_prd_assets.py`).【F:docs/LOCAL_DEV_WORKFLOW.md†L69-L104】【F:AGENTS.md†L11-L28】
- Quality rail assets: `Security_Checklist.md`, `perf/budgets.json`, `A11y_Test_Plan.md`, `Analytics_Spec.xlsx`, `Feature_Flags.md`, `Test_Plan.md`, `Code_Review_Checklist.md`, plus CI pipeline templates enforcing these gates.【F:AGENTS.md†L45-L76】
- Launch-readiness pack: `Deployment_Runbook.md`, `Rollback_Plan.md`, `Prod_Observability.md`, `Backup_Policy.md`, `DR_Plan.md`, `GoLive_Checklist.md`, `SEO_Checklist.md`, `Release_Notes.md` seeded during Protocol 4/5 transitions.【F:AGENTS.md†L117-L160】
- Operations toolkit: `Postmortem_Template.md`, `Dependency_Update_Log.md`, `Security_Update_Log.md`, and rolling `Retro_YYYY-MM-DD.md` schedule automation to satisfy Phase 6 metrics.【F:AGENTS.md†L166-L194】

## Phase 3: Codex Implementation Plan

### Execution Strategy
1. **Base Workflow:** Adopt workflow1 as the foundation, layering AGENTS Phase 2–6 artefact requirements and automation triggers identified above.【F:workflow1/0-bootstrap-your-project.md†L1-L78】【F:AGENTS.md†L9-L194】
2. **File Structure:** Extend the existing `workflow/` tree with dedicated Phase-2–6 folders housing templates, checklists, and automation scripts (detailed in Phase 4 below).【F:AGENTS.md†L9-L160】
3. **Automation Points:** Leverage existing lifecycle scripts (planning, PRD generation, task validation, stack selection, gate enforcement) as automation anchors, adding new commands to generate architecture packs, contract assets, quality rails, and launch artefacts.【F:docs/LOCAL_DEV_WORKFLOW.md†L69-L200】【F:workflow1/2-generate-tasks.md†L63-L104】
4. **Dependencies:** Require Python tooling (existing scripts), diagram/render tooling (e.g., Structurizr CLI or Mermaid for C4), OpenAPI generators, database schema tools, testing frameworks, and CI templates to enforce gates. Incorporate environment strategy docs and feature flag frameworks per AGENTS guidance.【F:AGENTS.md†L9-L160】【F:docs/LOCAL_DEV_WORKFLOW.md†L59-L200】

### Readiness Checklist
- [ ] Complete file structure defined (see Final Workflow Structure).
- [ ] All phases executable by Codex with scripted checkpoints (protocol instructions + lifecycle automation).
- [ ] Dependencies documented with install/usage instructions for architecture, contract, and quality tooling.
- [ ] Quality gates implemented for security, performance, accessibility, analytics, and testing.
- [ ] Error handling defined for automation failures (stack selection, gate enforcement, artefact validation).

## Phase 4: Implementation Specification

### Final Workflow Structure
```
workflow/
  codex-phase2-design/
    protocol.md
    templates/
      Architecture.md
      C4/context.mmd
      C4/container.mmd
      ADR-template.md
      Product_Backlog.csv
      Sprint0_Plan.md
      Env_Strategy.md
      Repo_Policy.md
      Coding_Standards.md
      OpenAPI/README.md
    scripts/
      generate_architecture_pack.py
      generate_contract_assets.py
  codex-phase3-quality-rails/
    protocol.md
    templates/
      Security_Checklist.md
      perf/budgets.json
      A11y_Test_Plan.md
      Analytics_Spec.xlsx
      Feature_Flags.md
      Test_Plan.md
      Code_Review_Checklist.md
    scripts/
      run_quality_gates.sh
      configure_feature_flags.py
  codex-phase4-integration/
    protocol.md
    templates/
      Observability_Spec.md
      SLO_SLI.md
      CHANGELOG.md
      Staging_Smoke_Playbook.md
    scripts/
      run_staging_smoke.sh
      generate_observability_pack.py
  codex-phase5-launch/
    protocol.md
    templates/
      Deployment_Runbook.md
      Rollback_Plan.md
      Prod_Observability.md
      Backup_Policy.md
      DR_Plan.md
      GoLive_Checklist.md
      Release_Notes.md
      SEO_Checklist.md
    scripts/
      rehearse_rollback.sh
      verify_dr_restore.sh
  codex-phase6-operations/
    protocol.md
    templates/
      Postmortem_Template.md
      Dependency_Update_Log.md
      Security_Update_Log.md
      Retro_Template.md
    scripts/
      monitor_slo.py
      schedule_retros.py
```
All templates include AGENTS-mandated outputs while scripts wrap automation hooks from `docs/LOCAL_DEV_WORKFLOW.md` (planning, validation, gates) and extend them for architecture, contracts, quality, and launch artefacts.【F:AGENTS.md†L9-L194】【F:docs/LOCAL_DEV_WORKFLOW.md†L69-L200】

### Execution Protocol
1. **Phase 2 (Design & Planning):** Run lifecycle planning scripts, then invoke `generate_architecture_pack.py` and `generate_contract_assets.py` to create architecture docs, ADR stubs, OpenAPI/ERD, backlog CSV, Sprint-0 plan, env/branching policies, and lint/CI scaffolds. Validate outputs against AGENTS exit checks (ADR approvals, OpenAPI validation, CI skeleton status).【F:AGENTS.md†L9-L33】【F:docs/LOCAL_DEV_WORKFLOW.md†L69-L109】
2. **Phase 3 (Quality Rails):** Execute `run_quality_gates.sh` to populate security, performance, accessibility, analytics, test-plan, and code-review templates, wiring feature flag framework setup (`configure_feature_flags.py`) and ensuring CI enforcement per AGENTS Phase 3 outputs.【F:AGENTS.md†L45-L76】【F:workflow1/3-process-tasks.md†L43-L80】
3. **Phase 4 (Feature Build & Integration):** During implementation loops, run staging smoke automation (`run_staging_smoke.sh`) and `generate_observability_pack.py` to deliver Observability Spec, SLO draft, and CHANGELOG initialization while verifying gating criteria (staging stability, web vitals, trace coverage).【F:AGENTS.md†L89-L111】【F:workflow1/3-process-tasks.md†L54-L74】
4. **Phase 5 (Hardening & Launch):** Produce deployment and rollback artefacts via templated scripts, confirm DR rehearsals, finalize documentation, and complete Go-Live checklist before sign-off. Automation covers SEO/i18n tasks when flagged as public deliverables.【F:AGENTS.md†L117-L160】【F:workflow1/4-quality-control-protocol.md†L54-L116】
5. **Phase 6 (Operate & Improve):** Schedule monitoring checks, dependency/security update cadences, retrospectives, and postmortems with scripts that log outputs into the operations templates, ensuring AGENTS exit metrics (SLO adherence, vulnerability SLAs, action closure) are tracked.【F:AGENTS.md†L166-L194】【F:workflow1/5-implementation-retrospective.md†L14-L103】

### Validation Criteria
- Each phase concludes with artefact validation scripts (schema checks, linting, coverage thresholds, smoke tests) and documented approvals matching AGENTS exit gates (ADR acceptance, OpenAPI validation, CI status, staging smoke, rollback rehearsal, SLO monitoring).【F:AGENTS.md†L23-L194】【F:docs/LOCAL_DEV_WORKFLOW.md†L173-L199】
- Codex automation logs evidence within `evidence/` directories, linking back to protocol templates for auditability and enabling QC to trace requirements to artefacts and test results.【F:workflow1/4-quality-control-protocol.md†L14-L116】

### Success Metrics
- 100% completion of AGENTS Phase 2–6 artefact checklists per project engagement (architecture pack, contracts, quality rails, integration pack, launch pack, operations logs).【F:AGENTS.md†L9-L194】
- Automated gates achieving green status (lint/type/build, security/perf/a11y scans, staging smoke) before advancing phases, mirroring lifecycle script expectations.【F:docs/LOCAL_DEV_WORKFLOW.md†L186-L199】【F:AGENTS.md†L27-L111】
- Retro logs demonstrating closure of improvement actions within agreed timelines and vulnerability/dependency SLAs met (<14 days for high/critical issues).【F:AGENTS.md†L188-L194】【F:workflow1/5-implementation-retrospective.md†L41-L103】
- Ability for Codex to regenerate any project scaffold by replaying scripted phases without manual intervention, validated through lifecycle automation runs (`make bootstrap`, `make workflow-automation`).【F:docs/LOCAL_DEV_WORKFLOW.md†L14-L200】

## Key Findings & Recommendations
- Select workflow1 as the canonical base and retrofit AGENTS deliverables, using workflow4’s concise communication patterns to keep execution efficient while preserving governance depth.【F:workflow1/0-bootstrap-your-project.md†L1-L78】【F:workflow4/3-process-tasks.md†L21-L94】
- Build new template and script layers per Phase 4 structure to cover missing artefacts, leveraging existing automation entrypoints documented in LOCAL_DEV_WORKFLOW.md.【F:docs/LOCAL_DEV_WORKFLOW.md†L69-L199】
- Institutionalize validation gates so Codex can halt on unmet criteria, aligning automation signals with AGENTS exit checks (CI skeleton green, mock server validation, staging stability, DR rehearsal, SLO tracking).【F:AGENTS.md†L23-L194】
- Document dependencies (diagramming tools, OpenAPI generators, testing harnesses) and integrate them with environment doctor checks to guarantee reproducible runs across projects.【F:docs/LOCAL_DEV_WORKFLOW.md†L59-L199】【F:AGENTS.md†L9-L160】
