# F2 — Product Planning: Product Requirements Document (PRD)

## Project/Initiative
- AI Governor Framework — Governed delivery enablement

## Summary
- Create approved PRD, prioritized backlog, and milestone plan aligned to the Discovery Brief and RAD.

## Goals & Non-Goals
- Goals:
  - Define MVP scope and acceptance criteria
  - Encode constraints from rules and security/compliance overlay
  - Provide inputs to UX and Implementation
- Non-Goals:
  - Detailed implementation code or refactors
  - Final UI visuals beyond acceptance criteria

## Users & Stakeholders
- PM, Eng Lead, QA Lead, Security/Compliance, DevOps/SRE, UX Lead, Data/ML, Legal/Privacy, Program/Delivery

## Problem Statement
- Teams require predictable, governed planning artifacts to reduce variance and speed delivery while preserving quality and safety.

## Scope
- In-scope: PRD, roadmap, backlog; acceptance and constraints, dependency mapping
- Out-of-scope: Code execution and deployment

## Requirements
- Functional
  - F1: PRD document with MVP scope and acceptance criteria
  - F2: Roadmap with milestones and rough capacity/estimates
  - F3: Backlog with priorities and dependencies
- Non-Functional
  - N1: Accessibility and performance considerations captured for UX/FE
  - N2: Security & compliance constraints referenced (overlay)
  - N3: Documentation integrity maintained and linked to artifacts

## Acceptance Criteria (MVP)
- A1: `docs/planning/prd.md` reviewed and approved by PM + Eng Lead
- A2: `docs/planning/roadmap.md` includes phases/milestones and rough estimates
- A3: `docs/planning/backlog.csv` lists prioritized tasks with IDs and dependencies
- A4: Risks from `docs/discovery/rad.md` mapped to mitigations in plan
- A5: Links to UX and Implementation consumers included

## Constraints
- Master rules: collaboration, BIOS/context discovery, code quality, modification safety, documentation integrity
- Security & Compliance Overlay: data protection, access control, audit/logging, incident response

## Dependency Map (FE/BE split allowed)
- Frontend/UX:
  - Consumers: UX acceptance criteria and flows
  - Dependencies: PRD approval (A1)
- Backend/Architecture:
  - Consumers: Architecture constraints and interfaces
  - Dependencies: Security/compliance overlay review

## Metrics & KPIs
- PRD approval; MVP scope locked; prioritized backlog; traceability to RAD risks

## Open Questions
- Do we need CI checks to verify `.cursor` vs `.ai-governor` drift?
- Confirm PR base branch policy (`integration`)

## References
- `/workspace/docs/discovery/brief.md`
- `/workspace/docs/discovery/rad.md`
- `/workspace/dev-workflow/0-master-planner-output.md`