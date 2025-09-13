# Generator Argument Map: commerce-analytics

## Overview
This document maps generator arguments and source fields for the commerce-analytics project, defining the relationship between CLI arguments, configuration sources, and generated project components.

## Argument Categories

### 1. Required Arguments

#### Project Identity
- **`--name`** (required)
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Non-empty, alphanumeric with hyphens/underscores
  - **Usage**: Project directory name, package names, configuration values
  - **Template Placeholder**: `{{PROJECT_NAME}}`

- **`--industry`** (required)
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Must be valid industry (healthcare, finance, ecommerce, saas, enterprise)
  - **Usage**: Industry-specific configurations, compliance requirements, template selection
  - **Template Placeholder**: `{{INDUSTRY}}`

- **`--project-type`** (required)
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Must be valid project type (web, mobile, api, fullstack, microservices)
  - **Usage**: Project structure, required components, template variants
  - **Template Placeholder**: `{{PROJECT_TYPE}}`

### 2. Technology Stack Arguments

#### Frontend Technology
- **`--frontend`** (optional, default: 'none')
  - **Type**: String
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid frontend framework
  - **Options**: nextjs, nuxt, angular, expo, none
  - **Usage**: Frontend template selection, package.json generation, build configuration
  - **Template Placeholder**: `{{FRONTEND}}`

#### Backend Technology
- **`--backend`** (optional, default: 'none')
  - **Type**: String
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid backend framework
  - **Options**: fastapi, django, nestjs, go, none
  - **Usage**: Backend template selection, API generation, server configuration
  - **Template Placeholder**: `{{BACKEND}}`

- **`--nestjs-orm`** (optional, default: 'typeorm')
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Must be valid ORM for NestJS
  - **Options**: typeorm, prisma
  - **Usage**: NestJS template variant selection
  - **Dependencies**: Requires `--backend nestjs`

#### Database Technology
- **`--database`** (optional, default: 'none')
  - **Type**: String
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid database
  - **Options**: postgres, mongodb, firebase, none
  - **Usage**: Database template selection, schema generation, connection configuration
  - **Template Placeholder**: `{{DATABASE}}`

#### Authentication Technology
- **`--auth`** (optional, default: 'none')
  - **Type**: String
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid auth provider
  - **Options**: auth0, cognito, firebase, custom, none
  - **Usage**: Auth template selection, configuration generation
  - **Template Placeholder**: `{{AUTH}}`

#### Deployment Technology
- **`--deploy`** (optional, default: 'self-hosted')
  - **Type**: String
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid deployment target
  - **Options**: aws, azure, gcp, vercel, self-hosted
  - **Usage**: Deployment template selection, CI/CD configuration
  - **Template Placeholder**: `{{DEPLOY}}`

### 3. Feature Arguments

#### Feature List
- **`--features`** (optional)
  - **Type**: Comma-separated string
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid feature names
  - **Options**: realtime, offline_sync, push_notifications, file_upload, analytics, etc.
  - **Usage**: Feature-specific template inclusion, configuration generation
  - **Processing**: Merged with industry-specific features

#### Compliance Requirements
- **`--compliance`** (optional)
  - **Type**: Comma-separated string
  - **Source**: CLI input or industry defaults
  - **Validation**: Must be valid compliance standard
  - **Options**: hipaa, gdpr, sox, pci, soc2, iso27001, ferpa, coppa
  - **Usage**: Compliance-specific template inclusion, rule generation
  - **Processing**: Split into list, validated against industry requirements

### 4. Output Arguments

#### Output Configuration
- **`--output-dir`** (optional, default: '../_generated')
  - **Type**: String
  - **Source**: CLI input or default
  - **Validation**: Must be valid directory path
  - **Usage**: Project generation location
  - **Isolation**: Modified to '../_generated' when .cursor detected

- **`--dry-run`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Preview generation without creating files
  - **Behavior**: Shows project structure, skips file creation

- **`--force`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Overwrite existing project directory
  - **Validation**: Required when output directory exists

### 5. Cursor Asset Arguments

#### Cursor Integration
- **`--no-cursor-assets`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Exclude .cursor assets from generated project
  - **Isolation**: Default true when .cursor detected

- **`--include-cursor-assets`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Include .cursor assets in generated project
  - **Override**: Overrides --no-cursor-assets

- **`--minimal-cursor`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Include minimal .cursor assets only
  - **Behavior**: Only project.json and selected rules

- **`--rules-manifest`** (optional)
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Must be valid JSON file path
  - **Usage**: Specify rules to include in minimal-cursor mode
  - **Format**: JSON array of .mdc filenames

### 6. Development Arguments

#### Development Tools
- **`--no-git`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Skip git repository initialization
  - **Behavior**: Skips git init, add, commit

- **`--no-install`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Skip dependency installation
  - **Behavior**: Skips npm install, pip install, go mod download

- **`--workers`** (optional, default: auto)
  - **Type**: Integer
  - **Source**: CLI input or auto-detection
  - **Validation**: Must be positive integer
  - **Usage**: Number of parallel workers for template processing
  - **Auto-detection**: max(2, (os.cpu_count() or 2) * 2)

### 7. Configuration Arguments

#### Configuration Output
- **`--config-output`** (optional)
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Must be valid file path
  - **Usage**: Output configuration to file
  - **Format**: JSON configuration file

- **`--yes`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: Skip confirmation prompts
  - **Behavior**: Auto-confirm all prompts

### 8. Template Arguments

#### Template Management
- **`--list-templates`** (optional, default: False)
  - **Type**: Boolean
  - **Source**: CLI input
  - **Usage**: List available templates
  - **Behavior**: Shows template list and exits

- **`--category`** (optional)
  - **Type**: String
  - **Source**: CLI input
  - **Validation**: Must be valid category
  - **Options**: frontend, backend, database, cicd
  - **Usage**: Filter templates by category

## Source Field Mapping

### 1. CLI Input Sources
- **Direct Input**: User-provided values
- **Interactive Mode**: Prompted values for missing required fields
- **Default Values**: Framework-provided defaults
- **Validation**: Input validation and sanitization

### 2. Industry Configuration Sources
- **Industry Config**: `project_generator/core/industry_config.py`
- **Default Features**: Industry-specific default features
- **Required Features**: Industry-specific required features
- **Recommended Stack**: Industry-specific technology recommendations
- **Compliance Requirements**: Industry-specific compliance requirements

### 3. Technology Configuration Sources
- **Tech Stack Config**: `.cursor/dev-workflow/tools/tech-stack-config.yaml`
- **Technology Components**: Available technology options
- **Compatibility Matrix**: Technology compatibility rules
- **Performance Scores**: Technology performance metrics
- **Compliance Support**: Technology compliance capabilities

### 4. Template Sources
- **Template Packs**: `template-packs/` directory
- **Frontend Templates**: `template-packs/frontend/`
- **Backend Templates**: `template-packs/backend/`
- **Database Templates**: `template-packs/database/`
- **CI/CD Templates**: `template-packs/cicd/`

### 5. Rule Sources
- **Project Rules**: `.cursor/rules/project-rules/`
- **Master Rules**: `.cursor/rules/master-rules/`
- **Client Rules**: Generated client-specific rules
- **Compliance Rules**: Generated compliance-specific rules

## Argument Processing Pipeline

### 1. Input Validation
```python
def validate_inputs(args):
    errors = []
    
    # Required field validation
    if not args.name:
        errors.append("Project name is required")
    
    # Type validation
    if not isinstance(args.name, str):
        errors.append("Project name must be a string")
    
    # Format validation
    if not args.name.replace('_', '').replace('-', '').isalnum():
        errors.append("Project name must contain only alphanumeric characters, hyphens, and underscores")
    
    return errors
```

### 2. Industry Configuration Merging
```python
def merge_industry_config(args, industry_config):
    # Merge features
    features = industry_config.merge_features(args.features)
    
    # Apply industry defaults
    if not args.frontend:
        args.frontend = industry_config.get_recommended_stack().get('frontend', 'none')
    
    # Apply compliance requirements
    if not args.compliance:
        args.compliance = ','.join(industry_config.get_compliance_requirements())
    
    return args
```

### 3. Technology Validation
```python
def validate_technology_stack(args):
    validator = ProjectValidator()
    result = validator.validate_configuration(args)
    
    if not result['valid']:
        raise ValueError(f"Configuration validation failed: {result['errors']}")
    
    return result
```

### 4. Template Selection
```python
def select_templates(args):
    templates = {}
    
    # Frontend template selection
    if args.frontend != 'none':
        templates['frontend'] = select_frontend_template(args)
    
    # Backend template selection
    if args.backend != 'none':
        templates['backend'] = select_backend_template(args)
    
    # Database template selection
    if args.database != 'none':
        templates['database'] = select_database_template(args)
    
    return templates
```

## Template Placeholder Mapping

### Core Placeholders
```python
mapping = {
    '{{PROJECT_NAME}}': args.name,
    '{{INDUSTRY}}': args.industry,
    '{{PROJECT_TYPE}}': args.project_type,
    '{{FRONTEND}}': args.frontend,
    '{{BACKEND}}': args.backend,
    '{{DATABASE}}': args.database,
    '{{AUTH}}': args.auth,
    '{{DEPLOY}}': args.deploy,
}
```

### Feature Placeholders
```python
# Features are processed and included in templates
features = industry_config.merge_features(args.features)
for feature in features:
    mapping[f'{{{{FEATURE_{feature.upper()}}}}}'] = 'true'
```

### Compliance Placeholders
```python
# Compliance requirements are processed and included
if args.compliance:
    compliance_list = args.compliance.split(',')
    for compliance in compliance_list:
        mapping[f'{{{{COMPLIANCE_{compliance.upper()}}}}}'] = 'true'
```

## Argument Dependencies

### Required Dependencies
- **Project Type Dependencies**: Certain project types require specific components
- **Industry Dependencies**: Industries may require specific compliance or features
- **Technology Dependencies**: Technologies may have compatibility requirements
- **Feature Dependencies**: Features may require specific technologies

### Optional Dependencies
- **Performance Dependencies**: Performance features may require specific configurations
- **Security Dependencies**: Security features may require specific technologies
- **Compliance Dependencies**: Compliance may require specific configurations
- **Integration Dependencies**: Integrations may require specific technologies

## Argument Validation Rules

### Format Validation
- **Project Name**: Alphanumeric with hyphens and underscores
- **Industry**: Must be valid industry identifier
- **Project Type**: Must be valid project type identifier
- **Technology Stack**: Must be valid technology identifiers

### Range Validation
- **Workers**: Must be positive integer
- **Features**: Must be valid feature identifiers
- **Compliance**: Must be valid compliance identifiers
- **Output Directory**: Must be valid directory path

### Dependency Validation
- **Technology Compatibility**: Technologies must be compatible
- **Feature Prerequisites**: Features must have required prerequisites
- **Compliance Requirements**: Compliance must have required technologies
- **Industry Requirements**: Industry must have required compliance

## Argument Processing Examples

### Basic Project Generation
```bash
python generate_client_project.py \
  --name commerce-analytics \
  --industry ecommerce \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws
```

### Healthcare Project with Compliance
```bash
python generate_client_project.py \
  --name health-portal \
  --industry healthcare \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws \
  --compliance hipaa \
  --features patient_portal,secure_messaging
```

### API-Only Project
```bash
python generate_client_project.py \
  --name analytics-api \
  --industry saas \
  --project-type api \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws
```

### Mobile Project
```bash
python generate_client_project.py \
  --name mobile-app \
  --industry ecommerce \
  --project-type mobile \
  --frontend expo \
  --backend fastapi \
  --database firebase \
  --auth firebase \
  --deploy aws
```

## Argument Configuration Files

### JSON Configuration
```json
{
  "name": "commerce-analytics",
  "industry": "ecommerce",
  "project_type": "fullstack",
  "frontend": "nextjs",
  "backend": "fastapi",
  "database": "postgres",
  "auth": "auth0",
  "deploy": "aws",
  "features": "realtime,analytics,file_upload",
  "compliance": "pci,gdpr"
}
```

### YAML Configuration
```yaml
name: commerce-analytics
industry: ecommerce
project_type: fullstack
frontend: nextjs
backend: fastapi
database: postgres
auth: auth0
deploy: aws
features:
  - realtime
  - analytics
  - file_upload
compliance:
  - pci
  - gdpr
```

## Argument Documentation

### CLI Help
```bash
python generate_client_project.py --help
```

### Interactive Mode
```bash
python generate_client_project.py --interactive
```

### Template Listing
```bash
python generate_client_project.py --list-templates
```

### Configuration Output
```bash
python generate_client_project.py --config-output config.json --dry-run
```
