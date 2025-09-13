#!/usr/bin/env python3
"""
Template validation script for Client Project Generator
Validates that all templates are runnable and working correctly
"""

import os
import sys
import subprocess
import tempfile
import shutil
from pathlib import Path
from typing import Dict, List, Tuple
import json


class TemplateValidator:
    """Validates all templates in the Client Project Generator"""
    
    def __init__(self, template_dir: Path, output_dir: Path):
        self.template_dir = template_dir
        self.output_dir = output_dir
        self.results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def validate_all_templates(self) -> Dict:
        """Validate all templates"""
        print("🔵 Starting template validation...")
        
        # Test configurations for different scenarios
        test_configs = [
            {
                'name': 'healthcare-fullstack',
                'industry': 'healthcare',
                'project_type': 'fullstack',
                'frontend': 'nextjs',
                'backend': 'fastapi',
                'database': 'postgres',
                'auth': 'auth0',
                'deploy': 'aws',
                'compliance': ['hipaa'],
                'features': ['patient-portal']
            },
            {
                'name': 'finance-api',
                'industry': 'finance',
                'project_type': 'api',
                'backend': 'go',
                'database': 'postgres',
                'auth': 'cognito',
                'deploy': 'aws',
                'compliance': ['sox', 'pci'],
                'features': ['transaction-processing']
            },
            {
                'name': 'ecommerce-mobile',
                'industry': 'ecommerce',
                'project_type': 'mobile',
                'frontend': 'expo',
                'backend': 'django',
                'database': 'mongodb',
                'auth': 'firebase',
                'deploy': 'gcp',
                'compliance': ['pci', 'gdpr'],
                'features': ['inventory']
            },
            {
                'name': 'saas-web',
                'industry': 'saas',
                'project_type': 'web',
                'frontend': 'nuxt',
                'backend': 'nestjs',
                'database': 'postgres',
                'auth': 'auth0',
                'deploy': 'vercel',
                'compliance': ['gdpr'],
                'features': ['subscription-billing']
            }
        ]
        
        for config in test_configs:
            self.validate_template_config(config)
        
        return self.results
    
    def validate_template_config(self, config: Dict) -> bool:
        """Validate a specific template configuration"""
        print(f"\n🔵 Validating: {config['name']}")
        
        try:
            # Generate project
            project_dir = self.output_dir / config['name']
            if project_dir.exists():
                shutil.rmtree(project_dir)
            
            success = self.generate_project(config, project_dir)
            if not success:
                self.record_error(config['name'], "Project generation failed")
                return False
            
            # Validate project structure
            structure_valid = self.validate_project_structure(project_dir, config)
            if not structure_valid:
                self.record_error(config['name'], "Project structure validation failed")
                return False
            
            # Validate template files
            files_valid = self.validate_template_files(project_dir, config)
            if not files_valid:
                self.record_error(config['name'], "Template files validation failed")
                return False
            
            # Validate Docker Compose
            docker_valid = self.validate_docker_compose(project_dir)
            if not docker_valid:
                self.record_error(config['name'], "Docker Compose validation failed")
                return False
            
            # Validate Makefile
            makefile_valid = self.validate_makefile(project_dir)
            if not makefile_valid:
                self.record_error(config['name'], "Makefile validation failed")
                return False
            
            # Validate README
            readme_valid = self.validate_readme(project_dir, config)
            if not readme_valid:
                self.record_error(config['name'], "README validation failed")
                return False
            
            print(f"✅ {config['name']} validation passed")
            self.results['passed'] += 1
            return True
            
        except Exception as e:
            self.record_error(config['name'], f"Unexpected error: {str(e)}")
            return False
    
    def generate_project(self, config: Dict, project_dir: Path) -> bool:
        """Generate a project using the configuration"""
        try:
            # Add project_generator to path
            sys.path.insert(0, str(Path(__file__).parent / 'project_generator'))
            
            from project_generator.core.generator import ProjectGenerator
            from project_generator.core.validator import ProjectValidator
            from project_generator.core.industry_config import IndustryConfig
            
            # Create mock args object
            class MockArgs:
                def __init__(self, config_dict, template_dir_path):
                    self.name = config_dict['name']
                    self.industry = config_dict['industry']
                    self.project_type = config_dict['project_type']
                    self.frontend = config_dict.get('frontend')
                    self.backend = config_dict.get('backend')
                    self.database = config_dict.get('database')
                    self.auth = config_dict.get('auth')
                    self.deploy = config_dict.get('deploy')
                    self.compliance = config_dict.get('compliance', [])
                    self.features = config_dict.get('features', [])
                    self.output_dir = str(project_dir.parent)
                    self.template_dir = str(template_dir_path)
                    self.no_cursor_assets = True
                    self.minimal_cursor = False
                    self.rules_manifest = None
                    self.workers = 2
            
            args = MockArgs(config, self.template_dir)
            validator = ProjectValidator()
            industry_config = IndustryConfig(config['industry'])
            
            generator = ProjectGenerator(args, validator, industry_config)
            
            # Mock external dependencies
            with self.mock_dependencies():
                result = generator.generate()
                return result.get('success', False)
                
        except Exception as e:
            print(f"❌ Project generation error: {e}")
            return False
    
    def mock_dependencies(self):
        """Context manager to mock external dependencies"""
        import unittest.mock
        
        mock_run = unittest.mock.patch('subprocess.run')
        mock_run.return_value = unittest.mock.Mock(returncode=0, stdout=b'', stderr=b'')
        return mock_run
    
    def validate_project_structure(self, project_dir: Path, config: Dict) -> bool:
        """Validate that the project has the correct structure"""
        required_files = [
            'README.md',
            'docker-compose.yml',
            'Makefile',
            '.gitignore'
        ]
        
        required_dirs = ['docs']
        
        # Add component-specific directories based on config
        if config.get('frontend'):
            required_dirs.append('frontend')
        if config.get('backend'):
            required_dirs.append('backend')
        if config.get('database'):
            required_dirs.append('database')
        
        # Check required files
        for file_name in required_files:
            file_path = project_dir / file_name
            if not file_path.exists():
                print(f"❌ Missing required file: {file_name}")
                return False
        
        # Check required directories
        for dir_name in required_dirs:
            dir_path = project_dir / dir_name
            if not dir_path.exists():
                print(f"❌ Missing required directory: {dir_name}")
                return False
        
        return True
    
    def validate_template_files(self, project_dir: Path, config: Dict) -> bool:
        """Validate that template files are properly processed"""
        # Check README content
        readme_file = project_dir / 'README.md'
        if readme_file.exists():
            content = readme_file.read_text()
            if config['name'] not in content:
                print(f"❌ Project name not found in README")
                return False
        
        # Check Docker Compose content
        docker_file = project_dir / 'docker-compose.yml'
        if docker_file.exists():
            content = docker_file.read_text()
            if config['name'] not in content:
                print(f"❌ Project name not found in docker-compose.yml")
                return False
        
        # Check Makefile content
        makefile = project_dir / 'Makefile'
        if makefile.exists():
            content = makefile.read_text()
            if 'setup:' not in content or 'dev:' not in content:
                print(f"❌ Required Makefile targets missing")
                return False
        
        return True
    
    def validate_docker_compose(self, project_dir: Path) -> bool:
        """Validate Docker Compose file"""
        docker_file = project_dir / 'docker-compose.yml'
        if not docker_file.exists():
            return False
        
        try:
            content = docker_file.read_text()
            
            # Check for required sections
            required_sections = ['version:', 'services:']
            for section in required_sections:
                if section not in content:
                    print(f"❌ Missing Docker Compose section: {section}")
                    return False
            
            # Check for valid YAML structure (basic check)
            if 'services:' in content and 'version:' in content:
                return True
            else:
                print(f"❌ Invalid Docker Compose structure")
                return False
                
        except Exception as e:
            print(f"❌ Docker Compose validation error: {e}")
            return False
    
    def validate_makefile(self, project_dir: Path) -> bool:
        """Validate Makefile"""
        makefile = project_dir / 'Makefile'
        if not makefile.exists():
            return False
        
        try:
            content = makefile.read_text()
            
            # Check for required targets
            required_targets = ['setup:', 'dev:', 'test:', 'build:']
            for target in required_targets:
                if target not in content:
                    print(f"❌ Missing Makefile target: {target}")
                    return False
            
            return True
            
        except Exception as e:
            print(f"❌ Makefile validation error: {e}")
            return False
    
    def validate_readme(self, project_dir: Path, config: Dict) -> bool:
        """Validate README file"""
        readme_file = project_dir / 'README.md'
        if not readme_file.exists():
            return False
        
        try:
            content = readme_file.read_text()
            
            # Check for required sections
            required_sections = ['#', '## Overview', '## Technology Stack', '## Quick Start']
            for section in required_sections:
                if section not in content:
                    print(f"❌ Missing README section: {section}")
                    return False
            
            # Check for project name
            if config['name'] not in content:
                print(f"❌ Project name not found in README")
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ README validation error: {e}")
            return False
    
    def record_error(self, project_name: str, error_message: str):
        """Record an error"""
        error = f"{project_name}: {error_message}"
        self.results['errors'].append(error)
        self.results['failed'] += 1
        print(f"❌ {error}")
    
    def print_summary(self):
        """Print validation summary"""
        total = self.results['passed'] + self.results['failed']
        
        print(f"\n📊 Validation Summary:")
        print(f"  Total: {total}")
        print(f"  Passed: {self.results['passed']}")
        print(f"  Failed: {self.results['failed']}")
        
        if self.results['errors']:
            print(f"\n❌ Errors:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        if self.results['failed'] == 0:
            print(f"\n🎉 All template validations passed!")
            return True
        else:
            print(f"\n❌ {self.results['failed']} template validations failed!")
            return False


def main():
    """Main validation function"""
    # Get paths
    script_dir = Path(__file__).parent
    template_dir = script_dir / 'template-packs'
    output_dir = script_dir / '_generated' / 'validation'
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Validate templates
    validator = TemplateValidator(template_dir, output_dir)
    results = validator.validate_all_templates()
    
    # Print summary
    success = validator.print_summary()
    
    # Save results to file
    results_file = output_dir / 'validation_results.json'
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to: {results_file}")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
