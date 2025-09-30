# Protocol 2 · Technical Task Generation

## Purpose & Role
- **Role:** Delivery Planning Lead responsible for translating the approved PRD into an actionable backlog.
- **Mission:** Produce a structured plan of implementation tasks that covers development, business logic, testing, documentation, deployment, and validation activities.
- **Success Criteria:** Baseline backlog stored in version control, dependency graph defined, owners or personas assigned, and execution readiness confirmed for Protocol 3.

## Required Inputs
- Approved PRD and Context Kit updates.
- Architectural placement summary, integration map, and risk register.
- Applicable engineering standards, coding conventions, testing frameworks, and deployment guidelines.
- Capacity information (team composition, skill sets, tooling access, AI personas available).

## Expected Outputs
1. Task plan document (e.g., `tasks-<initiative>.md` or `tasks.json`) organized by epics/parent tasks.
2. For each parent task: scope statement, deliverables, acceptance tests, and definition of done.
3. Atomic sub-tasks covering development, business logic, data work, QA, documentation, deployment, and validation steps.
4. Dependency matrix and sequencing guidance (critical path, parallelizable work, environment constraints).
5. Estimated effort/complexity per task plus resource or persona recommendations.
6. Risk & assumption tracker linked to tasks.

## Phase Breakdown

### Phase 0 · Preparation & Context Alignment
1. Re-run rule/context discovery to capture any updates since PRD approval.
2. Review PRD sections focusing on scope, architecture, business logic, testing, and rollout.
3. Identify mandatory compliance or audit checkpoints that must become tasks.

### Phase 1 · Capability Decomposition
1. Segment the initiative into high-level capabilities or epics aligned with the PRD sections (e.g., UI feature, API service, data migration, analytics update).
2. For each capability, capture:
   - Objective and business value
   - Primary implementation layer(s)
   - Key success metrics or acceptance criteria
   - Notable constraints or dependencies
3. Validate coverage with stakeholders or engineering leads to ensure the decomposition reflects the PRD.

### Phase 2 · Task Detailing
1. Break each capability into parent tasks and sub-tasks, ensuring every deliverable has:
   - Development activities (code, configuration, infrastructure)
   - Business logic implementation (rule engines, validations, calculations)
   - Data work (schema updates, migrations, seeds, backfills)
   - Testing activities (unit, integration, contract, performance, security, manual, monitoring setup)
   - Documentation updates (README, ADRs, API docs, runbooks, change logs)
   - Deployment and rollout steps (feature flags, release notes, environment promotion)
   - Operational follow-up (observability dashboards, alert tuning, support playbooks)
2. Ensure sub-tasks are atomic, testable, and reference specific file paths or components when possible.
3. Add acceptance criteria or verification steps directly to the sub-task descriptions.
4. Include checkpoints for reviewing business logic with subject-matter experts when needed.

### Phase 3 · Sequencing & Dependency Mapping
1. Identify prerequisites and successor tasks; document explicit dependencies.
2. Flag tasks requiring specific environments, data sets, or stakeholder availability.
3. Determine opportunities for parallel execution vs. serialized work.
4. Update the risk register with task-level risks (technical, resource, external dependencies) and mitigation steps.

### Phase 4 · Estimation & Resourcing
1. Assign complexity (e.g., Small / Medium / Large) or time-based estimates to each parent task.
2. Recommend responsible parties or AI personas based on required expertise (frontend, backend, DevOps, QA, data, UX writing).
3. Note collaboration touchpoints (pair programming, design reviews, security approvals) and schedule them.

### Phase 5 · Validation & Packaging
1. Consolidate tasks into the chosen artifact format using a consistent template (see below).
2. Validate the plan against the PRD:
   - All PRD requirements and acceptance criteria mapped to tasks
   - Testing and documentation coverage confirmed
   - Deployment and post-release monitoring activities included
3. Run automated validation scripts if available (e.g., task schema validation, linting).
4. Circulate the plan for sign-off with product, engineering, QA, and operations leads.
5. Store the approved plan alongside the PRD and update the Context Kit with the execution roadmap.

## Task Template (Reference)
```markdown
## <Parent Task ID> · <Parent Task Title>
- **Objective:**
- **Primary Layer:**
- **Dependencies:**
- **Definition of Done:**
- **Recommended Owner / Persona:**
- **Acceptance Tests:**

### Sub-Tasks
- [ ] <ID> Implement feature logic (include files/modules)
- [ ] <ID> Update data model / migration (include scripts)
- [ ] <ID> Write unit tests (framework + coverage target)
- [ ] <ID> Write integration or contract tests
- [ ] <ID> Update documentation / runbooks
- [ ] <ID> Prepare deployment configuration / feature flag
- [ ] <ID> Add monitoring or alerting hooks
- [ ] <ID> Demo or validation with stakeholders
```

## Quality Gates & Checkpoints
- **Coverage Gate:** Every PRD requirement maps to at least one task; no orphan tasks.
- **Quality Gate:** Each parent task includes testing, documentation, and deployment subtasks.
- **Dependency Gate:** All dependencies documented; critical path reviewed.
- **Estimation Gate:** Complexity/effort and owner/persona assigned for planning.
- **Approval Gate:** Plan reviewed and accepted by product, engineering, QA, and operations.

## Transition to Protocol 3
Begin `3-process-tasks.md` when:
1. Task plan is baselined in version control with approval history.
2. Dependencies, risks, and resource assignments are visible to the execution team.
3. Tooling and environments referenced by the plan are available or scheduled.
4. Stakeholders confirm readiness to proceed to implementation.

*This protocol transforms validated requirements into a comprehensive execution roadmap that balances business value, technical accuracy, and quality assurance.*
