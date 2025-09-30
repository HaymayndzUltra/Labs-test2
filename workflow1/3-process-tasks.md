# Protocol 3 · Controlled Task Execution

## Purpose & Role
- **Role:** Implementation Lead (AI or human) executing the approved task plan responsibly and transparently.
- **Mission:** Deliver incremental value by completing parent tasks sequentially, adhering to standards, verifying quality, and maintaining accurate progress tracking.
- **Success Criteria:** Tasks completed with passing tests, updated documentation, validated business logic, recorded evidence, and readiness for Quality Control (Protocol 4).

## Required Inputs
- Approved task plan from Protocol 2 and the latest Context Kit.
- Access to source repository, development environments, credentials, and tooling.
- Coding standards, review guidelines, and testing requirements for the project.
- Definition of Done per parent task and sub-task.

## Expected Outputs
1. Code, configuration, and infrastructure changes implementing assigned tasks.
2. Updated tests with passing results and captured logs or reports.
3. Documentation updates (README, ADRs, API docs, change logs, runbooks) reflecting new behavior.
4. Updated task plan status (checked-off sub-tasks, notes, evidence links).
5. Commit(s) and/or pull request prepared according to repository contribution standards.
6. Updated risk, issue, or decision logs when new information arises.

## Operating Principles
- Execute one parent task at a time to maintain context and simplify validation.
- Maintain traceability from code changes to tasks, acceptance criteria, and business value.
- Surface blockers or ambiguities immediately; do not guess when requirements are unclear.
- Treat testing, documentation, and deployment preparation as first-class work items.

## Phase Breakdown

### Phase 0 · Pre-Execution Readiness
1. Re-run rule/context discovery to confirm active standards and waivers.
2. Review the target parent task scope, dependencies, acceptance criteria, and recommended owner/persona.
3. Ensure local environment is up-to-date (dependencies installed, migrations applied, feature flags configured).
4. Create or switch to a dedicated branch that references the task ID or feature name.
5. Review outstanding risks or assumptions relevant to the parent task.

### Phase 1 · Detailed Task Analysis
1. Inspect all sub-tasks and clarify any ambiguities before writing code.
2. Sketch solution approaches, sequence of changes, and testing strategy.
3. Confirm business logic expectations with subject-matter experts or refer back to the PRD if needed.
4. Update the task plan with notes on decisions or clarifications to preserve context.

### Phase 2 · Implementation Loop (per Sub-Task)
For each sub-task:
1. **Design:** Determine affected files, interfaces, data models, and integration points.
2. **Develop:** Implement code or configuration changes adhering to project standards.
3. **Business Logic Verification:** Cross-check calculations, validations, and rules against PRD and domain definitions.
4. **Static Quality:** Run relevant linters, formatters, or code analyzers.
5. **Automated Tests:** Create or update unit, integration, contract, performance, or security tests as specified; run them locally and capture results.
6. **Documentation:** Update inline comments and external docs impacted by the change.
7. **Evidence:** Record commands, logs, or screenshots demonstrating completion.
8. Mark the sub-task as complete in the task plan with references to evidence and commits.

### Phase 3 · Parent Task Integration & Verification
1. Execute end-to-end or scenario tests that cover the combined sub-tasks.
2. Validate non-functional requirements (performance, accessibility, localization, compliance) where applicable.
3. Perform regression checks in affected areas, including smoke tests for critical paths.
4. Update risk/issue logs if new insights emerge.
5. Ensure feature flags, configuration toggles, or rollout scripts are ready for deployment.

### Phase 4 · Review Preparation & Commit Packaging
1. Review diffs for consistency, readability, and adherence to standards.
2. Update changelog entries, release notes, or deployment instructions as needed.
3. Compose descriptive commit messages summarizing business value and technical scope.
4. Run the full local test suite or targeted subsets required by contribution guidelines.
5. Capture final evidence (test output, screenshots, logs) for Quality Control.
6. Push branch and open a pull request or prepare patches as defined by the workflow.

### Phase 5 · Task Closure & Handoff
1. Complete parent task checkbox only after verifying all acceptance criteria and tests pass.
2. Summarize work completed, outstanding follow-ups, and relevant evidence links in the task plan.
3. Notify reviewers or stakeholders that the parent task is ready for audit.
4. Transition to **Protocol 4 · Quality Control Audit** with collected evidence and context.

## Quality Gates & Checkpoints
- **Rule Compliance Gate:** All applicable rules reviewed; deviations documented and approved.
- **Test Gate:** Unit/integration/E2E tests updated and passing; regression checks recorded.
- **Documentation Gate:** READMEs, ADRs, API docs, and runbooks updated when behavior changes.
- **Deployment Gate:** Release artifacts, feature flags, and configuration changes prepared and validated.
- **Traceability Gate:** Task plan updated with status, evidence, and commit references.

## Transition to Protocol 4
Initiate `4-quality-control-protocol.md` once:
1. Parent task implementation is complete with evidence gathered.
2. Tests and static analysis have passed or documented exceptions exist with approvals.
3. Documentation and changelog updates are merged into the branch.
4. Pull request or patch is ready for review.

*This protocol ensures implementations are executed methodically, leaving no ambiguity about what was done, how it was validated, and how it ties back to business objectives.*
