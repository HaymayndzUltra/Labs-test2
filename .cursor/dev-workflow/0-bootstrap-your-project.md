# PROTOCOL 0: UNIVERSAL PROJECT BOOTSTRAP

## Purpose
Establish a shared understanding of the initiative, validate the working environment, and capture the information required for all downstream protocols. The outcome is a "Context Kit" that any contributor or AI agent can rely on without assumptions.

## Primary Role
**AI Context Architect & Delivery Lead** – responsible for gathering domain knowledge, documenting constraints, and ensuring the repository is ready for structured execution.

## Inputs & Preconditions
- Access to the repository and available documentation (README files, architecture notes, briefs).
- Ability to run read-only commands in the workspace.
- Stakeholder availability for clarifying questions.

## Outputs
1. Context Kit (living document or folder) containing:
   - Project overview and business objectives
   - Key systems, services, and integrations
   - Known constraints (technical, compliance, delivery)
   - Success criteria and definition of done
   - Open questions and risks
2. Verified environment checklist with tooling versions and accessibility status.
3. Confirmed transition plan into **Protocol 1 – Unified PRD Creation**.

---

## Workflow

### Phase 0: Confirm Engagement Scope
1. **Action:** Identify who can clarify business and technical decisions (product owner, tech lead, domain expert).
2. **Action:** Request or locate existing briefs, charters, or requirement documents.
3. **Checkpoint:** Acknowledge alignment message such as `Scope confirmed for bootstrap. Proceeding with context discovery.`

### Phase 1: Environment & Toolchain Validation
1. **Action:** Enumerate required tooling for the project (language runtime, package managers, test frameworks, linters, database clients, deployment CLIs).
2. **Action:** Run non-destructive version checks (e.g., `node --version`, `python --version`, `npm --version`, `<framework-cli> --help`). Record output verbatim in the Context Kit.
3. **Action:** Verify local commands for installing dependencies (e.g., `package-manager install` dry run) and executing tests (`package-manager test --help`).
4. **Action:** Document environment variables or secrets that are required and whether they are available in the current workspace.
5. **Checkpoint:** If any prerequisite is missing, stop and request remediation before advancing.

### Phase 2: Repository Mapping & Knowledge Capture
1. **Action:** Produce a lightweight inventory of the repository using project-approved discovery commands (e.g., `tree -L 3`, `fd`, or `find` with depth limits). Avoid recursive listings that may be disallowed.
2. **Action:** Identify major domains/modules (frontend, services, data layer, infra) and note their locations.
3. **Action:** Record critical configuration files (package manifests, build configs, CI workflows, infrastructure definitions).
4. **Action:** Capture existing documentation sources (docs folder, ADRs, wiki links).
5. **Checkpoint:** Summarize findings in the Context Kit and tag knowledge gaps for follow-up.

### Phase 3: Business & Technical Alignment
1. **Action:** Interview stakeholders (or review documents) to answer:
   - What business problem does the project solve?
   - Who are the end users and what outcomes matter to them?
   - What metrics define success (quantitative and qualitative)?
   - Which regulatory, compliance, or accessibility standards apply?
2. **Action:** Map business goals to technical capabilities within the repo (e.g., "Order processing" maps to `/services/orders`).
3. **Action:** Document domain terminology and canonical data entities.
4. **Checkpoint:** Obtain confirmation from stakeholders that the recorded objectives and constraints are accurate.

### Phase 4: Risk & Dependency Assessment
1. **Action:** Identify external systems, APIs, data sources, and deployment targets.
2. **Action:** Note active feature flags, release schedules, or change freezes.
3. **Action:** Capture known risks (technical debt, performance bottlenecks, resource constraints) and categorize by severity.
4. **Action:** Record mitigation or investigation tasks required prior to implementation.
5. **Checkpoint:** Validate that all high and medium risks have owners or follow-up actions.

### Phase 5: Context Kit Publication & Handoff
1. **Action:** Assemble collected information into a centralized document (`docs/context-kit.md`, `knowledge/context/README.md`, or equivalent).
2. **Action:** Include references to:
   - Environment validation results
   - Repository map snippets
   - Open questions and decision log
   - Success metrics and acceptance criteria templates
3. **Action:** Share the Context Kit with stakeholders and request explicit approval to proceed.
4. **Action:** Record approval (timestamp, approver) within the document or an evidence folder.
5. **Checkpoint:** Once approved, announce `Context kit ready. Transitioning to Protocol 1.`

---

## Quality Gates
- Environment validation documented and blockers resolved.
- All critical knowledge gaps have owners or are closed.
- Risks are logged with mitigation steps.
- Stakeholders confirm accuracy of the Context Kit.

## Transition to Protocol 1
When all gates pass, reference the approved Context Kit while executing **Protocol 1 – Unified PRD Creation**. Carry forward:
- Business goals and success metrics
- Identified systems and constraints
- Outstanding questions requiring resolution during PRD interviews

## Messagebox Macro (Optional)
```
/apply-instructions-from-0-bootstrap-your-project.md
# Validate toolchain
/run: <language-runtime> --version
/run: <package-manager> --version
# Capture repository overview
/run: tree -L 3 > evidence/repo-structure.txt
# Publish context kit
/run: bash -lc 'mkdir -p evidence/status && date -Is >> evidence/status/00_bootstrap_complete.log'
```
