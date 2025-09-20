# Project Generator API Documentation

## Overview

The Project Generator is the core component of the Client Project Generator system. It provides a unified interface for generating complete project structures with multiple backend and frontend frameworks, industry-specific configurations, and compliance requirements.

## Table of Contents

1. [Core Classes](#core-classes)
2. [Public Methods](#public-methods)
3. [Configuration Options](#configuration-options)
4. [Usage Examples](#usage-examples)
5. [Error Handling](#error-handling)
6. [Extension Points](#extension-points)

## Core Classes

### ProjectGenerator

The main class for generating complete project structures.

```python
class ProjectGenerator:
    """Main project generator class."""
    
    def __init__(self, args=None, validator: ProjectValidator = None, 
                 config: IndustryConfig = None, **kwargs):
        """
        Initialize the project generator.
        
        Args:
            args: Command line arguments or configuration dict
            validator: Project validation instance
            config: Industry-specific configuration
            **kwargs: Additional configuration options
        """
```

#### Key Properties

- `args`: Configuration arguments
- `validator`: Project validation instance
- `config`: Industry configuration
- `project_name`: Name of the project to generate
- `frontend`: Selected frontend framework
- `backend`: Selected backend framework
- `database`: Selected database
- `industry`: Target industry
- `compliance`: Compliance requirements

### ProjectValidator

Validates project configuration and requirements.

```python
class ProjectValidator:
    """Validates project configuration and requirements."""
    
    def __init__(self):
        """Initialize the validator."""
    
    def validate_project_name(self, name: str) -> bool:
        """Validate project name format."""
    
    def validate_framework_combination(self, frontend: str, backend: str) -> bool:
        """Validate frontend/backend combination."""
    
    def validate_industry_requirements(self, industry: str, config: dict) -> bool:
        """Validate industry-specific requirements."""
```

### IndustryConfig

Manages industry-specific configurations and requirements.

```python
class IndustryConfig:
    """Industry-specific configuration manager."""
    
    def __init__(self, industry: str):
        """Initialize with specific industry."""
    
    def get_compliance_requirements(self) -> List[str]:
        """Get compliance requirements for the industry."""
    
    def get_required_components(self) -> List[str]:
        """Get required components for the industry."""
    
    def get_security_standards(self) -> List[str]:
        """Get security standards for the industry."""
```

## Public Methods

### ProjectGenerator Methods

#### generate()

Main method to generate the complete project structure.

```python
def generate(self) -> Dict[str, Any]:
    """
    Generate the complete project structure.
    
    Returns:
        Dict containing generation results and metadata
        
    Raises:
        ValidationError: If project configuration is invalid
        GenerationError: If project generation fails
    """
```

**Example:**
```python
generator = ProjectGenerator({
    'project_name': 'my-healthcare-app',
    'frontend': 'nextjs',
    'backend': 'fastapi',
    'database': 'postgresql',
    'industry': 'healthcare',
    'compliance': ['hipaa']
})

result = generator.generate()
print(f"Project generated at: {result['output_path']}")
```

#### _create_base_structure()

Creates the base project directory structure.

```python
def _create_base_structure(self):
    """
    Create the base project directory structure.
    
    Creates:
        - Project root directory
        - Frontend directory
        - Backend directory
        - Documentation directory
        - Configuration files
    """
```

#### _generate_frontend()

Generates the frontend application structure.

```python
def _generate_frontend(self):
    """
    Generate frontend application structure.
    
    Supported frameworks:
        - Next.js (React)
        - Nuxt.js (Vue)
        - Angular
        - Expo (React Native)
    """
```

#### _generate_backend()

Generates the backend application structure.

```python
def _generate_backend(self):
    """
    Generate backend application structure.
    
    Supported frameworks:
        - FastAPI (Python)
        - Echo (Go)
        - Django (Python)
        - NestJS (Node.js)
    """
```

#### _setup_database()

Configures database setup and migrations.

```python
def _setup_database(self):
    """
    Setup database configuration and migrations.
    
    Supported databases:
        - PostgreSQL
        - MySQL
        - SQLite
        - MongoDB
    """
```

#### _process_templates()

Processes template files and applies transformations.

```python
def _process_templates(self, root: Path):
    """
    Process template files and apply transformations.
    
    Args:
        root: Root directory to process
        
    Applies:
        - Variable substitution
        - Conditional inclusion
        - File transformations
    """
```

#### _add_industry_components()

Adds industry-specific components and configurations.

```python
def _add_industry_components(self, target_dir: Path, component_type: str):
    """
    Add industry-specific components.
    
    Args:
        target_dir: Target directory for components
        component_type: Type of components to add
        
    Component types:
        - 'compliance' - Compliance rules and configurations
        - 'security' - Security components and middleware
        - 'monitoring' - Monitoring and observability tools
        - 'testing' - Industry-specific test suites
    """
```

### Validation Methods

#### validate_project_name()

```python
def validate_project_name(self, name: str) -> bool:
    """
    Validate project name format.
    
    Args:
        name: Project name to validate
        
    Returns:
        True if valid, False otherwise
        
    Validation rules:
        - Must be 3-50 characters
        - Can contain letters, numbers, hyphens, underscores
        - Must start with a letter
        - Cannot contain spaces or special characters
    """
```

#### validate_framework_combination()

```python
def validate_framework_combination(self, frontend: str, backend: str) -> bool:
    """
    Validate frontend/backend framework combination.
    
    Args:
        frontend: Frontend framework name
        backend: Backend framework name
        
    Returns:
        True if combination is valid, False otherwise
    """
```

### Industry Configuration Methods

#### get_compliance_requirements()

```python
def get_compliance_requirements(self) -> List[str]:
    """
    Get compliance requirements for the industry.
    
    Returns:
        List of compliance standards to implement
        
    Examples:
        - Healthcare: ['hipaa', 'hitech', 'fda']
        - Finance: ['pci-dss', 'sox', 'gdpr']
        - E-commerce: ['pci-dss', 'gdpr', 'ccpa']
    """
```

#### get_required_components()

```python
def get_required_components(self) -> List[str]:
    """
    Get required components for the industry.
    
    Returns:
        List of required component types
        
    Examples:
        - Healthcare: ['patient-management', 'appointment-scheduling', 'medical-records']
        - Finance: ['payment-processing', 'transaction-history', 'compliance-reporting']
        - E-commerce: ['product-catalog', 'shopping-cart', 'order-management']
    """
```

## Configuration Options

### Project Configuration

```python
project_config = {
    'project_name': 'my-project',           # Required: Project name
    'frontend': 'nextjs',                   # Required: Frontend framework
    'backend': 'fastapi',                   # Required: Backend framework
    'database': 'postgresql',               # Required: Database type
    'industry': 'healthcare',               # Optional: Target industry
    'compliance': ['hipaa'],                # Optional: Compliance requirements
    'features': [                           # Optional: Additional features
        'authentication',
        'authorization',
        'monitoring',
        'testing'
    ],
    'deployment': {                         # Optional: Deployment configuration
        'platform': 'docker',
        'cloud_provider': 'aws',
        'environment': 'production'
    }
}
```

### Industry-Specific Configuration

```python
industry_config = {
    'healthcare': {
        'compliance': ['hipaa', 'hitech', 'fda'],
        'security': ['encryption', 'audit_logging', 'access_control'],
        'components': ['patient_management', 'appointment_scheduling'],
        'database_requirements': ['encryption_at_rest', 'backup_retention']
    },
    'finance': {
        'compliance': ['pci-dss', 'sox', 'gdpr'],
        'security': ['pci_compliance', 'fraud_detection', 'risk_management'],
        'components': ['payment_processing', 'transaction_history'],
        'database_requirements': ['audit_trail', 'data_retention']
    }
}
```

## Usage Examples

### Basic Project Generation

```python
from project_generator import ProjectGenerator

# Create generator instance
generator = ProjectGenerator({
    'project_name': 'my-web-app',
    'frontend': 'nextjs',
    'backend': 'fastapi',
    'database': 'postgresql'
})

# Generate project
result = generator.generate()
print(f"Project generated at: {result['output_path']}")
```

### Industry-Specific Project

```python
# Healthcare application with HIPAA compliance
generator = ProjectGenerator({
    'project_name': 'telehealth-platform',
    'frontend': 'nextjs',
    'backend': 'fastapi',
    'database': 'postgresql',
    'industry': 'healthcare',
    'compliance': ['hipaa', 'hitech'],
    'features': ['authentication', 'encryption', 'audit_logging']
})

result = generator.generate()
```

### Custom Configuration

```python
# Custom configuration with specific features
generator = ProjectGenerator({
    'project_name': 'e-commerce-platform',
    'frontend': 'nextjs',
    'backend': 'fastapi',
    'database': 'postgresql',
    'industry': 'ecommerce',
    'compliance': ['pci-dss', 'gdpr'],
    'features': [
        'authentication',
        'payment_processing',
        'inventory_management',
        'order_tracking'
    ],
    'deployment': {
        'platform': 'docker',
        'cloud_provider': 'aws',
        'environment': 'production'
    }
})

result = generator.generate()
```

### Validation Before Generation

```python
from project_generator import ProjectGenerator, ProjectValidator

# Create validator
validator = ProjectValidator()

# Validate configuration
config = {
    'project_name': 'my-app',
    'frontend': 'nextjs',
    'backend': 'fastapi',
    'database': 'postgresql'
}

if validator.validate_project_name(config['project_name']):
    if validator.validate_framework_combination(config['frontend'], config['backend']):
        generator = ProjectGenerator(config, validator=validator)
        result = generator.generate()
    else:
        print("Invalid framework combination")
else:
    print("Invalid project name")
```

## Error Handling

### Common Exceptions

#### ValidationError
Raised when project configuration is invalid.

```python
try:
    generator = ProjectGenerator(invalid_config)
    result = generator.generate()
except ValidationError as e:
    print(f"Validation error: {e.message}")
    print(f"Field: {e.field}")
    print(f"Value: {e.value}")
```

#### GenerationError
Raised when project generation fails.

```python
try:
    result = generator.generate()
except GenerationError as e:
    print(f"Generation error: {e.message}")
    print(f"Component: {e.component}")
    print(f"Details: {e.details}")
```

#### TemplateError
Raised when template processing fails.

```python
try:
    generator._process_templates(template_dir)
except TemplateError as e:
    print(f"Template error: {e.message}")
    print(f"Template: {e.template_file}")
    print(f"Variable: {e.variable}")
```

### Error Response Format

```python
{
    "error": {
        "type": "ValidationError",
        "message": "Invalid project name format",
        "field": "project_name",
        "value": "invalid-name!",
        "suggestion": "Use only letters, numbers, hyphens, and underscores"
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "req_123456789"
}
```

## Extension Points

### Custom Industry Configuration

```python
class CustomIndustryConfig(IndustryConfig):
    """Custom industry configuration."""
    
    def __init__(self, industry: str):
        super().__init__(industry)
        self.custom_requirements = self._load_custom_requirements()
    
    def get_compliance_requirements(self) -> List[str]:
        """Override to add custom compliance requirements."""
        base_requirements = super().get_compliance_requirements()
        return base_requirements + self.custom_requirements
    
    def _load_custom_requirements(self) -> List[str]:
        """Load custom requirements from configuration."""
        # Implementation here
        pass
```

### Custom Template Processing

```python
class CustomProjectGenerator(ProjectGenerator):
    """Custom project generator with additional features."""
    
    def _process_templates(self, root: Path):
        """Override template processing with custom logic."""
        # Call parent method
        super()._process_templates(root)
        
        # Add custom processing
        self._apply_custom_transformations(root)
    
    def _apply_custom_transformations(self, root: Path):
        """Apply custom transformations to generated files."""
        # Implementation here
        pass
```

### Custom Validation Rules

```python
class CustomProjectValidator(ProjectValidator):
    """Custom validator with additional rules."""
    
    def validate_custom_requirements(self, config: dict) -> bool:
        """Validate custom requirements."""
        # Implementation here
        return True
    
    def validate_project_name(self, name: str) -> bool:
        """Override with custom validation."""
        # Call parent validation
        if not super().validate_project_name(name):
            return False
        
        # Add custom validation
        return self.validate_custom_requirements({'project_name': name})
```

## Performance Considerations

### Memory Usage

The generator is designed to be memory-efficient:

- Templates are processed in chunks
- Large files are streamed
- Temporary files are cleaned up automatically

### Processing Time

Typical generation times:

- Simple project: 5-10 seconds
- Complex project with compliance: 30-60 seconds
- Enterprise project with multiple components: 2-5 minutes

### Optimization Tips

1. **Use SSD storage** for faster file operations
2. **Increase memory** for large projects
3. **Disable unnecessary features** to reduce processing time
4. **Use parallel processing** for multiple projects

## Testing

### Unit Tests

```python
import unittest
from project_generator import ProjectGenerator, ProjectValidator

class TestProjectGenerator(unittest.TestCase):
    def setUp(self):
        self.validator = ProjectValidator()
        self.config = {
            'project_name': 'test-project',
            'frontend': 'nextjs',
            'backend': 'fastapi',
            'database': 'postgresql'
        }
    
    def test_project_generation(self):
        generator = ProjectGenerator(self.config, validator=self.validator)
        result = generator.generate()
        
        self.assertIsNotNone(result)
        self.assertIn('output_path', result)
        self.assertTrue(result['success'])
    
    def test_validation(self):
        self.assertTrue(self.validator.validate_project_name('valid-name'))
        self.assertFalse(self.validator.validate_project_name('invalid name!'))
```

### Integration Tests

```python
def test_end_to_end_generation():
    """Test complete project generation workflow."""
    config = {
        'project_name': 'integration-test',
        'frontend': 'nextjs',
        'backend': 'fastapi',
        'database': 'postgresql',
        'industry': 'healthcare',
        'compliance': ['hipaa']
    }
    
    generator = ProjectGenerator(config)
    result = generator.generate()
    
    # Verify project structure
    assert os.path.exists(result['output_path'])
    assert os.path.exists(os.path.join(result['output_path'], 'frontend'))
    assert os.path.exists(os.path.join(result['output_path'], 'backend'))
    
    # Verify compliance files
    compliance_dir = os.path.join(result['output_path'], 'compliance')
    assert os.path.exists(compliance_dir)
    assert os.path.exists(os.path.join(compliance_dir, 'hipaa.md'))
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure write permissions to output directory
   - Run with appropriate user privileges

2. **Template Not Found**
   - Check template pack installation
   - Verify template path configuration

3. **Validation Failures**
   - Review project name format
   - Check framework combination compatibility
   - Verify industry requirements

4. **Memory Issues**
   - Increase available memory
   - Process smaller projects
   - Use streaming for large files

### Debug Mode

Enable debug mode for detailed logging:

```python
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

generator = ProjectGenerator(config, debug=True)
result = generator.generate()
```

### Support

For additional support:

- **Documentation**: https://docs.example.com/project-generator
- **GitHub Issues**: https://github.com/client-project-generator/issues
- **Email Support**: support@example.com


