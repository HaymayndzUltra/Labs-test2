---
title: "Roadmap & Milestones — F2 Planning"
traceability_id: RMP-001
version: 0.1.0
status: Draft
date: "2025-09-03"
links:
  - "/workspace/docs/planning/prd.md"
---

## Milestones
1. M1 — PRD Draft Complete (Week 1)
   - Output: `docs/planning/prd.md`
   - Gate: Review with Product and Engineering
2. M2 — Backlog Prioritized + Estimates (Week 1)
   - Output: `docs/planning/backlog.csv`
   - Gate: MVP cutline agreed
3. M3 — Milestone Plan & Capacity (Week 1)
   - Output: `docs/planning/roadmap.md`
   - Gate: Capacity signals recorded
4. M4 — PR to Integration (Week 1)
   - Output: PR to `integration`
   - Gate: G1 sign-off recorded, KPIs linked

## Capacity & Estimates (Rough Order of Magnitude)
- Discovery alignment: 0.5d
- PRD drafting & review: 1.0d
- Backlog curation & estimates: 0.5d
- Roadmap & PR: 0.5d

## Dependencies & Sequencing
- Requires Discovery artifacts (DBR-001, RAD-001)
- Parallelizable: backlog curation with PRD drafting
- Sequential: PR to integration after approvals

## Risks & Mitigations
- Scope drift: Anchor to DBR-001; enforce MVP cutline in backlog
- Capacity uncertainty: Capture ranges and note assumptions
- Late compliance issues: Reference overlay in backlog acceptance criteria

## Revision History
- 0.1.0 (2025-09-03): Initial draft

# F2 — Product Planning: Roadmap & Milestones

## Milestones
| ID | Name | Scope | Owner | Estimation | Target Date | Dependencies | Exit Criteria |
|----|------|-------|-------|------------|-------------|--------------|---------------|
| M1 | Discovery Sign-off | F1 Brief + RAD finalized | PM | 0.5d | Done | — | Brief approved; RAD prioritized |
| M2 | PRD Approval | PRD v1 review + sign-offs | PM, Eng Lead | 1.0d | T+1d | M1 | PRD approved (A1) |
| M3 | Roadmap/Backlog Ready | Roadmap + backlog drafted | PM, Eng Lead | 1.0d | T+2d | M2 | Roadmap + backlog reviewed (A2, A3) |
| M4 | Handoff to Implementation | Links and consumers confirmed | PM | 0.5d | T+3d | M3 | Handoff doc updated; consumers acknowledged |

## Rough Capacity & Estimates
- PM: 1.5–2.0 days
- Eng Lead: 1.5 days
- QA/Security/UX consultation: 0.5 day total

## Dependencies
- Inputs: `/workspace/docs/discovery/brief.md`, `/workspace/docs/discovery/rad.md`
- Downstream: UX (acceptance consumption), Implementation (technical plan)

## Risk Alignment (RAD Linkage)
- R-02 (Ambiguous scope): mitigated via explicit non-goals and A1 review
- R-03 (Security gaps): mitigation by overlay review in PRD constraints
- R-05 (No telemetry): include measurement plan in acceptance where relevant

## Notes
- Dates are placeholders (T = start of planning). Update in PR as calendar dates once aligned.