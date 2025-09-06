"""
Project Configuration Validator
Validates technology combinations and compliance requirements
"""

from typing import Dict, List, Any


class ProjectValidator:
    """Validates project configurations for compatibility and best practices"""
    
    def __init__(self):
        self.compatibility_matrix = self._load_compatibility_matrix()
        self.compliance_requirements = self._load_compliance_requirements()
    
    def _load_compatibility_matrix(self) -> Dict[str, Dict[str, List[str]]]:
        """Define technology compatibility rules"""
        return {
            'frontend': {
                'nextjs': {
                    'backend': ['fastapi', 'django', 'nestjs', 'go', 'none'],
                    'auth': ['auth0', 'firebase', 'cognito', 'custom'],
                    'deploy': ['vercel', 'aws', 'azure', 'gcp']
                },
                'nuxt': {
                    'backend': ['fastapi', 'django', 'nestjs', 'go', 'none'],
                    'auth': ['auth0', 'firebase', 'cognito', 'custom'],
                    'deploy': ['vercel', 'aws', 'azure', 'gcp']
                },
                'angular': {
                    'backend': ['fastapi', 'django', 'nestjs', 'go'],
                    'auth': ['auth0', 'cognito', 'custom'],
                    'deploy': ['aws', 'azure', 'gcp']
                },
                'expo': {
                    'backend': ['fastapi', 'django', 'nestjs', 'go'],
                    'auth': ['auth0', 'firebase', 'cognito'],
                    'deploy': ['aws', 'azure', 'gcp']
                }
            },
            'backend': {
                'fastapi': {
                    'database': ['postgres', 'mongodb'],
                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
                },
                'django': {
                    'database': ['postgres', 'mongodb'],
                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
                },
                'nestjs': {
                    'database': ['postgres', 'mongodb'],
                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
                },
                'go': {
                    'database': ['postgres', 'mongodb'],
                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
                }
            },
            'project_type': {
                'web': {
                    'required': ['frontend'],
                    'optional': ['backend', 'database', 'auth']
                },
                'mobile': {
                    'required': ['frontend'],
                    'frontend_allowed': ['expo'],
                    'optional': ['backend', 'database', 'auth']
                },
                'api': {
                    'required': ['backend'],
                    'optional': ['database', 'auth'],
                    'excluded': ['frontend']
                },
                'fullstack': {
                    'required': ['frontend', 'backend'],
                    'optional': ['database', 'auth']
                },
                'microservices': {
                    'required': ['backend'],
                    'optional': ['frontend', 'database', 'auth']
                }
            }
        }
    
    def _load_compliance_requirements(self) -> Dict[str, Dict[str, Any]]:
        """Define compliance-specific requirements"""
        return {
            'hipaa': {
                'required_features': ['encryption', 'audit_logging', 'access_control'],
                'required_auth': ['auth0', 'cognito'],
                'deploy_allowed': ['aws', 'azure'],
                'warnings': ['Requires BAA with cloud provider', 'PHI data handling procedures needed']
            },
            'gdpr': {
                'required_features': ['data_privacy', 'consent_management', 'data_deletion'],
                'warnings': ['Privacy policy required', 'Data processing agreements needed']
            },
            'sox': {
                'required_features': ['audit_trails', 'access_control', 'change_management'],
                'required_auth': ['cognito', 'auth0'],
                'warnings': ['Financial controls documentation required']
            },
            'pci': {
                'required_features': ['encryption', 'tokenization', 'secure_storage'],
                'warnings': ['PCI DSS assessment required', 'Network segmentation needed']
            },
            'soc2': {
                'required_features': ['security_monitoring', 'access_control', 'audit_logging'],
                'warnings': ['Security policies required', 'Regular audits needed']
            }
        }
    
    def validate_configuration(self, args) -> Dict[str, Any]:
        """Validate the entire project configuration"""
        errors = []
        warnings = []
        
        # Validate project type requirements
        project_rules = self.compatibility_matrix['project_type'].get(args.project_type, {})
        
        # Check required components
        for component in project_rules.get('required', []):
            if component == 'frontend' and args.frontend == 'none':
                errors.append(f"Project type '{args.project_type}' requires a frontend framework")
            elif component == 'backend' and args.backend == 'none':
                errors.append(f"Project type '{args.project_type}' requires a backend framework")
        
        # Check excluded components
        for component in project_rules.get('excluded', []):
            if component == 'frontend' and args.frontend != 'none':
                errors.append(f"Project type '{args.project_type}' should not have a frontend framework")
        
        # Validate frontend compatibility
        if args.frontend != 'none':
            frontend_rules = self.compatibility_matrix['frontend'].get(args.frontend, {})
            
            # Check backend compatibility
            if args.backend != 'none' and args.backend not in frontend_rules.get('backend', []):
                warnings.append(f"Frontend '{args.frontend}' may have compatibility issues with backend '{args.backend}'")
            
            # Check auth compatibility
            if args.auth != 'none' and args.auth not in frontend_rules.get('auth', []):
                warnings.append(f"Frontend '{args.frontend}' may have limited support for auth '{args.auth}'")
            
            # Check deployment compatibility
            if args.deploy not in frontend_rules.get('deploy', []):
                warnings.append(f"Frontend '{args.frontend}' may require additional configuration for deployment to '{args.deploy}'")
        
        # Validate backend compatibility
        if args.backend != 'none':
            backend_rules = self.compatibility_matrix['backend'].get(args.backend, {})
            
            # Check database compatibility
            if args.database != 'none' and args.database not in backend_rules.get('database', []):
                warnings.append(f"Backend '{args.backend}' may have limited support for database '{args.database}'")
        
        # Validate compliance requirements
        if args.compliance:
            compliance_list = [c.strip().lower() for c in args.compliance.split(',')]
            
            for compliance in compliance_list:
                if compliance in self.compliance_requirements:
                    req = self.compliance_requirements[compliance]
                    
                    # Check required auth
                    if 'required_auth' in req and args.auth not in req['required_auth']:
                        errors.append(f"Compliance '{compliance}' requires auth provider: {', '.join(req['required_auth'])}")
                    
                    # Check allowed deployment
                    if 'deploy_allowed' in req and args.deploy not in req['deploy_allowed']:
                        errors.append(f"Compliance '{compliance}' only allows deployment to: {', '.join(req['deploy_allowed'])}")
                    
                    # Add compliance warnings
                    warnings.extend([f"{compliance.upper()}: {w}" for w in req.get('warnings', [])])
                else:
                    warnings.append(f"Unknown compliance requirement: {compliance}")
        
        # Industry-specific validations
        if args.industry == 'healthcare' and 'hipaa' not in (args.compliance or ''):
            warnings.append("Healthcare projects typically require HIPAA compliance")
        
        if args.industry == 'finance' and not any(c in (args.compliance or '') for c in ['sox', 'pci']):
            warnings.append("Financial projects typically require SOX or PCI compliance")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def get_required_features(self, compliance: str) -> List[str]:
        """Get required features for a compliance standard"""
        return self.compliance_requirements.get(
            compliance.lower(), {}
        ).get('required_features', [])