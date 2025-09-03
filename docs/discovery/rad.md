---
title: "Risks, Assumptions, Dependencies (RAD) Register"
traceability_id: RAD-001
version: 0.1.0
status: Draft
date: "2025-09-03"
links:
  - "/workspace/docs/discovery/brief.md"
---

## Risks
| ID | Risk | Impact | Likelihood | Owner | Mitigation | Status |
|---|---|---|---|---|---|---|
| R-001 | TBD | High | Medium | TBD | TBD | Open |
| R-002 | TBD | Medium | High | TBD | TBD | Open |

## Assumptions
| ID | Assumption | Validation Method | Owner | Due |
|---|---|---|---|---|
| A-001 | TBD | Experiment/Interview/Log analysis | TBD | TBD |

## Dependencies
| ID | Dependency | Type | Owner | Needed By | Status |
|---|---|---|---|---|---|
| D-001 | TBD | Team/System/Vendor | TBD | TBD | Open |

## Compliance & Privacy Checklist
- Data minimization defined: TBD
- Consent and transparency requirements: TBD
- Retention policies: TBD
- Access controls and audit logging: TBD

## Decision Log
| Date | Decision | Context | Approver |
|---|---|---|---|
| 2025-09-03 | Initialized RAD register | Discovery kickoff | TBD |

# F1 — Risks, Assumptions, Dependencies (RAD) Register

## Legend
- Severity: Low / Medium / High
- Probability: Low / Medium / High
- Priority: Order by (Severity x Probability), then dependency criticality

## Risks
| ID | Risk | Impact | Probability | Severity | Priority | Owner | Mitigation |
|----|------|--------|-------------|----------|----------|-------|------------|
| R-01 | Rule/doc drift between `.cursor` and `.ai-governor` | Confusion, misapplied rules | Medium | Medium | Medium | Eng Lead | Single source + CI sync check |
| R-02 | Ambiguous scope pre-PRD | Rework, delays | Medium | High | High | PM | Tighten discovery scope, decision log |
| R-03 | Security/compliance gaps found late | Re-architecture, launch delay | Low | High | High | Security | Early overlay review + checklist |
| R-04 | Missing stakeholder inputs | Gaps in requirements | Medium | Medium | Medium | Program | Stakeholder matrix + calendar holds |
| R-05 | No telemetry to measure KPIs | Inability to prove success | Medium | Medium | Medium | Data/ML | Define metrics + add to PRD |
| R-06 | PR base branch mismatch (integration) | Merge friction | Low | Medium | Low | Eng Lead | Confirm target branch early |

## Assumptions
| ID | Assumption | Validation Plan | Status |
|----|------------|-----------------|--------|
| A-01 | Decision-makers available for sign-off | Calendar holds confirmed | Pending |
| A-02 | Access to compliance requirements | Overlay + policy links accessible | Pending |
| A-03 | UX/QA/Security can attend deep-dives | Pre-booked sessions | Pending |

## Dependencies
| ID | Dependency | Type | Criticality | Owner | Notes |
|----|-----------|------|-------------|-------|-------|
| D-01 | Planning (PRD) | Downstream | High | PM | Needs KPIs/constraints |
| D-02 | UX user flows | Downstream | Medium | UX Lead | Needs scope and a11y reqs |
| D-03 | CI/PR process | Platform | Medium | DevOps | PR to integration |

## Acceptance & Traceability
- Artifacts:
  - `/workspace/docs/discovery/brief.md`
  - `/workspace/docs/discovery/rad.md`
- Traceability IDs: R-01..06, A-01..03, D-01..03 referenced in PR
- Sign-offs recorded in PR description and commit message footer