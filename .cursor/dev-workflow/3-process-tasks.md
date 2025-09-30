# PROTOCOL 3: CONTROLLED TASK EXECUTION

## Purpose
Execute the approved task plan with precision, ensuring every change is validated, documented, and ready for quality control. This protocol enforces disciplined development habits for any project type.

## Primary Role
**AI Paired Developer & Implementation Steward** – responsible for completing assigned tasks, maintaining traceability, and ensuring production readiness at every step.

## Inputs
- Approved task plan (Protocol 2)
- Engineering rules and coding standards relevant to the scope
- Access to repository, development tooling, and test environments

## Outputs
1. Code, configuration, and documentation updates that satisfy assigned tasks.
2. Updated task plan with completion status and evidence links.
3. Test results and operational checks proving readiness for quality control (Protocol 4).
4. Draft commit summaries and release notes for completed parent tasks.

---

## Workflow Overview
This protocol is executed for each parent task in the task plan. When a parent task is complete, run Protocol 4 (Quality Control) before starting the next parent task.

### Phase 0: Session Initialization
1. **Action:** Identify the parent task to execute (e.g., `Start with Task 2.0`).
2. **Action:** Review associated sub-tasks, dependencies, and acceptance criteria.
3. **Action:** Load relevant rules, guidelines, and previous implementation notes.
4. **Checkpoint:** Announce readiness: `[PRE-FLIGHT] Ready to execute parent task <ID> - <Name>.`

### Phase 1: Environment & Tooling Verification
1. **Action:** Confirm required runtimes, package managers, and CLIs are available (`<runtime> --version`, `<package-manager> --version`).
2. **Action:** Ensure dependencies are installed (`<package-manager> install`) and tests can run (`<package-manager> test --help`).
3. **Action:** Verify access to external services or test doubles (APIs, databases, message brokers). If unavailable, plan mitigation or mock strategy aligned with project rules.
4. **Checkpoint:** If tooling or access is missing, stop and escalate before proceeding.

### Phase 2: Task-by-Task Execution Loop
For each sub-task in the selected parent task:
1. **Plan & Research**
   - **Action:** Re-read sub-task description and related context (code references, documentation, rules).
   - **Action:** Inspect existing code and tests to understand integration points.
   - **Checkpoint:** Announce `[NEXT TASK] <Sub-task ID> - <Summary>.`

2. **Implement**
   - **Action:** Make changes in small, coherent steps using repository-friendly tools.
   - **Action:** Follow project conventions for structure, naming, error handling, logging, and internationalization as applicable.
   - **Action:** Implement required business logic explicitly, ensuring calculations, validation, and branching rules match the PRD.
   - **Action:** Update or create tests (unit, integration, e2e) that prove the change works and prevent regressions.
   - **Action:** Update documentation, configuration, and changelog entries referenced in the task plan.

3. **Self-Verify**
   - **Action:** Run targeted tests (`<package-manager> test <scope>`, `pytest <module>`, `npm run lint`, etc.) and record results.
   - **Action:** Perform static analysis or linters as required.
   - **Action:** Review diff to confirm only intended changes are present and code quality standards are met.
   - **Checkpoint:** If tests or checks fail, resolve before proceeding.

4. **Traceability Update**
   - **Action:** Mark the sub-task as complete in the task plan (change `[ ]` to `[x]` or update status field).
   - **Action:** Capture evidence links (test logs, screenshots, demo URLs) if required.
   - **Action:** Announce `[TASK COMPLETE] <Sub-task ID>. Evidence: <location>.`

### Phase 3: Parent Task Completion
1. **Action:** Confirm all sub-tasks are checked off and acceptance criteria are satisfied.
2. **Action:** Execute full regression scope relevant to the parent task (unit + integration + e2e + lint/build as applicable).
3. **Action:** Update parent task status to complete and summarize key outcomes.
4. **Action:** Prepare commit message draft highlighting scope, business impact, and testing performed.
5. **Checkpoint:** Announce `[PARENT COMPLETE] Task <ID>. Ready for Protocol 4 quality audit.`

### Phase 4: Commit & Review (post-QC)
1. **Action:** After Protocol 4 passes, stage relevant files and commit using approved message format.
2. **Action:** Update release notes, changelog entries, or deployment checklists if required.
3. **Action:** If multiple parent tasks are completed in one session, repeat the workflow per parent task to maintain context isolation.

---

## Operational Guidelines
- Work in focused increments: one parent task per execution session.
- Maintain a clean working tree; avoid committing unrelated changes.
- Record commands and decisions in `evidence/` or equivalent folders for auditability.
- Communicate blockers immediately with clear status and required assistance.
- When interacting with multiple systems, validate integrations early (contract tests, mocked requests, schema checks).

## Quality Gates
- All sub-tasks completed with evidence and passing tests.
- No open lint/test failures or TODO comments left unresolved without approval.
- Business logic verified against PRD expectations and domain rules.
- Documentation and configuration updates committed alongside code.
- Parent task flagged for Protocol 4 before merge requests or deployment.

## Transition to Protocol 4
Provide to the quality auditor:
- List of files changed and their locations
- Test commands executed with results
- Outstanding risks or follow-up actions
- Proposed commit message(s)

## Messagebox Macro (Optional)
```
/apply-instructions-from-3-process-tasks.md
# Example placeholders – replace with project commands
/run: <package-manager> install
/run: <package-manager> test
/run: git status
```
