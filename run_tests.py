#!/usr/bin/env python3
"""
Test runner for Client Project Generator
"""

import sys
import subprocess
import argparse
from pathlib import Path


def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n🔵 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False


def run_unit_tests():
    """Run unit tests"""
    cmd = "python3 -m pytest project_generator/tests/test_unit/ -v --cov=project_generator --cov-report=html --cov-report=term"
    return run_command(cmd, "Unit Tests")


def run_integration_tests():
    """Run integration tests"""
    cmd = "python3 -m pytest project_generator/tests/test_integration/ -v"
    return run_command(cmd, "Integration Tests")


def run_e2e_tests():
    """Run end-to-end tests"""
    cmd = "python3 -m pytest project_generator/tests/test_e2e/ -v"
    return run_command(cmd, "E2E Tests")


def run_all_tests():
    """Run all tests"""
    cmd = "python3 -m pytest project_generator/tests/ -v --cov=project_generator --cov-report=html --cov-report=term"
    return run_command(cmd, "All Tests")


def run_linting():
    """Run code linting"""
    # Black formatting
    black_cmd = "python3 -m black project_generator/ --check"
    if not run_command(black_cmd, "Black Formatting Check"):
        print("⚠️  Code formatting issues found. Run 'black project_generator/' to fix.")
    
    # isort import sorting
    isort_cmd = "python3 -m isort project_generator/ --check-only"
    if not run_command(isort_cmd, "Import Sorting Check"):
        print("⚠️  Import sorting issues found. Run 'isort project_generator/' to fix.")
    
    # mypy type checking
    mypy_cmd = "python3 -m mypy project_generator/ --ignore-missing-imports"
    run_command(mypy_cmd, "Type Checking")


def run_security_checks():
    """Run security checks"""
    # bandit security linter
    bandit_cmd = "python3 -m bandit -r project_generator/ -f json"
    run_command(bandit_cmd, "Security Analysis")


def main():
    """Main test runner"""
    parser = argparse.ArgumentParser(description='Run Client Project Generator tests')
    parser.add_argument('--unit', action='store_true', help='Run unit tests only')
    parser.add_argument('--integration', action='store_true', help='Run integration tests only')
    parser.add_argument('--e2e', action='store_true', help='Run E2E tests only')
    parser.add_argument('--lint', action='store_true', help='Run linting only')
    parser.add_argument('--security', action='store_true', help='Run security checks only')
    parser.add_argument('--all', action='store_true', help='Run all tests and checks')
    
    args = parser.parse_args()
    
    if not any([args.unit, args.integration, args.e2e, args.lint, args.security, args.all]):
        args.all = True
    
    success = True
    
    if args.unit or args.all:
        success &= run_unit_tests()
    
    if args.integration or args.all:
        success &= run_integration_tests()
    
    if args.e2e or args.all:
        success &= run_e2e_tests()
    
    if args.lint or args.all:
        run_linting()
    
    if args.security or args.all:
        run_security_checks()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)


if __name__ == '__main__':
    main()
