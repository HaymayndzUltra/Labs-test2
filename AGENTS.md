# Development Phase Generator Prompt

## Task Overview
You are tasked with creating a structured 3-phase development plan based on client briefs, following a specific workflow structure, with validation mechanisms for each phase.

## Input Requirements
- Client brief file: `docs/briefs/${NAME}/brief.md`
- Workflow reference: `Labs-test2/docs/LOCAL_DEV_WORKFLOW.md`
- Variable: `${NAME}` (client/project identifier)

## Core Instructions

### Step 1: Brief Analysis
1. Read and thoroughly analyze the client brief from `docs/briefs/${NAME}/brief.md`
2. Extract key requirements, deliverables, and project scope
3. Identify technical requirements, constraints, and success criteria
4. Note any specific workflow requirements mentioned in the brief

### Step 2: Workflow Alignment
1. Read and understand the structure of `Labs-test2/docs/LOCAL_DEV_WORKFLOW.md`
2. Map brief requirements to workflow phases
3. Ensure phases follow the established workflow patterns
4. Maintain consistency with workflow terminology and processes

### Step 3: Phase Generation
Generate exactly 3 development phases with the following requirements:

**Each Phase Must Include:**
- **Clear Name**: Descriptive phase title
- **Detailed Description**: What the phase accomplishes
- **Specific Deliverables**: Concrete outputs and artifacts
- **Acceptance Criteria**: Measurable completion standards
- **Dependencies**: What must be completed before this phase
- **Timeline**: Estimated duration and milestones
- **Resources**: Required tools, team members, or assets

**Phase Requirements:**
- Must be executable and measurable
- Properly sequenced with clear dependencies
- Aligned with LOCAL_DEV_WORKFLOW.md structure
- Directly address brief requirements
- Include technical specifications where applicable

### Step 4: File Creation
For each phase, create the following files:

**Phase Documentation Files:**
- `docs/briefs/${NAME}/phase1.md` - Complete Phase 1 documentation
- `docs/briefs/${NAME}/phase2.md` - Complete Phase 2 documentation  
- `docs/briefs/${NAME}/phase3.md` - Complete Phase 3 documentation

**Validation Prompt Files:**
- `docs/briefs/${NAME}/prompt-phase1.md` - Validation checklist for Phase 1
- `docs/briefs/${NAME}/prompt-phase2.md` - Validation checklist for Phase 2
- `docs/briefs/${NAME}/prompt-phase3.md` - Validation checklist for Phase 3

## Output Format

### Phase Documentation Format
```markdown
# Phase [Number]: [Phase Name]

## Description
[Detailed description of what this phase accomplishes]

## Deliverables
- [Specific deliverable 1]
- [Specific deliverable 2]
- [Specific deliverable 3]

## Acceptance Criteria
- [Measurable criterion 1]
- [Measurable criterion 2]
- [Measurable criterion 3]

## Dependencies
- [Previous phase or requirement]
- [External dependency]

## Timeline
- Duration: [X days/weeks]
- Milestones: [Key checkpoints]

## Resources Required
- [Tool/technology 1]
- [Team member/role 1]
- [Asset/resource 1]
```

### Validation Prompt Format
```markdown
# Phase [Number] Validation Checklist

## Brief Compliance Check
- [ ] Does this phase address the core requirements from the brief?
- [ ] Are all deliverables aligned with client expectations?
- [ ] Does the phase timeline match brief constraints?

## Workflow Alignment Check
- [ ] Does this phase follow LOCAL_DEV_WORKFLOW.md structure?
- [ ] Are dependencies properly sequenced?
- [ ] Are acceptance criteria measurable and clear?

## Technical Validation
- [ ] Are technical requirements properly addressed?
- [ ] Are deliverables technically feasible?
- [ ] Does the phase include proper testing/validation steps?

## Quality Assurance
- [ ] Is the phase executable with current resources?
- [ ] Are success metrics clearly defined?
- [ ] Does the phase contribute to overall project success?
```

## Quality Standards

### Phase Quality Requirements
- **Clarity**: Each phase must be understandable by any team member
- **Measurability**: All deliverables and criteria must be quantifiable
- **Feasibility**: Phases must be executable with available resources
- **Alignment**: Must directly support brief requirements
- **Sequencing**: Proper dependency management between phases

### Validation Quality Requirements
- **Comprehensive**: Cover all aspects of phase correctness
- **Actionable**: Provide clear yes/no validation criteria
- **Brief-Focused**: Ensure alignment with original requirements
- **Workflow-Compliant**: Verify adherence to established processes

## Success Criteria
- All 6 files created successfully
- Phases are properly sequenced and dependent
- Each phase has clear, measurable deliverables
- Validation prompts provide comprehensive checking
- All phases align with both brief and workflow requirements
- Documentation is professional and actionable

## Error Handling
- If brief is unclear, request clarification before proceeding
- If workflow structure conflicts with brief, prioritize brief requirements
- If dependencies cannot be resolved, adjust phase sequencing
- If deliverables are not measurable, refine acceptance criteria

Execute this prompt to generate a complete, validated 3-phase development plan for any client brief.