# Utility Scripts Documentation

## Overview

The utility scripts provide essential tools for project management, validation, and maintenance. These scripts are designed to work with the Client Project Generator system and can be used independently or as part of automated workflows.

## Table of Contents

1. [Script Categories](#script-categories)
2. [Individual Script Documentation](#individual-script-documentation)
3. [Usage Examples](#usage-examples)
4. [Integration Guide](#integration-guide)
5. [Troubleshooting](#troubleshooting)

## Script Categories

### Project Management Scripts
- `normalize_project_rules.py` - Normalize and standardize project rules
- `sync_from_scaffold.py` - Synchronize project from scaffold templates

### Validation Scripts
- `check_hipaa.py` - Validate HIPAA compliance requirements
- `scan_deps.py` - Scan and analyze project dependencies

### Performance Scripts
- `collect_coverage.py` - Collect test coverage metrics
- `collect_perf.py` - Collect performance metrics

## Individual Script Documentation

### normalize_project_rules.py

Normalizes and standardizes project rules to ensure consistency across the system.

#### Purpose
- Standardizes frontmatter format in rule files
- Ensures consistent metadata structure
- Validates rule file format and content

#### Usage
```bash
python scripts/normalize_project_rules.py [options]
```

#### Options
- `--input-dir` - Input directory containing rule files (default: `.cursor/rules`)
- `--output-dir` - Output directory for normalized files (default: same as input)
- `--dry-run` - Show what would be changed without making changes
- `--verbose` - Enable verbose output

#### Example
```bash
# Normalize rules in default directory
python scripts/normalize_project_rules.py

# Normalize rules with dry run
python scripts/normalize_project_rules.py --dry-run --verbose

# Normalize rules in specific directory
python scripts/normalize_project_rules.py --input-dir ./custom-rules --output-dir ./normalized-rules
```

#### Functions

##### normalize_frontmatter(text: str) -> Tuple[str, bool]
Normalizes frontmatter in rule files.

**Parameters:**
- `text` (str): Rule file content

**Returns:**
- `Tuple[str, bool]`: Normalized content and whether changes were made

**Example:**
```python
from scripts.normalize_project_rules import normalize_frontmatter

content = """
---
title: My Rule
description: A sample rule
---

# My Rule Content
"""

normalized, changed = normalize_frontmatter(content)
print(f"Content changed: {changed}")
```

### check_hipaa.py

Validates HIPAA compliance requirements for healthcare applications.

#### Purpose
- Validates Role-Based Access Control (RBAC) implementation
- Checks audit logging configuration
- Ensures no PHI (Protected Health Information) in logs
- Validates session timeout settings

#### Usage
```bash
python scripts/check_hipaa.py [options]
```

#### Options
- `--config-file` - Path to configuration file (default: `config/hipaa.json`)
- `--output-format` - Output format: json, yaml, text (default: text)
- `--fail-on-error` - Exit with error code on validation failure
- `--verbose` - Enable verbose output

#### Example
```bash
# Check HIPAA compliance
python scripts/check_hipaa.py

# Check with JSON output
python scripts/check_hipaa.py --output-format json

# Check with configuration file
python scripts/check_hipaa.py --config-file ./custom-hipaa.json
```

#### Functions

##### load_min_session() -> int
Loads minimum session timeout from configuration.

**Returns:**
- `int`: Minimum session timeout in minutes

##### check_rbac() -> bool
Validates Role-Based Access Control implementation.

**Returns:**
- `bool`: True if RBAC is properly implemented

##### check_audit_logging() -> bool
Validates audit logging configuration.

**Returns:**
- `bool`: True if audit logging is properly configured

##### check_no_phi_in_logs() -> bool
Ensures no PHI is present in log files.

**Returns:**
- `bool`: True if no PHI found in logs

##### check_session_timeout() -> bool
Validates session timeout settings.

**Returns:**
- `bool`: True if session timeout meets requirements

### sync_from_scaffold.py

Synchronizes project structure from scaffold templates.

#### Purpose
- Syncs project files from scaffold templates
- Updates project structure based on template changes
- Maintains project consistency with templates

#### Usage
```bash
python scripts/sync_from_scaffold.py [options]
```

#### Options
- `--scaffold-dir` - Scaffold template directory (default: `template-packs`)
- `--project-dir` - Target project directory (default: current directory)
- `--dry-run` - Show what would be synced without making changes
- `--force` - Force sync even if conflicts exist
- `--exclude` - Comma-separated list of patterns to exclude

#### Example
```bash
# Sync from scaffold
python scripts/sync_from_scaffold.py

# Sync with dry run
python scripts/sync_from_scaffold.py --dry-run

# Sync specific project
python scripts/sync_from_scaffold.py --project-dir ./my-project
```

#### Functions

##### _walk_files(root: Path, excludes: Set[str]) -> List[Path]
Walks directory tree and collects files.

**Parameters:**
- `root` (Path): Root directory to walk
- `excludes` (Set[str]): Patterns to exclude

**Returns:**
- `List[Path]`: List of file paths

##### _collect_tasks(root: Any) -> Tuple[List[Dict[str, Any]], bool]
Collects tasks from project structure.

**Parameters:**
- `root` (Any): Root project structure

**Returns:**
- `Tuple[List[Dict[str, Any]], bool]`: Tasks list and success status

##### _detect(frontend_paths: List[Path], backend_paths: List[Path], migration_paths: List[Path], test_paths: List[Path]) -> Dict[str, Dict[str, Any]]
Detects project type and configuration.

**Parameters:**
- `frontend_paths` (List[Path]): Frontend file paths
- `backend_paths` (List[Path]): Backend file paths
- `migration_paths` (List[Path]): Migration file paths
- `test_paths` (List[Path]): Test file paths

**Returns:**
- `Dict[str, Dict[str, Any]]`: Detected project configuration

### scan_deps.py

Scans and analyzes project dependencies.

#### Purpose
- Scans Python and Node.js dependencies
- Analyzes dependency versions and vulnerabilities
- Generates dependency reports

#### Usage
```bash
python scripts/scan_deps.py [options]
```

#### Options
- `--project-dir` - Project directory to scan (default: current directory)
- `--output-file` - Output file for dependency report
- `--format` - Output format: json, csv, html (default: json)
- `--check-vulnerabilities` - Check for known vulnerabilities
- `--verbose` - Enable verbose output

#### Example
```bash
# Scan dependencies
python scripts/scan_deps.py

# Scan with vulnerability check
python scripts/scan_deps.py --check-vulnerabilities

# Generate HTML report
python scripts/scan_deps.py --format html --output-file deps-report.html
```

#### Functions

##### _run(cmd: list[str]) -> tuple[int, str]
Runs shell command and returns result.

**Parameters:**
- `cmd` (list[str]): Command to run

**Returns:**
- `tuple[int, str]`: Exit code and output

##### python_counts() -> Tuple[int, int]
Counts Python dependencies.

**Returns:**
- `Tuple[int, int]`: Total dependencies and unique dependencies

##### node_counts() -> Tuple[int, int]
Counts Node.js dependencies.

**Returns:**
- `Tuple[int, int]`: Total dependencies and unique dependencies

### collect_coverage.py

Collects test coverage metrics.

#### Purpose
- Runs test suite with coverage collection
- Generates coverage reports
- Analyzes coverage metrics

#### Usage
```bash
python scripts/collect_coverage.py [options]
```

#### Options
- `--test-dir` - Test directory (default: `tests`)
- `--source-dir` - Source directory (default: `src`)
- `--output-file` - Coverage report output file
- `--format` - Report format: html, xml, json (default: html)
- `--threshold` - Minimum coverage threshold (default: 80)

#### Example
```bash
# Collect coverage
python scripts/collect_coverage.py

# Collect with threshold
python scripts/collect_coverage.py --threshold 90

# Generate XML report
python scripts/collect_coverage.py --format xml --output-file coverage.xml
```

### collect_perf.py

Collects performance metrics.

#### Purpose
- Runs performance tests
- Collects performance metrics
- Generates performance reports

#### Usage
```bash
python scripts/collect_perf.py [options]
```

#### Options
- `--test-file` - Performance test file (default: `tests/performance.py`)
- `--output-file` - Performance report output file
- `--format` - Report format: json, csv, html (default: json)
- `--iterations` - Number of test iterations (default: 10)
- `--warmup` - Warmup iterations (default: 3)

#### Example
```bash
# Collect performance metrics
python scripts/collect_perf.py

# Collect with custom iterations
python scripts/collect_perf.py --iterations 20 --warmup 5

# Generate CSV report
python scripts/collect_perf.py --format csv --output-file perf-report.csv
```

## Usage Examples

### Complete Project Validation Workflow

```bash
#!/bin/bash
# Complete project validation workflow

echo "Starting project validation..."

# Normalize project rules
echo "Normalizing project rules..."
python scripts/normalize_project_rules.py --verbose

# Check HIPAA compliance
echo "Checking HIPAA compliance..."
python scripts/check_hipaa.py --output-format json --fail-on-error

# Scan dependencies
echo "Scanning dependencies..."
python scripts/scan_deps.py --check-vulnerabilities --format html

# Collect test coverage
echo "Collecting test coverage..."
python scripts/collect_coverage.py --threshold 85

# Collect performance metrics
echo "Collecting performance metrics..."
python scripts/collect_perf.py --iterations 15

echo "Project validation complete!"
```

### Automated CI/CD Pipeline

```yaml
# .github/workflows/validation.yml
name: Project Validation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
    
    - name: Normalize project rules
      run: python scripts/normalize_project_rules.py --dry-run
    
    - name: Check HIPAA compliance
      run: python scripts/check_hipaa.py --output-format json
    
    - name: Scan dependencies
      run: python scripts/scan_deps.py --check-vulnerabilities
    
    - name: Collect coverage
      run: python scripts/collect_coverage.py --threshold 80
    
    - name: Collect performance
      run: python scripts/collect_perf.py --iterations 10
```

### Custom Validation Script

```python
#!/usr/bin/env python3
"""
Custom validation script that combines multiple checks.
"""

import subprocess
import sys
import json
from pathlib import Path

def run_script(script_name, args=None):
    """Run a validation script and return results."""
    cmd = [sys.executable, f"scripts/{script_name}.py"]
    if args:
        cmd.extend(args)
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return {
            "success": True,
            "output": result.stdout,
            "error": result.stderr
        }
    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "output": e.stdout,
            "error": e.stderr,
            "return_code": e.returncode
        }

def main():
    """Run all validation checks."""
    results = {}
    
    # Normalize project rules
    print("Normalizing project rules...")
    results["normalize_rules"] = run_script("normalize_project_rules", ["--dry-run"])
    
    # Check HIPAA compliance
    print("Checking HIPAA compliance...")
    results["hipaa_check"] = run_script("check_hipaa", ["--output-format", "json"])
    
    # Scan dependencies
    print("Scanning dependencies...")
    results["dependency_scan"] = run_script("scan_deps", ["--check-vulnerabilities"])
    
    # Collect coverage
    print("Collecting test coverage...")
    results["coverage"] = run_script("collect_coverage", ["--threshold", "80"])
    
    # Collect performance
    print("Collecting performance metrics...")
    results["performance"] = run_script("collect_perf", ["--iterations", "10"])
    
    # Save results
    with open("validation_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    # Check for failures
    failures = [name for name, result in results.items() if not result["success"]]
    
    if failures:
        print(f"Validation failed for: {', '.join(failures)}")
        sys.exit(1)
    else:
        print("All validations passed!")

if __name__ == "__main__":
    main()
```

## Integration Guide

### Python Integration

```python
import subprocess
import json
from pathlib import Path

class ValidationRunner:
    """Runs validation scripts programmatically."""
    
    def __init__(self, project_dir: Path):
        self.project_dir = project_dir
    
    def normalize_rules(self, dry_run: bool = True) -> dict:
        """Normalize project rules."""
        cmd = ["python", "scripts/normalize_project_rules.py"]
        if dry_run:
            cmd.append("--dry-run")
        
        return self._run_command(cmd)
    
    def check_hipaa(self, output_format: str = "json") -> dict:
        """Check HIPAA compliance."""
        cmd = [
            "python", "scripts/check_hipaa.py",
            "--output-format", output_format
        ]
        return self._run_command(cmd)
    
    def scan_dependencies(self, check_vulnerabilities: bool = True) -> dict:
        """Scan project dependencies."""
        cmd = ["python", "scripts/scan_deps.py"]
        if check_vulnerabilities:
            cmd.append("--check-vulnerabilities")
        
        return self._run_command(cmd)
    
    def _run_command(self, cmd: list) -> dict:
        """Run command and return results."""
        try:
            result = subprocess.run(
                cmd, 
                cwd=self.project_dir,
                capture_output=True, 
                text=True, 
                check=True
            )
            return {
                "success": True,
                "output": result.stdout,
                "error": result.stderr
            }
        except subprocess.CalledProcessError as e:
            return {
                "success": False,
                "output": e.stdout,
                "error": e.stderr,
                "return_code": e.returncode
            }

# Usage
runner = ValidationRunner(Path("./my-project"))
results = runner.normalize_rules()
print(f"Normalization success: {results['success']}")
```

### Shell Integration

```bash
#!/bin/bash
# validation.sh - Shell script for running validations

set -e  # Exit on any error

PROJECT_DIR="${1:-.}"
OUTPUT_DIR="${2:-./validation-reports}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Running validations for project: $PROJECT_DIR"
echo "Output directory: $OUTPUT_DIR"

# Function to run script and capture output
run_validation() {
    local script_name="$1"
    local output_file="$2"
    shift 2
    
    echo "Running $script_name..."
    python "scripts/$script_name.py" "$@" > "$output_file" 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✓ $script_name completed successfully"
    else
        echo "✗ $script_name failed"
        return 1
    fi
}

# Run all validations
run_validation "normalize_project_rules" "$OUTPUT_DIR/rules.txt" --dry-run
run_validation "check_hipaa" "$OUTPUT_DIR/hipaa.json" --output-format json
run_validation "scan_deps" "$OUTPUT_DIR/dependencies.json" --check-vulnerabilities
run_validation "collect_coverage" "$OUTPUT_DIR/coverage.html" --format html
run_validation "collect_perf" "$OUTPUT_DIR/performance.json" --format json

echo "All validations completed successfully!"
echo "Reports saved to: $OUTPUT_DIR"
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   # Fix permission issues
   chmod +x scripts/*.py
   ```

2. **Missing Dependencies**
   ```bash
   # Install required dependencies
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. **Python Path Issues**
   ```bash
   # Add scripts directory to Python path
   export PYTHONPATH="${PYTHONPATH}:$(pwd)/scripts"
   ```

4. **Configuration File Not Found**
   ```bash
   # Create default configuration
   python scripts/check_hipaa.py --config-file ./config/hipaa.json
   ```

### Debug Mode

Enable debug mode for detailed output:

```bash
# Enable debug logging
export DEBUG=1
python scripts/check_hipaa.py --verbose
```

### Log Files

Scripts generate log files in the following locations:

- `logs/validation.log` - General validation logs
- `logs/hipaa.log` - HIPAA compliance logs
- `logs/dependencies.log` - Dependency scan logs
- `logs/coverage.log` - Coverage collection logs
- `logs/performance.log` - Performance collection logs

### Support

For script-related issues:

- **Documentation**: https://docs.example.com/utility-scripts
- **GitHub Issues**: https://github.com/client-project-generator/issues
- **Email Support**: support@example.com


