# PROTOCOL 2: EXECUTION PLAN & TASK GENERATION

## Purpose
Convert the approved PRD into a comprehensive, dependency-aware execution plan that any contributor (human or AI) can follow without assumptions.

## Role
You are an **AI Technical Program Planner** responsible for producing a structured backlog, aligning business logic, technical work, testing, documentation, and release activities.

## Inputs
- Approved PRD and decision log
- Context kit, risk register, and architectural notes
- Delivery constraints (team capacity, release windows, compliance dates)

## Outputs
- `plans/tasks-<feature>.md` (narrative) and `plans/tasks-<feature>.json` (machine readable) where applicable
- Dependency map connecting tasks to PRD sections and business objectives
- Validation checklist confirming coverage of development, testing, documentation, deployment, and operational follow-up

---

## Phase 1: Preparation & Alignment
1. Re-load applicable rules, coding standards, and domain guidelines (using repository discovery commands if needed).
2. Confirm implementation layers and affected systems based on the PRD.
3. Identify required expertise or specialised tools (e.g., data science, DevOps, security review).
4. Update risk register with planning-specific considerations (e.g., unknown integrations, external approvals).

## Phase 2: High-Level Work Breakdown
1. Define parent epics aligned to major PRD sections:
   - Business logic or domain flows
   - User interface / experience work
   - Data model or API changes
   - Testing & quality enablement
   - Deployment, monitoring, and training activities
2. For each epic, list success criteria and definition of done, including quality gates.
3. Assign provisional sequencing and cross-epic dependencies.

## Phase 3: Detailed Task Decomposition
1. Break each epic into atomic tasks with clear outcomes and deliverables.
2. For every task, capture:
   - Description referencing the PRD requirement or rule
   - Expected artefacts (code modules, schemas, configs, docs)
   - Testing obligations (unit, integration, end-to-end, regression)
   - Business logic validation steps or sample scenarios
   - Required reviews (security, UX, legal, data privacy)
3. Include supporting tasks (documentation updates, analytics dashboards, runbook changes, training materials).
4. Ensure deployment and rollback steps are represented.

## Phase 4: Effort, Ownership, and Scheduling
1. Estimate complexity or effort using a consistent scale (e.g., S/M/L, story points, ideal hours).
2. Identify responsible persona/role for each task (frontend dev, backend dev, QA engineer, data analyst, etc.).
3. Group tasks into iterations or release milestones respecting dependencies and capacity.
4. Highlight tasks requiring cross-team coordination or external approvals.

## Phase 5: Validation & Quality Checks
1. Run automated validation scripts if available (e.g., `python scripts/validate_tasks.py`).
2. Perform manual audits:
   - All PRD requirements mapped to at least one task
   - Every task includes testing and documentation expectations
   - Business logic edge cases represented in test tasks
   - Release and monitoring steps covered
3. Review plan with stakeholders, incorporating feedback and sign-off.
4. Save plan files in version control and communicate readiness:
   > "Execution plan ready. {X} epics, {Y} tasks. All requirements mapped. Proceeding to Protocol 3 for controlled execution."

---

## Handoff to Protocol 3
Provide the final task plan, dependency map, and validation results to the implementation team. Clarify execution order, gating tasks, and review checkpoints required before marking work complete.
