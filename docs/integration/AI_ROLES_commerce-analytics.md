# AI Roles and Choreography: commerce-analytics

## Overview
This document defines the AI roles and choreography for the commerce-analytics project, mapping AI agent responsibilities, interactions, and coordination patterns.

## AI Role Definitions

### 1. AI Codebase Analyst & Context Architect
**Protocol**: `0-bootstrap-your-project.md`
**Mission**: Initial project setup and context engineering

#### Responsibilities
- **Tooling Configuration**: Rename `.ai-governor` to `.cursor`, convert `.md` to `.mdc`
- **Initial Codebase Mapping**: Create comprehensive project structure map
- **Thematic Investigation**: Identify core themes and patterns
- **Autonomous Deep Dive**: Use semantic search for deep code analysis
- **Collaborative Validation**: Validate findings with human input
- **Documentation Generation**: Create README.md files and project rules

#### Key Activities
- Map project structure and dependencies
- Identify architectural patterns and themes
- Generate comprehensive documentation
- Establish project rules and guidelines
- Create context kit for future AI collaboration

#### Success Criteria
- Complete project structure documented
- All themes and patterns identified
- README.md files generated for all modules
- Project rules established and validated

### 2. Master Planner & Background Agent Orchestrator
**Protocol**: `0-master-planner.md`
**Mission**: High-level strategic planning and background agent orchestration

#### Responsibilities
- **Strategic Planning**: Devise three distinct strategies for framework ecosystem
- **Background Agent Coordination**: Orchestrate parallel framework development
- **Resource Allocation**: Allocate resources across multiple frameworks
- **Risk Assessment**: Identify and mitigate strategic risks
- **Timeline Management**: Coordinate development timelines

#### Key Activities
- Analyze project requirements and constraints
- Develop three distinct strategic approaches
- Coordinate background agents for parallel execution
- Monitor progress and adjust strategies
- Ensure alignment with business objectives

#### Success Criteria
- Three distinct strategies proposed and documented
- Background agents successfully coordinated
- All frameworks developed in parallel
- Strategic objectives achieved

### 3. Monorepo-Aware AI Product Manager
**Protocol**: `1-create-prd.md`
**Mission**: Create comprehensive Product Requirements Document

#### Responsibilities
- **Requirements Analysis**: Analyze and scope business requirements
- **Layer Detection**: Identify implementation layers (Frontend/Backend/Central)
- **Placement Validation**: Validate feature placement in monorepo
- **Specification Creation**: Create detailed layer-specific specifications
- **Stakeholder Alignment**: Ensure alignment with business stakeholders

#### Key Activities
- Analyze new vs. existing feature requirements
- Identify core business needs and feature types
- Detect appropriate implementation layer
- Validate placement in monorepo structure
- Create detailed specifications for each layer

#### Success Criteria
- PRD created and validated
- Implementation layers clearly defined
- Feature placement validated
- Stakeholder alignment achieved

### 4. Monorepo-Aware AI Tech Lead
**Protocol**: `2-generate-tasks.md`
**Mission**: Transform PRD into granular, actionable technical plan

#### Responsibilities
- **Context Discovery**: Invoke context discovery protocols
- **Model Selection**: Identify top LLM models/personas for tasks
- **Layer Identification**: Identify implementation layers and dependencies
- **Duplicate Prevention**: Prevent duplicate work across layers
- **Task Breakdown**: Generate high-level and detailed tasks

#### Key Activities
- Analyze PRD and technical requirements
- Select appropriate AI models for different tasks
- Identify implementation layers and dependencies
- Generate comprehensive task breakdown
- Ensure no duplicate work across layers

#### Success Criteria
- Detailed technical plan created
- AI models selected for each task
- Implementation layers identified
- No duplicate work planned

### 5. AI Paired Developer
**Protocol**: `3-process-tasks.md`
**Mission**: Controlled, sequential execution of technical tasks

#### Responsibilities
- **Task Execution**: Execute tasks in controlled, sequential manner
- **Focus Mode**: One parent task per chat session
- **Pre-execution Validation**: Validate prerequisites before execution
- **Self-verification**: Verify task completion and quality
- **Error Handling**: Handle and recover from errors

#### Key Activities
- Identify and prioritize tasks
- Execute tasks with proper validation
- Verify completion and quality
- Handle errors and recovery
- Update progress and synchronize

#### Success Criteria
- All tasks executed successfully
- Quality standards maintained
- Errors handled and recovered
- Progress properly tracked

### 6. QA & Process Improvement Lead
**Protocol**: `4-implementation-retrospective.md`
**Mission**: Technical code review and process retrospective

#### Responsibilities
- **Technical Review**: Conduct comprehensive code review
- **Process Analysis**: Analyze development process effectiveness
- **Quality Assessment**: Assess code quality and standards
- **Improvement Identification**: Identify process improvements
- **Recommendation Generation**: Generate concrete improvement actions

#### Key Activities
- Review conversation and code changes
- Audit code against established rules
- Synthesize findings and insights
- Conduct guided interview on process
- Propose concrete improvement actions

#### Success Criteria
- Comprehensive review completed
- Process improvements identified
- Quality issues addressed
- Improvement actions proposed

### 7. Background Agent Coordinator
**Protocol**: `5-background-agent-coordination.md`
**Mission**: Manage parallel execution of multiple background agents

#### Responsibilities
- **Agent Launch**: Launch and manage background agents
- **Handoff Management**: Manage handoffs between agents
- **Conflict Resolution**: Resolve conflicts between agents
- **Quality Gates**: Ensure quality standards across agents
- **Integration**: Integrate results from multiple agents

#### Key Activities
- Launch background agents for parallel work
- Monitor agent progress and status
- Resolve conflicts and dependencies
- Ensure quality gates are met
- Integrate results from all agents

#### Success Criteria
- All background agents launched successfully
- Conflicts resolved and dependencies managed
- Quality gates met across all agents
- Results properly integrated

### 8. Client Portfolio Manager & Project Coordinator
**Protocol**: `6-client-portfolio-manager.md`
**Mission**: Provide oversight and coordination across multiple concurrent client projects

#### Responsibilities
- **Portfolio Discovery**: Discover and assess all client projects
- **Resource Planning**: Plan resources across projects
- **Quality Assurance**: Ensure quality across all projects
- **Risk Management**: Identify and mitigate portfolio risks
- **Coordination**: Coordinate activities across projects

#### Key Activities
- Assess portfolio of client projects
- Plan resource allocation across projects
- Ensure quality standards across portfolio
- Identify and mitigate risks
- Coordinate activities and dependencies

#### Success Criteria
- Portfolio properly assessed and managed
- Resources optimally allocated
- Quality maintained across portfolio
- Risks identified and mitigated

### 9. System Update Coordinator
**Protocol**: `6-comprehensive-system-update.md`
**Mission**: Perform comprehensive update of entire development workflow system

#### Responsibilities
- **System Validation**: Validate current system state
- **Update Planning**: Plan comprehensive system updates
- **Rule Updates**: Update master and project rules
- **Documentation Sync**: Synchronize documentation
- **Validation**: Validate updates and rollback if needed

#### Key Activities
- Validate current system state
- Plan and execute system updates
- Update rules and documentation
- Validate updates and rollback if needed
- Generate update reports

#### Success Criteria
- System successfully updated
- All rules and documentation synchronized
- Updates validated and working
- Rollback procedures tested

### 10. AI Upwork Proposal Specialist
**Protocol**: `7-proposalcreate.mdc`
**Mission**: Generate tailored Upwork proposals with strict compliance and quality controls

#### Responsibilities
- **Proposal Creation**: Create tailored Upwork proposals
- **Compliance Validation**: Ensure compliance with Upwork guidelines
- **Quality Control**: Maintain high quality standards
- **Customization**: Customize proposals for specific clients
- **Validation**: Validate proposals through 3-pass validator

#### Key Activities
- Analyze client briefs and requirements
- Create tailored proposal content
- Ensure compliance with guidelines
- Customize for specific client needs
- Validate through quality checks

#### Success Criteria
- High-quality proposals generated
- Compliance with Upwork guidelines
- Client-specific customization
- Validation passed successfully

## AI Choreography Patterns

### Sequential Choreography
```
AI Codebase Analyst → Master Planner → Product Manager → Tech Lead → Paired Developer → QA Lead
```

### Parallel Choreography
```
Master Planner ↔ Background Agent Coordinator
Product Manager ↔ Background Agent Coordinator
Tech Lead ↔ Background Agent Coordinator
Paired Developer ↔ Background Agent Coordinator
```

### Management Choreography
```
QA Lead → Portfolio Manager
Portfolio Manager → Master Planner
Portfolio Manager → Paired Developer
Portfolio Manager → System Update Coordinator
```

### System Maintenance Choreography
```
System Update Coordinator → AI Codebase Analyst
QA Lead → System Update Coordinator
Portfolio Manager → System Update Coordinator
```

### External Trigger Choreography
```
Upwork Proposal Specialist → Master Planner
Upwork Proposal Specialist → AI Codebase Analyst
```

## Role Interactions

### Direct Interactions

#### AI Codebase Analyst ↔ Master Planner
- **Trigger**: Context discovery completion
- **Purpose**: Transfer context and strategic planning
- **Data**: Project structure, themes, patterns

#### Master Planner ↔ Background Agent Coordinator
- **Trigger**: Strategic plan approval
- **Purpose**: Launch and coordinate background agents
- **Data**: Strategic plans, resource allocation

#### Product Manager ↔ Tech Lead
- **Trigger**: PRD completion
- **Purpose**: Transform requirements into technical tasks
- **Data**: PRD, technical specifications

#### Tech Lead ↔ Paired Developer
- **Trigger**: Task generation completion
- **Purpose**: Execute technical tasks
- **Data**: Task breakdown, technical specifications

#### Paired Developer ↔ QA Lead
- **Trigger**: Task execution completion
- **Purpose**: Review and improve process
- **Data**: Code changes, execution logs

### Indirect Interactions

#### Portfolio Manager ↔ All Roles
- **Trigger**: Cross-project coordination needs
- **Purpose**: Coordinate activities across projects
- **Data**: Project status, resource allocation

#### System Update Coordinator ↔ All Roles
- **Trigger**: System update requirements
- **Purpose**: Update system and rules
- **Data**: System state, update requirements

#### Background Agent Coordinator ↔ All Development Roles
- **Trigger**: Parallel work requirements
- **Purpose**: Coordinate parallel development
- **Data**: Work assignments, progress updates

## Role Specializations

### Industry Specializations

#### Healthcare Specialists
- **AI Codebase Analyst**: HIPAA compliance focus
- **Product Manager**: Healthcare workflow expertise
- **Tech Lead**: Healthcare data security knowledge
- **Paired Developer**: Healthcare API development
- **QA Lead**: Healthcare compliance validation

#### Finance Specialists
- **AI Codebase Analyst**: SOX/PCI compliance focus
- **Product Manager**: Financial workflow expertise
- **Tech Lead**: Financial data security knowledge
- **Paired Developer**: Financial API development
- **QA Lead**: Financial compliance validation

#### E-commerce Specialists
- **AI Codebase Analyst**: PCI/GDPR compliance focus
- **Product Manager**: E-commerce workflow expertise
- **Tech Lead**: E-commerce performance knowledge
- **Paired Developer**: E-commerce API development
- **QA Lead**: E-commerce compliance validation

### Technology Specializations

#### Frontend Specialists
- **Tech Lead**: Frontend architecture expertise
- **Paired Developer**: Frontend development skills
- **QA Lead**: Frontend testing and validation

#### Backend Specialists
- **Tech Lead**: Backend architecture expertise
- **Paired Developer**: Backend development skills
- **QA Lead**: Backend testing and validation

#### Database Specialists
- **Tech Lead**: Database design expertise
- **Paired Developer**: Database development skills
- **QA Lead**: Database testing and validation

#### DevOps Specialists
- **Tech Lead**: Infrastructure expertise
- **Paired Developer**: DevOps development skills
- **QA Lead**: Infrastructure testing and validation

## Role Performance Metrics

### Individual Role Metrics

#### AI Codebase Analyst
- **Context Completeness**: Percentage of project context captured
- **Documentation Quality**: Quality of generated documentation
- **Pattern Recognition**: Accuracy of pattern identification
- **Time to Completion**: Time to complete context analysis

#### Master Planner
- **Strategy Quality**: Quality of strategic plans
- **Resource Optimization**: Efficiency of resource allocation
- **Risk Identification**: Accuracy of risk assessment
- **Timeline Accuracy**: Accuracy of timeline estimates

#### Product Manager
- **Requirements Clarity**: Clarity of requirements documentation
- **Stakeholder Alignment**: Level of stakeholder alignment
- **Feature Completeness**: Completeness of feature specifications
- **Layer Accuracy**: Accuracy of layer identification

#### Tech Lead
- **Task Completeness**: Completeness of task breakdown
- **Model Selection**: Accuracy of AI model selection
- **Dependency Mapping**: Accuracy of dependency identification
- **Duplicate Prevention**: Effectiveness of duplicate prevention

#### Paired Developer
- **Task Completion Rate**: Percentage of tasks completed
- **Quality Score**: Quality of delivered code
- **Error Rate**: Frequency of errors and bugs
- **Time to Completion**: Time to complete tasks

#### QA Lead
- **Review Completeness**: Completeness of code review
- **Issue Identification**: Accuracy of issue identification
- **Process Improvement**: Quality of process improvements
- **Recommendation Quality**: Quality of recommendations

### Team Performance Metrics

#### Coordination Effectiveness
- **Handoff Success Rate**: Success rate of role handoffs
- **Conflict Resolution**: Effectiveness of conflict resolution
- **Communication Quality**: Quality of inter-role communication
- **Timeline Adherence**: Adherence to project timelines

#### Quality Metrics
- **Overall Quality Score**: Average quality across all roles
- **Compliance Rate**: Rate of compliance with standards
- **Error Rate**: Overall error rate across team
- **Customer Satisfaction**: Level of customer satisfaction

#### Efficiency Metrics
- **Throughput**: Tasks completed per unit time
- **Resource Utilization**: Efficiency of resource usage
- **Bottleneck Identification**: Accuracy of bottleneck identification
- **Process Optimization**: Effectiveness of process improvements

## Role Training and Development

### Initial Training
- **Role-Specific Training**: Training for specific role responsibilities
- **System Training**: Training on AI Governor framework
- **Process Training**: Training on development processes
- **Tool Training**: Training on development tools

### Continuous Learning
- **Performance Feedback**: Regular feedback on role performance
- **Skill Development**: Ongoing skill development programs
- **Process Improvement**: Continuous process improvement
- **Technology Updates**: Training on new technologies

### Role Evolution
- **Role Expansion**: Expanding role responsibilities
- **Role Specialization**: Developing role specializations
- **Role Integration**: Improving role integration
- **Role Innovation**: Developing new role capabilities

## Role Governance

### Role Definition
- **Clear Responsibilities**: Clearly defined role responsibilities
- **Success Criteria**: Clear success criteria for each role
- **Performance Standards**: Clear performance standards
- **Accountability**: Clear accountability mechanisms

### Role Monitoring
- **Performance Tracking**: Regular performance tracking
- **Quality Monitoring**: Continuous quality monitoring
- **Compliance Checking**: Regular compliance checking
- **Feedback Collection**: Regular feedback collection

### Role Optimization
- **Performance Analysis**: Regular performance analysis
- **Process Improvement**: Continuous process improvement
- **Role Refinement**: Regular role refinement
- **Innovation**: Continuous innovation in role design

## Role Integration

### System Integration
- **Framework Integration**: Integration with AI Governor framework
- **Tool Integration**: Integration with development tools
- **Process Integration**: Integration with development processes
- **Quality Integration**: Integration with quality systems

### Cross-Role Integration
- **Communication Protocols**: Clear communication protocols
- **Handoff Procedures**: Standardized handoff procedures
- **Conflict Resolution**: Clear conflict resolution procedures
- **Collaboration Tools**: Effective collaboration tools

### External Integration
- **Client Integration**: Integration with client systems
- **Stakeholder Integration**: Integration with stakeholders
- **Vendor Integration**: Integration with vendors
- **Community Integration**: Integration with development community






