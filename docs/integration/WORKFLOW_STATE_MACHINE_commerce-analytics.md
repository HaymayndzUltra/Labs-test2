# Workflow State Machine: commerce-analytics

## Overview
This document defines the workflow state machine for the commerce-analytics project, mapping the AI-driven development protocols and their state transitions.

## State Machine Definition

### States

#### 1. **INITIAL** 
- **Description**: Project initialization state
- **Entry Conditions**: New project or fresh start
- **Exit Conditions**: Context discovery completed
- **Next States**: BOOTSTRAP, CONTEXT_DISCOVERY

#### 2. **BOOTSTRAP**
- **Description**: Project setup and context engineering
- **AI Role**: AI Codebase Analyst & Context Architect
- **Entry Conditions**: Project initialization
- **Exit Conditions**: Base structure created, rules loaded
- **Next States**: MASTER_PLAN, CONTEXT_DISCOVERY

#### 3. **CONTEXT_DISCOVERY**
- **Description**: Deep codebase analysis and context gathering
- **AI Role**: AI Codebase Analyst & Context Architect
- **Entry Conditions**: Bootstrap completion or context refresh needed
- **Exit Conditions**: Context kit generated, documentation updated
- **Next States**: MASTER_PLAN, PRD_CREATION

#### 4. **MASTER_PLAN**
- **Description**: High-level strategic planning and framework orchestration
- **AI Role**: Master Planner & Background Agent Orchestrator
- **Entry Conditions**: Context discovery completed
- **Exit Conditions**: Three distinct strategies proposed
- **Next States**: PRD_CREATION, BACKGROUND_AGENT_COORDINATION

#### 5. **PRD_CREATION**
- **Description**: Product Requirements Document creation
- **AI Role**: Monorepo-Aware AI Product Manager
- **Entry Conditions**: Master plan completed
- **Exit Conditions**: PRD validated and approved
- **Next States**: TASK_GENERATION, BACKGROUND_AGENT_COORDINATION

#### 6. **TASK_GENERATION**
- **Description**: Technical task breakdown and planning
- **AI Role**: Monorepo-Aware AI Tech Lead
- **Entry Conditions**: PRD approved
- **Exit Conditions**: Detailed technical tasks generated
- **Next States**: TASK_EXECUTION, BACKGROUND_AGENT_COORDINATION

#### 7. **TASK_EXECUTION**
- **Description**: Sequential task implementation
- **AI Role**: AI Paired Developer
- **Entry Conditions**: Tasks generated and prioritized
- **Exit Conditions**: All tasks completed or blocked
- **Next States**: RETROSPECTIVE, BACKGROUND_AGENT_COORDINATION

#### 8. **BACKGROUND_AGENT_COORDINATION**
- **Description**: Parallel background agent management
- **AI Role**: Background Agent Coordinator
- **Entry Conditions**: Any active development phase
- **Exit Conditions**: Background tasks completed or integrated
- **Next States**: TASK_EXECUTION, RETROSPECTIVE, PORTFOLIO_MANAGEMENT

#### 9. **RETROSPECTIVE**
- **Description**: Technical review and process improvement
- **AI Role**: QA & Process Improvement Lead
- **Entry Conditions**: Task execution completed
- **Exit Conditions**: Review completed, improvements identified
- **Next States**: PORTFOLIO_MANAGEMENT, SYSTEM_UPDATE, INITIAL

#### 10. **PORTFOLIO_MANAGEMENT**
- **Description**: Multi-project coordination and oversight
- **AI Role**: Client Portfolio Manager & Project Coordinator
- **Entry Conditions**: Project milestone or cross-project coordination needed
- **Exit Conditions**: Portfolio status updated, resources allocated
- **Next States**: MASTER_PLAN, TASK_EXECUTION, SYSTEM_UPDATE

#### 11. **SYSTEM_UPDATE**
- **Description**: Comprehensive system and rule updates
- **AI Role**: System Update Coordinator
- **Entry Conditions**: System-wide updates required
- **Exit Conditions**: System updated, validation completed
- **Next States**: INITIAL, BOOTSTRAP

#### 12. **PROPOSAL_GENERATION**
- **Description**: Upwork proposal creation
- **AI Role**: AI specializing in crafting tailored Upwork proposals
- **Entry Conditions**: Client brief received
- **Exit Conditions**: Proposal generated and validated
- **Next States**: INITIAL, MASTER_PLAN

### State Transitions

#### Primary Flow
```
INITIAL → BOOTSTRAP → CONTEXT_DISCOVERY → MASTER_PLAN → PRD_CREATION → TASK_GENERATION → TASK_EXECUTION → RETROSPECTIVE
```

#### Parallel Flows
```
TASK_EXECUTION ↔ BACKGROUND_AGENT_COORDINATION
MASTER_PLAN ↔ BACKGROUND_AGENT_COORDINATION
PRD_CREATION ↔ BACKGROUND_AGENT_COORDINATION
TASK_GENERATION ↔ BACKGROUND_AGENT_COORDINATION
```

#### Management Flows
```
RETROSPECTIVE → PORTFOLIO_MANAGEMENT
PORTFOLIO_MANAGEMENT → MASTER_PLAN
PORTFOLIO_MANAGEMENT → TASK_EXECUTION
PORTFOLIO_MANAGEMENT → SYSTEM_UPDATE
```

#### System Maintenance Flows
```
SYSTEM_UPDATE → INITIAL
SYSTEM_UPDATE → BOOTSTRAP
RETROSPECTIVE → SYSTEM_UPDATE
```

#### External Trigger Flows
```
PROPOSAL_GENERATION → INITIAL
PROPOSAL_GENERATION → MASTER_PLAN
```

### Transition Triggers

#### Command-Based Triggers
- `bootstrap` → BOOTSTRAP
- `update all` → CONTEXT_DISCOVERY
- `master plan` → MASTER_PLAN
- `prd` → PRD_CREATION
- `task generation` → TASK_GENERATION
- `execute` → TASK_EXECUTION
- `implement` → TASK_EXECUTION
- `process tasks` → TASK_EXECUTION
- `retrospective` → RETROSPECTIVE
- `background agents` → BACKGROUND_AGENT_COORDINATION
- `portfolio` → PORTFOLIO_MANAGEMENT
- `system update` → SYSTEM_UPDATE
- `proposal` → PROPOSAL_GENERATION

#### Event-Based Triggers
- **Project Completion** → RETROSPECTIVE
- **Context Drift** → CONTEXT_DISCOVERY
- **System Drift** → SYSTEM_UPDATE
- **Cross-Project Coordination** → PORTFOLIO_MANAGEMENT
- **New Client Brief** → PROPOSAL_GENERATION

#### Condition-Based Triggers
- **Validation Failure** → Previous state with error handling
- **Blocking Dependencies** → BACKGROUND_AGENT_COORDINATION
- **Quality Gate Failure** → RETROSPECTIVE
- **Resource Conflicts** → PORTFOLIO_MANAGEMENT

### State Properties

#### Focus Mode States
- **TASK_EXECUTION**: One parent task per chat session
- **PRD_CREATION**: Layer-specific focus (Frontend/Backend/Central)
- **TASK_GENERATION**: Implementation layer focus

#### Parallel Execution States
- **BACKGROUND_AGENT_COORDINATION**: Multiple agents running simultaneously
- **PORTFOLIO_MANAGEMENT**: Cross-project coordination

#### Validation States
- **RETROSPECTIVE**: Quality review and process improvement
- **SYSTEM_UPDATE**: System-wide validation and updates

### Error Handling

#### State Recovery
- **Validation Errors** → Return to previous state with error context
- **Dependency Failures** → BACKGROUND_AGENT_COORDINATION for resolution
- **System Failures** → SYSTEM_UPDATE for comprehensive fix

#### Rollback Procedures
- **Task Execution Failure** → TASK_GENERATION for replanning
- **PRD Validation Failure** → MASTER_PLAN for strategy revision
- **System Update Failure** → Previous system state with rollback

### Quality Gates

#### State Entry Gates
- **BOOTSTRAP**: Project structure validation
- **PRD_CREATION**: Business requirements validation
- **TASK_EXECUTION**: Technical prerequisites validation
- **RETROSPECTIVE**: Completion criteria validation

#### State Exit Gates
- **CONTEXT_DISCOVERY**: Documentation completeness
- **MASTER_PLAN**: Strategy validation
- **TASK_GENERATION**: Task completeness and feasibility
- **TASK_EXECUTION**: Implementation quality

### Monitoring and Observability

#### State Metrics
- **Time in State**: Duration tracking per state
- **Transition Frequency**: State change patterns
- **Error Rates**: Failure rates per state
- **Completion Rates**: Success rates per state

#### State Logging
- **Entry/Exit Events**: State transition logging
- **Decision Points**: AI role decision logging
- **Error Events**: Failure and recovery logging
- **Performance Metrics**: State execution timing

### Integration Points

#### External Systems
- **Git**: State persistence and version control
- **CI/CD**: Quality gate integration
- **Monitoring**: State observability
- **Documentation**: State documentation generation

#### Internal Systems
- **Router**: State-based routing decisions
- **Rules Engine**: State-specific rule activation
- **Template System**: State-specific template generation
- **Validation System**: State transition validation

## Implementation Notes

### State Persistence
- States are persisted in `.cursor/ai-governor/state.json`
- State transitions are logged in `routing_logs/`
- Rollback information is maintained for recovery

### State Validation
- Each state transition is validated against business rules
- Quality gates prevent invalid transitions
- Error recovery procedures are defined for each state

### State Optimization
- Parallel execution where possible
- State caching for performance
- Lazy loading of state-specific resources
- State cleanup procedures for resource management







