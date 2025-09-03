# Background Agent Prompt: F2 — Product Planning

## Goal
Produce an approved PRD, prioritized backlog, and milestone plan.

## Context Package
- Discovery Brief, RAD
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Draft PRD with scope, acceptance criteria, non-goals
2. Roadmap and milestones; capacity and rough estimates
3. Dependency map (FE/BE split allowed)

## Success Criteria
- PRD approved; MVP scope fixed; backlog prioritized

## Integration Requirements
- Provide acceptance criteria to UX and Implementation; constraints to Architecture

## Quality Gates
- PRD review sign-off; measurable outcomes linked to KPIs

## Output Instructions
- PR to `integration`: `docs/planning/prd.md`, `docs/planning/roadmap.md`, `docs/planning/backlog.csv`
- Daily status summary in the agent thread
