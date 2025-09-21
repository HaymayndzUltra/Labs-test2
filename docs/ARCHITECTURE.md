# Architecture Guide

## Overview

The Client Project Generator is built on a sophisticated multi-layered architecture designed for enterprise-scale project generation. The system combines advanced templating, intelligent rule management, and enterprise-grade performance optimization to create production-ready applications with industry-specific compliance.

## Core Architecture Principles

### 1. Template-Driven Generation
The system uses a sophisticated template engine that processes industry-specific configurations to generate complete project structures.

### 2. Policy-Driven Selection
Technology stack selection is driven by industry policies and compliance requirements, ensuring appropriate technology choices for each use case.

### 3. Hierarchical Rule Management
A sophisticated rule hierarchy with intelligent precedence ensures consistent application of best practices and compliance requirements.

### 4. Enterprise Performance
Concurrent processing, memory optimization, and intelligent caching enable scalable project generation.

## System Components

### Template Processing System

#### Multi-Layer Templating
- **Simple Variable Substitution**: Uses `{{VARIABLE_NAME}}` placeholders with regex-based replacement
- **Advanced Templating**: Handlebars-like templating with `{{#if}}`, `{{#each}}` constructs
- **Custom Helpers**: Functions like `contains()`, `eq()`, `gte()` for complex logic

#### Template Inheritance
- **Hierarchical Structure**: `template-packs/component/technology/variant/` organization
- **Variant Selection**: Base templates with enterprise/compliance overlays
- **Industry Extensions**: Templates extend base functionality with industry compliance patterns

#### Framework-Specific Templates
- **Frontend**: Next.js, Nuxt, Angular, Expo with industry-specific configurations
- **Backend**: FastAPI, Django, NestJS, Go with compliance-aware patterns
- **Database**: PostgreSQL, MongoDB, Firebase with industry-specific schemas

### Rule Management System

#### Rule Hierarchy
```
Security (Priority 1) > Compliance (Priority 2) > Industry (Priority 3) > 
Quality (Priority 4) > Workflow (Priority 5) > Project (Priority 6)
```

#### Industry-Specific Adjustments
- **Healthcare/Finance**: +20/+25 points for security priority
- **Compliance Rules**: Dynamic generation based on industry requirements
- **Master Rule Integration**: Essential master rules copied to new projects

#### Rule Generation Process
1. **Client-Specific Rules**: Generated dynamically based on project configuration
2. **Industry Compliance Rules**: Created for each compliance requirement
3. **Project Workflow Rules**: Generated based on technology stack
4. **AI Governor Integration**: Seamless integration with master rule system

### Performance & Scalability

#### Concurrent Processing
- **ThreadPoolExecutor**: Configurable worker management for parallel operations
- **Dependency Management**: Lane-based execution with concurrency caps
- **Topological Ordering**: Ensures proper execution order
- **Batch Processing**: Tasks executed in batches respecting concurrency limits

#### Memory Management
- **Memory Budgets**: Framework (<2GB), Project Generation (<4GB), Cache (<1GB)
- **Optimization Strategies**: Chunked processing, streaming, LRU caching
- **Automatic Cleanup**: Temporary files cleaned up automatically
- **Context Cache**: High-performance cache with TTL-based invalidation

#### Caching Strategy
- **Multi-Layered Caching**: Template cache, rule cache, component cache
- **TTL-Based Invalidation**: Industry-specific TTL adjustments
- **File System Monitoring**: Watches for changes to critical files
- **Performance Metrics**: Cache hit rates and access time monitoring

### State Management

#### Persistent State
- **State Storage**: States persisted in `.cursor/ai-governor/state.json`
- **Transition Logging**: All state changes logged in `routing_logs/`
- **Rollback Support**: Recovery information maintained for each state

#### State Machine
```
INITIAL → BOOTSTRAP → CONTEXT_DISCOVERY → MASTER_PLAN → 
PRD_CREATION → TASK_GENERATION → TASK_EXECUTION
```

#### Quality Gates
- **State Validation**: Each transition validated against business rules
- **Error Recovery**: Comprehensive error handling and recovery procedures
- **Context Preservation**: Critical context maintained across transitions

## Integration Patterns

### AI Governor Framework Integration

#### Core Integration
- **Framework Discovery**: Automatically finds AI Governor root directory
- **Rule Validation**: Validates project configuration against policies
- **Master Rule Copying**: Copies essential master rules to new projects
- **Workflow Integration**: Creates workflow configuration files

#### Integration Protocols
- **Router Protocol**: `python3 .cursor/dev-workflow/router/router.py [git_commit]`
- **Policy Management**: Filesystem API via `.cursor/dev-workflow/policy-dsl/*.json`
- **CI & Artifacts**: Provides evidences, snapshots, waivers, and consumes routing logs

### External Dependencies

#### Docker Integration
- **DevContainer Support**: Pre-configured development environments
- **Multi-stage Builds**: Optimized container builds for different environments
- **Health Checks**: Container health monitoring and validation
- **Volume Management**: Persistent storage for development data

#### Git Integration
- **Repository Initialization**: Automatic Git repository setup
- **Branch Strategy**: Industry-specific branching strategies
- **Commit Hooks**: Pre-commit and post-commit validation
- **History Tracking**: Complete audit trail for compliance

#### CI/CD Pipeline Integration
- **Multi-Cloud Support**: AWS, Azure, GCP deployment configurations
- **Quality Gates**: Industry-specific quality requirements
- **Security Scanning**: Integrated security vulnerability scanning
- **Automated Rollback**: Rollback capability for failed deployments

## Security Architecture

### Industry-Specific Security
- **Policy DSL**: Industry-specific security patterns through policy definitions
- **Compliance-First Design**: Security enforced through compliance requirements
- **Authentication Providers**: Enterprise-grade auth providers with industry recommendations
- **Session Management**: Industry-specific session timeouts

### Security Features
- **PHI Protection**: HIPAA-compliant logging with PHI protection
- **Audit Logging**: Comprehensive audit trails for compliance
- **Access Controls**: Role-based access control with industry-specific requirements
- **Encryption**: Data encryption at rest and in transit

## Error Handling & Validation

### Structured Error Responses
- **Consistent Format**: `{ success: false, error: { ... } }` structure
- **Comprehensive Validation**: Input, configuration, and compliance validation
- **Graceful Degradation**: Non-fatal errors handled gracefully
- **Try-Catch Everywhere**: All I/O operations wrapped in error handling

### Validation Pipeline
1. **Input Validation**: Guard clauses for all external inputs
2. **Configuration Validation**: Technology stack compatibility checks
3. **Compliance Validation**: Industry-specific compliance requirements
4. **Integration Validation**: External service availability and configuration

## Monitoring & Observability

### Logging System
- **Structured Logging**: JSON format with correlation IDs
- **Industry-Specific Logging**: HIPAA-compliant logging with PHI protection
- **Multi-Level Logging**: ERROR, WARN, INFO, DEBUG levels
- **Centralized Aggregation**: Centralized log collection and analysis

### Performance Monitoring
- **SLIs/SLOs**: Specific targets (P95 ≤ 500ms, CI pass rate ≥ 90%)
- **Real-time Metrics**: Prometheus + Grafana for system metrics
- **Application Performance**: Custom metrics for framework operations
- **Error Tracking**: Sentry for error monitoring and alerting

## Development Workflow

### Code Quality Standards
- **Naming Conventions**: Explicit variable and function names
- **Single Responsibility**: Functions limited to 20-30 lines
- **Guard Clauses**: Input validation at function entry points
- **Error Handling**: Comprehensive error handling with informative logging

### Testing Strategy
- **Unit Tests**: Comprehensive test coverage for all components
- **Integration Tests**: End-to-end testing of generation workflows
- **Performance Tests**: Load testing and performance validation
- **Compliance Tests**: Industry-specific compliance validation

## Future Enhancements

### Planned Improvements
- **Enhanced Template Engine**: More sophisticated templating capabilities
- **Advanced Caching**: Machine learning-based cache optimization
- **Real-time Monitoring**: Enhanced observability and alerting
- **Multi-tenant Support**: Support for multiple concurrent generations

### Scalability Roadmap
- **Horizontal Scaling**: Distributed generation across multiple nodes
- **Cloud Integration**: Native cloud provider integrations
- **Advanced Analytics**: Usage analytics and optimization recommendations
- **API Gateway**: RESTful API for programmatic access

## Conclusion

The Client Project Generator's architecture is designed for enterprise-scale project generation with a focus on compliance, performance, and maintainability. The multi-layered approach ensures that generated projects meet industry standards while maintaining high performance and reliability.

The system's sophisticated template processing, intelligent rule management, and enterprise-grade performance optimization make it a powerful tool for creating production-ready applications across multiple industries and technology stacks.
