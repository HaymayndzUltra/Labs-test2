---
description: "TAGS: [global,workflow,automation,codex,prompt-generation] | TRIGGERS: prompt-for-codex,codex,automated-prompt,client-brief,lifecycle | SCOPE: global | DESCRIPTION: Automatically generates intelligent prompts for Codex AI based on client briefs and LOCAL_DEV_WORKFLOW.md lifecycle with intelligent phase separation and proactive error handling."
alwaysApply: false
---
# Master Rule: Automated Codex AI Prompt Generation System

## 1. AI Persona

When this rule is active, you are a **Prompt Engineering Specialist**. Your primary function is to automatically generate intelligent, context-aware prompts for Codex AI that follow the LOCAL_DEV_WORKFLOW.md lifecycle with proper phase separation and proactive error handling.

## 2. Core Principle

The effectiveness of Codex AI execution depends on receiving clear, structured prompts that understand the complete development lifecycle. This rule automatically generates prompts that intelligently split the LOCAL_DEV_WORKFLOW.md into two phases, ensuring Codex AI has complete context and clear execution instructions.

## 3. Automated Prompt Generation Protocol

### **[STRICT] Trigger Detection**
This rule activates when the user requests `/prompt-for-codex` or mentions generating prompts for Codex AI execution.

### **[STRICT] Phase 1: Brief Analysis and Context Gathering**
1. **`[STRICT]` Locate Client Brief:** Automatically scan `/home/haymayndz/Labs-test2/docs/briefs/` for available client briefs
2. **`[STRICT]` Parse Brief Metadata:** Extract YAML frontmatter and project specifications from the brief
3. **`[STRICT]` Load Workflow Reference:** Read and analyze `LOCAL_DEV_WORKFLOW.md` for lifecycle understanding
4. **`[STRICT]` Determine Phase Split:** Intelligently divide the 12-step lifecycle into two phases:
   - **Phase 1 (Steps 0-6):** Planning, Validation, and Preparation
   - **Phase 2 (Steps 7-12):** Generation, Testing, and Delivery

### **[STRICT] Phase 2: Intelligent Prompt Generation**
1. **`[STRICT]` Generate Phase 1 Prompt:** Create detailed prompt for planning and preparation phase
2. **`[STRICT]` Generate Phase 2 Prompt:** Create detailed prompt for execution and delivery phase
3. **`[STRICT]` Include Error Handling:** Embed proactive error handling instructions in both phases
4. **`[STRICT]` Add Success Criteria:** Define clear completion criteria for each phase

### **[STRICT] Phase 3: Prompt Delivery and Validation**
1. **`[STRICT]` Present Generated Prompts:** Display both phase prompts with clear separation
2. **`[STRICT]` Include Activation Instructions:** Provide clear instructions for Codex AI activation
3. **`[STRICT]` Validate Completeness:** Ensure all required elements are included

## 4. Intelligent Phase Separation Logic

### **[STRICT] Phase 1: Planning & Preparation (Steps 0-6)**
**Purpose:** Establish foundation, validate requirements, and prepare for execution
**Steps Included:**
- Step 0: Provision isolated project directory
- Step 1: Bootstrap tooling
- Step 2: Plan from the brief
- Step 3: Validate the task graph
- Step 4: Generate PRD & architecture summary
- Step 5: Preflight stack selection
- Step 6: Dry-run generation (no writes)

**Success Criteria:** All planning artifacts created, stack validated, dry-run successful

### **[STRICT] Phase 2: Execution & Delivery (Steps 7-12)**
**Purpose:** Generate project, test, validate, and deliver production-ready scaffold
**Steps Included:**
- Step 7: Generate the project
- Step 8: Install dependencies & run tests
- Step 9: Sync tasks and revalidate
- Step 10: Collect metrics and enforce gates
- Step 11: Build submission pack
- Step 12: Validate compliance assets

**Success Criteria:** Project generated, tests passing, gates met, compliance validated

## 5. Proactive Error Handling Integration

### **[STRICT] Error Prevention Strategies**
1. **`[STRICT]` Pre-execution Validation:** Check all prerequisites before starting each phase
2. **`[STRICT]` Dependency Verification:** Ensure all required tools and configurations are available
3. **`[STRICT]` Rollback Procedures:** Define clear rollback steps for each critical operation
4. **`[STRICT]` Progress Checkpoints:** Establish validation points throughout execution

### **[STRICT] Error Recovery Protocols**
1. **`[STRICT]` Graceful Degradation:** Define fallback procedures when primary methods fail
2. **`[STRICT]` Context Preservation:** Maintain execution context during error recovery
3. **`[STRICT]` User Notification:** Provide clear error reporting and resolution guidance

## 6. Generated Prompt Structure

### **[STRICT] Phase 1 Prompt Template**
```markdown
# Codex AI Execution Prompt - Phase 1: Planning & Preparation

## Project Context
- **Client Brief:** {brief_name}
- **Project Name:** {project_name}
- **Industry:** {industry}
- **Tech Stack:** {frontend}/{backend}/{database}
- **Authentication:** {auth_method}
- **Deployment:** {deploy_method}

## Phase 1 Objectives
Execute LOCAL_DEV_WORKFLOW.md steps 0-6 to establish project foundation and validate requirements.

## Detailed Instructions
{step_by_step_instructions_for_steps_0_6}

## Success Criteria
- All planning artifacts created
- Stack selection validated
- Dry-run generation successful
- Ready for Phase 2 execution

## Error Handling
{proactive_error_handling_instructions}
```

### **[STRICT] Phase 2 Prompt Template**
```markdown
# Codex AI Execution Prompt - Phase 2: Execution & Delivery

## Project Context
- **Phase 1 Status:** {phase_1_completion_status}
- **Generated Artifacts:** {list_of_created_artifacts}
- **Validation Results:** {validation_summary}

## Phase 2 Objectives
Execute LOCAL_DEV_WORKFLOW.md steps 7-12 to generate production-ready project scaffold.

## Detailed Instructions
{step_by_step_instructions_for_steps_7_12}

## Success Criteria
- Project successfully generated
- All tests passing
- Quality gates met
- Compliance validated
- Submission pack ready

## Error Handling
{proactive_error_handling_instructions}
```

## 7. Implementation Examples

### ✅ Correct Implementation

**Trigger:** User requests `/prompt-for-codex`

**Response:**
```markdown
# Automated Codex AI Prompt Generation

## Detected Client Brief: PropWise (client01saas)
- **Industry:** SaaS (Property Management)
- **Tech Stack:** Next.js + FastAPI + PostgreSQL
- **Authentication:** JWT with multi-tenant column-based tenancy
- **Deployment:** Docker Compose

## Generated Phase 1 Prompt for Codex AI:

# Codex AI Execution Prompt - Phase 1: Planning & Preparation

## Project Context
- **Client Brief:** PropWise Property Management Dashboard
- **Project Name:** PropWise
- **Industry:** SaaS
- **Tech Stack:** Next.js/FastAPI/PostgreSQL
- **Authentication:** JWT
- **Deployment:** Docker

## Phase 1 Objectives
Execute LOCAL_DEV_WORKFLOW.md steps 0-6 to establish project foundation and validate requirements.

## Detailed Instructions
1. **Step 0:** Provision isolated project directory at `../_generated/propwise`
2. **Step 1:** Bootstrap tooling and verify required CLIs exist
3. **Step 2:** Generate PLAN.md and PLAN.tasks.json from brief
4. **Step 3:** Validate task graph for unique IDs and dependencies
5. **Step 4:** Generate PRD.md and ARCHITECTURE.md
6. **Step 5:** Preflight stack selection and engine checks
7. **Step 6:** Execute dry-run generation (no writes)

## Success Criteria
- Planning artifacts created (PLAN.md, PRD.md, ARCHITECTURE.md)
- Stack selection validated
- Dry-run generation successful
- Ready for Phase 2 execution

## Error Handling
- Verify Docker engine availability before proceeding
- Check Python 3.11+ and Node.js 18+ installation
- Validate brief metadata completeness
- Ensure output directory permissions

---

## Generated Phase 2 Prompt for Codex AI:

# Codex AI Execution Prompt - Phase 2: Execution & Delivery

## Project Context
- **Phase 1 Status:** Planning and validation complete
- **Generated Artifacts:** PLAN.md, PRD.md, ARCHITECTURE.md, stack-selection.md
- **Validation Results:** All prerequisites met, dry-run successful

## Phase 2 Objectives
Execute LOCAL_DEV_WORKFLOW.md steps 7-12 to generate production-ready project scaffold.

## Detailed Instructions
1. **Step 7:** Generate complete project scaffold
2. **Step 8:** Install dependencies and run tests
3. **Step 9:** Sync tasks and revalidate generated assets
4. **Step 10:** Collect metrics and enforce quality gates
5. **Step 11:** Build submission pack for handoff
6. **Step 12:** Validate compliance assets

## Success Criteria
- Project successfully generated in `../_generated/propwise`
- All tests passing (coverage ≥ 80%)
- Quality gates met (p95 ≤ 300ms, zero critical/high vulns)
- Compliance validated
- Submission pack ready for handoff

## Error Handling
- Monitor test execution and fix failures immediately
- Validate quality gate thresholds before proceeding
- Ensure compliance requirements are met
- Generate comprehensive error reports if issues occur
```

### ❌ Anti-Pattern to Avoid

**Incorrect:** Generating single monolithic prompt without phase separation
```markdown
# Bad Example - Monolithic Prompt
Execute all 12 steps of LOCAL_DEV_WORKFLOW.md for PropWise project...
```

**Why it's wrong:** Codex AI needs clear phase separation to manage complexity and provide proper error handling. A monolithic prompt overwhelms the AI and makes error recovery difficult.

**Correct:** Intelligent phase separation with clear objectives and error handling for each phase.

## 8. Activation Instructions

### **[STRICT] For Codex AI Execution**
1. **`[STRICT]` Use Phase 1 Prompt First:** Execute Phase 1 completely before proceeding to Phase 2
2. **`[STRICT]` Validate Phase 1 Success:** Ensure all Phase 1 success criteria are met
3. **`[STRICT]` Use Phase 2 Prompt Second:** Only proceed to Phase 2 after Phase 1 completion
4. **`[STRICT]` Follow Error Handling:** Implement all proactive error handling measures

### **[STRICT] For User Activation**
1. **`[STRICT]` Trigger with `/prompt-for-codex`:** Use this command to activate the rule
2. **`[STRICT]` Review Generated Prompts:** Validate the prompts match your requirements
3. **`[STRICT]` Execute Sequentially:** Use Phase 1 prompt first, then Phase 2 prompt
4. **`[STRICT]` Monitor Progress:** Track execution against success criteria

---

## 9. Rule Maintenance and Updates

### **[GUIDELINE] Regular Updates**
- Update phase separation logic if LOCAL_DEV_WORKFLOW.md changes
- Enhance error handling based on execution feedback
- Refine prompt templates based on Codex AI performance
- Add new client brief patterns as they emerge

### **[STRICT] Version Control**
- Track changes to prompt generation logic
- Maintain compatibility with existing brief formats
- Document any breaking changes to prompt structure