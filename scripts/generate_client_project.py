#!/usr/bin/env python3
"""
Client Project Generator - Main CLI Script
Generates industry-specific, compliance-ready client projects
"""

import argparse
import sys
import os
import json
import shutil
from pathlib import Path
from typing import Dict, List, Optional
import subprocess

# Add project_generator to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from project_generator.core.generator import ProjectGenerator
from project_generator.core.validator import ProjectValidator
from project_generator.core.industry_config import IndustryConfig


def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Generate industry-specific client projects with compliance support',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Healthcare web application
  %(prog)s --name acme-health --industry healthcare --project-type web \\
           --frontend nextjs --backend fastapi --database postgres \\
           --auth auth0 --deploy aws --compliance hipaa

  # Financial API service
  %(prog)s --name fintech-api --industry finance --project-type api \\
           --backend go --database postgres --auth cognito \\
           --deploy azure --compliance sox,pci

  # E-commerce mobile app
  %(prog)s --name shop-mobile --industry ecommerce --project-type mobile \\
           --frontend expo --backend django --database mongodb \\
           --auth firebase --deploy gcp
        """
    )
    
    # Required arguments
    parser.add_argument('--name', required=True,
                        help='Client/project name (e.g., acme-health)')
    
    parser.add_argument('--industry', required=True,
                        choices=['healthcare', 'finance', 'ecommerce', 'saas', 'enterprise'],
                        help='Industry vertical')
    
    parser.add_argument('--project-type', required=True,
                        choices=['web', 'mobile', 'api', 'fullstack', 'microservices'],
                        help='Type of project')
    
    # Technology stack arguments
    parser.add_argument('--frontend',
                        choices=['nextjs', 'nuxt', 'angular', 'expo', 'none'],
                        default='none',
                        help='Frontend framework')
    
    parser.add_argument('--backend',
                        choices=['fastapi', 'django', 'nestjs', 'go', 'none'],
                        default='none',
                        help='Backend framework')
    
    parser.add_argument('--database',
                        choices=['postgres', 'mongodb', 'firebase', 'none'],
                        default='none',
                        help='Database technology')
    
    parser.add_argument('--auth',
                        choices=['auth0', 'firebase', 'cognito', 'custom', 'none'],
                        default='none',
                        help='Authentication provider')
    
    parser.add_argument('--deploy',
                        choices=['aws', 'azure', 'gcp', 'vercel', 'self-hosted'],
                        default='aws',
                        help='Deployment target')
    
    # Optional arguments
    parser.add_argument('--features',
                        help='Comma-separated list of additional features')
    
    parser.add_argument('--compliance',
                        help='Comma-separated compliance requirements (hipaa,gdpr,sox,pci)')
    
    parser.add_argument('--output-dir', '-o',
                        default='.',
                        help='Output directory for generated project (default: current directory)')
    
    parser.add_argument('--dry-run', action='store_true',
                        help='Show what would be generated without creating files')
    
    parser.add_argument('--interactive', '-i', action='store_true',
                        help='Run in interactive mode for missing options')
    
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='Enable verbose output')
    
    parser.add_argument('--no-git', action='store_true',
                        help='Skip git repository initialization')
    
    parser.add_argument('--no-install', action='store_true',
                        help='Skip dependency installation')
    
    return parser.parse_args()


def interactive_mode(args):
    """Fill in missing arguments through interactive prompts"""
    print("\n🚀 Client Project Generator - Interactive Mode\n")
    
    # Helper function for choice prompts
    def prompt_choice(field, prompt, choices, current_value=None):
        if current_value and current_value != 'none':
            return current_value
            
        print(f"\n{prompt}")
        for i, choice in enumerate(choices, 1):
            print(f"  {i}. {choice}")
        
        while True:
            try:
                selection = input(f"Select (1-{len(choices)}): ").strip()
                if selection.isdigit():
                    idx = int(selection) - 1
                    if 0 <= idx < len(choices):
                        return choices[idx]
                print("Invalid selection. Please try again.")
            except KeyboardInterrupt:
                print("\n\nOperation cancelled.")
                sys.exit(1)
    
    # Fill in missing technology choices based on project type
    if args.project_type in ['web', 'fullstack'] and args.frontend == 'none':
        args.frontend = prompt_choice(
            'frontend',
            "Select frontend framework:",
            ['nextjs', 'nuxt', 'angular', 'none'],
            args.frontend
        )
    
    if args.project_type in ['api', 'fullstack', 'microservices'] and args.backend == 'none':
        args.backend = prompt_choice(
            'backend',
            "Select backend framework:",
            ['fastapi', 'django', 'nestjs', 'go', 'none'],
            args.backend
        )
    
    if args.project_type == 'mobile' and args.frontend == 'none':
        args.frontend = 'expo'
        print(f"✓ Auto-selected frontend: {args.frontend}")
    
    # Database selection
    if args.backend != 'none' and args.database == 'none':
        args.database = prompt_choice(
            'database',
            "Select database:",
            ['postgres', 'mongodb', 'firebase', 'none'],
            args.database
        )
    
    # Auth selection based on industry
    if args.auth == 'none':
        auth_choices = ['auth0', 'firebase', 'cognito', 'custom', 'none']
        if args.industry == 'healthcare':
            print("\n⚕️ Healthcare detected - recommending Auth0 for HIPAA compliance")
            auth_choices.insert(0, auth_choices.pop(auth_choices.index('auth0')))
        elif args.industry == 'finance':
            print("\n💰 Finance detected - recommending Cognito for enterprise features")
            auth_choices.insert(0, auth_choices.pop(auth_choices.index('cognito')))
        
        args.auth = prompt_choice(
            'auth',
            "Select authentication provider:",
            auth_choices,
            args.auth
        )
    
    # Compliance requirements
    if not args.compliance:
        compliance_map = {
            'healthcare': ['hipaa', 'none'],
            'finance': ['sox', 'pci', 'none'],
            'ecommerce': ['pci', 'gdpr', 'none'],
            'saas': ['gdpr', 'soc2', 'none'],
            'enterprise': ['soc2', 'none']
        }
        
        available_compliance = compliance_map.get(args.industry, ['none'])
        if len(available_compliance) > 1:
            print(f"\n📋 Select compliance requirements for {args.industry}:")
            selected = []
            for comp in available_compliance[:-1]:  # Exclude 'none'
                response = input(f"  Include {comp.upper()}? (y/n): ").strip().lower()
                if response == 'y':
                    selected.append(comp)
            
            args.compliance = ','.join(selected) if selected else None
    
    # Features
    if not args.features:
        print("\n✨ Additional features (comma-separated, or press Enter to skip):")
        feature_suggestions = {
            'healthcare': "telehealth,patient-portal,ehr-integration",
            'finance': "reporting,analytics,trading",
            'ecommerce': "inventory,shipping,reviews",
            'saas': "billing,subscriptions,admin-panel",
            'enterprise': "sso,audit-logs,api-gateway"
        }
        
        print(f"  Suggestions: {feature_suggestions.get(args.industry, 'none')}")
        features_input = input("  Features: ").strip()
        if features_input:
            args.features = features_input
    
    return args


def display_project_summary(args, generator):
    """Display a summary of what will be generated"""
    print("\n📊 Project Generation Summary")
    print("=" * 50)
    print(f"Project Name:     {args.name}")
    print(f"Industry:         {args.industry.upper()}")
    print(f"Project Type:     {args.project_type}")
    print(f"Frontend:         {args.frontend if args.frontend != 'none' else 'N/A'}")
    print(f"Backend:          {args.backend if args.backend != 'none' else 'N/A'}")
    print(f"Database:         {args.database if args.database != 'none' else 'N/A'}")
    print(f"Authentication:   {args.auth if args.auth != 'none' else 'N/A'}")
    print(f"Deployment:       {args.deploy}")
    print(f"Compliance:       {args.compliance.upper() if args.compliance else 'None'}")
    print(f"Features:         {args.features if args.features else 'None'}")
    print(f"Output Directory: {os.path.abspath(args.output_dir)}")
    print("=" * 50)


def main():
    """Main entry point"""
    args = parse_arguments()
    
    # Run interactive mode if requested or if critical args are missing
    if args.interactive or (
        args.project_type in ['web', 'fullstack'] and args.frontend == 'none' and args.backend == 'none'
    ):
        args = interactive_mode(args)
    
    # Initialize components
    validator = ProjectValidator()
    config = IndustryConfig(args.industry)
    generator = ProjectGenerator(args, validator, config)
    
    # Validate the configuration
    print("\n🔍 Validating project configuration...")
    validation_result = validator.validate_configuration(args)
    
    if not validation_result['valid']:
        print("\n❌ Configuration validation failed:")
        for error in validation_result['errors']:
            print(f"  - {error}")
        sys.exit(1)
    
    if validation_result['warnings']:
        print("\n⚠️  Configuration warnings:")
        for warning in validation_result['warnings']:
            print(f"  - {warning}")
    
    # Display summary
    display_project_summary(args, generator)
    
    # Dry run mode
    if args.dry_run:
        print("\n🏃 DRY RUN MODE - No files will be created")
        structure = generator.get_project_structure()
        print("\n📁 Project Structure:")
        generator.display_structure(structure)
        return
    
    # Confirm generation
    print("\n")
    response = input("Proceed with project generation? (y/n): ").strip().lower()
    if response != 'y':
        print("Generation cancelled.")
        return
    
    try:
        # Generate the project
        print("\n🔨 Generating project...")
        result = generator.generate()
        
        if result['success']:
            print("\n✅ Project generated successfully!")
            print(f"\n📁 Project location: {result['project_path']}")
            
            # Display next steps
            print("\n📋 Next Steps:")
            for i, step in enumerate(result['next_steps'], 1):
                print(f"  {i}. {step}")
            
            # Offer to run setup commands
            if not args.no_install and result.get('setup_commands'):
                print("\n🚀 Run initial setup commands? (y/n): ", end='')
                if input().strip().lower() == 'y':
                    generator.run_setup_commands(result['project_path'], result['setup_commands'])
        else:
            print(f"\n❌ Generation failed: {result['error']}")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()