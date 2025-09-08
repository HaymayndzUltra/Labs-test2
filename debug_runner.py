import sys
import os
import traceback

# Add project_generator to the path so imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Mock sys.argv to pass the arguments to the script
sys.argv = [
    'scripts/generate_client_project.py',
    '--name',
    'healthtech-demo',
    '--industry',
    'healthcare',
    '--project-type',
    'fullstack',
    '--frontend',
    'nextjs',
    '--backend',
    'fastapi',
    '--database',
    'postgres',
    '--auth',
    'auth0',
    '--compliance',
    'hipaa',
    '--deploy',
    'aws',
    '--output-dir',
    '../_generated/healthtech-demo',
    '--workers',
    '8',
    '--no-cursor-assets',
    '--yes',
    '--verbose',
    '--force' # Add force to avoid issues with existing dirs
]

try:
    # Import the main function from the script
    from scripts.generate_client_project import main
    print("--- Starting script execution via debug_runner.py ---")
    main()
    print("--- Script execution finished ---")
except Exception as e:
    print(f"!!! An exception occurred: {e}")
    traceback.print_exc()
