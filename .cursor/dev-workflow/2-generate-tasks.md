# PROTOCOL 2: TECHNICAL TASK GENERATION

## Purpose
Convert the approved PRD into a sequenced, test-inclusive execution plan that can be handed to delivery teams or AI agents without ambiguity.

## Primary Role
**AI Technical Planner & Delivery Orchestrator** – responsible for translating requirements into actionable tasks, sequencing workstreams, and ensuring coverage across implementation, testing, documentation, and release.

## Inputs
- Finalized PRD and architectural placement summary (Protocol 1)
- Context Kit, risks, and decision logs
- Applicable engineering rules, coding standards, and definition of done criteria

## Outputs
1. Structured task plan (e.g., `tasks/<feature>-plan.md` and/or `tasks.json`).
2. Workstream overview highlighting primary vs. supporting systems.
3. Dependency graph and sequencing notes.
4. Validation summary confirming readiness for Protocol 3 execution.

---

## Workflow

### Phase 0: Preparation & Rule Alignment
1. **Action:** Load relevant engineering guidelines (coding standards, security rules, testing requirements) referenced in the Context Kit.
2. **Action:** Review PRD sections for business logic, data impacts, testing expectations, and release constraints.
3. **Action:** Clarify outstanding questions with stakeholders; update decision log with resolutions.
4. **Checkpoint:** Announce readiness: `PRD digested. Proceeding with task generation.`

### Phase 1: Identify Workstreams & Deliverables
1. **Action:** Break the solution into major workstreams such as UI, business logic/services, data/storage, integration, testing, documentation, deployment.
2. **Action:** For each workstream, list mandatory deliverables (code modules, migrations, configurations, automation, knowledge artifacts).
3. **Action:** Capture cross-cutting concerns (security, observability, feature flags) that affect multiple workstreams.
4. **Checkpoint:** Share the high-level workstream map and confirm coverage with stakeholders or leads.

### Phase 2: Define Tasks & Acceptance Criteria
For each workstream:
1. **Action:** Create parent tasks that represent meaningful deliverable increments (e.g., `1.0 Build Checkout API`, `2.0 Implement UI Checkout Flow`).
2. **Action:** Decompose parent tasks into atomic sub-tasks that can be executed sequentially. Include:
   - Implementation steps (code changes, configurations)
   - Business logic validations
   - Tests (unit, integration, e2e, manual test scripts)
   - Documentation updates (README, changelog, runbooks)
   - Deployment/release preparation (CI updates, infrastructure changes)
3. **Action:** Attach acceptance criteria or completion definition to each parent task and sub-task.
4. **Action:** Assign effort/complexity indicators (Simple, Moderate, Complex) and note required expertise or model persona if using multiple AI agents.
5. **Checkpoint:** Verify that each requirement from the PRD is traceable to at least one task or sub-task.

### Phase 3: Sequence & Dependency Planning
1. **Action:** Determine task order, dependencies, and potential parallelization.
2. **Action:** Highlight prerequisites such as schema migrations, API contracts, or environment provisioning.
3. **Action:** Identify integration checkpoints (e.g., UI ↔ API contract validation, service ↔ data pipeline sync).
4. **Action:** Incorporate testing gates (unit tests before integration, integration before e2e, regression before release).
5. **Checkpoint:** Produce a dependency diagram or ordered list and validate feasibility with engineering leads.

### Phase 4: Validation & Publication
1. **Action:** Review the task list for completeness, clarity, and alignment with definition of done.
2. **Action:** Ensure tasks include instructions for maintaining the task file (checkbox updates, evidence capture) during execution.
3. **Action:** Document assumptions, risks, and mitigation actions tied to specific tasks.
4. **Action:** Store the plan in version control and link it from the Context Kit and PRD.
5. **Checkpoint:** Obtain approval to move into Protocol 3. Record approval metadata.

---

## Task Plan Template (Markdown Example)
```markdown
# Technical Execution Plan: <Feature>

## Workstream Overview
- Primary Layer(s):
- Supporting Layer(s):
- Dependencies:

## Task List
- [ ] 1.0 <Parent Task Name> [Complexity: Simple/Moderate/Complex]
  - [ ] 1.1 Implementation Step (code change + acceptance criteria)
  - [ ] 1.2 Business Logic Validation (describe rules to cover)
  - [ ] 1.3 Automated Tests (unit/integration/e2e)
  - [ ] 1.4 Documentation & Knowledge Updates
  - [ ] 1.5 Deployment/Release Preparation
- [ ] 2.0 <Parent Task Name>
  - ...

## Testing Strategy
- Unit Tests:
- Integration Tests:
- End-to-End Tests:
- Manual Verification Steps:

## Release Checklist
- Feature flags/configuration
- Migration plan & rollback
- Monitoring & alerting updates

## Risks & Mitigations
- R1: <risk> – <mitigation task ID>
- ...
```

---

## Quality Gates
- Every PRD requirement mapped to at least one task.
- Tasks include implementation, testing, documentation, and deployment considerations.
- Dependencies and sequencing explicitly documented.
- Approval captured from responsible stakeholders (tech lead, product owner, QA).

## Transition to Protocol 3
Provide:
- Location of the task plan file(s)
- Execution sequencing notes (e.g., start with Task 1.0)
- Any required tools or environments highlighted in tasks
- Testing strategy summary and quality gates to be enforced during execution

## Messagebox Macro (Optional)
```
/apply-instructions-from-2-generate-tasks.md
# Initialize plan artifacts
/run: bash -lc 'mkdir -p tasks && touch tasks/<feature>-plan.md'
# Optional validation command placeholder
/run: python scripts/validate_tasks.py tasks.json  # replace with actual validator if available
```
