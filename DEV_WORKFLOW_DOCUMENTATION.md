# Complete Documentation: Development Workflow Directory

## Overview

The `dev-workflow` directory contains the AI Governor Framework's structured development workflow - a comprehensive system designed to transform AI from a simple code generator into a reliable engineering partner. This workflow provides a 4-step sequential process that ensures predictable, controllable, and efficient AI-powered development.

## Directory Structure

```
dev-workflow/
├── README.md                           # Main workflow overview
├── 0-bootstrap-your-project.md         # Project initialization protocol
├── 1-create-prd.md                     # Product requirements creation
├── 2-generate-tasks.md                 # Technical task planning
├── 3-process-tasks.md                  # Controlled task execution
└── 4-implementation-retrospective.md   # Post-implementation review
```

## Core Principles

### Why This Workflow Exists
- **Predictable:** Each step has a clear purpose and output
- **Controllable:** You are always in the loop for key decisions
- **Efficient:** AI does the heavy lifting, you provide strategic direction
- **Structured:** Transforms generic AI into project-specific expert

## Detailed Protocol Breakdown

### Step 0: Project Bootstrap & Context Engineering
**AI Role:** Project Analyst & Context Architect

**Purpose:** Performs initial codebase analysis and configures the AI Governor Framework for the specific project.

#### Key Activities:
1. **Tooling Configuration & Rule Activation**
   - Detects editor environment (Cursor vs others)
   - Configures `.cursor/rules/` directory structure
   - Renames rule files to `.mdc` extension for Cursor compatibility
   - Adds YAML frontmatter metadata to rules

2. **Initial Codebase Mapping**
   - Performs recursive file listing
   - Identifies key technology stack components
   - Creates complete project structure map

3. **Thematic Investigation Plan**
   - Generates architectural questions by theme
   - Investigates security, data flow, and conventions
   - Performs deep semantic analysis of code patterns

4. **Autonomous Deep Dive & Synthesis**
   - Uses semantic search tools to find implementation patterns
   - Synthesizes findings into architectural principles

5. **Collaborative Validation**
   - Presents consolidated report for user validation
   - Identifies answered questions vs. needs clarification

6. **Documentation Generation (READMEs)**
   - Creates human-readable documentation
   - Links to validated architectural principles

7. **Rules Generation**
   - Creates machine-actionable project rules
   - Enforces conventions programmatically

#### Output:
- Project-specific `README.md` files
- Customized `.cursor/rules/project-rules/` directory
- "Context Kit" transforming AI into project expert

### Step 1: Unified PRD Creation
**AI Role:** Monorepo-Aware AI Product Manager

**Purpose:** Conducts comprehensive interview to create detailed Product Requirements Document that automatically determines implementation layer and communication patterns.

#### Architectural Decision Matrix:
| Need Type | Likely Implementation Target | Key Constraints | Communication Patterns |
|-----------|-----------------------------|-----------------|----------------------|
| UI/Component | Frontend Application | Responsive Design, Theming, i18n | API calls, Direct calls |
| Business Logic | Backend Microservices | Scalability, Inter-service RPC | Full CRUD to API |
| Data CRUD | Central REST API | Exclusive DB access, OpenAPI | Direct DB queries |
| Static Assets | Object Storage | Caching strategy, Versioning | Direct SDK/API access |

#### Phase Structure:

**Phase 1: Analysis & Scoping**
- Qualification: New feature vs. modifying existing
- Path A (New): Business need → User stories → Layer detection
- Path B (Modified): Current vs. desired behavior → Impact analysis

**Phase 2: Specifications by Layer**
- **Frontend:** Target user, user stories, wireframes, responsiveness
- **Backend:** API routes, HTTP methods, request/response schemas
- **Integration:** Orchestration logic, external service calls

**Phase 3: Architectural Constraints**
- Validates communication flows respect project rules
- Identifies allowed vs. prohibited interactions

**Phase 4: Synthesis & Generation**
- Creates comprehensive PRD with architecture summary
- Includes data flow diagrams and technical specifications

### Step 2: Technical Task Generation
**AI Role:** Monorepo-Aware AI Tech Lead

**Purpose:** Transforms PRD into granular, actionable technical execution plan following project standards.

#### Generation Algorithm:

**Phase 1: Context Discovery & Preparation**
- Invokes context discovery protocol
- Loads relevant architectural guidelines
- Identifies implementation layers (primary + secondary)
- Performs duplicate prevention for UI components
- Recommends LLM personas for different task types

**Phase 2: High-Level Task Generation**
- Creates structured task file (`tasks-[feature].md`)
- Generates top-level tasks (UI development, backend routes, testing, documentation)
- Presents plan for validation with "Go" confirmation

**Phase 3: Detailed Breakdown by Layer**
- **Frontend Template:** File scaffolding → HTML structure → i18n → JavaScript logic → CSS styling → Documentation
- **Backend Template:** Route scaffolding → Handler logic → Business modules → Testing
- Assigns specific LLM personas to each task
- Populates placeholders with PRD-specific details

#### LLM Persona Strategy:
- **System Integrator:** Broad ecosystem knowledge for setup/DevOps
- **Code Architect:** Deep logical consistency for core business logic
- **Code Quality Specialist:** Testing, security, performance optimization

### Step 3: Controlled Task Execution
**AI Role:** AI Paired Developer

**Purpose:** Executes technical tasks sequentially and meticulously following the "One Parent Task, One Chat" rule to prevent context saturation.

#### Core Rules:

**Focus Mode (Per-Parent-Task Validation):**
- Executes ALL sub-tasks of single parent task
- Waits for validation before proceeding
- Maintains coherent short-term memory

**Context Management:**
- Each parent task in separate chat session
- Clears context after completion
- Runs retrospective protocol before starting new session

**Execution Loop:**
1. **Task Identification:** Identifies next unchecked sub-task
2. **Platform Documentation Check:** Consults official docs for platform-specific features
3. **Dependency Analysis:** Uses tools to understand function signatures and parameters
4. **Execution:** Performs task using available tools
5. **Self-Verification:** Confirms all criteria met
6. **Update & Synchronize:** Marks task complete, updates task file
7. **Checkpoint:** Pauses for user validation

**Communication Standards:**
- Uses formal prefixes: `[NEXT TASK]`, `[TASK COMPLETE]`, `[GIT PROPOSAL]`
- Provides concise, direct feedback
- Never assumes autonomy

### Step 4: Implementation Retrospective
**AI Role:** QA & Process Improvement Lead

**Purpose:** Audits completed code and conducts collaborative interview to improve context, rules, and workflows.

#### Two-Phase Retrospective:

**Phase 1: Technical Self-Review**
- Invokes context discovery to load relevant rules
- Reviews conversation history for user interventions
- Audits source code compliance against loaded rules
- Synthesizes findings into hypotheses about friction points

**Phase 2: Collaborative Retrospective**
- Presents self-review findings
- Conducts guided interview covering:
  - PRD Phase: Clarity and completeness
  - Planning Phase: Logic and feasibility
  - Execution Phase: Efficiency and issues
  - Rules: Ambiguities or helpfulness
- Proposes concrete improvement actions
- Validates and concludes interview

#### Continuous Improvement:
- Identifies opportunities to improve rules/workflows
- Proposes modifications with clear rationale
- Ensures documentation reflects code changes
- Builds richer context for future collaborations

## Workflow Integration

### Prerequisites
- AI Governor Framework properly configured
- Project bootstrapped with context kit
- Relevant rules loaded and activated

### Best Practices
1. **Clean Context Sessions:** Use separate chats for each parent task
2. **Regular Retrospectives:** Always run retrospective after parent task completion
3. **Rule Compliance:** Follow loaded rules strictly
4. **Documentation Updates:** Keep READMEs synchronized with code changes
5. **User Validation:** Confirm at each checkpoint

### Expected Outcomes
- **Predictable Results:** Clear, structured development process
- **High-Quality Code:** Compliance with project standards
- **Rich Context:** AI evolves into project expert
- **Efficient Collaboration:** Reduced back-and-forth communication
- **Maintainable Systems:** Well-documented architectural decisions

## Troubleshooting

### Common Issues
- **Context Saturation:** Use "One Parent Task, One Chat" rule
- **Rule Conflicts:** Follow AI Collaboration Guidelines protocol
- **Unclear Requirements:** Conduct thorough PRD interview
- **Technical Debt:** Address in retrospective phase

### Emergency Protocols
- **Lost Context:** Re-run context discovery protocol
- **Rule Violations:** Halt and request clarification
- **Complex Features:** Activate Complex Feature Context Preservation
- **High-Risk Changes:** Use Code Modification Safety Protocol

## Future Enhancements

The workflow is designed to be living system that improves through:
- **Retrospective Learning:** Each cycle refines the AI's understanding
- **Rule Evolution:** New rules created based on patterns
- **Context Enrichment:** Progressive improvement of project knowledge
- **Process Optimization:** Continuous workflow refinements

This comprehensive workflow transforms AI-powered development from unpredictable assistance to reliable engineering partnership, ensuring consistent quality and efficiency across all development activities.
