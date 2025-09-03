# RAD Register — Risks, Assumptions, Dependencies (F1 Discovery)

- Traceability ID: DISC-RAD-001
- Version: 0.1 (Initial Draft)
- Date: TBD
- Owner: Background Agent

## How to Use
- Update status weekly during discovery; assign owners for each active item.
- Severity scale: Low, Medium, High, Critical. Likelihood: Rare, Unlikely, Possible, Likely.
- Prioritize by Severity x Likelihood; P1 = highest priority.

## Assumptions
- Governance rules and documentation will be maintained in-repo.
- CI/CD and scanning tools are available for automation.
- Stakeholders can be scheduled within two weeks.
- Security and privacy policies are accessible and current.

## Dependencies
- Access to architecture docs and team calendars.
- CI/CD, code scanning, and telemetry tooling.
- Security/compliance contacts for early reviews.
- Product roadmap inputs for prioritization.

## Risks
| ID | Category    | Description                                                                 | Impact     | Likelihood | Severity  | Priority | Owner         | Mitigation                                                                 | Status   |
|----|-------------|------------------------------------------------------------------------------|------------|------------|-----------|----------|---------------|----------------------------------------------------------------------------|----------|
| R1 | Scope       | Ambiguous goals cause scope drift and rework                                 | High       | Possible   | High      | P1       | Product Lead  | Align early; sign brief; change control                                    | Open     |
| R2 | Tooling     | Gaps in CI/scanning delay automation and quality gates                       | Medium     | Likely     | High      | P1       | Eng Lead      | MVP gates; phased rollout; backlog tooling improvements                    | Open     |
| R3 | Compliance  | Late discovery of privacy/audit requirements                                | High       | Possible   | High      | P1       | Compliance    | Early reviews; checklist enforcement; data mapping                          | Open     |
| R4 | Resourcing  | Limited stakeholder availability slows interviews                            | Medium     | Possible   | Medium    | P2       | PM            | Schedule early; async questionnaires; consolidate sessions                  | Open     |
| R5 | Data        | Missing metrics to baseline KPIs                                            | Medium     | Possible   | Medium    | P2       | Analytics     | Define measurement plan; instrument telemetry; use proxies temporarily      | Open     |

## Prioritization Notes
- P1 risks (R1–R3) require owners and mitigation plans before exiting discovery.
- P2 risks monitored weekly; escalate if likelihood/severity change.

## Next Steps
- Confirm owners; add due dates for mitigations.
- Review weekly in discovery standup and update statuses.