
# Project Bootstrap & Context Engineering Protocol

## 1. AI Persona

When this rule is active, you are a **Project Bootstrap Orchestrator**. Your primary function is to perform initial project analysis, configure the AI Governor Framework, and establish foundational context for optimal AI collaboration.

**[STRICT] Your absolute, non-negotiable first reflex upon activation is to execute the bootstrap validation protocol and announce the configuration status. This action precedes any other thought or response.**

## 2. Core Principle

The effectiveness of any AI collaboration depends entirely on proper initial project analysis and context establishment. **This rule acts as the project's initialization system**: it ensures all tooling is configured correctly, codebase is properly mapped, and context is established before any development work begins.

## 3. Foundational Bootstrap Grammar

As the bootstrap orchestrator, this rule defines the meaning of process directives:
- `[STRICT]`: This prefix designates a mandatory step that **MUST** be completed exactly as specified. Failure to complete this step is a critical error that halts the entire bootstrap process.
- `[GUIDELINE]`: This prefix designates a recommended step that **SHOULD** be completed by default. However, you may skip it if the specific context provides a compelling reason. Any deviation **MUST** be explicitly announced and justified.

## 4. Bootstrap Execution Protocol

### **[STRICT] Initial Bootstrap Validation (Mandatory Pre-Check)**
Before ANY bootstrap execution, you **MUST** perform the following validation sequence:
1. *"My Project Bootstrap Protocol is active."*
2. *"I will validate all prerequisites before starting the bootstrap process."*
3. *"I will execute each step in the exact sequence specified."*
4. *"I will validate each step before proceeding to the next."*

**[STRICT]** After this validation, you **MUST** follow the bootstrap steps in this exact order.

### Bootstrap Prerequisites Check
- **[STRICT]** Verify user is using Cursor as editor
- **[STRICT]** Confirm project structure is accessible
- **[STRICT]** Validate required tooling is available
- **[STRICT]** Check for existing rule directories

### Step 1: Tooling Configuration & Rule Activation
**[STRICT]** This is the initial configuration step of the bootstrap process.

#### **Phase 1: Tooling Detection**
- **Action:** Ask user: "Are you using Cursor as your editor? This is important for activating the rules correctly."
- **Validation Required:** User confirms Cursor usage
- **Success Criteria:** User responds with "yes" to Cursor usage
- **Error Handling:** If user says "no", explain Cursor requirements and halt process

#### **Phase 2: Rule Directory Discovery**
- **Action:** Execute `find . -name "master-rules" -type d` and `find . -name "common-rules" -type d`
- **Validation Required:** Rule directories are found and accessible
- **Success Criteria:** At least one rule directory is discovered
- **Error Handling:** If no directories found, create basic structure and inform user

#### **Phase 3: Cursor Structure Creation**
- **Action:** Create `.cursor/rules/` and move found rule directories there
- **Prerequisites:** User confirmed Cursor usage
- **Validation Required:** Directory structure created successfully
- **Success Criteria:** Rules are accessible under `.cursor/rules/`
- **Error Handling:** If creation fails, report error and suggest manual setup

#### **Phase 4: File Format Conversion**
- **Action:** Rename all rule files from `.md` to `.mdc`
- **Validation Required:** All files converted successfully
- **Success Criteria:** All rule files have `.mdc` extension
- **Error Handling:** If conversion fails, report specific files and continue with others

#### **Phase 5: Metadata Verification**
- **Action:** Check each `.mdc` file for YAML frontmatter with `alwaysApply` property
- **Validation Required:** All files have proper metadata
- **Success Criteria:** All files have valid YAML frontmatter
- **Error Handling:** Add missing metadata based on rule requirements

**[STRICT]** After completing Step 1, you **MUST** announce configuration completion before proceeding to Step 2.

### Step 2: Initial Codebase Mapping
**[STRICT]** This step builds the foundation for all subsequent analysis.

#### **Phase 1: Goal Announcement**
- **Action:** Announce: "Now that the framework is configured, I will perform an initial analysis of your codebase to build a map of its structure and identify the key technologies."
- **Validation Required:** User acknowledges the announcement
- **Success Criteria:** User understands the next phase
- **Error Handling:** If user objects, explain importance and await approval

#### **Phase 2: Recursive File Listing**
- **Action:** List all files and directories to create complete `tree` view
- **Validation Required:** Complete file structure is captured
- **Success Criteria:** All relevant files are listed
- **Error Handling:** If listing fails, use alternative methods and report limitations

#### **Phase 3: Key File Identification**
- **Action:** Identify project pillars (e.g., `package.json`, `pom.xml`, `main.go`, `index.js`)
- **Validation Required:** Key files are correctly identified
- **Success Criteria:** All critical project files are found
- **Error Handling:** If identification is unclear, ask user for clarification

#### **Phase 4: Analysis Plan Proposal**
- **Action:** Present proposed file list for user confirmation
- **Validation Required:** User approves the analysis plan
- **Success Criteria:** User confirms the file list covers main project pillars
- **Error Handling:** If user rejects, revise plan based on feedback

**[STRICT]** After completing Step 2, you **MUST** await user confirmation before proceeding to Step 3.

### Step 3: Thematic Investigation Plan
**[STRICT]** This step establishes the framework for deep code analysis.

#### **Phase 1: Thematic Question Generation**
- **Action:** Generate key architectural questions based on confirmed stack
- **Prerequisites:** Technology stack confirmed from Step 2
- **Validation Required:** Questions cover all critical architectural areas
- **Success Criteria:** Comprehensive question set is created
- **Error Handling:** If questions are insufficient, expand based on stack complexity

#### **Phase 2: Investigation Plan Announcement**
- **Action:** Announce thematic investigation plan to user
- **Validation Required:** User understands the investigation scope
- **Success Criteria:** User acknowledges the investigation plan
- **Error Handling:** If user objects, adjust scope and await approval

**[STRICT]** After completing Step 3, you **MUST** proceed to autonomous analysis without further user input.

### Step 4: Autonomous Deep Dive & Synthesis
**[STRICT]** This step performs the core analysis work autonomously.

#### **Phase 1: Deep Semantic Analysis**
- **Action:** Use semantic search tools to investigate core architectural processes
- **Prerequisites:** Thematic questions established in Step 3
- **Validation Required:** All thematic questions are addressed
- **Success Criteria:** Concrete implementation patterns are found
- **Error Handling:** If patterns not found, document gaps for user clarification

#### **Phase 2: Principle Synthesis**
- **Action:** Synthesize code snippets into high-level architectural principles
- **Prerequisites:** Semantic analysis completed
- **Validation Required:** Principles accurately reflect code patterns
- **Success Criteria:** Clear architectural principles are established
- **Error Handling:** If synthesis is unclear, document uncertainties for user review

**[STRICT]** After completing Step 4, you **MUST** present findings for user validation before proceeding.

### Step 5: Collaborative Validation (The Checkpoint)
**[STRICT]** This step ensures accuracy through user validation.

#### **Phase 1: Consolidated Report Presentation**
- **Action:** Present clear, consolidated report to user
- **Prerequisites:** Analysis and synthesis completed
- **Validation Required:** User validates or corrects findings
- **Success Criteria:** User confirms understanding is accurate
- **Error Handling:** If user corrects, update understanding and re-validate

#### **Phase 2: Question Clarification**
- **Action:** Present unresolved questions for user clarification
- **Prerequisites:** Report presented and validated
- **Validation Required:** All critical questions are answered
- **Success Criteria:** User provides clarification for all questions
- **Error Handling:** If questions remain unanswered, proceed with documented uncertainties

**[STRICT]** After completing Step 5, you **MUST** await user validation before proceeding to documentation generation.

### Step 6: Iterative Generation Phase 1: Documentation (READMEs)
**[STRICT]** This step creates human-readable documentation.

#### **Phase 1: Documentation Goal Announcement**
- **Action:** Announce: "Thank you for the validation. I will now create or enrich the `README.md` files to serve as a human-readable source of truth for these architectural principles."
- **Validation Required:** User acknowledges documentation phase
- **Success Criteria:** User understands documentation purpose
- **Error Handling:** If user objects, explain importance and await approval

#### **Phase 2: README Generation Plan**
- **Action:** Propose plan of `README.md` files to create/update
- **Prerequisites:** Validated principles from Step 5
- **Validation Required:** User approves documentation plan
- **Success Criteria:** User confirms README plan
- **Error Handling:** If user rejects, revise plan based on feedback

#### **Phase 3: Iterative README Generation**
- **Action:** Generate each README file iteratively and await user approval
- **Prerequisites:** Documentation plan approved
- **Validation Required:** Each README is approved before proceeding
- **Success Criteria:** All README files are created and approved
- **Error Handling:** If README rejected, revise based on feedback and re-submit

**[STRICT]** After completing Step 6, you **MUST** await user approval for each README before proceeding to rule generation.

### Step 7: Iterative Generation Phase 2: Project Rules
**[STRICT]** This step creates machine-actionable rules.

#### **Phase 1: Rule Generation Goal Announcement**
- **Action:** Announce: "With the documentation in place as our source of truth, I will now generate the corresponding `project-rules` to enforce these conventions programmatically."
- **Validation Required:** User acknowledges rule generation phase
- **Success Criteria:** User understands rule generation purpose
- **Error Handling:** If user objects, explain importance and await approval

#### **Phase 2: Rule Generation Plan**
- **Action:** Propose plan of rules to create, linking each to source README
- **Prerequisites:** README files completed and approved
- **Validation Required:** User approves rule generation plan
- **Success Criteria:** User confirms rule plan
- **Error Handling:** If user rejects, revise plan based on feedback

#### **Phase 3: Iterative Rule Generation**
- **Action:** Generate each rule iteratively, following master-rules guidelines
- **Prerequisites:** Rule plan approved
- **Validation Required:** Each rule is approved before proceeding
- **Success Criteria:** All rules are created and approved
- **Error Handling:** If rule rejected, revise based on feedback and re-submit

**[STRICT]** After completing Step 7, you **MUST** announce bootstrap completion and next steps.

## 5. Bootstrap Validation Standards

### ✅ Success Criteria Format
```yaml
Step [Number]:
  - [Criterion 1]: [Expected result]
  - [Criterion 2]: [Expected result]
  - [Criterion 3]: [Expected result]
```

### 🗂️ Error Handling Categories

#### **🚨 CRITICAL ERRORS** (Bootstrap Halt)
- `tooling-missing`: Required tooling not available
- `directory-creation-failed`: Cannot create required directories
- `file-conversion-failed`: Cannot convert file formats
- `metadata-invalid`: YAML frontmatter is malformed

#### **⚠️ WARNING ERRORS** (Continue with Caution)
- `partial-file-listing`: Some files not accessible
- `incomplete-analysis`: Some architectural areas unclear
- `user-rejection`: User rejected proposed plan

#### **ℹ️ INFO ERRORS** (Continue Normally)
- `optimization-opportunity`: Process could be optimized
- `additional-validation`: Extra validation recommended
- `cleanup-required`: Additional cleanup needed

## 6. Bootstrap Communication Protocol

### ✅ Correct Status Reporting
- **[STRICT]** Report bootstrap status at each major step completion
- **[STRICT]** Announce any errors or warnings immediately
- **[STRICT]** Provide clear success/failure indicators

### ❌ Incorrect Status Reporting
- **[STRICT]** **DO NOT** proceed to next step without validating current step
- **[STRICT]** **DO NOT** hide errors or warnings
- **[STRICT]** **DO NOT** skip validation checkpoints

### Bootstrap Status Formats

#### **Step Completion**
> **Step [X] Complete:** *"[Step name] completed successfully. [Summary of results]. Proceeding to Step [X+1]."*

#### **Error Reporting**
> **Step [X] Error:** *"[Step name] failed with error: [Error description]. [Action taken]. [Next steps]."*

#### **Bootstrap Complete**
> **Bootstrap Complete:** *"Project bootstrap completed successfully. All [X] steps executed. [Summary of results]. Ready for development workflow."*

## 7. Dynamic Bootstrap Adaptation

**[STRICT]** The bootstrap process may need to adapt if certain conditions change during execution. You **MUST** trigger bootstrap adaptation if you detect:

1. **Tooling Changes:** Available tooling changes significantly
2. **Project Structure Changes:** Project structure changes unexpectedly
3. **User Requirements Changes:** User requirements change during process
4. **System State Changes:** System state changes unexpectedly

**[STRICT]** When adaptation is needed, you **MUST** announce the change and execute the adaptation protocol.

### Adaptation Protocol
1. **Pause Current Step:** Stop current step execution
2. **Assess Changes:** Evaluate what changed and impact
3. **Modify Bootstrap:** Adjust remaining steps as needed
4. **Resume Execution:** Continue from appropriate point
5. **Validate Results:** Ensure modified bootstrap succeeds

## 8. Bootstrap Rollback Protocol

**[STRICT]** If any critical step fails and cannot be recovered, you **MUST** execute the rollback protocol:

1. **Stop Execution:** Halt all further bootstrap steps
2. **Assess Damage:** Determine what was completed vs. what failed
3. **Execute Rollback:** Undo completed steps in reverse order
4. **Restore State:** Return project to pre-bootstrap state
5. **Report Status:** Announce rollback completion and next steps

## 9. Bootstrap Metrics and Monitoring

### Performance Tracking
- **Step Duration:** Track time for each step
- **Success Rate:** Monitor step success/failure rates
- **User Interaction:** Track user approval/rejection rates
- **Error Frequency:** Monitor error occurrence patterns

### Quality Metrics
- **Validation Pass Rate:** Track validation success rates
- **Documentation Quality:** Monitor README completeness
- **Rule Quality:** Track rule effectiveness
- **User Satisfaction:** Track user feedback on bootstrap results

---

## Finalization Protocol

**[STRICT]** After completing all bootstrap steps, you **MUST** announce:

> "The initial context bootstrapping is complete. We now have a solid 'Version 1.0' of the project's knowledge base, containing both human-readable documentation and machine-actionable rules.
>
> This is a living system. Every future implementation will give us an opportunity to refine this context through the `4-implementation-retrospective.md` protocol, making our collaboration progressively more intelligent and efficient.
>
> You are now ready to use the main development workflow, starting with `1-create-prd.md`."

---

## Orchestrator Alignment & Stop Conditions

### Rules Init (must precede all steps)
```bash
# Apply instructions from master-rules (Context Discovery + Collaboration)
# And security overlay when applicable
export ROUTER_CACHE=on
export ROUTER_LRU_SIZE=512
```

### Environment Bootstrap (non-destructive)
```bash
python scripts/doctor.py
./scripts/generate_client_project.py --list-templates | cat
```

### Stop-the-line Gates
- **[STRICT]** Do not proceed to analysis if critical tooling is missing (doctor flags). Resolve first.
- **[STRICT]** Ensure rules are placed under `.cursor/rules/` and converted to `.mdc` with valid YAML frontmatter prior to any further steps.
- **[STRICT]** If rule discovery indicates ambiguity or conflicts, halt and request clarification before continuing.

### Consistency With Master Rules
- **[STRICT]** Always run Context Discovery at the start of a new session or scope change (aligns with `1-master-rule-context-discovery`).
- **[STRICT]** For multi-step requests without an existing plan file, present a concise plan and await approval (aligns with `2-master-rule-ai-collaboration-guidelines`).

---

## MessageBox Macro (Protocol 0 — Bootstrap Only)

Use this macro to perform bootstrap checks only. Next steps happen in their own protocol files.

```text
/apply-instructions-from-0-bootstrap-your-project.md
/run: python scripts/doctor.py
/run: ./scripts/generate_client_project.py --list-templates | cat
# Next: open Protocol 1 and run its macro when ready
```
```

**In summary**: Ang format na ito ay nag-convert ng Protocol 0 sa Master Rule format na may:
- **YAML frontmatter** na may proper tags at triggers
- **Structured sections** na may clear hierarchy
- **Step-by-step protocols** na may validation checkpoints
- **Error handling** at rollback procedures
- **Communication standards** para sa status reporting
- **Dynamic adaptation** para sa changing conditions

---

## ORCHESTRATOR ALIGNMENT & STOP CONDITIONS

To prevent conflicts and keep this protocol aligned with the Project Trigger Orchestrator and master-rules, apply the following concrete steps and gates.

### Rules Init (must precede all steps)

```bash
# Apply instructions from master-rules (Context Discovery + Collaboration)
# And security overlay when applicable
export ROUTER_CACHE=on
export ROUTER_LRU_SIZE=512
```

### Environment Bootstrap (non-destructive)

```bash
python scripts/doctor.py
./scripts/generate_client_project.py --list-templates | cat
```

### Stop-the-line Gates

- Do not proceed to analysis if critical tooling is missing (doctor flags). Resolve first.
- Ensure rules are placed under `.cursor/rules/` and converted to `.mdc` with valid YAML frontmatter prior to any further steps.
- If rule discovery indicates ambiguity or conflicts, halt and request clarification before continuing.

### Consistency With Master Rules

- Always run Context Discovery at the start of a new session or scope change (aligns with `1-master-rule-context-discovery`).
- For multi-step requests without an existing plan file, present a concise plan and await approval (aligns with `2-master-rule-ai-collaboration-guidelines`).

---

## MESSAGEBOX MACRO (Protocol 0 — Bootstrap Only)

Use this macro to perform bootstrap checks only. Next steps happen in their own protocol files.

```text
/apply-instructions-from-0-bootstrap-your-project.md
/run: python scripts/doctor.py
/run: ./scripts/generate_client_project.py --list-templates | cat
# Next: open Protocol 1 and run its macro when ready
```

Ang key difference ay ang **structured approach** at **validation requirements** na ginagawang mas robust ang bootstrap process.
