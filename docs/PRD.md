# PRD — Workflow System Enhancements

## 1. Overview
Standardize workflow documents and trigger commands to enable automation, CI gating, and consistent developer experience across phases 01–10.

## 2. Goals & Non-Goals
- Goals
  - Add machine-readable workflow frontmatter
  - Normalize sections and acceptance gates
  - Introduce centralized gates configuration
  - Provide validation tooling and CI enforcement
- Non-Goals
  - Replace existing content; the effort is structural and governance-focused

## 3. Users & Stakeholders
- Rules Maintainer (owner: triggers and validation)
- Docs Maintainer (owner: workflows content)
- Tech Lead (approvals)
- Devs/QA/DevOps (consumers)

## 4. Requirements
- R1: Each workflow must include YAML frontmatter (phase, inputs, outputs, artifacts, gates, depends_on, owner)
- R2: Central gates_config.yaml defines numeric thresholds and compliance expectations
- R3: Validator script lints frontmatter and required sections
- R4: CI blocks merges on missing sections/gates violations

## 5. Success Metrics
- 100% workflows have valid frontmatter and required sections
- CI enforces Evidence and Overall Acceptance presence
- Thresholds validated (coverage ≥ 80%, p95 ≤ 500ms, 0 critical vulns)

## 6. Dependencies
- Existing docs under docs/workflows
- Trigger command files under .cursor/rules/trigger-commands

## 7. Risks & Mitigations
- Risk: Incomplete updates across phases → Mitigation: validator CI gate
- Risk: Ambiguity in thresholds → Mitigation: central gates_config.yaml reviewed by tech lead

## 8. Deliverables
- docs/workflows/CONVENTIONS.md (frontmatter + template)
- gates_config.yaml (schema + starter values)
- Validation tooling (next phase)

## 9. Timeline
- Phase 02 (current): PRD + conventions + gates schema
- Phase 03: tooling + make targets
- Phase 04: apply edits and normalization across phases

## 10. Approvals
- Tech Lead approval required