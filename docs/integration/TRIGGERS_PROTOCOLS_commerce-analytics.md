# Triggers and Protocols: commerce-analytics

## Overview
This document defines the brief-driven triggers and protocols for the commerce-analytics project, mapping command triggers to workflow protocols and their execution patterns.

## Trigger Categories

### 1. Project Lifecycle Triggers

#### Bootstrap Triggers
- **`bootstrap`**: Initialize new project
- **`setup`**: Setup project environment
- **`initialize`**: Initialize project structure
- **`project start`**: Start new project development

**Protocol**: `0-bootstrap-your-project.md`
**AI Role**: AI Codebase Analyst & Context Architect
**Execution**: Sequential, single-threaded

#### Planning Triggers
- **`master plan`**: Create master development plan
- **`framework ecosystem`**: Plan framework ecosystem
- **`background agents`**: Coordinate background agents
- **`prd`**: Create Product Requirements Document
- **`requirements`**: Define project requirements
- **`feature planning`**: Plan feature development
- **`product spec`**: Create product specifications
- **`task generation`**: Generate technical tasks
- **`technical planning`**: Plan technical implementation
- **`implementation plan`**: Create implementation plan

**Protocols**: `0-master-planner.md`, `1-create-prd.md`, `2-generate-tasks.md`
**AI Roles**: Master Planner, Product Manager, Tech Lead
**Execution**: Sequential with parallel coordination

#### Execution Triggers
- **`execute`**: Execute implementation plan
- **`implement`**: Implement features
- **`process tasks`**: Process technical tasks
- **`development`**: Development activities

**Protocol**: `3-process-tasks.md`
**AI Role**: AI Paired Developer
**Execution**: Sequential, focus mode

#### Review Triggers
- **`retrospective`**: Conduct retrospective
- **`review`**: Review work
- **`improvement`**: Process improvement
- **`post-implementation`**: Post-implementation review

**Protocol**: `4-implementation-retrospective.md`
**AI Role**: QA & Process Improvement Lead
**Execution**: Sequential, analysis-focused

### 2. System Management Triggers

#### Update Triggers
- **`update all`**: Update all system components
- **`refresh all`**: Refresh all generated assets
- **`sync all`**: Synchronize all systems
- **`reload all`**: Reload all configurations

**Protocol**: `6-comprehensive-system-update.md`
**AI Role**: System Update Coordinator
**Execution**: Comprehensive, system-wide

#### Coordination Triggers
- **`parallel execution`**: Execute parallel processes
- **`coordination`**: Coordinate activities
- **`multi-agent`**: Multi-agent coordination
- **`analyze`**: Analyze system state

**Protocols**: `5-background-agent-coordination.md`, `6-client-portfolio-manager.md`
**AI Roles**: Background Agent Coordinator, Portfolio Manager
**Execution**: Parallel, coordination-focused

### 3. External Triggers

#### Proposal Triggers
- **`proposal`**: Generate Upwork proposal
- **`client brief`**: Process client brief

**Protocol**: `7-proposalcreate.mdc`
**AI Role**: AI Upwork Proposal Specialist
**Execution**: Single-threaded, compliance-focused

## Protocol Execution Patterns

### Sequential Execution
```
bootstrap → master plan → prd → task generation → execute → retrospective
```

### Parallel Execution
```
master plan ↔ background agents
prd ↔ background agents
task generation ↔ background agents
execute ↔ background agents
```

### Management Execution
```
retrospective → portfolio management
portfolio management → master plan
portfolio management → execute
portfolio management → system update
```

### System Maintenance Execution
```
system update → bootstrap
retrospective → system update
portfolio management → system update
```

## Trigger Validation

### Input Validation
- **Required Fields**: Validate required context fields
- **Format Validation**: Validate input formats
- **Range Validation**: Validate input ranges
- **Dependency Validation**: Validate dependencies

### Context Validation
- **Project Context**: Validate project context
- **Industry Context**: Validate industry requirements
- **Compliance Context**: Validate compliance requirements
- **Technology Context**: Validate technology stack

### Permission Validation
- **Role Permissions**: Validate role permissions
- **Resource Permissions**: Validate resource access
- **Operation Permissions**: Validate operation permissions
- **System Permissions**: Validate system access

## Protocol State Management

### State Transitions
- **INITIAL** → **BOOTSTRAP** (bootstrap trigger)
- **BOOTSTRAP** → **MASTER_PLAN** (master plan trigger)
- **MASTER_PLAN** → **PRD_CREATION** (prd trigger)
- **PRD_CREATION** → **TASK_GENERATION** (task generation trigger)
- **TASK_GENERATION** → **TASK_EXECUTION** (execute trigger)
- **TASK_EXECUTION** → **RETROSPECTIVE** (retrospective trigger)

### State Persistence
- **State Storage**: Store state in `.cursor/ai-governor/state.json`
- **State Logging**: Log state transitions in `routing_logs/`
- **State Recovery**: Recover state from storage
- **State Validation**: Validate state consistency

### State Synchronization
- **Cross-Protocol**: Synchronize state across protocols
- **Cross-Agent**: Synchronize state across agents
- **Cross-Project**: Synchronize state across projects
- **Cross-System**: Synchronize state across systems

## Protocol Error Handling

### Error Detection
- **Input Errors**: Detect invalid inputs
- **State Errors**: Detect invalid states
- **Execution Errors**: Detect execution failures
- **Integration Errors**: Detect integration failures

### Error Recovery
- **Retry Logic**: Retry failed operations
- **Fallback Procedures**: Use fallback procedures
- **State Rollback**: Rollback to previous state
- **Error Reporting**: Report errors for analysis

### Error Prevention
- **Input Validation**: Validate inputs before processing
- **State Validation**: Validate state before transitions
- **Dependency Checking**: Check dependencies before execution
- **Resource Validation**: Validate resources before use

## Protocol Monitoring

### Performance Monitoring
- **Execution Time**: Monitor protocol execution time
- **Resource Usage**: Monitor resource consumption
- **Throughput**: Monitor processing throughput
- **Latency**: Monitor response latency

### Quality Monitoring
- **Success Rate**: Monitor success rates
- **Error Rate**: Monitor error rates
- **Compliance Rate**: Monitor compliance rates
- **Quality Score**: Monitor quality scores

### Business Monitoring
- **Value Delivery**: Monitor value delivery
- **Stakeholder Satisfaction**: Monitor stakeholder satisfaction
- **Business Impact**: Monitor business impact
- **ROI**: Monitor return on investment

## Protocol Optimization

### Performance Optimization
- **Parallel Processing**: Optimize parallel execution
- **Caching**: Implement caching strategies
- **Resource Optimization**: Optimize resource usage
- **Algorithm Optimization**: Optimize algorithms

### Quality Optimization
- **Process Improvement**: Improve processes
- **Error Reduction**: Reduce error rates
- **Compliance Improvement**: Improve compliance
- **Quality Enhancement**: Enhance quality

### Business Optimization
- **Value Optimization**: Optimize value delivery
- **Efficiency Improvement**: Improve efficiency
- **Cost Optimization**: Optimize costs
- **Time Optimization**: Optimize time to market

## Protocol Integration

### System Integration
- **Framework Integration**: Integrate with AI Governor framework
- **Tool Integration**: Integrate with development tools
- **Process Integration**: Integrate with development processes
- **Quality Integration**: Integrate with quality systems

### External Integration
- **Client Integration**: Integrate with client systems
- **Stakeholder Integration**: Integrate with stakeholders
- **Vendor Integration**: Integrate with vendors
- **Community Integration**: Integrate with development community

### Cross-Protocol Integration
- **Protocol Communication**: Enable protocol communication
- **Data Sharing**: Enable data sharing between protocols
- **State Synchronization**: Synchronize state between protocols
- **Error Propagation**: Propagate errors between protocols

## Protocol Documentation

### Protocol Reference
- **Protocol Descriptions**: Detailed protocol descriptions
- **Trigger Mappings**: Complete trigger mappings
- **Execution Patterns**: Execution pattern documentation
- **Error Handling**: Error handling documentation

### User Guide
- **Getting Started**: Getting started guide
- **Usage Examples**: Usage examples
- **Best Practices**: Best practices guide
- **Troubleshooting**: Troubleshooting guide

### Developer Guide
- **Protocol Development**: Protocol development guide
- **Integration Guide**: Integration guide
- **Testing Guide**: Testing guide
- **Maintenance Guide**: Maintenance guide



