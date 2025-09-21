# Rule Management System Documentation

## Overview

The Client Project Generator implements a sophisticated rule management system that ensures consistent application of best practices, compliance requirements, and industry-specific standards. The system uses a hierarchical rule precedence model with intelligent validation and dynamic rule generation.

## Rule Hierarchy System

### Precedence Order

The rule system follows a strict precedence order that determines which rules take priority when conflicts arise:

```
Security (Priority 1) > Compliance (Priority 2) > Industry (Priority 3) > 
Quality (Priority 4) > Workflow (Priority 5) > Project (Priority 6)
```

### Industry-Specific Adjustments

Certain industries receive priority adjustments to ensure appropriate security and compliance focus:

- **Healthcare**: +20 points for security priority
- **Finance**: +25 points for security priority
- **Enterprise**: +15 points for security priority

### Rule Type Definitions

#### Security Rules (Priority 1)
- Authentication and authorization patterns
- Data encryption requirements
- Access control mechanisms
- Security monitoring and logging

#### Compliance Rules (Priority 2)
- Industry-specific regulatory requirements
- Data protection and privacy standards
- Audit trail requirements
- Compliance reporting standards

#### Industry Rules (Priority 3)
- Industry-specific best practices
- Technology stack recommendations
- Performance and scalability requirements
- Integration patterns

#### Quality Rules (Priority 4)
- Code quality standards
- Testing requirements
- Documentation standards
- Performance benchmarks

#### Workflow Rules (Priority 5)
- Development process standards
- CI/CD pipeline requirements
- Deployment procedures
- Monitoring and observability

#### Project Rules (Priority 6)
- Project-specific configurations
- Custom business logic
- Client-specific requirements
- Environment-specific settings

## Rule Generation Process

### 1. Client-Specific Rules

Client-specific rules are generated dynamically based on project configuration:

```python
def _generate_client_rules(self) -> str:
    """Generate client-specific rules based on project configuration"""
    
    # Determine uptime requirements based on industry
    uptime = '>99.99%' if self.args.industry in ['healthcare', 'finance'] else '>99.9%'
    
    # Generate compliance-specific rules
    compliance_rules = []
    if 'hipaa' in self.args.compliance.lower():
        compliance_rules.extend([
            'audit_logging: true',
            'phi_encryption: true',
            'session_timeout: 15',
            'access_control: rbac'
        ])
    
    if 'sox' in self.args.compliance.lower():
        compliance_rules.extend([
            'change_control: true',
            'audit_trails: true',
            'segregation_of_duties: true',
            'financial_integrity: true'
        ])
    
    return self._format_client_rules(compliance_rules, uptime)
```

### 2. Industry Compliance Rules

Industry compliance rules are created for each compliance requirement:

```python
def _generate_compliance_rules_content(self, compliance: str) -> str:
    """Generate compliance-specific rule content"""
    
    compliance_rules = {
        'hipaa': {
            'description': 'Healthcare PHI protection: encryption, access control, audit logging, session timeout',
            'requirements': [
                'Audit logging for all PHI access and changes',
                'Minimum necessary access (RBAC) with reviews',
                'Encryption at rest and in transit',
                '15-minute session timeout',
                'No PHI in logs or error messages'
            ]
        },
        'gdpr': {
            'description': 'EU data protection: consent, right to erasure, data export, privacy by design',
            'requirements': [
                'Consent management system',
                'Right to erasure implementation',
                'Data portability features',
                'Privacy by design principles',
                'Data protection impact assessments'
            ]
        },
        'sox': {
            'description': 'Financial reporting: change control, audit trails, segregation of duties',
            'requirements': [
                'Change control procedures',
                'Audit trails for all financial data',
                'Segregation of duties',
                'Financial data integrity checks',
                'Regular compliance audits'
            ]
        },
        'pci': {
            'description': 'Payment card security: tokenization, encryption, network segmentation',
            'requirements': [
                'Cardholder data protection',
                'Network segmentation',
                'Tokenization for payment data',
                'Security scanning and monitoring',
                'Regular security assessments'
            ]
        }
    }
    
    return self._format_compliance_rules(compliance_rules.get(compliance, {}))
```

### 3. Project Workflow Rules

Project workflow rules are generated based on technology stack and project type:

```python
def _generate_workflow_rules(self) -> str:
    """Generate process/workflow rules with extended triggers and Cursor frontmatter"""
    
    triggers = [
        'workflow', 'process', 'development', 'deployment',
        'ci', 'cd', 'pipeline', 'quality', 'testing'
    ]
    
    # Add technology-specific triggers
    if self.args.frontend != 'none':
        triggers.extend(['frontend', 'ui', 'component', 'styling'])
    
    if self.args.backend != 'none':
        triggers.extend(['backend', 'api', 'database', 'server'])
    
    # Add industry-specific triggers
    if self.args.industry == 'healthcare':
        triggers.extend(['hipaa', 'phi', 'audit', 'compliance'])
    elif self.args.industry == 'finance':
        triggers.extend(['sox', 'pci', 'financial', 'audit'])
    
    return self._format_workflow_rules(triggers, self.args.industry)
```

## Rule Integration with AI Governor

### Master Rule Integration

Essential master rules are copied to new projects to ensure consistent behavior:

```python
def _prepare_ai_governor_assets(self):
    """Prepare AI Governor assets (tools, router config, sample logs)"""
    
    if self.no_cursor_assets:
        return
    
    # Copy essential master rules
    master_rules = [
        '1-master-rule-context-discovery.mdc',
        '2-master-rule-ai-collaboration-guidelines.mdc',
        '3-master-rule-code-quality-checklist.mdc',
        '4-master-rule-code-modification-safety-protocol.mdc',
        '5-master-rule-documentation-and-context-guidelines.mdc'
    ]
    
    for rule in master_rules:
        self._copy_master_rule(rule)
```

### Rule Validation

The system validates project configuration against AI Governor policies:

```python
def validate_against_ai_governor(self, config: Dict[str, Any]) -> Dict[str, Any]:
    """Validate project configuration against AI Governor policies"""
    
    validation_result = {
        'valid': True,
        'errors': [],
        'warnings': [],
        'recommendations': []
    }
    
    # Validate against master rules
    master_rule_validation = self._validate_master_rules(config)
    validation_result['errors'].extend(master_rule_validation['errors'])
    
    # Validate against industry policies
    industry_validation = self._validate_industry_policies(config)
    validation_result['errors'].extend(industry_validation['errors'])
    validation_result['warnings'].extend(industry_validation['warnings'])
    
    # Validate against compliance requirements
    compliance_validation = self._validate_compliance_requirements(config)
    validation_result['errors'].extend(compliance_validation['errors'])
    
    return validation_result
```

## Rule Precedence Configuration

### Intelligent Precedence System

The system uses an intelligent precedence configuration that adjusts based on project context:

```yaml
# dev-workflow/config/intelligent-precedence-config.yaml
base_precedence:
  security: 1
  compliance: 2
  industry: 3
  quality: 4
  workflow: 5
  project: 6

industry_adjustments:
  healthcare:
    security: +20
    compliance: +15
  finance:
    security: +25
    compliance: +20
  enterprise:
    security: +15
    compliance: +10

rule_type_precedence:
  security: 1
  compliance: 2
  industry: 3
  quality: 4
  workflow: 5
  project: 6
```

### Dynamic Precedence Calculation

The system calculates rule precedence dynamically based on project context:

```python
def calculate_rule_precedence(self, rule_type: str, industry: str, 
                            compliance_requirements: List[str]) -> int:
    """Calculate rule precedence based on project context"""
    
    base_precedence = {
        'security': 1,
        'compliance': 2,
        'industry': 3,
        'quality': 4,
        'workflow': 5,
        'project': 6
    }
    
    precedence = base_precedence.get(rule_type, 6)
    
    # Apply industry adjustments
    industry_adjustments = {
        'healthcare': {'security': 20, 'compliance': 15},
        'finance': {'security': 25, 'compliance': 20},
        'enterprise': {'security': 15, 'compliance': 10}
    }
    
    if industry in industry_adjustments:
        adjustment = industry_adjustments[industry].get(rule_type, 0)
        precedence -= adjustment
    
    # Apply compliance adjustments
    if 'hipaa' in compliance_requirements and rule_type == 'compliance':
        precedence -= 5
    if 'sox' in compliance_requirements and rule_type == 'compliance':
        precedence -= 5
    
    return max(1, precedence)  # Ensure precedence is at least 1
```

## Rule Validation and Enforcement

### Input Validation

The system validates all inputs against rule requirements:

```python
def validate_input_against_rules(self, input_data: Dict[str, Any], 
                               rule_type: str) -> Dict[str, Any]:
    """Validate input data against specific rule type"""
    
    validation_result = {
        'valid': True,
        'errors': [],
        'warnings': []
    }
    
    if rule_type == 'security':
        validation_result = self._validate_security_rules(input_data)
    elif rule_type == 'compliance':
        validation_result = self._validate_compliance_rules(input_data)
    elif rule_type == 'industry':
        validation_result = self._validate_industry_rules(input_data)
    
    return validation_result
```

### Rule Enforcement

Rules are enforced through multiple mechanisms:

1. **Pre-generation Validation**: Rules are validated before project generation begins
2. **Runtime Validation**: Rules are checked during template processing
3. **Post-generation Validation**: Generated code is validated against rules
4. **Continuous Validation**: Rules are monitored during development

### Error Handling

The system provides comprehensive error handling for rule violations:

```python
def handle_rule_violation(self, rule_type: str, violation: str, 
                         context: Dict[str, Any]) -> Dict[str, Any]:
    """Handle rule violations with appropriate responses"""
    
    response = {
        'action': 'error',
        'message': f"Rule violation in {rule_type}: {violation}",
        'context': context,
        'recommendations': []
    }
    
    if rule_type == 'security':
        response['action'] = 'block'
        response['recommendations'].append('Review security configuration')
    elif rule_type == 'compliance':
        response['action'] = 'warn'
        response['recommendations'].append('Update compliance settings')
    elif rule_type == 'quality':
        response['action'] = 'suggest'
        response['recommendations'].append('Improve code quality')
    
    return response
```

## Rule Development Guidelines

### 1. Rule Structure

Rules should follow a consistent structure:

```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: keyword1,keyword2 | SCOPE: scope | DESCRIPTION: Rule description"
alwaysApply: false
---

# Rule Title

## Rule Content
- Rule description
- Implementation guidelines
- Examples and anti-patterns
```

### 2. Rule Naming

- Use descriptive, hierarchical names
- Include rule type and scope
- Use consistent naming conventions
- Include version information when appropriate

### 3. Rule Content

- Include clear, actionable guidelines
- Provide examples and anti-patterns
- Include validation criteria
- Specify enforcement mechanisms

### 4. Rule Testing

Rules should be thoroughly tested:

```python
def test_rule_validation():
    """Test rule validation with various inputs"""
    
    # Test valid input
    valid_input = {'security_level': 'high', 'encryption': True}
    result = validate_input_against_rules(valid_input, 'security')
    assert result['valid'] == True
    
    # Test invalid input
    invalid_input = {'security_level': 'low', 'encryption': False}
    result = validate_input_against_rules(invalid_input, 'security')
    assert result['valid'] == False
    assert len(result['errors']) > 0
```

## Rule Maintenance

### 1. Rule Updates

Rules should be updated regularly to reflect:

- Industry best practices
- Regulatory changes
- Technology updates
- Security improvements

### 2. Rule Deprecation

Deprecated rules should be:

- Marked as deprecated
- Provided with migration paths
- Removed after appropriate notice period
- Documented in changelog

### 3. Rule Performance

Rules should be monitored for:

- Performance impact
- Validation accuracy
- False positive rates
- User feedback

## Conclusion

The rule management system provides a comprehensive framework for ensuring consistent application of best practices, compliance requirements, and industry standards. The hierarchical precedence model ensures that critical rules take priority while allowing for flexibility and customization.

The system's integration with the AI Governor Framework ensures that generated projects meet enterprise standards while maintaining high quality and compliance. The dynamic rule generation and validation mechanisms provide a robust foundation for creating production-ready applications across multiple industries and use cases.
