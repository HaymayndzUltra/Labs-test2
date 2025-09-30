# Protocol 4 · Quality Control Audit

## Purpose & Role
- **Role:** Independent Quality Auditor ensuring implementations meet business, technical, and operational expectations.
- **Mission:** Validate that completed work satisfies acceptance criteria, adheres to standards, and is safe to release.
- **Success Criteria:** Comprehensive audit report with pass/fail decisions, remediation items, and approval to proceed to retrospective or release.

## Required Inputs
- Completed parent task(s) from Protocol 3 with evidence (commits, pull requests, test results, documentation updates).
- Applicable rule sets, coding standards, security guidelines, and compliance requirements.
- PRD, task plan, and Context Kit for traceability back to requirements.
- Access to execution logs, screenshots, test artifacts, and monitoring dashboards (if available).

## Expected Outputs
1. Structured audit report summarizing findings across quality dimensions.
2. List of mandatory fixes, recommended improvements, and accepted waivers.
3. Validation of test results, coverage, and non-functional requirements.
4. Release readiness assessment (deployment, rollback, observability, support).
5. Updated risk register and documentation of decisions.
6. Clear go/no-go recommendation for deployment or next protocol.

## Phase Breakdown

### Phase 0 · Audit Preparation
1. Re-run rule/context discovery and load the latest standards.
2. Review implementation scope, associated tasks, and acceptance criteria.
3. Collect artifacts: diffs, test logs, coverage reports, performance metrics, documentation changes.
4. Confirm which environments or data sets were used for testing.

### Phase 1 · Code & Documentation Review
1. Evaluate code readability, maintainability, adherence to conventions, and absence of dead code.
2. Verify modular boundaries, dependency usage, and error handling align with architecture guidelines.
3. Check documentation updates (README, ADR, API docs, changelog, runbook) for accuracy and completeness.
4. Ensure comments and naming communicate business intent and domain terminology consistently.

### Phase 2 · Business Logic & Requirement Alignment
1. Trace implementation back to PRD requirements and task acceptance criteria.
2. Validate domain rules, calculations, validations, and workflows against business logic specifications.
3. Review edge cases, error scenarios, rollback behavior, and audit trails.
4. Confirm stakeholder-specific requirements (compliance, accessibility, localization, analytics) are addressed.

### Phase 3 · Testing & Quality Evidence
1. Confirm presence and sufficiency of unit, integration, contract, performance, security, and UI/E2E tests as applicable.
2. Review test coverage metrics and ensure critical paths are exercised.
3. Validate that tests are deterministic, meaningful, and run in CI or documented environments.
4. Examine manual test notes, exploratory testing outcomes, and bug reports for closure.

### Phase 4 · Security, Privacy & Compliance Checks
1. Assess input validation, authentication, authorization, encryption, logging, and data retention practices.
2. Verify compliance with regulatory requirements (e.g., GDPR, HIPAA, SOC2) when applicable.
3. Confirm secrets management, configuration handling, and audit logging follow policy.
4. Document any deviations with required approvals or mitigation plans.

### Phase 5 · Performance, Reliability & Operations
1. Review performance benchmarks, load tests, and resource utilization impacts.
2. Ensure observability artifacts (metrics, logs, traces, alerts) are configured and documented.
3. Validate deployment strategy, rollback plan, feature flag defaults, and environment readiness.
4. Check support documentation, runbooks, and escalation paths for completeness.

### Phase 6 · Findings, Decisions & Communication
1. Summarize findings by severity (Blocker, Major, Minor, Informational).
2. Identify required remediation tasks with owners and due dates.
3. Record accepted risks or waivers with stakeholder approval.
4. Provide an explicit go/no-go recommendation for release or next steps.
5. Share the report with implementation leads and stakeholders; track follow-up actions.

## Audit Report Template (Reference)
```markdown
# Quality Control Report · <Feature / Parent Task>
- **Date:**
- **Auditor:**
- **Scope:**
- **Decision:** Approved / Approved with Conditions / Blocked

## 1. Code & Documentation
- Summary:
- Findings:

## 2. Business Logic & Requirements
- Summary:
- Findings:

## 3. Testing & Quality Evidence
- Summary:
- Findings:

## 4. Security, Privacy & Compliance
- Summary:
- Findings:

## 5. Performance & Operations
- Summary:
- Findings:

## 6. Actions & Approvals
- Mandatory Fixes:
- Recommendations:
- Accepted Risks / Waivers:
- Approvals:
```

## Quality Gates & Checkpoints
- **Traceability Gate:** Each requirement has corresponding evidence and tests.
- **Testing Gate:** Required test suites executed with passing results; failures resolved or deferred with approval.
- **Security Gate:** No unmitigated security/privacy issues.
- **Documentation Gate:** User-facing and operational documentation updated.
- **Readiness Gate:** Deployment, rollback, and monitoring plans verified.

## Transition to Protocol 5
Proceed to `5-implementation-retrospective.md` when:
1. Audit report is completed and shared.
2. Mandatory fixes are resolved or tracked with owners and deadlines.
3. Go/no-go decision and approvals are recorded.
4. Evidence and documentation are archived for future reference.

*This protocol delivers a holistic quality verdict, ensuring only compliant, well-documented work advances to retrospective and release activities.*
