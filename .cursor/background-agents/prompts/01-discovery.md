# Background Agent Prompt: F1 — Discovery & Intake

## Goal
Synthesize problem definition, constraints, KPIs, and risks into an approved Discovery Brief.

## Context Package
- Repo snapshot; `dev-workflow/0-master-planner-output.md`
- Any existing docs: README, ADRs, planning files
- Compliance or domain constraints

## Tasks & Deliverables
1. Stakeholder map and interview plan
2. Problem statements and success metrics (KPIs)
3. Risks, assumptions, dependencies (RAD) register
4. Discovery Brief (concise, actionable)

## Success Criteria
- Discovery Brief approved; KPIs defined; RAD registered and prioritized

## Integration Requirements
- Provide inputs to Planning (PRD) and UX (user flows)

## Quality Gates
- Sign-off from product/engineering; traceability IDs assigned

## Output Instructions
- Create PR to `integration` including: `docs/discovery/brief.md`, `docs/discovery/rad.md`
- Post a status summary in the agent thread daily
