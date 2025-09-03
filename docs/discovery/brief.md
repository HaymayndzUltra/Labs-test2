---
title: "Discovery Brief"
traceability_id: DBR-001
version: 0.1.0
status: Draft
owners:
  - product: TBD
  - engineering: TBD
date: "2025-09-03"
links:
  - "/workspace/dev-workflow/0-master-planner-output.md"
  - "/workspace/docs/discovery/rad.md"
---

## Overview
Establish a standardized Discovery & Intake baseline (Brief and RAD) for the AI Governor Framework in this repository. Define scope boundaries, constraints, measurable KPIs, and an approvals path to feed Planning (PRD) and UX (user flows).

## Stakeholder Map
- Executive sponsor: TBD (influence: high, interest: high)
- Product lead: TBD (influence: high, interest: high)
- Engineering lead: TBD (influence: high, interest: high)
- Design lead: TBD (influence: medium, interest: high)
- Data/Analytics: TBD (influence: medium, interest: medium)
- Compliance/Security: TBD (influence: medium, interest: medium)
- QA Lead: TBD (influence: medium, interest: high)
- DevOps/SRE: TBD (influence: medium, interest: medium)
- Legal/Privacy: TBD (influence: medium, interest: medium)

## Interview Plan
- Objectives: clarify goals, constraints, success metrics, risks.
- Format: 30–45 min interviews; shared notes; confirm summaries within 24h.
- Participants: sponsors, PM, Eng lead, Design, Ops/Sec, key users.
- Schedule: TBD (insert calendar links).

## Problem Statements
- P1: Inconsistent discovery artifacts lead to variable quality and downstream PRD rework.
- P2: Missing traceability and unrecorded approvals reduce auditability and slow delivery.
- P3: Late discovery of security/compliance constraints causes scope churn and delays.

## Success Metrics (KPIs)
- G1 approvals: Product + Engineering sign-offs recorded within 2 business days of kickoff.
- RAD coverage: ≥ 90% of risk categories captured with owners and mitigations.
- Traceability: 100% discovery artifacts include stable IDs and cross-links.
- Documentation integrity: 0 outstanding doc/rule drift findings at PR time.
- Handoffs: PRD and UX receive inputs within 1 business day after sign-off.

## Constraints
- Business: budget/timebox defined by sponsors; approvals required before planning starts.
- Technical: in-repo rules are source of truth; follow modification safety and code quality rules.
- Platform: prefer native patterns; keep artifacts in `/workspace/docs/discovery/`.
- Compliance: see RAD register; security overlay requirements apply (encryption, access controls, logging).

## Integration Requirements
- Handoff to Planning (PRD): user stories, acceptance criteria, non-functionals.
- Handoff to UX: key personas, user flows, edge cases.

## Open Questions
- Q1: TBD
- Q2: TBD

## Approvals (G1)
- Product sign-off: Name, Date, Notes
- Engineering sign-off: Name, Date, Notes

## Revision History
- 0.1.0 (2025-09-03): Initial draft structure.

# F1 — Discovery & Intake: Discovery Brief

## Project/Initiative
- AI Governor Framework — Framework adoption and governed delivery enablement

## Problem Definition
- Teams adopting the framework need a concise, approved Discovery Brief to align scope, constraints, and success metrics before PRD and planning.
- Without structured discovery, outputs vary in quality, delaying downstream PRD, planning, and implementation.

## Objectives
- Establish a shared understanding of problem, scope, constraints, and success criteria.
- Produce artifacts required by the workflow: Discovery Brief and RAD register.
- Provide validated inputs to Planning (PRD) and UX (user flows).

## Scope
- In-scope: discovery interviews, constraint inventory, KPI definition, risk/assumption/dependency capture, sign-off path.
- Out-of-scope: detailed PRD specs, technical task breakdown, implementation.

## Context & Inputs
- Repo snapshot and core docs:
  - `/workspace/dev-workflow/0-master-planner-output.md`
  - `/workspace/README.md`
  - `/workspace/DEV_WORKFLOW_DOCUMENTATION.md`
  - `/workspace/RULES_DOCUMENTATION.md`
  - Security & Compliance Overlay (rules)

## Constraints & Standards
- Collaboration: `2-master-rule-ai-collaboration-guidelines` (communication, planning, conflict resolution)
- Context BIOS: `1-master-rule-context-discovery` (load relevant rules before major actions)
- Code Quality: `3-master-rule-code-quality-checklist` (robustness, clarity, safety)
- Modification Safety: `4-master-rule-code-modification-safety-protocol` (risk classification, validation)
- Documentation Integrity: `5-master-rule-documentation-and-context-guidelines` (sync docs ↔ code)
- Security & Compliance Overlay: data protection, access control, logging, incident response

## Stakeholder Map
- Product Manager (PM): goals, scope, milestones, success criteria
- Engineering Lead (Eng Lead): architecture, risks, feasibility, sequencing
- QA Lead: quality gates, automation, acceptance criteria
- Security/Compliance: data protection, access control, audit, privacy
- DevOps/SRE: environments, CI/CD, observability, rollback
- UX Lead: users, flows, accessibility, design system alignment
- Data/ML: analytics, metrics, data contracts, telemetry
- Legal/Privacy: data retention, notices, consents
- Program/Delivery: dependencies, timeline, resourcing

## Interview Plan
- Format: 3 phases
  1) Kickoff alignment (PM + Eng Lead) — 45–60 min
  2) Functional deep-dives (QA, Security, DevOps, UX, Data) — 30–45 min each
  3) Readout & sign-off (PM + Eng Lead + QA + Security) — 30 min
- Core questions (sample):
  1) What problem are we solving and for whom? What is success in user terms?
  2) What are hard constraints (security, performance, compliance, platforms)?
  3) What must be in scope now vs. explicitly out-of-scope?
  4) What measurable outcomes define success (KPIs) and target thresholds?
  5) What risks could derail us? What mitigations and owners?
  6) What assumptions are we making that need validation?
  7) What upstream/downstream dependencies exist (teams, services, approvals)?
  8) What acceptance criteria and quality gates are must-haves?
  9) What telemetry is needed to measure KPIs post-launch?
  10) What sign-offs are required and by when?

## KPIs & Success Criteria
- Discovery Brief approved by Product and Engineering (sign-offs recorded)
- RAD register created with prioritized items and assigned owners
- Inputs delivered to Planning (PRD) and UX (flows)
- Traceability IDs assigned to artifacts and referenced in PR/issue
- Evidence attached (notes, links) in `docs/discovery/`

## Risks (Summary)
- See `/workspace/docs/discovery/rad.md` for full register. Top risks:
  - Rule/doc drift between `.cursor` and `.ai-governor` directories
  - Ambiguous scope causing PRD rework and schedule slips
  - Security/compliance gaps discovered late
  - Missing stakeholders, leading to unowned decisions

## Dependencies & Assumptions (Summary)
- Access to decision-makers for sign-off windows
- Availability of UX, QA, Security for deep-dives
- “Integration” branch exists or target agreed for PR base

## Next Steps
1) Execute interviews per plan and capture notes
2) Finalize KPIs and acceptance checks with PM/Eng Lead
3) Prioritize RAD and assign owners/mitigations
4) Confirm sign-offs and open PR to `integration` with artifacts

