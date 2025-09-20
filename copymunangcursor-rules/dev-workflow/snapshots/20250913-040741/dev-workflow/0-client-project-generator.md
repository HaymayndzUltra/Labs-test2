# PROTOCOL 0: CLIENT PROJECT GENERATOR

## AI ROLE
You are a **Master Project Architect** specializing in rapid, production-ready application scaffolding. You understand industry requirements, compliance standards, and modern development practices across multiple technology stacks.

## OVERVIEW
The Client Project Generator is a comprehensive system that creates fully-configured, industry-specific projects with:
- Complete application scaffolding (frontend, backend, database)
- Industry-specific compliance (HIPAA, GDPR, SOX, PCI)
- DevEx tooling (Docker, DevContainers, Makefile)
- CI/CD pipelines with quality gates
- AI Governor Framework integration
- Smart technology selection based on industry

## EXECUTION PROTOCOL

### PHASE 1: Requirements Gathering

**Collect project information:**
```
1. Project name
2. Industry (healthcare/finance/ecommerce/saas/enterprise)
3. Project type (web/mobile/api/fullstack/microservices)
4. Compliance requirements
5. Special features needed
```

### PHASE 2: Technology Selection

**Use Policy DSL to recommend stack:**
- Frontend: Based on SEO needs, team size, industry
- Backend: Based on performance, type safety, industry
- Database: Based on data structure, compliance
- Auth: Based on compliance, enterprise needs
- Deployment: Based on compliance, scale

### PHASE 3: Project Generation

**Execute generator with validated configuration:**
```bash
./scripts/generate_client_project.py \
  --name <project-name> \
  --industry <industry> \
  --project-type <type> \
  --frontend <framework> \
  --backend <framework> \
  --database <database> \
  --auth <provider> \
  --deploy <platform> \
  --compliance <standards> \
  --features <feature-list>
```

### PHASE 4: Post-Generation Setup

**Guide through initial setup:**
1. Navigate to project: `cd <project-name>`
2. Run setup: `make setup`
3. Start development: `make dev`
4. Review AI instructions: `.cursor/AI_INSTRUCTIONS.md`

## SMART DEFAULTS BY INDUSTRY

### Healthcare (HIPAA)
```yaml
Stack:
  frontend: nextjs  # SSR for security
  backend: fastapi  # Type safety
  database: postgres  # ACID compliance
  auth: auth0  # HIPAA-compliant
  deploy: aws  # BAA available
Features:
  - patient_portal
  - appointment_scheduling
  - secure_messaging
  - audit_logging
  - phi_encryption
```

### Financial Services (SOX/PCI)
```yaml
Stack:
  frontend: angular  # Enterprise standard
  backend: go  # High performance
  database: postgres
  auth: cognito  # Enterprise features
  deploy: aws  # Compliance support
Features:
  - transaction_processing
  - audit_trails
  - fraud_detection
  - regulatory_reporting
```

### E-commerce (PCI/GDPR)
```yaml
Stack:
  frontend: nextjs  # SEO optimization
  backend: django  # Rapid development
  database: postgres
  auth: firebase  # Social login
  deploy: vercel  # Edge performance
Features:
  - product_catalog
  - shopping_cart
  - payment_processing
  - inventory_management
```

### SaaS (SOC2/GDPR)
```yaml
Stack:
  frontend: nextjs
  backend: nestjs  # Enterprise TypeScript
  database: postgres
  auth: auth0  # B2B features
  deploy: aws  # Scalability
Features:
  - multi_tenancy
  - subscription_billing
  - admin_dashboard
  - api_access
```

### Enterprise (SOC2)
```yaml
Stack:
  frontend: angular  # Corporate standard
  backend: nestjs
  database: postgres
  auth: cognito  # SSO support
  deploy: azure  # Enterprise agreement
Features:
  - sso_integration
  - role_based_access
  - audit_logging
  - api_gateway
```

## COMPLIANCE FEATURES

### HIPAA Compliance
- ✅ PHI encryption at rest (AES-256)
- ✅ Audit logging for all access
- ✅ 15-minute session timeout
- ✅ Access control templates
- ✅ BAA-ready deployment

### GDPR Compliance
- ✅ Consent management UI
- ✅ Data export functionality
- ✅ Right to deletion workflows
- ✅ Privacy policy templates
- ✅ Cookie consent banner

### SOX Compliance
- ✅ Change control workflows
- ✅ Audit trail implementation
- ✅ Segregation of duties
- ✅ Financial controls
- ✅ Approval workflows

### PCI Compliance
- ✅ No card storage templates
- ✅ Tokenization setup
- ✅ Network segmentation
- ✅ Security scanning
- ✅ Encryption utilities

## GENERATED PROJECT STRUCTURE

```
<project>/
├── .cursor/               # AI Governor integration
│   ├── rules/            # Compliance & coding rules
│   ├── dev-workflow/     # AI workflows
│   └── AI_INSTRUCTIONS.md
├── .devcontainer/        # VS Code DevContainer
├── .github/workflows/    # CI/CD pipelines
├── frontend/             # Frontend application
├── backend/              # Backend application
├── database/             # DB schemas & migrations
├── docs/                 # Documentation
├── docker-compose.yml    # Local development
├── Makefile             # Dev commands
└── gates_config.yaml    # Quality gates
```

## CI/CD PIPELINE FEATURES

### Quality Gates
- **Linting**: Zero errors required
- **Testing**: 80% coverage (healthcare/finance), 70% (others)
- **Security**: No critical vulnerabilities
- **Compliance**: Industry-specific checks

### Pipeline Stages
1. **Lint**: Code quality checks
2. **Test**: Unit, integration, E2E
3. **Security**: SAST, dependency scan, secrets
4. **Build**: Docker images
5. **Deploy**: Environment-specific

## AI GOVERNOR INTEGRATION

### Automatic Setup
- Master rules copied
- Workflow configurations
- Pre-commit hooks
- AI development guide

### Available Workflows
```
analyze  → Create PRD from requirements
plan     → Generate actionable tasks
execute  → Parallel task execution
review   → Retrospective & learnings
```

## INTERACTIVE MODE GUIDE

When using `-i` flag, the generator will:
1. Ask for missing required options
2. Suggest technology based on industry
3. Recommend compliance standards
4. Propose relevant features
5. Validate configuration before generation

## COMMON COMMANDS

### Generate Healthcare App
```bash
./scripts/generate_client_project.py \
  --name clinic-portal \
  --industry healthcare \
  --project-type fullstack \
  --compliance hipaa -i
```

### Generate Financial API
```bash
./scripts/generate_client_project.py \
  --name trading-api \
  --industry finance \
  --project-type api \
  --compliance sox,pci -i
```

### Generate E-commerce Platform
```bash
./scripts/generate_client_project.py \
  --name shop-app \
  --industry ecommerce \
  --project-type fullstack \
  --compliance pci,gdpr -i
```

## POST-GENERATION CHECKLIST

- [ ] Review generated README.md
- [ ] Check `.env.example` and create `.env`
- [ ] Review compliance requirements in docs/
- [ ] Customize client-specific rules
- [ ] Run `make setup` to install dependencies
- [ ] Run `make dev` to start development
- [ ] Configure CI/CD secrets in GitHub
- [ ] Review security scan results

## ERROR HANDLING

### Common Issues

**"Directory already exists"**
- Choose a different project name
- Or delete existing directory

**"Invalid technology combination"**
- Check compatibility matrix
- Use interactive mode for guidance

**"Compliance conflict"**
- Some deployments don't support certain compliance
- AWS/Azure recommended for HIPAA

**"Missing prerequisites"**
- Install Python 3.8+
- Install Docker
- Install Make

## EXTENDING THE GENERATOR

### Add New Framework
1. Create template in `template-packs/<category>/<framework>/`
2. Update template engine
3. Add to validator compatibility matrix
4. Update policy DSL

### Add New Industry
1. Define in `industry_config.py`
2. Create compliance rules
3. Add to policy DSL
4. Update documentation

### Add New Compliance
1. Create rule template
2. Add validation logic
3. Create CI/CD gates
4. Document requirements

## USAGE
```
Apply instructions from .cursor/dev-workflow/0-client-project-generator.md

Project Requirements:
- Name: [project name]
- Industry: [healthcare/finance/ecommerce/saas/enterprise]
- Type: [web/mobile/api/fullstack/microservices]
- Special Requirements: [list any specific needs]
```