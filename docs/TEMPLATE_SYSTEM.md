# Template System Documentation

## Overview

The Client Project Generator uses a sophisticated multi-layered template system that combines simple variable substitution with advanced templating capabilities. The system supports industry-aware generation, template inheritance, and custom helper functions for complex logic.

## Template Processing Architecture

### Core Template Processing

#### Simple Variable Substitution
The system uses `{{VARIABLE_NAME}}` placeholders with regex-based replacement for basic templating needs.

```python
# Core template processing in project_generator/core/generator.py
def process_template_file(self, template_path: Path, variables: Dict[str, Any]) -> str:
    """Process a template file with variable substitution"""
    content = template_path.read_text()
    
    # Simple variable substitution
    for key, value in variables.items():
        content = content.replace(f"{{{{{key}}}}}", str(value))
    
    return content
```

#### Template Variables
Template variables are generated via the `get_template_variables()` method, which creates a comprehensive mapping of all available variables.

```python
def get_template_variables(self) -> Dict[str, Any]:
    """Generate comprehensive template variable mapping"""
    return {
        'PROJECT_NAME': self.args.name,
        'INDUSTRY': self.args.industry,
        'FRONTEND': self.args.frontend,
        'BACKEND': self.args.backend,
        'DATABASE': self.args.database,
        'AUTH': self.args.auth,
        'DEPLOY': self.args.deploy,
        'COMPLIANCE': self.args.compliance,
        'FEATURES': self.args.features,
        # ... additional variables
    }
```

### Advanced Template Engine

#### Framework-Specific Templates
The system generates code for multiple frameworks with industry-specific configurations:

- **Frontend**: Next.js, Nuxt, Angular, Expo
- **Backend**: FastAPI, Django, NestJS, Go
- **Database**: PostgreSQL, MongoDB, Firebase

#### Industry-Aware Generation
Templates adapt based on industry requirements with specific compliance patterns:

```python
# Industry-specific template processing
def _generate_industry_files_with_templates(self, project_path: Path, 
                                          industry_context: Dict[str, Any], 
                                          tech_stack: Dict[str, str]):
    """Generate industry-specific files using templates"""
    
    if industry_context['industry'] == 'healthcare':
        # HIPAA-specific template processing
        self._generate_hipaa_templates(project_path, tech_stack)
    elif industry_context['industry'] == 'finance':
        # SOX/PCI-specific template processing
        self._generate_finance_templates(project_path, tech_stack)
```

#### Conditional Logic
The system supports Handlebars-like templating with conditional constructs:

```handlebars
{{#if COMPLIANCE_HIPAA}}
// HIPAA-specific code
- Audit logging for all PHI access
- Minimum necessary access (RBAC) with reviews
- Encryption at rest and in transit
{{/if}}

{{#if COMPLIANCE_SOX}}
// SOX-specific code
- Change control procedures
- Audit trails for all financial data
- Segregation of duties
{{/if}}
```

#### Custom Helpers
The template engine implements custom helper functions for complex logic:

```python
# Custom helper functions
def contains(value, substring):
    """Check if value contains substring"""
    return substring in str(value)

def eq(value1, value2):
    """Check if two values are equal"""
    return str(value1) == str(value2)

def gte(value1, value2):
    """Check if value1 is greater than or equal to value2"""
    return float(value1) >= float(value2)
```

## Template Inheritance System

### Hierarchical Structure

The template system uses a hierarchical organization:

```
template-packs/
├── frontend/
│   ├── nextjs/
│   │   ├── base/
│   │   ├── healthcare/
│   │   ├── finance/
│   │   └── ecommerce/
│   ├── nuxt/
│   │   ├── base/
│   │   └── enterprise/
│   └── angular/
│       ├── base/
│       └── saas/
├── backend/
│   ├── fastapi/
│   │   ├── base/
│   │   ├── healthcare/
│   │   └── finance/
│   ├── django/
│   │   ├── base/
│   │   └── ecommerce/
│   └── go/
│       ├── base/
│       └── enterprise/
└── database/
    ├── postgres/
    │   ├── base/
    │   └── healthcare/
    └── mongodb/
        ├── base/
        └── ecommerce/
```

### Variant Selection

The system supports base templates with enterprise/compliance overlays:

```python
def _select_template_variant(self, component: str, technology: str, 
                           industry: str) -> Path:
    """Select appropriate template variant based on industry and requirements"""
    
    # Try industry-specific variant first
    industry_path = self.template_dir / component / technology / industry
    if industry_path.exists():
        return industry_path
    
    # Fall back to base template
    base_path = self.template_dir / component / technology / 'base'
    return base_path
```

### Industry-Specific Extensions

Templates extend base functionality with industry compliance patterns:

```python
def _generate_industry_extensions(self, project_path: Path, 
                                industry: str, tech_stack: Dict[str, str]):
    """Generate industry-specific extensions"""
    
    if industry == 'healthcare':
        self._generate_hipaa_extensions(project_path, tech_stack)
    elif industry == 'finance':
        self._generate_finance_extensions(project_path, tech_stack)
    elif industry == 'ecommerce':
        self._generate_ecommerce_extensions(project_path, tech_stack)
```

## Template Processing Workflow

### 1. Template Discovery
The system discovers available templates based on project configuration:

```python
def discover_templates(self, config: Dict[str, Any]) -> List[Path]:
    """Discover available templates for project configuration"""
    templates = []
    
    # Discover frontend templates
    if config.get('frontend') != 'none':
        frontend_templates = self._discover_frontend_templates(config)
        templates.extend(frontend_templates)
    
    # Discover backend templates
    if config.get('backend') != 'none':
        backend_templates = self._discover_backend_templates(config)
        templates.extend(backend_templates)
    
    return templates
```

### 2. Variable Generation
Template variables are generated based on project configuration and industry requirements:

```python
def generate_template_variables(self, config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate template variables from project configuration"""
    variables = {
        'PROJECT_NAME': config['name'],
        'INDUSTRY': config['industry'],
        'COMPLIANCE': config.get('compliance', ''),
        'FEATURES': config.get('features', ''),
    }
    
    # Add industry-specific variables
    if config['industry'] == 'healthcare':
        variables.update({
            'HIPAA_COMPLIANCE': True,
            'AUDIT_LOGGING': True,
            'SESSION_TIMEOUT': 15,
        })
    elif config['industry'] == 'finance':
        variables.update({
            'SOX_COMPLIANCE': True,
            'PCI_COMPLIANCE': True,
            'SESSION_TIMEOUT': 10,
        })
    
    return variables
```

### 3. Template Processing
Templates are processed with variable substitution and conditional logic:

```python
def process_template(self, template_path: Path, variables: Dict[str, Any]) -> str:
    """Process template with variable substitution and conditional logic"""
    content = template_path.read_text()
    
    # Process conditional blocks
    content = self._process_conditionals(content, variables)
    
    # Process variable substitution
    content = self._process_variables(content, variables)
    
    # Process custom helpers
    content = self._process_helpers(content, variables)
    
    return content
```

### 4. File Generation
Processed templates are written to the project directory:

```python
def generate_files(self, templates: List[Path], variables: Dict[str, Any], 
                  output_dir: Path):
    """Generate project files from templates"""
    for template_path in templates:
        # Process template
        content = self.process_template(template_path, variables)
        
        # Determine output path
        output_path = self._determine_output_path(template_path, output_dir)
        
        # Write file
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(content)
```

## Template Examples

### Frontend Template (Next.js)

```typescript
// {{PROJECT_NAME}}/frontend/pages/api/{{ENTITY_NAME}}.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  {{#if COMPLIANCE_HIPAA}}
  // HIPAA-compliant audit logging
  console.log(`User ${session.user.id} accessed {{ENTITY_NAME}} API`);
  {{/if}}

  try {
    // API implementation
    const result = await {{ENTITY_NAME}}Service.{{METHOD_NAME}}(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in {{ENTITY_NAME}} API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Backend Template (FastAPI)

```python
# {{PROJECT_NAME}}/backend/app/api/{{ENTITY_NAME}}.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.{{ENTITY_NAME}} import {{ENTITY_NAME}}
from ..schemas.{{ENTITY_NAME}} import {{ENTITY_NAME}}Create, {{ENTITY_NAME}}Update
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/{{ENTITY_NAME}}s", tags=["{{ENTITY_NAME}}s"])

@router.get("/")
async def list_{{ENTITY_NAME}}s(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    {{#if COMPLIANCE_HIPAA}}
    # HIPAA-compliant audit logging
    logger.info(f"Listing {{ENTITY_NAME}}s with skip={skip}, limit={limit}")
    {{/if}}
    
    try:
        {{ENTITY_NAME}}s = db.query({{ENTITY_NAME}}).offset(skip).limit(limit).all()
        return {{ENTITY_NAME}}s
    except Exception as e:
        logger.error(f"Error listing {{ENTITY_NAME}}s: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

### Database Template (PostgreSQL)

```sql
-- {{PROJECT_NAME}}/database/migrations/001_create_{{ENTITY_NAME}}s.sql
CREATE TABLE {{ENTITY_NAME}}s (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    {{#if COMPLIANCE_HIPAA}}
    -- HIPAA-compliant fields
    phi_encrypted BOOLEAN DEFAULT FALSE,
    audit_trail JSONB,
    {{/if}}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

{{#if COMPLIANCE_HIPAA}}
-- HIPAA-compliant indexes
CREATE INDEX idx_{{ENTITY_NAME}}s_phi_encrypted ON {{ENTITY_NAME}}s(phi_encrypted);
CREATE INDEX idx_{{ENTITY_NAME}}s_audit_trail ON {{ENTITY_NAME}}s USING GIN(audit_trail);
{{/if}}
```

## Template Development Guidelines

### 1. Template Structure
- Use clear, descriptive variable names
- Include comprehensive comments
- Follow industry best practices
- Include error handling and validation

### 2. Variable Naming
- Use UPPER_CASE for template variables
- Use descriptive names that indicate purpose
- Include type information when helpful
- Use consistent naming conventions

### 3. Conditional Logic
- Use `{{#if}}` blocks for feature flags
- Use `{{#each}}` for iteration
- Keep conditional logic simple and readable
- Include fallback values when appropriate

### 4. Industry Compliance
- Include industry-specific compliance patterns
- Use appropriate security measures
- Include audit logging where required
- Follow regulatory requirements

## Template Testing

### Unit Testing
Templates should be tested with various configurations:

```python
def test_template_processing():
    """Test template processing with different configurations"""
    
    # Test healthcare template
    healthcare_config = {
        'industry': 'healthcare',
        'compliance': 'hipaa',
        'features': 'audit_logging,encryption'
    }
    
    result = process_template(healthcare_template, healthcare_config)
    assert 'HIPAA' in result
    assert 'audit_logging' in result
    
    # Test finance template
    finance_config = {
        'industry': 'finance',
        'compliance': 'sox,pci',
        'features': 'security_monitoring,access_control'
    }
    
    result = process_template(finance_template, finance_config)
    assert 'SOX' in result
    assert 'PCI' in result
```

### Integration Testing
Templates should be tested in the context of full project generation:

```python
def test_end_to_end_template_generation():
    """Test complete template generation workflow"""
    
    config = {
        'name': 'test-project',
        'industry': 'healthcare',
        'frontend': 'nextjs',
        'backend': 'fastapi',
        'compliance': 'hipaa'
    }
    
    generator = ProjectGenerator(config)
    result = generator.generate()
    
    # Verify generated files
    assert os.path.exists(result['output_path'] / 'frontend')
    assert os.path.exists(result['output_path'] / 'backend')
    
    # Verify compliance features
    frontend_code = (result['output_path'] / 'frontend' / 'pages' / 'api' / 'patients.ts').read_text()
    assert 'HIPAA' in frontend_code
    assert 'audit_logging' in frontend_code
```

## Conclusion

The template system provides a powerful and flexible foundation for generating industry-specific, compliance-ready projects. The multi-layered approach ensures that generated code meets industry standards while maintaining high quality and performance.

The system's support for template inheritance, conditional logic, and custom helpers makes it easy to create sophisticated templates that adapt to different industries and requirements. The comprehensive testing framework ensures that templates work correctly across various configurations and use cases.
