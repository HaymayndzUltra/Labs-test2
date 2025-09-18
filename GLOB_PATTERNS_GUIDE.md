# Glob Patterns Guide for Rules

## Overview
Glob patterns allow rules to be applied only to specific files or file types, making the rule system more precise and efficient. This guide explains how to use glob patterns effectively in your rules.

## **[STRICT] Glob Pattern Syntax**

### Basic Patterns
```yaml
# Single file extension
globs: ["*.py"]                    # All Python files in current directory
globs: ["*.ts", "*.tsx"]          # TypeScript and TSX files
globs: ["*.js", "*.jsx"]          # JavaScript and JSX files

# Recursive patterns
globs: ["**/*.py"]                # All Python files in any subdirectory
globs: ["**/*.ts", "**/*.tsx"]    # All TypeScript files recursively

# Directory-specific patterns
globs: ["src/**/*.py"]            # Python files only in src directory
globs: ["tests/**/*.py"]          # Python files only in tests directory
globs: ["app/api/**/*.ts"]        # TypeScript files only in API routes
```

### Advanced Patterns
```yaml
# Multiple conditions
globs: ["src/**/*.py", "tests/**/*.py"]     # Python files in src or tests
globs: ["**/*.ts", "**/*.tsx", "!**/*.d.ts"] # TypeScript files excluding declarations

# Specific file patterns
globs: ["**/test_*.py"]           # Test files starting with test_
globs: ["**/*_test.py"]           # Test files ending with _test
globs: ["**/conftest.py"]         # Pytest configuration files
globs: ["**/__init__.py"]         # Python package init files

# API and route patterns
globs: ["app/api/**/*.ts"]        # Next.js App Router API routes
globs: ["pages/api/**/*.ts"]      # Next.js Pages Router API routes
globs: ["src/routes/**/*.ts"]     # Custom route files
globs: ["**/routes/**/*.js"]      # Route files in any directory
```

## **[STRICT] Rule Examples with Globs**

### Language-Specific Rules
```yaml
# Python files only
---
description: "TAGS: [python,language] | TRIGGERS: python,py | SCOPE: python | DESCRIPTION: Python language rules"
globs: ["*.py", "**/*.py", "src/**/*.py", "tests/**/*.py"]
---

# TypeScript files only
---
description: "TAGS: [typescript,language] | TRIGGERS: typescript,ts | SCOPE: typescript | DESCRIPTION: TypeScript language rules"
globs: ["*.ts", "*.tsx", "**/*.ts", "**/*.tsx", "src/**/*.ts", "src/**/*.tsx"]
---

# JavaScript files only
---
description: "TAGS: [javascript,language] | TRIGGERS: javascript,js | SCOPE: javascript | DESCRIPTION: JavaScript language rules"
globs: ["*.js", "*.jsx", "**/*.js", "**/*.jsx", "src/**/*.js", "src/**/*.jsx"]
---
```

### Domain-Specific Rules
```yaml
# API routes only
---
description: "TAGS: [api,routes] | TRIGGERS: api,route | SCOPE: api | DESCRIPTION: API route standards"
globs: ["app/api/**/*.ts", "pages/api/**/*.ts", "src/api/**/*.ts", "**/routes/**/*.ts"]
---

# Test files only
---
description: "TAGS: [testing,quality] | TRIGGERS: test,testing | SCOPE: testing | DESCRIPTION: Testing standards"
globs: ["**/test_*.py", "**/*_test.py", "**/tests/**/*.py", "**/*.test.ts", "**/*.spec.ts"]
---

# Configuration files only
---
description: "TAGS: [config,setup] | TRIGGERS: config,setup | SCOPE: config | DESCRIPTION: Configuration standards"
globs: ["*.json", "*.yaml", "*.yml", "*.toml", "*.ini", "*.env*", "**/config/**/*"]
---
```

### Framework-Specific Rules
```yaml
# React components only
---
description: "TAGS: [react,components] | TRIGGERS: react,component | SCOPE: react | DESCRIPTION: React component standards"
globs: ["**/*.tsx", "**/*.jsx", "src/components/**/*", "components/**/*"]
---

# Next.js specific files
---
description: "TAGS: [nextjs,framework] | TRIGGERS: nextjs,next | SCOPE: nextjs | DESCRIPTION: Next.js framework rules"
globs: ["app/**/*.ts", "app/**/*.tsx", "pages/**/*.ts", "pages/**/*.tsx", "next.config.*"]
---

# FastAPI specific files
---
description: "TAGS: [fastapi,backend] | TRIGGERS: fastapi,api | SCOPE: fastapi | DESCRIPTION: FastAPI backend rules"
globs: ["app/**/*.py", "src/**/*.py", "**/main.py", "**/routers/**/*.py", "**/models/**/*.py"]
---
```

## **[STRICT] Glob Pattern Best Practices**

### 1. Be Specific
```yaml
# Good: Specific to Python files
globs: ["*.py", "**/*.py"]

# Avoid: Too broad
globs: ["*"]  # Applies to all files

# Good: Specific to API routes
globs: ["app/api/**/*.ts", "pages/api/**/*.ts"]

# Avoid: Too broad
globs: ["**/*.ts"]  # Applies to all TypeScript files
```

### 2. Use Multiple Patterns for Related Files
```yaml
# Python files in different contexts
globs: [
  "*.py",           # Root level Python files
  "src/**/*.py",    # Source code
  "tests/**/*.py",  # Test files
  "scripts/**/*.py" # Script files
]

# TypeScript files in different contexts
globs: [
  "*.ts",           # Root level TypeScript files
  "*.tsx",          # Root level TSX files
  "src/**/*.ts",    # Source TypeScript files
  "src/**/*.tsx",   # Source TSX files
  "components/**/*.tsx"  # Component files
]
```

### 3. Exclude Unwanted Files
```yaml
# TypeScript files but not declaration files
globs: ["**/*.ts", "**/*.tsx", "!**/*.d.ts"]

# Python files but not __pycache__
globs: ["**/*.py", "!**/__pycache__/**/*"]

# Test files but not fixtures
globs: ["**/test_*.py", "**/*_test.py", "!**/fixtures/**/*"]
```

### 4. Consider File Context
```yaml
# API routes in different frameworks
globs: [
  "app/api/**/*.ts",    # Next.js App Router
  "pages/api/**/*.ts",  # Next.js Pages Router
  "src/routes/**/*.ts", # Custom routing
  "**/api/**/*.py"      # Python API routes
]

# Configuration files
globs: [
  "*.json",             # JSON configs
  "*.yaml", "*.yml",    # YAML configs
  "*.toml",             # TOML configs
  "*.env*",             # Environment files
  "**/config/**/*"      # Config directories
]
```

## **[STRICT] Common Glob Patterns by Use Case**

### Development Files
```yaml
# Source code
globs: ["src/**/*", "lib/**/*", "app/**/*"]

# Test files
globs: ["**/test_*.py", "**/*_test.py", "**/*.test.ts", "**/*.spec.ts"]

# Documentation
globs: ["**/*.md", "**/*.rst", "docs/**/*"]

# Configuration
globs: ["*.json", "*.yaml", "*.yml", "*.toml", "*.ini", "*.env*"]
```

### Framework-Specific
```yaml
# React/Next.js
globs: ["**/*.tsx", "**/*.jsx", "app/**/*", "pages/**/*", "components/**/*"]

# Vue.js
globs: ["**/*.vue", "src/**/*", "components/**/*"]

# Angular
globs: ["**/*.ts", "**/*.html", "src/**/*", "**/*.component.ts"]

# Python frameworks
globs: ["**/*.py", "app/**/*", "src/**/*", "**/models/**/*", "**/views/**/*"]
```

### File Types
```yaml
# Scripts
globs: ["scripts/**/*", "**/*.sh", "**/*.bat", "**/*.ps1"]

# Styles
globs: ["**/*.css", "**/*.scss", "**/*.sass", "**/*.less"]

# Templates
globs: ["**/*.html", "**/*.hbs", "**/*.ejs", "templates/**/*"]

# Data files
globs: ["**/*.json", "**/*.xml", "**/*.csv", "data/**/*"]
```

## **[STRICT] Testing Glob Patterns**

### Validate Your Patterns
```python
import fnmatch
import os

def test_glob_patterns():
    """Test glob patterns against sample files"""
    test_files = [
        "src/main.py",
        "tests/test_user.py", 
        "app/api/users/route.ts",
        "components/UserCard.tsx",
        "config/database.json"
    ]
    
    patterns = [
        "**/*.py",
        "**/test_*.py",
        "app/api/**/*.ts",
        "**/*.tsx",
        "**/*.json"
    ]
    
    for pattern in patterns:
        print(f"\nPattern: {pattern}")
        for file in test_files:
            matches = fnmatch.fnmatch(file, pattern)
            print(f"  {file}: {'✓' if matches else '✗'}")
```

### Common Pattern Examples
```yaml
# These patterns work with these files:

# Pattern: "**/*.py"
# Matches: src/main.py, tests/test_user.py, app/models/user.py

# Pattern: "**/test_*.py" 
# Matches: tests/test_user.py, tests/test_auth.py
# Doesn't match: src/main.py, tests/user_test.py

# Pattern: "app/api/**/*.ts"
# Matches: app/api/users/route.ts, app/api/auth/login.ts
# Doesn't match: pages/api/users.ts, src/api/users.ts

# Pattern: "**/*.tsx"
# Matches: components/UserCard.tsx, pages/Home.tsx
# Doesn't match: components/UserCard.ts, utils/helpers.ts
```

## **[STRICT] Rule Application Logic**

### How Globs Work
1. **File Path Matching**: When a rule is evaluated, the current file path is checked against all glob patterns
2. **Pattern Matching**: Uses `fnmatch.fnmatch()` for pattern matching
3. **Multiple Patterns**: If any pattern matches, the rule applies
4. **No Globs**: If no globs are specified, the rule applies to all files
5. **Exclusion**: Use `!` prefix to exclude files (e.g., `!**/*.d.ts`)

### Rule Loading Process
```python
def should_apply_rule(rule: Rule, file_path: str) -> bool:
    """Determine if rule should apply to current file"""
    globs = rule.metadata.get('globs', [])
    
    # If no globs specified, apply to all files
    if not globs:
        return True
    
    # Check if file matches any glob pattern
    for pattern in globs:
        if pattern.startswith('!'):
            # Exclusion pattern
            if fnmatch.fnmatch(file_path, pattern[1:]):
                return False
        else:
            # Inclusion pattern
            if fnmatch.fnmatch(file_path, pattern):
                return True
    
    return False
```

## **[GUIDELINE] Performance Considerations**

### Efficient Patterns
```yaml
# Good: Specific patterns load faster
globs: ["src/**/*.py"]           # Only Python files in src
globs: ["app/api/**/*.ts"]       # Only API routes

# Avoid: Overly broad patterns
globs: ["**/*"]                  # All files (use sparingly)
globs: ["**/*.*"]                # All files with extensions
```

### Pattern Optimization
```yaml
# Use specific directories when possible
globs: ["src/**/*.py"]           # Better than "**/*.py"
globs: ["app/api/**/*.ts"]       # Better than "**/api/**/*.ts"

# Combine related patterns efficiently
globs: ["**/*.ts", "**/*.tsx"]   # TypeScript files
globs: ["**/*.py", "!**/__pycache__/**/*"]  # Python files excluding cache
```

This glob pattern system allows for precise rule application, ensuring that domain-specific rules only apply to relevant files while maintaining system performance and clarity.



