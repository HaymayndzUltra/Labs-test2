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