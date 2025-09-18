# Template System Structure: commerce-analytics

## Overview
This document defines the template system structure for the commerce-analytics project, mapping template organization, substitution mechanisms, and customization patterns.

## Template System Architecture

### Core Components

#### 1. Template Engine (`project_generator/core/generator.py`)
- **Purpose**: Main template processing engine
- **Features**: 
  - Placeholder substitution using regex
  - Thread pool processing for performance
  - File type filtering (text files only)
  - Cached regex compilation

#### 2. Template Registry (`project_generator/templates/registry.py`)
- **Purpose**: Template discovery and organization
- **Features**:
  - Template manifest management
  - Variant selection logic
  - Template validation

#### 3. Template Engine (`project_generator/templates/template_engine.py`)
- **Purpose**: Advanced template processing
- **Features**:
  - Handlebars-like templating
  - Conditional logic
  - Loop constructs
  - Custom helpers

### Template Organization

#### Directory Structure
```
template-packs/
├── frontend/
│   ├── nextjs/
│   │   ├── base/
│   │   └── enterprise/
│   ├── nuxt/
│   │   ├── base/
│   │   └── enterprise/
│   ├── angular/
│   │   ├── base/
│   │   └── enterprise/
│   └── expo/
│       ├── base/
│       └── enterprise/
├── backend/
│   ├── fastapi/
│   │   ├── base/
│   │   ├── microservice/
│   │   └── enterprise/
│   ├── django/
│   │   ├── base/
│   │   └── enterprise/
│   ├── nestjs/
│   │   ├── base/
│   │   ├── prisma/
│   │   └── enterprise/
│   └── go/
│       ├── base/
│       └── enterprise/
├── database/
│   ├── postgres/
│   │   └── base/
│   ├── mongodb/
│   │   └── base/
│   └── firebase/
│       └── base/
└── cicd/
    ├── gates_config.yaml
    └── github/
        ├── workflows/
        └── templates/
```

### Template Variants

#### Frontend Variants

##### Next.js Variants
- **base**: Standard Next.js setup
  - App Router configuration
  - TypeScript support
  - Tailwind CSS integration
  - ESLint/Prettier setup
- **enterprise**: Enterprise-ready Next.js
  - Advanced security headers
  - Performance optimizations
  - Monitoring integration
  - Compliance features

##### Nuxt Variants
- **base**: Standard Nuxt setup
  - Vue 3 composition API
  - TypeScript support
  - Tailwind CSS integration
  - SEO optimization
- **enterprise**: Enterprise-ready Nuxt
  - Advanced caching strategies
  - Security enhancements
  - Performance monitoring
  - Compliance features

##### Angular Variants
- **base**: Standard Angular setup
  - Standalone components
  - TypeScript strict mode
  - Angular Material integration
  - RxJS patterns
- **enterprise**: Enterprise-ready Angular
  - Advanced state management
  - Security features
  - Performance optimizations
  - Enterprise UI components

##### Expo Variants
- **base**: Standard Expo setup
  - Expo Router
  - TypeScript support
  - Native features
  - Development tools
- **enterprise**: Enterprise-ready Expo
  - Advanced security
  - Performance optimizations
  - Enterprise integrations
  - Compliance features

#### Backend Variants

##### FastAPI Variants
- **base**: Standard FastAPI setup
  - Pydantic v2 models
  - Dependency injection
  - OpenAPI documentation
  - Basic security
- **microservice**: Microservice-ready FastAPI
  - Service discovery
  - Circuit breakers
  - Distributed tracing
  - Health checks
- **enterprise**: Enterprise-ready FastAPI
  - Advanced security
  - Compliance features
  - Monitoring integration
  - Audit logging

##### Django Variants
- **base**: Standard Django setup
  - Django REST Framework
  - PostgreSQL integration
  - Basic authentication
  - Admin interface
- **enterprise**: Enterprise-ready Django
  - Advanced security
  - Compliance features
  - Performance optimizations
  - Enterprise integrations

##### NestJS Variants
- **base**: Standard NestJS setup
  - TypeScript support
  - Dependency injection
  - Swagger documentation
  - Basic security
- **prisma**: NestJS with Prisma ORM
  - Prisma integration
  - Database migrations
  - Type-safe queries
  - Advanced features
- **enterprise**: Enterprise-ready NestJS
  - Advanced security
  - Compliance features
  - Microservice architecture
  - Enterprise integrations

##### Go Variants
- **base**: Standard Go setup
  - Gin/Echo framework
  - Basic middleware
  - JSON serialization
  - Basic security
- **enterprise**: Enterprise-ready Go
  - Advanced security
  - Performance optimizations
  - Compliance features
  - Enterprise integrations

#### Database Variants

##### PostgreSQL Variants
- **base**: Standard PostgreSQL setup
  - Basic schema
  - Indexes
  - Constraints
  - Migrations

##### MongoDB Variants
- **base**: Standard MongoDB setup
  - Document schemas
  - Indexes
  - Aggregation pipelines
  - Change streams

##### Firebase Variants
- **base**: Standard Firebase setup
  - Firestore rules
  - Authentication
  - Storage
  - Functions

### Template Substitution

#### Placeholder System
```python
# Core placeholders
mapping = {
    '{{PROJECT_NAME}}': self.args.name,
    '{{INDUSTRY}}': self.args.industry,
    '{{PROJECT_TYPE}}': self.args.project_type,
    '{{FRONTEND}}': self.args.frontend,
    '{{BACKEND}}': self.args.backend,
    '{{DATABASE}}': self.args.database,
    '{{AUTH}}': self.args.auth,
    '{{DEPLOY}}': self.args.deploy,
}
```

#### File Type Filtering
```python
text_exts = {
    '.md', '.mdc', '.txt', '.json', '.yml', '.yaml', '.toml', '.ini', '.env',
    '.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.html', '.css', '.scss', '.sh'
}
```

#### Processing Pipeline
1. **File Discovery**: Recursively find all text files
2. **Regex Compilation**: Pre-compile placeholder patterns
3. **Thread Pool Processing**: Parallel file processing
4. **Substitution**: Replace placeholders with values
5. **Validation**: Verify successful processing

### Template Customization

#### Industry-Specific Customizations

##### Healthcare Templates
- **Compliance**: HIPAA-specific configurations
- **Security**: Enhanced encryption and access controls
- **Audit**: Comprehensive logging and monitoring
- **Features**: Patient portal, medical records, telehealth

##### Finance Templates
- **Compliance**: SOX, PCI-specific configurations
- **Security**: Maximum security and fraud detection
- **Audit**: Financial audit trails and reporting
- **Features**: Account management, transactions, risk assessment

##### E-commerce Templates
- **Compliance**: PCI, GDPR-specific configurations
- **Security**: Payment processing and secure checkout
- **Performance**: High-performance and global distribution
- **Features**: Product catalog, shopping cart, inventory

##### SaaS Templates
- **Compliance**: SOC2, GDPR-specific configurations
- **Security**: Multi-tenancy and API security
- **Scalability**: Auto-scaling and load balancing
- **Features**: User management, subscriptions, billing

##### Enterprise Templates
- **Compliance**: SOC2-specific configurations
- **Security**: SSO, RBAC, and enterprise integrations
- **Scalability**: Enterprise-grade infrastructure
- **Features**: SSO integration, role management, reporting

#### Project Type Customizations

##### Web Projects
- **Frontend**: Required (Next.js, Nuxt, Angular)
- **Backend**: Optional (FastAPI, Django, NestJS, Go)
- **Database**: Optional (PostgreSQL, MongoDB, Firebase)
- **Auth**: Optional (Auth0, Cognito, Firebase, Custom)

##### Mobile Projects
- **Frontend**: Required (Expo, React Native)
- **Backend**: Optional (FastAPI, Django, NestJS, Go)
- **Database**: Optional (PostgreSQL, MongoDB, Firebase)
- **Auth**: Optional (Auth0, Firebase, Custom)

##### API Projects
- **Frontend**: None
- **Backend**: Required (FastAPI, Django, NestJS, Go)
- **Database**: Optional (PostgreSQL, MongoDB, Firebase)
- **Auth**: Optional (Auth0, Cognito, Custom)

##### Fullstack Projects
- **Frontend**: Required (Next.js, Nuxt, Angular)
- **Backend**: Required (FastAPI, Django, NestJS, Go)
- **Database**: Optional (PostgreSQL, MongoDB, Firebase)
- **Auth**: Optional (Auth0, Cognito, Firebase, Custom)

##### Microservices Projects
- **Frontend**: Optional (Next.js, Nuxt, Angular)
- **Backend**: Required (FastAPI, NestJS, Go)
- **Database**: Optional (PostgreSQL, MongoDB, Firebase)
- **Auth**: Optional (Auth0, Cognito, Custom)

### Template Features

#### Conditional Logic
```handlebars
{{#if (eq INDUSTRY "healthcare")}}
# HIPAA Compliance Configuration
encryption: true
audit_logging: true
{{/if}}

{{#if (eq COMPLIANCE "hipaa")}}
# HIPAA-specific features
patient_portal: true
secure_messaging: true
{{/if}}
```

#### Loop Constructs
```handlebars
{{#each FEATURES}}
- {{this}}
{{/each}}

{{#each COMPLIANCE}}
compliance_{{this}}: true
{{/each}}
```

#### Custom Helpers
```handlebars
{{#if (contains COMPLIANCE "hipaa")}}
# HIPAA-specific configuration
{{/if}}

{{#if (gte PERFORMANCE_TIER 3)}}
# High-performance configuration
{{/if}}
```

### Template Validation

#### Pre-Generation Validation
- **Template Completeness**: All required templates present
- **Placeholder Consistency**: All placeholders have values
- **Variant Compatibility**: Selected variants are compatible
- **Industry Requirements**: Templates meet industry standards

#### Post-Generation Validation
- **File Generation**: All expected files created
- **Placeholder Substitution**: All placeholders replaced
- **Syntax Validation**: Generated code is syntactically correct
- **Dependency Validation**: All dependencies are valid

### Template Extensibility

#### Custom Template Creation
1. **Template Structure**: Follow existing directory structure
2. **Placeholder Usage**: Use standard placeholder names
3. **Variant Organization**: Organize by complexity/use case
4. **Documentation**: Document template purpose and usage

#### Template Inheritance
- **Base Templates**: Common functionality across variants
- **Variant Templates**: Specific customizations
- **Industry Templates**: Industry-specific modifications
- **Project Templates**: Project-specific customizations

#### Template Composition
- **Mix and Match**: Combine templates from different categories
- **Override Mechanism**: Override specific template files
- **Extension Points**: Add custom functionality
- **Plugin System**: Extend template engine capabilities

### Template Performance

#### Optimization Strategies
- **Caching**: Cache compiled templates and regex patterns
- **Parallel Processing**: Use thread pools for file processing
- **Lazy Loading**: Load templates only when needed
- **Incremental Updates**: Only process changed templates

#### Performance Metrics
- **Template Load Time**: Time to load and compile templates
- **Processing Time**: Time to process all files
- **Memory Usage**: Memory consumption during processing
- **File Count**: Number of files processed

### Template Maintenance

#### Version Control
- **Template Versioning**: Version templates independently
- **Backward Compatibility**: Maintain compatibility across versions
- **Migration Scripts**: Provide migration between versions
- **Deprecation Policy**: Clear deprecation and removal policy

#### Testing
- **Unit Tests**: Test individual template functions
- **Integration Tests**: Test template combinations
- **Regression Tests**: Ensure changes don't break existing functionality
- **Performance Tests**: Monitor template processing performance

#### Documentation
- **Template Reference**: Document all available templates
- **Usage Examples**: Provide usage examples for each template
- **Best Practices**: Document template development best practices
- **Troubleshooting**: Common issues and solutions

### Template Security

#### Security Considerations
- **Input Validation**: Validate all template inputs
- **Output Sanitization**: Sanitize generated output
- **Access Control**: Control access to template files
- **Audit Logging**: Log template generation activities

#### Security Features
- **Sandboxing**: Isolate template processing
- **Resource Limits**: Limit template processing resources
- **Error Handling**: Secure error handling and reporting
- **Vulnerability Scanning**: Regular security scanning

### Template Integration

#### CI/CD Integration
- **Template Validation**: Validate templates in CI pipeline
- **Template Testing**: Test template generation
- **Template Deployment**: Deploy template updates
- **Template Monitoring**: Monitor template usage and performance

#### Development Integration
- **IDE Support**: IDE integration for template development
- **Debugging**: Debug template processing issues
- **Profiling**: Profile template performance
- **Hot Reloading**: Hot reload template changes

### Template Examples

#### Basic Template
```typescript
// {{PROJECT_NAME}} - {{INDUSTRY}} {{PROJECT_TYPE}} Application
export class {{PROJECT_NAME}}App {
  private {{FRONTEND}}: string = '{{FRONTEND}}';
  private {{BACKEND}}: string = '{{BACKEND}}';
  private {{DATABASE}}: string = '{{DATABASE}}';
  
  constructor() {
    this.initialize();
  }
  
  private initialize(): void {
    console.log(`Initializing ${this.{{FRONTEND}}} frontend with ${this.{{BACKEND}}} backend`);
  }
}
```

#### Conditional Template
```yaml
# {{PROJECT_NAME}} Configuration
name: {{PROJECT_NAME}}
industry: {{INDUSTRY}}
project_type: {{PROJECT_TYPE}}

{{#if (eq COMPLIANCE "hipaa")}}
compliance:
  hipaa: true
  encryption: true
  audit_logging: true
{{/if}}

{{#if (eq COMPLIANCE "sox")}}
compliance:
  sox: true
  audit_trails: true
  change_management: true
{{/if}}
```

#### Loop Template
```json
{
  "{{PROJECT_NAME}}": {
    "features": [
      {{#each FEATURES}}
      "{{this}}"{{#unless @last}},{{/unless}}
      {{/each}}
    ],
    "compliance": [
      {{#each COMPLIANCE}}
      "{{this}}"{{#unless @last}},{{/unless}}
      {{/each}}
    ]
  }
}
```






