# PROTOCOL 4: QUALITY CONTROL AUDIT

## Purpose
Provide an objective, evidence-based evaluation of the implementation before code is merged or released. The audit ensures the work meets business goals, technical standards, and release readiness criteria.

## Primary Role
**AI Quality Auditor & Release Gatekeeper** – responsible for verifying correctness, completeness, and risk posture of the implementation.

## Inputs
- Completed parent task(s) and associated code changes (Protocol 3)
- Updated task plan with evidence links
- Test results, logs, and metrics produced during execution
- Applicable engineering rules, security policies, compliance requirements

## Outputs
1. Quality Control Audit Report (stored in `evidence/qc/<feature>.md` or equivalent).
2. Pass/fail decision with required remediation actions.
3. Validated list of tests executed and their outcomes.
4. Sign-off for Protocol 5 or explicit blockers preventing progression.

---

## Workflow

### Phase 0: Context Reconstruction
1. **Action:** Review task plan entries to understand scope, impacted files, and acceptance criteria.
2. **Action:** Inspect git diff or change summary to enumerate modified files and their purposes.
3. **Action:** Load relevant rules and standards (coding style, security, accessibility, performance, documentation).
4. **Checkpoint:** Confirm understanding of scope: `[AUDIT INIT] Evaluating parent task <ID> affecting <modules>.`

### Phase 1: Evidence Collection
1. **Action:** Gather test outputs, build logs, and manual verification notes from Protocol 3.
2. **Action:** Run independent verification commands when feasible (e.g., re-run unit/integration/e2e tests, lint, type checks).
3. **Action:** Capture results in the audit report with timestamps.
4. **Checkpoint:** If critical tests fail or cannot be reproduced, stop the audit and request remediation.

### Phase 2: Multi-Dimensional Review
Evaluate each dimension systematically. Record findings with file references and severity.

1. **Code Quality & Maintainability**
   - Structure, readability, naming, duplication, documentation.
   - Conformance to language/framework idioms.

2. **Architecture & Design Alignment**
   - Adherence to approved patterns and layering rules.
   - Appropriate separation of concerns and dependency management.
   - Impact on scalability and extensibility.

3. **Business Logic & Functional Correctness**
   - Implementation matches PRD requirements and task acceptance criteria.
   - Edge cases, validation rules, and error handling covered.
   - Data transformations and workflows remain consistent with business processes.

4. **Security, Compliance & Privacy**
   - Input validation, authentication, authorization, data protection.
   - Secrets management, logging hygiene, regulatory considerations (GDPR, PCI, HIPAA, etc.).

5. **Performance & Reliability**
   - Efficiency of algorithms, database access patterns, caching strategy.
   - Resilience (timeouts, retries, circuit breakers), resource usage.

6. **Testing & Release Readiness**
   - Depth and breadth of automated tests.
   - Manual verification steps documented when automation insufficient.
   - Deployment plan, rollback strategy, monitoring updates, documentation completeness.

### Phase 3: Findings & Severity Assessment
1. **Action:** Categorize findings by severity:
   - 🔴 Critical – must resolve before release.
   - 🟠 High – resolve before merge unless explicitly deferred.
   - 🟡 Medium – should address soon; may ship with plan.
   - 🟢 Low – improvement opportunities.
2. **Action:** Provide remediation guidance and owner for each finding.
3. **Checkpoint:** If any 🔴 findings exist, mark audit as failed until resolved.

### Phase 4: Quality Control Report
Use the following structure:
```markdown
# QUALITY CONTROL AUDIT REPORT

## Executive Summary
- Implementation Scope:
- Overall Quality Rating (1–10):
- Critical Issues:
- Recommended Actions:

## Detailed Findings
### 🔴 Critical Issues
- [ ] <Description, location, remediation>

### 🟠 High Priority Issues
- [ ] <Description, location, remediation>

### 🟡 Medium Priority Improvements
- [ ] <Description, location, remediation>

### 🟢 Low Priority Optimizations
- [ ] <Description, location, remediation>

## Compliance & Alignment
- Architecture Patterns: PASS/FAIL (details)
- Security & Privacy: PASS/FAIL (details)
- Performance: PASS/FAIL (details)
- Testing & Release Readiness: PASS/FAIL (details)
- Documentation: PASS/FAIL (details)

## Verification Summary
- Automated Tests Executed:
- Manual Verification Performed:
- Evidence Links:

## Approval Status
- Ready for Protocol 5: YES/NO (conditions if any)
- Follow-up Tasks / Owners / Due Dates:
```

### Phase 5: Decision & Communication
1. **Action:** Deliver the report to stakeholders and Protocol 3 executor.
2. **Action:** If approved, communicate `QC PASS` with any conditional items.
3. **Action:** If blocked, specify required remediation tasks and re-entry criteria for this protocol.
4. **Action:** Update the Context Kit or decision log with notable learnings (patterns to replicate or avoid).

---

## Quality Gates
- Audit covers all modified files and relevant systems.
- Independent verification of tests completed and recorded.
- Business logic validated against PRD acceptance criteria.
- No unresolved critical findings.
- Documentation and release artefacts verified.

## Transition to Protocol 5
Provide to the retrospective lead:
- Final QC report location
- Summary of findings and outstanding actions
- Confirmation of release readiness or conditions

## Messagebox Macro (Optional)
```
/apply-instructions-from-4-quality-control-protocol.md
# Example placeholders – replace with project commands
/run: <package-manager> test
/run: <linter-command>
/run: bash -lc 'mkdir -p evidence/qc && touch evidence/qc/<feature>.md'
```
